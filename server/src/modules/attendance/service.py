from datetime import date
from datetime import datetime

from uuid import UUID

from src.models.attendance import (
    AttendanceRecord
)

from src.models.enums import (
    AttendanceStatus
)

from .repository import (
    AttendanceRepository
)

from .schemas import (
    AttendanceCreate,
    AttendanceUpdate,
    AttendanceCheckIn,
    AttendanceCheckOut
)


class AttendanceService:

    @staticmethod
    def get_all(db):
        return AttendanceRepository.get_all(db)

    @staticmethod
    def get_by_id(
        db,
        attendance_id: UUID
    ):
        attendance = AttendanceRepository.get_by_id(
            db,
            attendance_id
        )

        if not attendance:
            raise ValueError(
                "Attendance record not found"
            )

        return attendance

    @staticmethod
    def create(
        db,
        payload: AttendanceCreate
    ):
        attendance = AttendanceRecord(
            **payload.model_dump()
        )

        return AttendanceRepository.create(
            db,
            attendance
        )

    @staticmethod
    def update(
        db,
        attendance_id: UUID,
        payload: AttendanceUpdate
    ):
        attendance = AttendanceRepository.get_by_id(
            db,
            attendance_id
        )

        if not attendance:
            raise ValueError(
                "Attendance record not found"
            )

        updates = payload.model_dump(
            exclude_unset=True
        )

        for key, value in updates.items():
            setattr(
                attendance,
                key,
                value
            )

        AttendanceRepository.save(db)

        return attendance

    @staticmethod
    def delete(
        db,
        attendance_id: UUID
    ):
        attendance = AttendanceRepository.get_by_id(
            db,
            attendance_id
        )

        if not attendance:
            raise ValueError(
                "Attendance record not found"
            )

        AttendanceRepository.delete(
            db,
            attendance
        )

    @staticmethod
    def check_in(
        db,
        payload: AttendanceCheckIn
    ):
        existing = (
            AttendanceRepository.get_today_record(
                db,
                payload.employee_id
            )
        )

        if existing:
            raise ValueError(
                "Already checked in today"
            )

        attendance = AttendanceRecord(
            employee_id=payload.employee_id,
            date=date.today(),
            check_in=datetime.now().time(),
            status=AttendanceStatus.PRESENT,
            work_hours=0
        )

        return AttendanceRepository.create(
            db,
            attendance
        )

    @staticmethod
    def check_out(
        db,
        payload: AttendanceCheckOut
    ):
        attendance = (
            AttendanceRepository.get_today_record(
                db,
                payload.employee_id
            )
        )

        if not attendance:
            raise ValueError(
                "No check-in found today"
            )

        if attendance.check_out:
            raise ValueError(
                "Already checked out"
            )

        now = datetime.now()

        attendance.check_out = now.time()

        attendance.work_hours = round(
            (
                datetime.combine(
                    date.today(),
                    attendance.check_out
                )
                -
                datetime.combine(
                    date.today(),
                    attendance.check_in
                )
            ).total_seconds()
            / 3600,
            2
        )

        AttendanceRepository.save(db)

        return attendance