from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column
from src.database import Base
from .base import UUIDMixin, TimestampMixin

class Department(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "departments"

    name: Mapped[str] = mapped_column(String(100), unique=True)
    description: Mapped[str | None]