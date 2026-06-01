from datetime import date
from uuid import UUID

from sqlalchemy.orm import Session

from src.models.attendance import AttendanceRecord


class AttendanceRepository:

    @staticmethod
    def get_all(db: Session):
        return db.query(
            AttendanceRecord
        ).all()

    @staticmethod
    def get_by_id(
        db: Session,
        attendance_id: UUID
    ):
        return (
            db.query(AttendanceRecord)
            .filter(
                AttendanceRecord.id == attendance_id
            )
            .first()
        )

    @staticmethod
    def get_today_record(
        db: Session,
        employee_id: UUID
    ):
        return (
            db.query(AttendanceRecord)
            .filter(
                AttendanceRecord.employee_id == employee_id,
                AttendanceRecord.date == date.today()
            )
            .first()
        )

    @staticmethod
    def create(
        db: Session,
        attendance: AttendanceRecord
    ):
        db.add(attendance)

        db.commit()
        db.refresh(attendance)

        return attendance

    @staticmethod
    def save(db: Session):
        db.commit()

    @staticmethod
    def delete(
        db: Session,
        attendance: AttendanceRecord
    ):
        db.delete(attendance)
        db.commit()