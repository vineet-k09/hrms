from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.schemas.user import SignupRequest, SignupResponse, LoginRequest ,LoginResponse
from src.services.auth_service import signup_user,login_user
from src.models.user import User
from src.database import get_db
from src.core.security import get_current_user

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

@router.post("/signup", response_model=SignupResponse, status_code=201)
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
    user = signup_user(db, payload)
    return SignupResponse(
        message="User created successfully",
        user_id=str(user.id),
        email=user.email,
        role=user.role.value
    )

@router.post("/login", response_model=LoginResponse)
def login(
    payload: LoginRequest,
    db: Session = Depends(get_db)
):
    return login_user(
        db=db,
        identifier=payload.identifier,
        password=payload.password
    )


@router.get("/me")
def me(current_user: User = Depends(get_current_user)):
    return {
        "id": str(current_user.id),
        "full_name": current_user.full_name,
        "email": current_user.email,
        "employee_id": current_user.employee_id,
        "role": current_user.role.value,
        "is_active": current_user.is_active
    }
    
  