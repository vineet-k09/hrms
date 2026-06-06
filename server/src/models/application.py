from src.database import Base
from .base import UUIDMixin, TimestampMixin
from .enums import ApplicationStatus
from sqlalchemy.orm import mapped_column
from sqlalchemy import ForeignKey, String, Enum


class Application(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "applications"

    candidate_id = mapped_column(
        ForeignKey("candidates.id")
    )

    job_description_id = mapped_column(
        ForeignKey("job_descriptions.id")
    )

    status = mapped_column(
        Enum(
            ApplicationStatus,
            name="application_status"
        )
    )

    notes = mapped_column(
        String,
        nullable=True
    )

    resume_url = mapped_column(
        String,
        nullable=True
    )

    resume_key = mapped_column(
        String,
        nullable=True
    )
