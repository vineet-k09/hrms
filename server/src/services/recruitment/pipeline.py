"""
pipeline.py
Location: server/src/services/recruitment/pipeline.py

Main orchestrator for the AI resume ranking pipeline.
Flow: ZIP extraction → PDF parsing → Gemini ranking → DB persist → ranked response
"""

import uuid
from typing import List, Dict, Any
import logging
from sqlalchemy.orm import Session

from .zip_handler import extract_pdfs_from_zip, cleanup_temp_dir
from .resume_parser import parse_all_resumes
from .resume_ranker import rank_resume

# Import DB model — adjust import path to match your project structure
from src.models.ai_evaluation import AIEvaluation
logger = logging.getLogger(__name__)

def run_resume_ranking_pipeline(
    zip_file,                   # FastAPI UploadFile
    job_description: str,
    db: Session,
    batch_application_id: str = None,  # optional: group results under one application_id
) -> Dict[str, Any]:
    """
    Full end-to-end pipeline:
      1. Extract PDFs from ZIP
      2. Parse text from each PDF
      3. Score each resume against job_description via Gemini
      4. Sort by score descending, assign rank
      5. Insert AIEvaluation rows into DB
      6. Return ranked results dict

    Args:
        zip_file:               FastAPI UploadFile (application/zip)
        job_description:        Job description text
        db:                     SQLAlchemy Session (injected via FastAPI Depends)
        batch_application_id:   Optional UUID string to tag all rows in this batch.
                                If None, a new UUID is auto-generated.

    Returns:
        {
            "total_candidates": int,
            "batch_id": str,
            "ranked_results": [
                {
                    "filename": str,
                    "score": int,
                    "rank": int,
                    "summary": str,
                    "recommendation": str,
                    "skills_match": list,
                    "missing_skills": list,
                    "evaluation_id": str,
                    "error": str | None
                },
                ...
            ]
        }
    """

    # ── 1. Generate batch ID ──────────────────────────────────────────────────
    if not batch_application_id:
        batch_application_id = str(uuid.uuid4())

    try:
        # ── 1. Extract ZIP ───────────────────────────────────────────────
        temp_dir, pdf_paths = extract_pdfs_from_zip(zip_file)

        # ── 2. Parse PDFs ────────────────────────────────────────────────
        parsed_resumes = parse_all_resumes(pdf_paths)

        # ── 3. Rank resumes ───────────────────────────────────────────────
        scored_resumes = []

        for parsed in parsed_resumes:
            filename = parsed["filename"]

            # parse failure case
            if parsed.get("error") or not parsed.get("text", "").strip():
                scored_resumes.append({
                    "filename": filename,
                    "resume_score": 0,
                    "interview_score": None,
                    "recommendation": "no",
                    "summary": f"Could not extract text. Reason: {parsed.get('error', 'Empty PDF')}",
                    "extracted_skills": {
                        "skills_match": [],
                        "missing_skills": []
                    },
                    "error": parsed.get("error", "Empty PDF"),
                })
                continue

            evaluation = rank_resume(
                resume_text=parsed["text"],
                job_description=job_description,
                filename=filename,
            )

            evaluation["filename"] = filename
            scored_resumes.append(evaluation)

        # ── 4. Sort safely by resume_score ───────────────────────────────
        scored_resumes.sort(
            key=lambda x: x.get("resume_score", 0),
            reverse=True
        )

        for idx, candidate in enumerate(scored_resumes, start=1):
            candidate["rank"] = idx

        # ── 5. Persist to DB (SAFE VERSION) ──────────────────────────────
        db_records: List[AIEvaluation] = []

        for candidate in scored_resumes:
            record = AIEvaluation(
                application_id=batch_application_id,
                resume_score=float(candidate.get("resume_score", 0)),
                interview_score=candidate.get("interview_score"),
                recommendation=candidate.get("recommendation"),
                summary=candidate.get("summary"),

                extracted_skills={
                    "skills_match": candidate.get("extracted_skills", {}).get("skills_match", []),
                    "missing_skills": candidate.get("extracted_skills", {}).get("missing_skills", []),
                },

                metadata_={
                    "filename": candidate.get("filename"),
                    "rank": candidate.get("rank"),
                    "pipeline": "ai_resume_ranker_v1",
                    "parse_error": candidate.get("error"),
                },
            )

            db.add(record)
            db_records.append(record)

        try:
            db.flush()

            inserted_ids = [str(r.id) for r in db_records]

            db.commit()

        except Exception as e:
            db.rollback()
            logger.exception("Failed to persist AI evaluation records")

            inserted_ids = [""] * len(scored_resumes)

        # ── 6. Build response ────────────────────────────────────────────
        ranked_results = []

        for candidate, db_id in zip(scored_resumes, inserted_ids):
            ranked_results.append({
                "filename": candidate.get("filename"),
                "resume_score": candidate.get("resume_score", 0),
                "rank": candidate.get("rank"),
                "summary": candidate.get("summary"),
                "recommendation": candidate.get("recommendation"),

                "skills_match": candidate.get("extracted_skills", {}).get("skills_match", []),
                "missing_skills": candidate.get("extracted_skills", {}).get("missing_skills", []),

                "evaluation_id": db_id,
                "error": candidate.get("error"),
            })

        return {
            "total_candidates": len(ranked_results),
            "batch_id": batch_application_id,
            "ranked_results": ranked_results,
        }

    finally:
        if temp_dir:
            cleanup_temp_dir(temp_dir)