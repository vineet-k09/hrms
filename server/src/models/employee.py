from sqlalchemy import (
    ForeignKey,
    String,
    Enum,
    Numeric,
    Date
)
from sqlalchemy.orm import mapped_column
from src.database import Base
from .base import UUIDMixin, TimestampMixin
from .enums import EmployeeStatus

class Employee(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "employees"

    user_id = mapped_column(
        ForeignKey("users.id"),
        nullable=True
    )

    department_id = mapped_column(
        ForeignKey("departments.id")
    )

    manager_id = mapped_column(
        ForeignKey("employees.id"),
        nullable=True
    )

    employee_code = mapped_column(
        String(50),
        unique=True
    )

    first_name = mapped_column(String(100))
    last_name = mapped_column(String(100))
    phone = mapped_column(String(20))

    designation = mapped_column(String(100))

    join_date = mapped_column(Date)

    salary = mapped_column(
        Numeric(12, 2)
    )

    status = mapped_column(
        Enum(EmployeeStatus, name="employee_status")
    )