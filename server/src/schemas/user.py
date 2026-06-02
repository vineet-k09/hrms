from pydantic import BaseModel, EmailStr, field_validator
from enum import Enum
from datetime import datetime
from uuid import UUID


class UserRole(str, Enum):
    ADMIN = "admin"
    SENIOR_MANAGER = "senior_manager"
    HR_RECRUITER = "hr_recruiter"
    EMPLOYEE = "employee"
    CANDIDATE = "candidate"


# ── Signup ──────────────────────────────────────────────

class SignupRequest(BaseModel):
    model_config = {"str_strip_whitespace": True}
    full_name: str
    email: EmailStr
    employee_id: str
    role: UserRole
    password: str
    confirm_password: str
    @field_validator("full_name")
    @classmethod
    def name_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError("Full name cannot be empty")
        return v.strip()

    @field_validator("employee_id")
    @classmethod
    def employee_id_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError("Employee ID cannot be empty")
        return v.strip().upper()

    @field_validator("password")
    @classmethod
    def password_must_be_strong(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if len(v.encode("utf-8")) > 72:
            raise ValueError("Password cannot exceed 72 characters")
        return v

    @field_validator("confirm_password")
    @classmethod
    def passwords_must_match(cls, v, info):
        if "password" in info.data and v != info.data["password"]:
            raise ValueError("Passwords do not match")
        return v


class SignupResponse(BaseModel):
    message: str
    user_id: UUID
    email: str
    role: str


# ── Login ───────────────────────────────────────────────

class LoginRequest(BaseModel):
    identifier: str
    password: str


class LoginResponse(BaseModel):
    message: str
    access_token: str
    token_type: str = "bearer"
    user: dict


# ── User Response ───────────────────────────────────────

class UserResponse(BaseModel):
    id: UUID
    full_name: str
    email: EmailStr
    employee_id: str
    role: str
    is_active: bool
    created_at: datetime

    model_config = {
        "from_attributes": True
    }