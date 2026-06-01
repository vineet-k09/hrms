from sqlalchemy import (
    ForeignKey,
    Date,
    Time,
    Enum,
    Float
)

from sqlalchemy.orm import mapped_column
from src.database import Base
from .base import UUIDMixin, TimestampMixin
from .enums import AttendanceStatus

class AttendanceRecord(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "attendance_records"

    employee_id = mapped_column(
        ForeignKey("employees.id")
    )

    date = mapped_column(Date)

    check_in = mapped_column(Time)

    check_out = mapped_column(Time)

    work_hours = mapped_column(Float)

    status = mapped_column(
        Enum(
            AttendanceStatus,
            name="attendance_status"
        )
    )