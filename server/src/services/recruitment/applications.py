from uuid import UUID

from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from src.helper.storage import delete_file, upload_pdf
from src.models.application import Application
from src.models.candidates import Candidate
from src.models.enums import ApplicationStatus
from src.models.job_description import JobDescription


def _require_job(db: Session, job_description_id: UUID) -> JobDescription:
    job = (
        db.query(JobDescription)
        .filter(JobDescription.id == job_description_id)
        .first()
    )

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job description not found",
        )

    return job


def _get_or_create_candidate(
    db: Session,
    *,
    candidate_id: UUID | None,
    full_name: str | None,
    email: str | None,
    phone: str | None,
    current_company: str | None,
    current_role: str | None,
    experience_years: float | None,
) -> Candidate:
    if candidate_id:
        candidate = (
            db.query(Candidate)
            .filter(Candidate.id == candidate_id)
            .first()
        )

        if not candidate:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Candidate not found",
            )

        return candidate

    if not full_name or not email or not phone:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="full_name, email, and phone are required when candidate_id is not provided",
        )

    candidate = (
        db.query(Candidate)
        .filter(Candidate.email == email)
        .first()
    )

    if candidate:
        return candidate

    candidate = Candidate(
        full_name=full_name,
        email=email,
        phone=phone,
        current_company=current_company,
        current_role=current_role,
        experience_years=experience_years or 0,
    )
    db.add(candidate)
    db.flush()

    return candidate


async def create_application_with_resume(
    db: Session,
    *,
    resume: UploadFile,
    job_description_id: UUID,
    candidate_id: UUID | None = None,
    full_name: str | None = None,
    email: str | None = None,
    phone: str | None = None,
    current_company: str | None = None,
    current_role: str | None = None,
    experience_years: float | None = None,
    notes: str | None = None,
) -> Application:
    _require_job(db, job_description_id)
    upload = await upload_pdf(resume)

    try:
        candidate = _get_or_create_candidate(
            db,
            candidate_id=candidate_id,
            full_name=full_name,
            email=email,
            phone=phone,
            current_company=current_company,
            current_role=current_role,
            experience_years=experience_years,
        )

        application = Application(
            candidate_id=candidate.id,
            job_description_id=job_description_id,
            status=ApplicationStatus.APPLIED,
            notes=notes,
            resume_url=upload["url"],
            resume_key=upload["key"],
        )
        db.add(application)
        db.commit()
        db.refresh(application)

        return application
    except Exception:
        db.rollback()
        delete_file(upload["key"])
        raise


def delete_application_resume(
    db: Session,
    application_id: UUID,
) -> Application:
    application = (
        db.query(Application)
        .filter(Application.id == application_id)
        .first()
    )

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )

    if application.resume_key:
        delete_file(application.resume_key)
        application.resume_key = None
        application.resume_url = None
        db.commit()
        db.refresh(application)

    return application


def delete_application(
    db: Session,
    application_id: UUID,
) -> dict[str, str]:
    application = (
        db.query(Application)
        .filter(Application.id == application_id)
        .first()
    )

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )

    if application.resume_key:
        delete_file(application.resume_key)

    db.delete(application)
    db.commit()

    return {
        "message": "Application deleted",
        "application_id": str(application_id),
    }
