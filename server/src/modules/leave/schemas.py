from datetime import date
from uuid import UUID

from pydantic import BaseModel

from src.models.enums import (
    LeaveStatus,
    LeaveType
)


class LeaveCreate(BaseModel):
    employee_id: UUID

    leave_type: LeaveType

    start_date: date
    end_date: date

    reason: str


class LeaveUpdate(BaseModel):
    leave_type: LeaveType | None = None

    start_date: date | None = None
    end_date: date | None = None

    reason: str | None = None

    status: LeaveStatus | None = None


class LeaveApproval(BaseModel):
    approved_by: UUID
class LeaveResponse(BaseModel):
    id: UUID

    employee_id: UUID
    employee_name: str | None
    approved_by: UUID | None

    leave_type: LeaveType

    status: LeaveStatus

    start_date: date
    end_date: date

    reason: str

    class Config:
        from_attributes = True
