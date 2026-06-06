# HRMS

## SETUP

### Client

```bash
cd client
npm i
npm run dev
```

### Server

```bash
cd server
python -m venv venv
pip install -r requirements.txt
env\Scripts\activate.bat
```

### Docker

```bash
cd server
docker compose-up -d
```

## DB Design

```bash
Department
├── id
├── name
└── description
      │
      │ 1:N
      ▼

Employee
├── id
├── employee_code
├── user_id
├── department_id
├── manager_id (self reference)
├── first_name
├── last_name
├── phone
├── designation
├── salary
├── join_date
└── status
      │
      │ 1:1
      ▼

User
├── id
├── email
├── password_hash
├── role
└── is_active
```

### Manager Hierarchy

**_refer to `server/scripts/seed_data.py`_**

```bash
Admin (HRMS001)
├── Sarah (Manager)
│   ├── Arjun
│   ├── Priya
│   └── Karan
│
└── David (Manager)
    ├── Neha
    ├── Rahul
    └── Vivek
```

### Attendance

```bash
Employee
    │
    │ 1:N
    ▼

AttendanceRecord
├── id
├── employee_id
├── date
├── check_in
├── check_out
├── work_hours
└── status
```

### Leave Management

```bash
Employee (requestor)
    │
    │ 1:N
    ▼

LeaveRequest
├── id
├── employee_id
├── approved_by
├── leave_type
├── status
├── start_date
├── end_date
└── reason

approved_by
     │
     ▼
Employee (manager)
```

## Features

### HR

- AI based bulk resume parsing, scoring with reference to the jd.
- File upload to online storage bucket

### Candidate

- Register themselves, apply for open job roles.
- Check application status and get interview callbacks.

### Employees

- Check thier payslip
- Apply/Approve/Reject leave applications

## Seeding

```server/scripts/seed.py``` contains a script to add the contents of ```server/scripts/seed_data.py``` and avoids any duplications even after re-runs.

- Enter the server (env)
- Run the command
```bash
cd scripts
py seed.py
```

## Useful commands

***A few repetetive commands are added to package.json for fast dev as well.***

### Intialize Alembic
```bash
alembic init alembic
```

### Create Migrations

```bash
alembic revision --autogenerate -m "any migration message"
```

### Apply Migrations

**_important_**

```bash
alembic upgrade head
```

## Devs

[vineet-k09](https://github.com/vineet-k09),
PranavBj2406
