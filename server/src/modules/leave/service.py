from uuid import UUID

from src.models.leave_request import LeaveRequest

from src.models.enums import (
    LeaveStatus
)

from .repository import (
    LeaveRepository
)

from .schemas import (
    LeaveCreate,
    LeaveUpdate
)


class LeaveService:

    @staticmethod
    def get_all(db):
        return LeaveRepository.get_all(db)

    @staticmethod
    def get_by_id(
        db,
        leave_id: UUID
    ):
        leave = LeaveRepository.get_by_id(
            db,
            leave_id
        )

        if not leave:
            raise ValueError(
                "Leave request not found"
            )

        return leave

    @staticmethod
    def get_pending(db):
        return LeaveRepository.get_pending(db)

    @staticmethod
    def get_employee_leaves(
        db,
        employee_id: UUID
    ):
        return (
            LeaveRepository.get_employee_leaves(
                db,
                employee_id
            )
        )

    @staticmethod
    def create(
        db,
        payload: LeaveCreate
    ):
        leave = LeaveRequest(
            **payload.model_dump(),
            status=LeaveStatus.PENDING
        )

        return LeaveRepository.create(
            db,
            leave
        )

    @staticmethod
    def update(
        db,
        leave_id: UUID,
        payload: LeaveUpdate
    ):
        leave = LeaveRepository.get_by_id(
            db,
            leave_id
        )

        if not leave:
            raise ValueError(
                "Leave request not found"
            )

        updates = payload.model_dump(
            exclude_unset=True
        )

        for key, value in updates.items():
            setattr(
                leave,
                key,
                value
            )

        LeaveRepository.save(db)

        return leave

    @staticmethod
    def delete(
        db,
        leave_id: UUID
    ):
        leave = LeaveRepository.get_by_id(
            db,
            leave_id
        )

        if not leave:
            raise ValueError(
                "Leave request not found"
            )

        LeaveRepository.delete(
            db,
            leave
        )

    @staticmethod
    def approve(
        db,
        leave_id: UUID,
        approver_id: UUID
    ):
        leave = LeaveRepository.get_by_id(
            db,
            leave_id
        )

        if not leave:
            raise ValueError(
                "Leave request not found"
            )

        leave.status = LeaveStatus.APPROVED
        leave.approved_by = approver_id

        LeaveRepository.save(db)

        return leave

    @staticmethod
    def reject(
        db,
        leave_id: UUID,
        approver_id: UUID
    ):
        leave = LeaveRepository.get_by_id(
            db,
            leave_id
        )

        if not leave:
            raise ValueError(
                "Leave request not found"
            )

        leave.status = LeaveStatus.REJECTED
        leave.approved_by = approver_id

        LeaveRepository.save(db)

        return leave