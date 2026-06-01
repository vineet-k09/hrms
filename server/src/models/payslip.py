from src.database import Base
from .base import UUIDMixin, TimestampMixin
from sqlalchemy import ForeignKey, Numeric, Integer
from sqlalchemy.orm import mapped_column

class Payslip(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "payslips"

    employee_id = mapped_column(
        ForeignKey("employees.id")
    )

    month = mapped_column(Integer)
    year = mapped_column(Integer)

    basic_salary = mapped_column(
        Numeric(12, 2)
    )

    bonus = mapped_column(
        Numeric(12, 2),
        default=0
    )

    deductions = mapped_column(
        Numeric(12, 2),
        default=0
    )

    net_salary = mapped_column(
        Numeric(12, 2)
    )