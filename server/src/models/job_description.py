from src.database import Base
from .base import UUIDMixin, TimestampMixin

from sqlalchemy.orm import mapped_column
from sqlalchemy import String, ForeignKey, Enum, Text

from .enums import JobStatus


class JobDescription(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "job_descriptions"

    # Human-friendly identifier
    job_code = mapped_column(
        String(20),
        unique=True,
        index=True,
    )

    title = mapped_column(
        String(255),
        nullable=False,
    )

    department_id = mapped_column(
        ForeignKey("departments.id"),
        nullable=False,
    )

    description = mapped_column(
        Text,
        nullable=False,
    )

    requirements = mapped_column(
        Text,
        nullable=False,
    )

    # AI/Search optimization
    keywords = mapped_column(
        Text,
        nullable=True,
    )
    # Example:
    # "python, fastapi, postgresql, docker, aws"

    status = mapped_column(
        Enum(
            JobStatus,
            name="job_status",
        ),
        nullable=False,
    )