from sqlalchemy import Enum, String, Boolean
from sqlalchemy.orm import mapped_column
from src.database import Base
from .base import UUIDMixin, TimestampMixin
from .enums import UserRole

class User(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "users"

    email = mapped_column(String(255), unique=True, index=True)

    password_hash = mapped_column(String)

    role = mapped_column(
        Enum(UserRole, name="user_role")
    )

    is_active = mapped_column(
        Boolean,
        default=True
    )