from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from src.db.dependencies import get_db

from .service import LeaveService

from .schemas import (
    LeaveCreate,
    LeaveUpdate,
    LeaveApproval,
    LeaveResponse
)

router = APIRouter(
    prefix="/leave",
    tags=["Leave"]
)


@router.get(
    "",
    response_model=list[LeaveResponse]
)
def get_leaves(
    db: Session = Depends(get_db)
):
    return LeaveService.get_all(db)


@router.get(
    "/pending",
    response_model=list[LeaveResponse]
)
def get_pending_leaves(
    db: Session = Depends(get_db)
):
    return LeaveService.get_pending(db)


@router.get(
    "/employee/{employee_id}",
    response_model=list[LeaveResponse]
)
def get_employee_leaves(
    employee_id: UUID,
    db: Session = Depends(get_db)
):
    return LeaveService.get_employee_leaves(
        db,
        employee_id
    )


@router.get(
    "/{leave_id}",
    response_model=LeaveResponse
)
def get_leave(
    leave_id: UUID,
    db: Session = Depends(get_db)
):
    try:
        return LeaveService.get_by_id(
            db,
            leave_id
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


@router.post(
    "",
    response_model=LeaveResponse
)
def create_leave(
    payload: LeaveCreate,
    db: Session = Depends(get_db)
):  
    print(payload)
    try:
        return LeaveService.create(
            db,
            payload
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.patch(
    "/{leave_id}",
    response_model=LeaveResponse
)
def update_leave(
    leave_id: UUID,
    payload: LeaveUpdate,
    db: Session = Depends(get_db)
):
    try:
        return LeaveService.update(
            db,
            leave_id,
            payload
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


@router.patch(
    "/{leave_id}/approve",
    response_model=LeaveResponse
)
def approve_leave(
    leave_id: UUID,
    payload: LeaveApproval,
    db: Session = Depends(get_db)
):
    try:
        return LeaveService.approve(
            db,
            leave_id,
            UUID(str(payload.approved_by))
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


@router.patch(
    "/{leave_id}/reject",
    response_model=LeaveResponse
)
def reject_leave(
    leave_id: UUID,
    payload: LeaveApproval,
    db: Session = Depends(get_db)
):
    try:
        return LeaveService.reject(
            db,
            leave_id,
            UUID(str(payload.approved_by))
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


@router.delete(
    "/{leave_id}"
)
def delete_leave(
    leave_id: UUID,
    db: Session = Depends(get_db)
):
    try:
        LeaveService.delete(
            db,
            leave_id
        )

        return {
            "message": "Leave request deleted"
        }

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )