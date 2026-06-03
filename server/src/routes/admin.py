from fastapi import APIRouter, Depends
from src.core.security import require_roles
from src.models.enums import UserRole

router = APIRouter(
    prefix="/admin",
    tags=["admin"]
)

@router.get("/dashboard")
def admin_dashboard(
    user=Depends(require_roles(UserRole.ADMIN))
):
    return {
        "message": "Admin Dashboard",
        "role": user.role
    }