"""
recruitment.py (additions)
Location: server/src/routes/recruitment.py

Add this endpoint to your existing recruitment router.
"""

from fastapi import APIRouter, File, Form, UploadFile, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

# Adjust these imports to match your project's actual import paths
from src.database import get_db
from src.services.recruitment.pipeline import run_resume_ranking_pipeline


router = APIRouter(prefix="/recruitment", tags=["Recruitment"])


# ── Response Schemas ───────────────────────────────────────────────────────────

class CandidateResult(BaseModel):
    filename: str
    resume_score: int
    rank: int
    summary: str
    recommendation: str  # strong_yes | yes | maybe | no

    skills_match: List[str]
    missing_skills: List[str]

    evaluation_id: Optional[str] = None
    error: Optional[str] = None

    class Config:
        from_attributes = True


class RankResumesResponse(BaseModel):
    total_candidates: int
    batch_id: str
    ranked_results: List[CandidateResult]


# ── Endpoint ───────────────────────────────────────────────────────────────────

@router.post(
    "/ai/rank-resumes",
    response_model=RankResumesResponse,
    summary="Rank resumes from ZIP using AI",
    description=(
        "Upload a ZIP file containing PDF resumes and a job description. "
        "Each resume is scored by Gemini and returned ranked by fit score."
    ),
)
async def rank_resumes(
    zip_file: UploadFile = File(
        ...,
        description="ZIP archive containing one or more PDF resumes",
        media_type="application/zip",
    ),
    job_description: str = Form(
        ...,
        description="Full text of the job description to evaluate resumes against",
        min_length=20,
    ),
    batch_id: Optional[str] = Form(
        default=None,
        description="Optional UUID to group this batch under a specific application_id",
    ),
    db: Session = Depends(get_db),
):
    """
    POST /recruitment/ai/rank-resumes

    Multipart form fields:
      - zip_file        (file)   — ZIP containing PDF resumes
      - job_description (string) — The job description text
      - batch_id        (string, optional) — Custom application/batch ID
    """
# ── Basic validation ───────────────────────────────────────────────────────
    if not zip_file.filename or not zip_file.filename.lower().endswith(".zip"):
        raise HTTPException(
            status_code=400,
            detail="Uploaded file must have a .zip extension.",
        )

    if len(job_description.strip()) < 20:
        raise HTTPException(
            status_code=400,
            detail="Job description is too short. Please provide meaningful content.",
        )

    # Optional: safer ZIP validation
    import zipfile
    try:
        zip_file.file.seek(0)

        if not zipfile.is_zipfile(zip_file.file):
            raise HTTPException(
                status_code=400,
                detail="Invalid ZIP file.",
            )
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Could not validate ZIP file.",
        )

    # reset pointer after validation
    zip_file.file.seek(0)

    # ── Pipeline execution ─────────────────────────────────────────────────────
    result = run_resume_ranking_pipeline(
        zip_file=zip_file,
        job_description=job_description,
        db=db,
        batch_application_id=batch_id,
    )

    return RankResumesResponse(**result)