"""
recruitment.py (additions)
Location: server/src/routes/recruitment.py

Add this endpoint to your existing recruitment router.
"""

from datetime import datetime
from fastapi import APIRouter, File, Form, UploadFile, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel

from src.database import get_db
from src.core.security import get_current_user
from src.models.application import Application
from src.models.candidates import Candidate
from src.models.department import Department
from src.models.employee import Employee
from src.models.job_description import JobDescription
from src.models.user import User
from src.models.enums import ApplicationStatus, JobStatus
from src.services.recruitment.applications import (
    create_application_with_resume,
    delete_application,
    delete_application_resume,
)
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


class ApplicationResponse(BaseModel):
    id: UUID
    candidate_id: UUID
    job_description_id: UUID
    status: ApplicationStatus
    notes: Optional[str] = None
    resume_url: Optional[str] = None
    resume_key: Optional[str] = None

    class Config:
        from_attributes = True


class OpenRoleResponse(BaseModel):
    id: UUID
    job_code: Optional[str] = None
    title: str
    department_name: str
    description: str
    requirements: str
    status: JobStatus


class MyApplicationResponse(BaseModel):
    id: UUID
    job_description_id: UUID
    job_code: Optional[str] = None
    title: str
    department_name: str
    status: ApplicationStatus
    notes: Optional[str] = None
    resume_url: Optional[str] = None
    resume_key: Optional[str] = None
    applied_at: Optional[datetime] = None


class ApplyRoleRequest(BaseModel):
    job_description_id: UUID


def _get_or_create_candidate_for_user(db: Session, current_user: User) -> Candidate:
    candidate = (
        db.query(Candidate)
        .filter(Candidate.email == current_user.email)
        .first()
    )

    if candidate:
        return candidate

    employee = (
        db.query(Employee)
        .filter(Employee.user_id == current_user.id)
        .first()
    )

    candidate = Candidate(
        full_name=current_user.full_name,
        email=current_user.email,
        phone=employee.phone if employee and employee.phone else current_user.employee_id or "0000000000",
        current_company=None,
        current_role=employee.designation if employee else None,
        experience_years=0,
        skills=None,
    )

    db.add(candidate)
    db.flush()
    return candidate


def _serialize_open_role(job: JobDescription, department: Department) -> OpenRoleResponse:
    return OpenRoleResponse(
        id=job.id,
        job_code=job.job_code,
        title=job.title,
        department_name=department.name,
        description=job.description,
        requirements=job.requirements,
        status=job.status,
    )


def _serialize_application(
    application: Application,
    job: JobDescription,
    department: Department,
) -> MyApplicationResponse:
    return MyApplicationResponse(
        id=application.id,
        job_description_id=application.job_description_id,
        job_code=job.job_code,
        title=job.title,
        department_name=department.name,
        status=application.status,
        notes=application.notes,
        resume_url=application.resume_url,
        resume_key=application.resume_key,
        applied_at=application.created_at,
    )


# ── Application Endpoints ──────────────────────────────────────────────────────

@router.post(
    "/applications",
    response_model=ApplicationResponse,
    status_code=201,
    summary="Create a job application with resume upload",
)
async def create_application(
    resume: UploadFile = File(
        ...,
        description="Candidate resume PDF",
        media_type="application/pdf",
    ),
    job_description_id: UUID = Form(...),
    candidate_id: Optional[UUID] = Form(default=None),
    full_name: Optional[str] = Form(default=None),
    email: Optional[str] = Form(default=None),
    phone: Optional[str] = Form(default=None),
    current_company: Optional[str] = Form(default=None),
    current_role: Optional[str] = Form(default=None),
    experience_years: Optional[float] = Form(default=None),
    notes: Optional[str] = Form(default=None),
    db: Session = Depends(get_db),
):
    return await create_application_with_resume(
        db,
        resume=resume,
        job_description_id=job_description_id,
        candidate_id=candidate_id,
        full_name=full_name,
        email=email,
        phone=phone,
        current_company=current_company,
        current_role=current_role,
        experience_years=experience_years,
        notes=notes,
    )


@router.delete(
    "/applications/{application_id}/resume",
    response_model=ApplicationResponse,
    summary="Delete the stored resume for an application",
)
def remove_application_resume(
    application_id: UUID,
    db: Session = Depends(get_db),
):
    return delete_application_resume(db, application_id)


@router.delete(
    "/applications/{application_id}",
    summary="Delete an application and its stored resume",
)
def remove_application(
    application_id: UUID,
    db: Session = Depends(get_db),
):
    return delete_application(db, application_id)


@router.get(
    "/jobs/open",
    response_model=List[OpenRoleResponse],
    summary="List open jobs available to the current user",
)
def list_open_jobs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    candidate = (
        db.query(Candidate)
        .filter(Candidate.email == current_user.email)
        .first()
    )

    applied_job_ids = []
    if candidate:
        applied_job_ids = [
            job_id
            for (job_id,) in db.query(Application.job_description_id)
            .filter(Application.candidate_id == candidate.id)
            .all()
        ]

    query = (
        db.query(JobDescription, Department)
        .join(Department, JobDescription.department_id == Department.id)
        .filter(JobDescription.status == JobStatus.OPEN)
    )

    if applied_job_ids:
        query = query.filter(~JobDescription.id.in_(applied_job_ids))

    jobs = query.order_by(JobDescription.created_at.desc()).all()

    return [
        _serialize_open_role(job, department)
        for job, department in jobs
    ]


@router.get(
    "/applications/me",
    response_model=List[MyApplicationResponse],
    summary="List the current user's applications",
)
def list_my_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    candidate = (
        db.query(Candidate)
        .filter(Candidate.email == current_user.email)
        .first()
    )

    if not candidate:
        return []

    rows = (
        db.query(Application, JobDescription, Department)
        .join(JobDescription, Application.job_description_id == JobDescription.id)
        .join(Department, JobDescription.department_id == Department.id)
        .filter(Application.candidate_id == candidate.id)
        .order_by(Application.created_at.desc())
        .all()
    )

    return [
        _serialize_application(application, job, department)
        for application, job, department in rows
    ]


@router.post(
    "/applications/apply",
    response_model=ApplicationResponse,
    status_code=201,
    summary="Apply for an open job using the current user",
)
def apply_for_role(
    payload: ApplyRoleRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    job = (
        db.query(JobDescription)
        .filter(JobDescription.id == payload.job_description_id)
        .first()
    )

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if job.status != JobStatus.OPEN:
        raise HTTPException(status_code=400, detail="Job is not open for applications")

    candidate = _get_or_create_candidate_for_user(db, current_user)

    existing = (
        db.query(Application)
        .filter(
            Application.candidate_id == candidate.id,
            Application.job_description_id == job.id,
        )
        .first()
    )

    if existing:
        return existing

    application = Application(
        candidate_id=candidate.id,
        job_description_id=job.id,
        status=ApplicationStatus.APPLIED,
        notes="Applied from the candidate dashboard",
    )

    db.add(application)
    db.commit()
    db.refresh(application)

    return application


# ── AI Ranking Endpoint ───────────────────────────────────────────────────────

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
        batch_application_id=str(batch_id),
    )

    return RankResumesResponse(**result)
