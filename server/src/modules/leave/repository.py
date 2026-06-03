from uuid import UUID

from sqlalchemy.orm import Session, joinedload

from src.models.leave_request import LeaveRequest
from src.models.enums import LeaveStatus


class LeaveRepository:

    @staticmethod
    def get_all(db: Session):
        return db.query(
            LeaveRequest
        ).options(
            joinedload(LeaveRequest.employee)
        ).all()

    @staticmethod
    def get_by_id(
        db: Session,
        leave_id: UUID
    ):
        return (
            db.query(LeaveRequest)
            .options(
                joinedload(LeaveRequest.employee)
            )
            .filter(
                LeaveRequest.id == leave_id
            )
            .first()
        )

    @staticmethod
    def get_pending(db: Session):
        return (
            db.query(LeaveRequest)
            .options(
                joinedload(LeaveRequest.employee)
            )
            .filter(
                LeaveRequest.status
                == LeaveStatus.PENDING
            )
            .all()
        )

    @staticmethod
    def get_employee_leaves(
        db: Session,
        employee_id: UUID
    ):
        return (
            db.query(LeaveRequest)
            .options(
                joinedload(LeaveRequest.employee)
            )
            .filter(
                LeaveRequest.employee_id
                == employee_id
            )
            .all()
        )

    @staticmethod
    def create(
        db: Session,
        leave: LeaveRequest
    ):
        db.add(leave)

        db.commit()
        db.refresh(leave)

        return leave

    @staticmethod
    def save(db: Session):
        db.commit()

    @staticmethod
    def delete(
        db: Session,
        leave: LeaveRequest
    ):
        db.delete(leave)
        db.commit()
