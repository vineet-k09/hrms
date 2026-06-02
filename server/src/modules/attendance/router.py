from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from src.db.dependencies import get_db

from .service import AttendanceService

from .schemas import (
    AttendanceCreate,
    AttendanceUpdate,
    AttendanceResponse,
    AttendanceCheckIn,
    AttendanceCheckOut
)


router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"]
)


@router.get(
    "",
    response_model=list[AttendanceResponse]
)
def get_attendance_records(
    db: Session = Depends(get_db)
):
    return AttendanceService.get_all(db)


@router.get(
    "/{attendance_id}",
    response_model=AttendanceResponse
)
def get_attendance_record(
    attendance_id: UUID,
    db: Session = Depends(get_db)
):
    try:
        return AttendanceService.get_by_id(
            db,
            attendance_id
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


@router.post(
    "",
    response_model=AttendanceResponse
)
def create_attendance(
    payload: AttendanceCreate,
    db: Session = Depends(get_db)
):
    return AttendanceService.create(
        db,
        payload
    )


@router.patch(
    "/{attendance_id}",
    response_model=AttendanceResponse
)
def update_attendance(
    attendance_id: UUID,
    payload: AttendanceUpdate,
    db: Session = Depends(get_db)
):
    try:
        return AttendanceService.update(
            db,
            attendance_id,
            payload
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


@router.delete("/{attendance_id}")
def delete_attendance(
    attendance_id: UUID,
    db: Session = Depends(get_db)
):
    try:
        AttendanceService.delete(
            db,
            attendance_id
        )

        return {
            "message": "Attendance deleted"
        }

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )
    
@router.post(
    "/check-in",
    response_model=AttendanceResponse
)
def check_in(
    payload: AttendanceCheckIn,
    db: Session = Depends(get_db)
):
    try:
        return AttendanceService.check_in(
            db,
            payload
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.post(
    "/check-out",
    response_model=AttendanceResponse
)
def check_out(
    payload: AttendanceCheckOut,
    db: Session = Depends(get_db)
):
    try:
        return AttendanceService.check_out(
            db,
            payload
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )