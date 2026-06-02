from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.schemas.user import SignupRequest, SignupResponse, LoginRequest ,LoginResponse
from src.services.auth_service import signup_user,login_user
from src.database import get_db

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