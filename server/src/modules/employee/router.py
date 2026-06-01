from uuid import UUID

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from src.db.dependencies import get_db

from .schemas import (
    EmployeeCreate,
    EmployeeUpdate,
    EmployeeResponse
)

from .service import EmployeeService


router = APIRouter(
    prefix="/employee",
    tags=["Employee"]
)


@router.get(
    "",
    response_model=list[EmployeeResponse]
)
def get_employees(
    db: Session = Depends(get_db)
):
    return EmployeeService.get_all(db)


@router.get(
    "/{employee_id}",
    response_model=EmployeeResponse
)
def get_employee(
    employee_id: UUID,
    db: Session = Depends(get_db)
):
    try:
        return EmployeeService.get_by_id(
            db,
            employee_id
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


@router.post(
    "",
    response_model=EmployeeResponse
)
def create_employee(
    payload: EmployeeCreate,
    db: Session = Depends(get_db)
):
    return EmployeeService.create(
        db,
        payload
    )


@router.patch(
    "/{employee_id}",
    response_model=EmployeeResponse
)
def update_employee(
    employee_id: UUID,
    payload: EmployeeUpdate,
    db: Session = Depends(get_db)
):
    try:
        return EmployeeService.update(
            db,
            employee_id,
            payload
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


@router.delete("/{employee_id}")
def delete_employee(
    employee_id: UUID,
    db: Session = Depends(get_db)
):
    try:
        EmployeeService.delete(
            db,
            employee_id
        )

        return {
            "message": "Employee deleted"
        }

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )