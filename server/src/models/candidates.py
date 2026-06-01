from src.database import Base
from .base import UUIDMixin, TimestampMixin
from sqlalchemy.orm import mapped_column
from sqlalchemy import String, Float
from sqlalchemy.dialects.postgresql import JSONB

class Candidate(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "candidates"

    full_name = mapped_column(
        String(255)
    )

    email = mapped_column(
        String(255),
        unique=True
    )

    phone = mapped_column(
        String(30)
    )

    current_company = mapped_column(
        String(255),
        nullable=True
    )

    current_role = mapped_column(
        String(255),
        nullable=True
    )

    experience_years = mapped_column(
        Float,
        default=0
    )

    skills = mapped_column(
        JSONB,
        nullable=True
    )