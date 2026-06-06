from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from src.models.employee import Employee
from src.models.enums import EmployeeStatus, UserRole
from src.models.user import User
from src.schemas.user import SignupRequest
from src.core.security import hash_password, verify_password, create_access_token


def _split_full_name(full_name: str) -> tuple[str, str]:
    parts = full_name.strip().split(maxsplit=1)

    if len(parts) == 1:
        return parts[0], ""

    return parts[0], parts[1]


def _designation_for_role(role: str) -> str:
    return role.replace("_", " ").title()


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

    is_employee_role = data.role.value != "candidate"

    if is_employee_role and db.query(Employee).filter(
        Employee.employee_code == data.employee_id
    ).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Employee record already exists"
        )

    new_user = User(
        full_name=data.full_name,
        email=data.email,
        employee_id=data.employee_id,
        role=UserRole(data.role.value),
        password_hash=hash_password(data.password),
    )

    try:
        db.add(new_user)
        db.flush()

        if is_employee_role:
            first_name, last_name = _split_full_name(data.full_name)
            employee = Employee(
                user_id=new_user.id,
                employee_code=data.employee_id,
                first_name=first_name,
                last_name=last_name,
                designation=_designation_for_role(data.role.value),
                status=EmployeeStatus.ACTIVE
            )
            db.add(employee)

        db.commit()
        db.refresh(new_user)
    except Exception:
        db.rollback()
        raise

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
