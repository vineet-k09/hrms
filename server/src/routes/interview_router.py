from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
import os
import json
import asyncio

router = APIRouter(prefix="/interview", tags=["interview"])

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

class ChatMessage(BaseModel):
    role: str
    text: str

class InterviewSession(BaseModel):
    candidateId: str
    role: str
    jobDescription: str
    messages: list[ChatMessage]

class QuestionRequest(BaseModel):
    candidateId: str
    role: str
    jobDescription: str
    messages: list[ChatMessage]

def get_system_prompt(role: str, job_description: str) -> str:
    return f"""You are an expert technical interviewer conducting a {role} interview.

JOB DESCRIPTION:
{job_description}

RULES:
- Ask ONE question at a time
- Keep questions natural and conversational (1-2 sentences max)
- Adapt follow-up questions based on the candidate's previous answers
- After 4-5 questions total, say "INTERVIEW_COMPLETE" and stop
- Do NOT give feedback during the interview
- Start with a brief greeting and first question"""

def get_scoring_prompt(role: str, job_description: str) -> str:
    return f"""You are an expert hiring manager. Evaluate this {role} interview.

JOB DESCRIPTION:
{job_description}

Return ONLY this JSON structure:
{{
    "score": <0-100>,
    "summary": "<2 sentences>",
    "strengths": ["<3 items>"],
    "improvements": ["<2 items>"],
    "recommendation": "<strong_yes|yes|maybe|no>"
}}"""

async def call_gemini_with_retry(payload: dict, max_retries: int = 3) -> dict:
    """Call Gemini API with retry logic for rate limits"""
    for attempt in range(max_retries):
        try:
            async with httpx.AsyncClient(timeout=20.0) as client:
                response = await client.post(
                    f"{GEMINI_URL}?key={GEMINI_API_KEY}",
                    json=payload,
                    headers={"Content-Type": "application/json"}
                )
                response.raise_for_status()
                return response.json()
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 429:
                wait_time = (attempt + 1) * 2  # 2s, 4s, 6s
                print(f"Rate limited. Retrying in {wait_time}s... (attempt {attempt + 1}/{max_retries})")
                await asyncio.sleep(wait_time)
                continue
            raise  # Re-raise if not 429
    raise HTTPException(status_code=429, detail="Gemini API rate limit exceeded. Please wait a moment and try again.")

@router.post("/chat")
async def chat(request: QuestionRequest):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured")

    system_prompt = get_system_prompt(request.role, request.jobDescription)
    contents = [{"role": "user", "parts": [{"text": system_prompt}]}]
    
    for msg in request.messages:
        contents.append({
            "role": "user" if msg.role == "user" else "model",
            "parts": [{"text": msg.text}]
        })

    payload = {
        "contents": contents,
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 200,
        }
    }

    try:
        data = await call_gemini_with_retry(payload)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Gemini API error: {str(e)}")

    ai_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
    is_complete = "INTERVIEW_COMPLETE" in ai_text.upper()
    clean_text = ai_text.replace("INTERVIEW_COMPLETE", "").replace("Interview complete", "").strip()

    return {
        "question": clean_text,
        "isComplete": is_complete,
        "questionNumber": len([m for m in request.messages if m.role == "user"]) + 1
    }

@router.post("/score")
async def score_interview(request: InterviewSession):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured")

    transcript_lines = []
    for msg in request.messages:
        prefix = "Interviewer" if msg.role == "model" else "Candidate"
        transcript_lines.append(f"{prefix}: {msg.text}")
    transcript = "\n".join(transcript_lines)

    prompt = f"""{get_scoring_prompt(request.role, request.jobDescription)}

INTERVIEW TRANSCRIPT:
{transcript}"""

    payload = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.3,
            "maxOutputTokens": 1024,
            "responseMimeType": "application/json"
        }
    }

    try:
        data = await call_gemini_with_retry(payload)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Gemini API error: {str(e)}")

    text = data["candidates"][0]["content"]["parts"][0]["text"]
    text = text.strip().replace("```json", "").replace("```", "").strip()
    
    try:
        result_data = json.loads(text)
    except json.JSONDecodeError:
        raise HTTPException(status_code=502, detail="Failed to parse Gemini response")

    return {
        "candidateId": request.candidateId,
        "score": result_data["score"],
        "summary": result_data["summary"],
        "strengths": result_data["strengths"],
        "improvements": result_data["improvements"],
        "recommendation": result_data["recommendation"]
    }

@router.get("/health")
async def health_check():
    return {
        "status": "ok",
        "gemini_configured": bool(GEMINI_API_KEY),
        "tip": "If you get 429 errors, wait 10-15 seconds between requests"
    }