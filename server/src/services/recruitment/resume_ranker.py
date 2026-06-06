import os
import json
import time
from typing import Dict, Any

from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

# ── Gemini client (NEW SDK) ─────────────────────────────────────────────
client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

# ── System Prompt ────────────────────────────────────────────────────────
_SYSTEM_PROMPT = """You are an expert HR recruiter and technical screener.

Evaluate a candidate's resume against the given job description.

Return ONLY valid JSON in this format:

{
  "resume_score": <integer 0-100>,
  "interview_score": <integer 0-100 or null>,
  "recommendation": "<strong_yes | yes | maybe | no>",
  "summary": "<2-3 sentence professional summary>",
  "extracted_skills": {
    "skills_match": [list of matched skills],
    "missing_skills": [list of missing skills]
  }
}
"""


# ── Core Function ────────────────────────────────────────────────────────
def rank_resume(
    resume_text: str,
    job_description: str,
    filename: str = "unknown.pdf",
    retry_count: int = 2,
) -> Dict[str, Any]:

    truncated_text = resume_text[:6000]

    prompt = (
        _SYSTEM_PROMPT
        + f"\n\nJOB DESCRIPTION:\n{job_description}"
        + f"\n\nRESUME:\n{truncated_text}"
        + f"\n\nFILENAME: {filename}"
    )

    last_error = None

    for attempt in range(retry_count + 1):
        try:
            if attempt > 0:
                time.sleep(2 * attempt)

            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.1,
                    response_mime_type="application/json",
                ),
            )

            raw = response.text
            data = json.loads(raw)

            return _normalize(data)

        except Exception as e:
            last_error = str(e)

    return _error_result(last_error)


# ── Normalization ────────────────────────────────────────────────────────
def _normalize(data: dict) -> Dict[str, Any]:
    return {
        "resume_score": int(data.get("resume_score", 0)),
        "interview_score": data.get("interview_score"),
        "recommendation": data.get("recommendation", "no"),
        "summary": data.get("summary", ""),
        "extracted_skills": {
            "skills_match": data.get("extracted_skills", {}).get("skills_match", []),
            "missing_skills": data.get("extracted_skills", {}).get("missing_skills", []),
        },
        "error": None,
    }


# ── Error Handling ───────────────────────────────────────────────────────
def _error_result(message: str) -> Dict[str, Any]:
    return {
        "resume_score": 0,
        "interview_score": None,
        "recommendation": "no",
        "summary": f"Evaluation failed: {message}",
        "extracted_skills": {
            "skills_match": [],
            "missing_skills": [],
        },
        "error": message,
    }