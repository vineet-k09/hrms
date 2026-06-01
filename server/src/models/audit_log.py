from src.database import Base
from .base import UUIDMixin
from sqlalchemy import ForeignKey, String, DateTime, func
from sqlalchemy.orm import mapped_column
from sqlalchemy.dialects.postgresql import JSONB

class AuditLog(UUIDMixin, Base):
    __tablename__ = "audit_logs"

    user_id = mapped_column(
        ForeignKey("users.id")
    )

    action = mapped_column(
        String(255)
    )

    entity_type = mapped_column(
        String(100)
    )

    entity_id = mapped_column(
        String(255)
    )

    metadata_ = mapped_column(
        JSONB,
        nullable=True
    )

    created_at = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )