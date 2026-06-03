from fastapi import APIRouter, Depends
from src.core.security import require_roles
from src.models.enums import UserRole

router = APIRouter(
    prefix="/employee",
    tags=["employee"]
)

@router.get("/dashboard")
def employee_dashboard(
    user=Depends(require_roles(UserRole.EMPLOYEE))
):
    return {
        "message": "Employee Dashboard",
        "role": user.role
    }