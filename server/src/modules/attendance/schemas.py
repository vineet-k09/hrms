from datetime import date, time
from uuid import UUID

from pydantic import BaseModel

from src.models.enums import AttendanceStatus


class AttendanceCreate(BaseModel):
    employee_id: UUID

    date: date

    check_in: time | None = None
    check_out: time | None = None

    work_hours: float = 0

    status: AttendanceStatus


class AttendanceUpdate(BaseModel):
    check_in: time | None = None
    check_out: time | None = None

    work_hours: float | None = None

    status: AttendanceStatus | None = None


class AttendanceCheckIn(BaseModel):
    employee_id: UUID


class AttendanceCheckOut(BaseModel):
    employee_id: UUID


class AttendanceResponse(BaseModel):
    id: UUID

    employee_id: UUID

    date: date

    check_in: time | None
    check_out: time | None

    work_hours: float

    status: AttendanceStatus

    class Config:
        from_attributes = True