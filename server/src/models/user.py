from sqlalchemy import Enum, String, Boolean
from sqlalchemy.orm import mapped_column

from src.database import Base
from .base import UUIDMixin, TimestampMixin
from .enums import UserRole


class User(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "users"

    full_name = mapped_column(
        String(200),
        nullable=False
    )

    email = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False
    )

    employee_id = mapped_column(
        String(50),
        unique=True,
        index=True,
        nullable=True
    )

    password_hash = mapped_column(
        String(255),
        nullable=False
    )

    role = mapped_column(
        Enum(UserRole, name="user_role"),
        nullable=False
    )

    is_active = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )