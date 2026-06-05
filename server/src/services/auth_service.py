from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from src.models.user import User
from src.schemas.user import SignupRequest
from src.core.security import hash_password, verify_password, create_access_token


# ─────────────────────────────────────────────
# SIGNUP
# ─────────────────────────────────────────────
def signup_user(db: Session, data: SignupRequest) -> User:
    # Check email uniqueness
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Check employee_id uniqueness
    if db.query(User).filter(User.employee_id == data.employee_id).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Employee ID already exists"
        )

    new_user = User(
        full_name=data.full_name,
        email=data.email,
        employee_id=data.employee_id,
        role=data.role.lower(),  # Ensure it is lowercase
        password_hash=hash_password(data.password),
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# ─────────────────────────────────────────────
# LOGIN
# ─────────────────────────────────────────────

def login_user(
    db: Session,
    identifier: str,
    password: str
) -> dict:

    # Try employee_id first
    user = db.query(User).filter(
        User.employee_id == identifier
    ).first()

    # If not found, try email
    if not user:
        user = db.query(User).filter(
            User.email == identifier
        ).first()

    # User not found or password mismatch
    if not user or not verify_password(
        password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    # Account disabled
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated"
        )

    # Generate JWT
    token = create_access_token(
        data={
            "sub": str(user.id),
            "role": user.role.value
        }
    )

    return {
        "message": "Login successful",
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": str(user.id),
            "full_name": user.full_name,
            "email": user.email,
            "employee_id": user.employee_id,
            "role": user.role.value,
            "is_active": user.is_active
        }
    }