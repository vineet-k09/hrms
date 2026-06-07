from pathlib import Path
import sys
from datetime import date, time, timedelta

sys.path.append(str(Path(__file__).resolve().parents[1]))

from src.db.session import SessionLocal

from src.models.user import User
from src.models.employee import Employee
from src.models.department import Department
from src.models.attendance import AttendanceRecord
from src.models.leave_request import LeaveRequest
from src.models.job_description import JobDescription

from src.models.enums import EmployeeStatus, AttendanceStatus
from src.core.security import hash_password

from seed_data import (
    DEPARTMENTS,
    ACCOUNTS,
    EMPLOYEES,
    SPECIAL_CASES,
    LEAVES,
    JOB_DESCRIPTIONS
)

TODAY = date.today()


def seed_departments(db):
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
                description=description,
            )
            db.add(department)
        else:
            department.description = description

        departments[name] = department

    db.commit()

    print("- Departments seeded")

    return departments


def seed_users(db):
    users = {}

    for email, password, role in ACCOUNTS:
        user = (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

        if user is None:
            user = User(
                full_name="ABCD",
                email=email,
                password_hash=hash_password(password),
                role=role,
                is_active=True,
            )
            db.add(user)
        else:
            user.role = role
            user.is_active = True

        users[email] = user

    db.commit()

    print("- Users seeded")

    return users


def seed_admin_employee(db, users, departments):
    admin_user = users["admin@hrms.com"]
    engineering = departments["Engineering"]

    employee = (
        db.query(Employee)
        .filter(Employee.employee_code == "HRMS001")
        .first()
    )

    if employee is None:
        employee = Employee(employee_code="HRMS001")
        db.add(employee)

    employee.user_id = admin_user.id
    employee.department_id = engineering.id
    employee.first_name = "Admin"
    employee.last_name = "User"
    employee.phone = "9999999999"
    employee.designation = "Administrator"
    employee.join_date = date(2021, 1, 1)
    employee.salary = 180000
    employee.status = EmployeeStatus.ACTIVE

    db.commit()

    print("- Admin employee seeded")


def seed_employees(db, departments):
    users_by_email = {
        user.email: user
        for user in db.query(User).all()
    }

    for data in EMPLOYEES:
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
            department_id=departments[data["department"]].id,
            user_id=users_by_email[data["email"]].id,
            phone="9999999999",
            join_date=date(2021, 1, 1),
            status=EmployeeStatus.ACTIVE,
        )

        db.add(employee)

    db.commit()

    print("- Employees seeded")


def build_employee_lookup(db):
    return {
        user.email: employee
        for employee, user in (
            db.query(Employee, User)
            .join(User, Employee.user_id == User.id)
            .all()
        )
    }


def seed_managers(db, employees_by_email):
    admin = employees_by_email["admin@hrms.com"]

    employees_by_email["sarah.manager@hrms.com"].manager_id = admin.id
    employees_by_email["david.manager@hrms.com"].manager_id = admin.id

    employees_by_email["arjun@hrms.com"].manager_id = (
        employees_by_email["sarah.manager@hrms.com"].id
    )
    employees_by_email["priya@hrms.com"].manager_id = (
        employees_by_email["sarah.manager@hrms.com"].id
    )
    employees_by_email["karan@hrms.com"].manager_id = (
        employees_by_email["sarah.manager@hrms.com"].id
    )

    employees_by_email["neha@hrms.com"].manager_id = (
        employees_by_email["david.manager@hrms.com"].id
    )
    employees_by_email["rahul@hrms.com"].manager_id = (
        employees_by_email["david.manager@hrms.com"].id
    )
    employees_by_email["vivek@hrms.com"].manager_id = (
        employees_by_email["david.manager@hrms.com"].id
    )

    db.commit()

    print("- Manager hierarchy synced")


def seed_attendance(db, employees_by_email):
    existing_attendance = {
        (record.employee_id, record.date)
        for record in db.query(AttendanceRecord).all()
    }

    for email, employee in employees_by_email.items():
        special = SPECIAL_CASES.get(email, {})

        for i in range(14):
            attendance_date = TODAY - timedelta(days=i)

            if (employee.id, attendance_date) in existing_attendance:
                continue

            status = AttendanceStatus.PRESENT
            check_in = time(9, 15)
            check_out = time(18, 5)
            work_hours = 8.8

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

            db.add(
                AttendanceRecord(
                    employee_id=employee.id,
                    date=attendance_date,
                    check_in=check_in,
                    check_out=check_out,
                    work_hours=work_hours,
                    status=status,
                )
            )

    print("- Attendance prepared")


def seed_leaves(db, employees_by_email):
    existing_leaves = {
        (
            leave.employee_id,
            leave.start_date,
            leave.end_date,
            leave.leave_type,
        )
        for leave in db.query(LeaveRequest).all()
    }

    for leave_data in LEAVES:
        employee = employees_by_email[leave_data["employee"]]
        approver = employees_by_email[leave_data["approver"]]

        start_date = TODAY + timedelta(
            days=leave_data["start_offset"]
        )

        end_date = TODAY + timedelta(
            days=leave_data["end_offset"]
        )

        key = (
            employee.id,
            start_date,
            end_date,
            leave_data["type"],
        )

        if key in existing_leaves:
            continue

        db.add(
            LeaveRequest(
                employee_id=employee.id,
                approved_by=approver.id,
                leave_type=leave_data["type"],
                status=leave_data["status"],
                start_date=start_date,
                end_date=end_date,
                reason=leave_data["reason"],
            )
        )

    print("- Leave requests prepared")


def seed_job_descriptions(db, departments):
    existing_jobs = {
        job.job_code: job
        for job in db.query(JobDescription).all()
    }

    created = 0

    for data in JOB_DESCRIPTIONS:
        department = departments[data["department"]]

        job = existing_jobs.get(data["job_code"])

        if job is None:
            job = JobDescription(
                job_code=data["job_code"]
            )
            db.add(job)
            created += 1

        job.title = data["title"]
        job.department_id = department.id
        job.description = data["description"]
        job.requirements = data["requirements"]
        job.keywords = data["keywords"]
        job.status = data["status"]

    db.commit()

    print("- Job Descriptions synced ")

def main():
    with SessionLocal() as db:
        departments = seed_departments(db)

        users = seed_users(db)

        seed_admin_employee(
            db,
            users,
            departments,
        )

        seed_employees(
            db,
            departments,
        )

        seed_job_descriptions(
            db,
            departments,
        )

        employees_by_email = build_employee_lookup(db)

        seed_managers(
            db,
            employees_by_email,
        )

        seed_attendance(
            db,
            employees_by_email,
        )

        seed_leaves(
            db,
            employees_by_email,
        )

        db.commit()

        print("- Attendance saved")
        print("- Leave requests saved")
        print("- Seed successful")


if __name__ == "__main__":
    main()