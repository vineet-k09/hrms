# AI Resume Ranker — Integration Guide
## FWC Hackathon · HRMS Module

---

## 1. File Placement

```
server/src/
  services/
    recruitment/
      __init__.py          ← create empty file
      zip_handler.py       ← from this delivery
      resume_parser.py     ← from this delivery
      resume_ranker.py     ← from this delivery
      pipeline.py          ← from this delivery
  routes/
    recruitment.py         ← ADD the endpoint from recruitment_route.py
```

---

## 2. Environment Variable

Add to your `.env` file:

```
GEMINI_API_KEY=your_google_gemini_api_key_here
```

Get a free key at: https://aistudio.google.com/app/apikey

---

## 3. Install Dependencies

```bash
pip install pymupdf google-generativeai python-multipart
```

---

## 4. Register the Route

In your FastAPI `main.py` or `app.py`:

```python
from server.src.routes.recruitment import router as recruitment_router
app.include_router(recruitment_router)
```

If you already have a recruitment router, add only the endpoint:

```python
# In your existing routes/recruitment.py
# Paste the rank_resumes() function and the schema classes
# from recruitment_route.py
```

---

## 5. Fix Import Paths

In `pipeline.py`, update this import to match YOUR project structure:

```python
# Change this:
from server.src.models.ai_evaluation import AIEvaluation
from server.src.services.database import get_db

# To whatever your actual paths are, e.g.:
from src.models.ai_evaluation import AIEvaluation
from src.db.session import get_db
```

---

## 6. Test the Endpoint

```bash
curl -X POST http://localhost:8000/recruitment/ai/rank-resumes \
  -F "zip_file=@test_resumes.zip" \
  -F "job_description=We need a Python backend developer with FastAPI, PostgreSQL, and REST API experience."
```

Expected response:
```json
{
  "total_candidates": 3,
  "batch_id": "uuid-here",
  "ranked_results": [
    {
      "filename": "alice.pdf",
      "score": 91,
      "rank": 1,
      "summary": "Strong Python backend developer with...",
      "recommendation": "strong_yes",
      "skills_match": ["Python", "FastAPI", "PostgreSQL"],
      "missing_skills": [],
      "evaluation_id": "db-row-id"
    }
  ]
}
```

---

## 7. Frontend (Next.js)

Place `ResumeRanker.jsx` in:
```
components/recruitment/ResumeRanker.jsx
```

Use it in any page:
```jsx
import ResumeRanker from "@/components/recruitment/ResumeRanker";

export default function RankPage() {
  return <ResumeRanker />;
}
```

Set in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 8. How It Works (Pipeline Flow)

```
POST /recruitment/ai/rank-resumes
         │
         ▼
  zip_handler.py
  • Validate ZIP
  • Extract to /tmp/resume_batch_xxx/
  • Filter .pdf files only
         │
         ▼
  resume_parser.py
  • PyMuPDF fitz.open()
  • Extract text per page
  • Clean whitespace/encoding
         │
         ▼
  resume_ranker.py  (per resume, in loop)
  • Build prompt: resume + job description
  • Call Gemini 1.5 Flash (free tier)
  • Parse JSON response
  • score / skills_match / missing_skills / summary / recommendation
         │
         ▼
  pipeline.py
  • Sort by score DESC
  • Assign rank (1 = best)
  • INSERT into ai_evaluations table
  • Cleanup temp files
         │
         ▼
  Return ranked_results JSON to frontend
```

---

## 9. DB Table Mapping

Each resume → one row in `ai_evaluations`:

| Column           | Value                                      |
|------------------|--------------------------------------------|
| application_id   | batch UUID (groups this upload together)   |
| resume_score     | Gemini score 0–100 (float)                 |
| interview_score  | NULL (not applicable here)                 |
| recommendation   | "strong_yes" / "yes" / "maybe" / "no"     |
| summary          | Gemini's 2–3 sentence assessment           |
| extracted_skills | ["Python", "FastAPI", …] (JSONB array)     |
| metadata_        | { filename, rank, missing_skills, ... }    |

---

## 10. Gemini Rate Limits (Free Tier)

- Gemini 1.5 Flash: 15 requests/minute, 1500 requests/day
- For 5–20 resumes per batch: well within limits
- The ranker includes 1.5s retry back-off for transient errors
- No parallel calls (sequential is safer for free tier + deterministic ordering)
