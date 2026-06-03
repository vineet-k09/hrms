from fastapi import APIRouter, Depends
from src.core.security import require_roles
from src.models.enums import UserRole

router = APIRouter(
    prefix="/hr",
    tags=["hr"]
)

@router.get("/dashboard")
def hr_dashboard(
    user=Depends(
        require_roles(
            UserRole.HR_RECRUITER,
            UserRole.SENIOR_MANAGER
        )
    )
):
    return {
        "message": "HR Dashboard",
        "role": user.role
    }