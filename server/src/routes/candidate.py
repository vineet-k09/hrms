from fastapi import APIRouter, Depends
from src.core.security import require_roles
from src.models.enums import UserRole

router = APIRouter(
    prefix="/candidate",
    tags=["candidate"]
)

@router.get("/dashboard")
def candidate_dashboard(
    user=Depends(require_roles(UserRole.CANDIDATE))
):
    return {
        "message": "Candidate Dashboard",
        "role": user.role
    }