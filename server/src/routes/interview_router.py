from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
import os
import json
import asyncio
import random

router = APIRouter(prefix="/interview", tags=["interview"])

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

# MOCK MODE: Set MOCK_INTERVIEW=true in .env to bypass Gemini (for hackathons/demo)
MOCK_MODE = os.getenv("MOCK_INTERVIEW", "false").lower() == "true"

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

# ─── MOCK DATA FOR FALLBACK ───────────────────────────────────────────────────
MOCK_QUESTIONS = {
    "SDE-1": [
        "Tell me about yourself and your programming background.",
        "Explain the difference between an array and a linked list.",
        "How do you handle debugging when your code doesn't work?",
        "Describe a project you're proud of.",
        "Why do you want to work in software development?"
    ],
    "SDE-2": [
        "Walk me through your most complex system design project.",
        "How do you approach optimizing a slow API endpoint?",
        "Explain microservices vs monoliths.",
        "Tell me about a time you refactored legacy code.",
        "How do you mentor junior developers?"
    ],
    "SDE-3": [
        "Design a distributed system for a real-time chat application.",
        "How do you balance technical debt with shipping features?",
        "Describe influencing architecture decisions across teams.",
        "How do you handle system failures at scale?",
        "What's your approach to technical leadership?"
    ],
    "HR": [
        "Tell me about yourself and what motivates you.",
        "Describe a conflict you had with a teammate.",
        "Where do you see yourself in 5 years?",
        "Tell me about a time you failed and what you learned.",
        "Why should we hire you for this role?"
    ],
    "Analyst": [
        "Walk me through how you approach a new dataset.",
        "How do you explain complex data insights to non-technical stakeholders?",
        "Describe a time your analysis led to a business decision.",
        "What tools do you use for data visualization?",
        "How do you ensure data quality in your analyses?"
    ]
}

def get_mock_question(role: str, question_number: int) -> str:
    questions = MOCK_QUESTIONS.get(role, MOCK_QUESTIONS["SDE-1"])
    if question_number < len(questions):
        return questions[question_number]
    return "That concludes our interview. Thank you for your time!"

def get_mock_score(role: str) -> dict:
    score = random.randint(65, 92)
    return {
        "score": score,
        "summary": f"The candidate demonstrated {'strong' if score > 80 else 'adequate'} technical skills for the {role} position. {'Communication was clear and structured.' if score > 75 else 'Could improve on articulating complex ideas.'}",
        "strengths": [
            "Good problem-solving approach",
            "Relevant technical experience",
            "Clear communication style"
        ],
        "improvements": [
            "Could provide more specific examples",
            "Consider deepening system design knowledge"
        ],
        "recommendation": "yes" if score > 75 else "maybe"
    }

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
                wait_time = (attempt + 1) * 3
                print(f"Rate limited. Retrying in {wait_time}s... (attempt {attempt + 1}/{max_retries})")
                await asyncio.sleep(wait_time)
                continue
            raise
    raise Exception("Rate limit exceeded after all retries")

@router.post("/chat")
async def chat(request: QuestionRequest):
    if not GEMINI_API_KEY and not MOCK_MODE:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured. Set MOCK_INTERVIEW=true for demo mode.")

    question_number = len([m for m in request.messages if m.role == "user"])

    # MOCK MODE: Skip Gemini entirely
    if MOCK_MODE or not GEMINI_API_KEY:
        is_complete = question_number >= 4
        return {
            "question": get_mock_question(request.role, question_number),
            "isComplete": is_complete,
            "questionNumber": question_number + 1,
            "mode": "mock"
        }

    # REAL GEMINI MODE
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
    except Exception as e:
        # Fallback to mock if Gemini fails
        print(f"Gemini failed ({str(e)}), falling back to mock")
        is_complete = question_number >= 4
        return {
            "question": get_mock_question(request.role, question_number),
            "isComplete": is_complete,
            "questionNumber": question_number + 1,
            "mode": "mock_fallback"
        }

    ai_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
    is_complete = "INTERVIEW_COMPLETE" in ai_text.upper()
    clean_text = ai_text.replace("INTERVIEW_COMPLETE", "").replace("Interview complete", "").strip()

    return {
        "question": clean_text,
        "isComplete": is_complete,
        "questionNumber": question_number + 1,
        "mode": "gemini"
    }

@router.post("/score")
async def score_interview(request: InterviewSession):
    if not GEMINI_API_KEY and not MOCK_MODE:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured")

    # MOCK MODE
    if MOCK_MODE or not GEMINI_API_KEY:
        result = get_mock_score(request.role)
        return {
            "candidateId": request.candidateId,
            **result,
            "mode": "mock"
        }

    # REAL GEMINI MODE
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
    except Exception as e:
        print(f"Gemini scoring failed ({str(e)}), falling back to mock")
        result = get_mock_score(request.role)
        return {
            "candidateId": request.candidateId,
            **result,
            "mode": "mock_fallback"
        }

    text = data["candidates"][0]["content"]["parts"][0]["text"]
    text = text.strip().replace("```json", "").replace("```", "").strip()
    
    try:
        result_data = json.loads(text)
    except json.JSONDecodeError:
        result = get_mock_score(request.role)
        return {
            "candidateId": request.candidateId,
            **result,
            "mode": "mock_fallback"
        }

    return {
        "candidateId": request.candidateId,
        "score": result_data["score"],
        "summary": result_data["summary"],
        "strengths": result_data["strengths"],
        "improvements": result_data["improvements"],
        "recommendation": result_data["recommendation"],
        "mode": "gemini"
    }

@router.get("/health")
async def health_check():
    return {
        "status": "ok",
        "gemini_configured": bool(GEMINI_API_KEY),
        "mock_mode": MOCK_MODE,
        "tip": MOCK_MODE and "Running in MOCK mode - no API calls made" or "If 429 errors, set MOCK_INTERVIEW=true in .env"
    }