# MyTeamHQ - AI powered HRMS system

MyTeamHQ is an AI-powered Human Resource Management System (HRMS) designed to streamline recruitment and employee management workflows through automation and intelligent decision-making.

The platform supports multiple user roles, including Admin, Senior Manager, HR Recruiter, Employee, and Candidate, providing personalized dashboards and role-based access to relevant features.

## Key Features

### AI-Powered Recruitment
- Resume upload and parsing
- Automated ATS-style candidate evaluation
- Skill extraction and candidate scoring
- AI-generated recommendations and summaries
- Candidate ranking based on job requirements

### Candidate Portal
- Candidate registration and login
- Job application submission
- Application status tracking
- Interview scheduling workflow

### Employee Management
- Employee profile management
- Department and organizational hierarchy support
- Role-based access control (RBAC)

### Leave Management
- Leave application submission
- Manager approval/rejection workflow
- Leave status tracking

### Payroll Management
- Employee payroll information
- Payslip viewing and management

### Authentication & Security
- Secure authentication system
- Multi-role login support
- Protected routes and role-based authorization

## Technology Stack

### Frontend
- Next.js
- React
- Tailwind CSS

### Backend
- FastAPI
- Python
- SQLAlchemy ORM

### Database
- PostgreSQL
- Alembic Migrations

### AI & Document Processing
- Gemini LLM APIs
- PyMuPDF

## Vision

MyTeamHQ aims to reduce manual HR effort by combining traditional HRMS functionalities with AI-driven recruitment workflows, helping organizations improve hiring efficiency and employee management through a modern, scalable platform.
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

## Screenshots
<img width="1580" height="926" alt="image" src="https://github.com/user-attachments/assets/c7a828c2-dbae-404b-8ec2-8d9f4be27414" />


## Devs

[vineet-k09](https://github.com/vineet-k09),
[PranavBj2406](https://github.com/PranavBj2406)
