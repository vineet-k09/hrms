from uuid import UUID

from sqlalchemy.orm import Session

from src.models.employee import Employee


class EmployeeRepository:

    @staticmethod
    def get_all(db: Session):
        return db.query(Employee).all()

    @staticmethod
    def get_by_id(db: Session, employee_id: UUID):
        return (
            db.query(Employee)
            .filter(Employee.id == employee_id)
            .first()
        )

    @staticmethod
    def get_by_code(db: Session, employee_code: str):
        return (
            db.query(Employee)
            .filter(Employee.employee_code == employee_code)
            .first()
        )

    @staticmethod
    def create(db: Session, employee: Employee):
        db.add(employee)
        db.commit()
        db.refresh(employee)

        return employee

    @staticmethod
    def delete(db: Session, employee: Employee):
        db.delete(employee)
        db.commit()

    @staticmethod
    def save(db: Session):
        db.commit()
