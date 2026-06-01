from src.database import Base
from .base import UUIDMixin, TimestampMixin
from sqlalchemy import ForeignKey, Enum, Date, String
from sqlalchemy.orm import mapped_column
from .enums import LeaveStatus, LeaveType

class LeaveRequest(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "leave_requests"

    employee_id = mapped_column(
        ForeignKey("employees.id")
    )

    approved_by = mapped_column(
        ForeignKey("employees.id"),
        nullable=True
    )

    leave_type = mapped_column(
        Enum(
            LeaveType,
            name="leave_type"
        )
    )

    status = mapped_column(
        Enum(
            LeaveStatus,
            name="leave_status"
        )
    )

    start_date = mapped_column(Date)

    end_date = mapped_column(Date)

    reason = mapped_column(String)