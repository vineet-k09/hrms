# some parts of the script is one time run eq. line 142-164
# so check them out once - if the script fails on the mid try
# and only half the migrations are done

from pathlib import Path
import sys

sys.path.append(str(Path(__file__).resolve().parents[1]))

from src.db.session import SessionLocal

from src.models.user import User
from src.models.employee import Employee
from src.models.department import Department
from src.models.attendance import AttendanceRecord
from src.models.leave_request import LeaveRequest

from src.core.security import hash_password

from src.models.enums import EmployeeStatus, AttendanceStatus

from datetime import timedelta, date, time

today = date.today()

from seed_data import DEPARTMENTS, ACCOUNTS, EMPLOYEES, SPECIAL_CASES, LEAVES

with SessionLocal() as db:
    departments = {}
    for name, description in DEPARTMENTS:
        department = (
            db.query(Department)
            .filter(Department.name == name)
            .first()
        )

        if department is None:
            department = Department(
                name=name,
                description=description
            )
            db.add(department) # skipping its done
        else:
            department.description = description

        departments[name] = department

    db.commit()

    print("Created Departments")

    users = {}
    for email, password, role in ACCOUNTS:
        user = (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

        if user is None:
            user = User(
                email=email,
                password_hash=hash_password(password),
                role=role,
                is_active=True
            )
            db.add(user) # skipping its done
        else:
            user.role = role
            user.is_active = True

        users[email] = user

    db.commit()

    print("Created Users")

    admin = users["admin@hrms.com"]
    engineering = departments["Engineering"]

    employee = (
        db.query(Employee)
        .filter(Employee.employee_code == "HRMS001")
        .first()
    )

    if employee is None:
        employee = Employee(employee_code="HRMS001")
        db.add(employee) # skipping its done

    employee.user_id = admin.id
    employee.department_id = engineering.id
    employee.first_name = "Admin"
    employee.last_name = "User"
    employee.phone = "9999999999"
    employee.designation = "Administrator"
    employee.join_date = date(2021, 1, 1)
    employee.salary = 180000
    employee.status = EmployeeStatus.ACTIVE

    db.commit()

    print("Added Admin Account")

    users_by_email = {
        user.email: user
        for user in db.query(User).all()
    }

    for data in EMPLOYEES:
        dept = (
            db.query(Department)
            .filter(Department.name == data["department"])
            .first()
        )

        if dept is None:
            raise ValueError(f"Department not found: {data['department']}")
        existing = (
            db.query(Employee)
            .filter(Employee.employee_code == data["code"])
            .first()
        )
        if existing:
            continue
        employee = Employee(
            employee_code=data["code"],
            first_name=data["first_name"],
            last_name=data["last_name"],
            designation=data["designation"],
            salary=data["salary"],
            department_id=dept.id,
            user_id=users_by_email[data["email"]].id,
            phone="9999999999",
            join_date=date(2021, 1, 1),
            status=EmployeeStatus.ACTIVE
        )

        db.add(employee)

    db.commit()

    print("Added Employees")

    employees_by_email = {
        user.email: emp
        for emp, user in db.query(Employee, User)
        .join(User, Employee.user_id == User.id)
        .all()
    }

    admin = employees_by_email["admin@hrms.com"]

    sarah = employees_by_email["sarah.manager@hrms.com"]
    david = employees_by_email["david.manager@hrms.com"]

    arjun = employees_by_email["arjun@hrms.com"]
    priya = employees_by_email["priya@hrms.com"]
    karan = employees_by_email["karan@hrms.com"]

    neha = employees_by_email["neha@hrms.com"]
    rahul = employees_by_email["rahul@hrms.com"]
    vivek = employees_by_email["vivek@hrms.com"]

    sarah.manager_id = admin.id
    david.manager_id = admin.id

    arjun.manager_id = sarah.id
    priya.manager_id = sarah.id
    karan.manager_id = sarah.id

    neha.manager_id = david.id
    rahul.manager_id = david.id
    vivek.manager_id = david.id

    db.commit()

    print("Added emp <> manager relationships (might fail if ran again)")

    for email, employee in employees_by_email.items():

        for i in range(14):
            attendance_date = today - timedelta(days=i)

            status = AttendanceStatus.PRESENT
            check_in = time(9, 15)
            check_out = time(18, 5)
            work_hours = 8.8

            special = SPECIAL_CASES.get(email, {})

            if i in special.get("absent_days", []):
                status = AttendanceStatus.ABSENT
                check_in = None
                check_out = None
                work_hours = 0

            elif i in special.get("remote_days", []):
                status = AttendanceStatus.REMOTE

            elif i in special.get("half_days", []):
                status = AttendanceStatus.HALF_DAY
                check_in = time(9, 30)
                check_out = time(13, 30)
                work_hours = 4.0

            elif i in special.get("leave_days", []):
                status = AttendanceStatus.ON_LEAVE
                check_in = None
                check_out = None
                work_hours = 0

            attendance = AttendanceRecord(
                employee_id=employee.id,
                date=attendance_date,
                check_in=check_in,
                check_out=check_out,
                work_hours=work_hours,
                status=status,
            )
            existing = (
                db.query(AttendanceRecord)
                .filter(
                    AttendanceRecord.employee_id == employee.id,
                    AttendanceRecord.date == attendance_date
                )
                .first()
            )

            if existing:
                continue
            db.add(attendance)

    for leave_data in LEAVES:

        employee = employees_by_email[leave_data["employee"]]
        approver = employees_by_email[leave_data["approver"]]

        leave = LeaveRequest(
            employee_id=employee.id,
            approved_by=approver.id,
            leave_type=leave_data["type"],
            status=leave_data["status"],
            start_date=date.today() + timedelta(days=leave_data["start_offset"]),
            end_date=date.today() + timedelta(days=leave_data["end_offset"]),
            reason=leave_data["reason"],
        )
        existing = (
            db.query(LeaveRequest)
            .filter(
                LeaveRequest.employee_id == employee.id,
                LeaveRequest.start_date == date.today() + timedelta(days=leave_data["start_offset"]),
                LeaveRequest.end_date == date.today() + timedelta(days=leave_data["end_offset"]),
            )
            .first()
        )

        if existing:
            continue

        db.add(leave)

    db.commit()
    print("Attendance and Leave done as well.")
    print("Seed successful")