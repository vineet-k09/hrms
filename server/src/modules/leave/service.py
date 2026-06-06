from uuid import UUID

from src.models.leave_request import LeaveRequest
from src.modules.employee.repository import EmployeeRepository

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
    def _resolve_employee_id(
        db,
        employee_id: UUID | str
    ):
        if not isinstance(employee_id, str):
            return employee_id

        employee = EmployeeRepository.get_by_code(
            db,
            employee_id
        )

        if not employee:
            raise ValueError(
                "Employee not found"
            )

        return employee.id

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
        data = payload.model_dump()
        data["employee_id"] = LeaveService._resolve_employee_id(
            db,
            data["employee_id"]
        )

        leave = LeaveRequest(
            **data,
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
        leave.approved_by = LeaveService._resolve_employee_id(
            db,
            approver_id
        )

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
        leave.approved_by = LeaveService._resolve_employee_id(
            db,
            approver_id
        )

        LeaveRepository.save(db)

        return leave
