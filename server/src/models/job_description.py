from src.database import Base
from .base import UUIDMixin, TimestampMixin
from sqlalchemy.orm import mapped_column
from sqlalchemy import String, ForeignKey, Enum
from .enums import JobStatus

class JobDescription(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "job_descriptions"

    title = mapped_column(String(255))

    department_id = mapped_column(
        ForeignKey("departments.id")
    )

    description = mapped_column(String)

    requirements = mapped_column(String)

    status = mapped_column(
        Enum(
            JobStatus,
            name="job_status"
        )
    )