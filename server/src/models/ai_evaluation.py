from src.database import Base
from .base import UUIDMixin, TimestampMixin
from sqlalchemy import ForeignKey, String, Float
from sqlalchemy.orm import mapped_column
from sqlalchemy.dialects.postgresql import JSONB

class AIEvaluation(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "ai_evaluations"

    application_id = mapped_column(
        ForeignKey("applications.id"),
        
    )

    resume_score = mapped_column(Float)

    interview_score = mapped_column(
        Float,
        nullable=True
    )

    recommendation = mapped_column(
        String
    )

    summary = mapped_column(
        String
    )

    extracted_skills = mapped_column(
        JSONB,
        nullable=True
    )

    # 'metadata' is a reserved attribute on Declarative Base; use a different
    # attribute name but keep the DB column name as 'metadata'.
    metadata_ = mapped_column(
        JSONB,
        nullable=True,
        name="metadata"
    )