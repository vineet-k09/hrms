from datetime import date
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel

from src.models.enums import EmployeeStatus


class EmployeeCreate(BaseModel):
    department_id: UUID
    manager_id: UUID | None = None

    employee_code: str

    first_name: str
    last_name: str
    phone: str | None

    designation: str

    join_date: date
    salary: Decimal | None

    status: EmployeeStatus = EmployeeStatus.ACTIVE


class EmployeeUpdate(BaseModel):
    department_id: UUID | None = None
    manager_id: UUID | None = None

    first_name: str | None = None
    last_name: str | None = None
    phone: str | None = None

    designation: str | None = None

    salary: Decimal | None = None

    status: EmployeeStatus | None = None


class EmployeeResponse(BaseModel):
    id: UUID

    employee_code: str

    first_name: str
    last_name: str

    phone: str | None

    designation: str

    status: EmployeeStatus

    class Config:
        from_attributes = True