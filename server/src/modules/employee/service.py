from uuid import UUID

from sqlalchemy.orm import Session

from src.models.employee import Employee

from .repository import EmployeeRepository
from .schemas import EmployeeCreate, EmployeeUpdate


class EmployeeService:

    @staticmethod
    def get_all(db: Session):
        return EmployeeRepository.get_all(db)

    @staticmethod
    def get_by_id(db: Session, employee_id: UUID):
        employee = EmployeeRepository.get_by_id(
            db,
            employee_id
        )

        if not employee:
            raise ValueError("Employee not found")

        return employee

    @staticmethod
    def create(
        db: Session,
        payload: EmployeeCreate
    ):
        employee = Employee(
            **payload.model_dump()
        )

        return EmployeeRepository.create(
            db,
            employee
        )

    @staticmethod
    def update(
        db: Session,
        employee_id: UUID,
        payload: EmployeeUpdate
    ):
        employee = EmployeeRepository.get_by_id(
            db,
            employee_id
        )

        if not employee:
            raise ValueError("Employee not found")

        updates = payload.model_dump(
            exclude_unset=True
        )

        for key, value in updates.items():
            setattr(employee, key, value)

        EmployeeRepository.save(db)

        return employee

    @staticmethod
    def delete(
        db: Session,
        employee_id: UUID
    ):
        employee = EmployeeRepository.get_by_id(
            db,
            employee_id
        )

        if not employee:
            raise ValueError("Employee not found")

        EmployeeRepository.delete(
            db,
            employee
        )