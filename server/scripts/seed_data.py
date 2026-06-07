from datetime import date
from pathlib import Path
import sys

sys.path.append(str(Path(__file__).resolve().parents[1]))

from src.models.enums import UserRole, LeaveType, LeaveStatus, JobStatus
DEPARTMENTS = [
    ("Engineering", "Software Development"),
    ("Human Resources", "Recruitment and Employee Relations"),
    ("Finance", "Payroll and Budgeting"),
    ("Operations", "Business Operations"),
]

ACCOUNTS = [
    ("admin@hrms.com", "admin123", UserRole.ADMIN),
    ("sarah.manager@hrms.com", "manager123", UserRole.SENIOR_MANAGER),
    ("david.manager@hrms.com", "manager123", UserRole.SENIOR_MANAGER),
    ("anita.hr@hrms.com", "recruiter123", UserRole.HR_RECRUITER),
    ("arjun@hrms.com", "employee123", UserRole.EMPLOYEE),
    ("priya@hrms.com", "employee123", UserRole.EMPLOYEE),
    ("karan@hrms.com", "employee123", UserRole.EMPLOYEE),
    ("neha@hrms.com", "employee123", UserRole.EMPLOYEE),
    ("rahul@hrms.com", "employee123", UserRole.EMPLOYEE),
    ("vivek@hrms.com", "employee123", UserRole.EMPLOYEE),
]

JOB_DESCRIPTIONS = [
    {
        "job_code": "ENG-001",
        "title": "Backend Engineer",
        "department": "Engineering",
        "description": "Design, develop, and maintain scalable backend services and APIs for enterprise applications.",
        "requirements": "2+ years Python, FastAPI, PostgreSQL, REST APIs, Git, Docker.",
        "keywords": "python, fastapi, backend, api, postgresql, docker, microservices",
        "status": JobStatus.OPEN,
    },
    {
        "job_code": "ENG-002",
        "title": "Frontend Engineer",
        "department": "Engineering",
        "description": "Build responsive web interfaces and collaborate with backend teams to deliver modern user experiences.",
        "requirements": "React, TypeScript, HTML, CSS, state management, API integration.",
        "keywords": "react, typescript, frontend, javascript, ui, ux, web",
        "status": JobStatus.OPEN,
    },
    {
        "job_code": "ENG-003",
        "title": "Data Scientist",
        "department": "Engineering",
        "description": "Analyze business data, build predictive models, and provide actionable insights.",
        "requirements": "Python, Pandas, Machine Learning, SQL, Statistics.",
        "keywords": "data science, machine learning, python, pandas, analytics, ai",
        "status": JobStatus.OPEN,
    },
    {
        "job_code": "ENG-004",
        "title": "DevOps Engineer",
        "department": "Engineering",
        "description": "Maintain CI/CD pipelines, cloud infrastructure, and deployment automation.",
        "requirements": "Docker, Kubernetes, AWS, Linux, CI/CD, monitoring.",
        "keywords": "devops, aws, kubernetes, docker, ci cd, infrastructure",
        "status": JobStatus.OPEN,
    },
    {
        "job_code": "HR-001",
        "title": "HR Recruiter",
        "department": "Human Resources",
        "description": "Source, screen, and coordinate candidates throughout the hiring lifecycle.",
        "requirements": "Recruitment experience, communication skills, ATS familiarity.",
        "keywords": "recruitment, hiring, sourcing, interviews, talent acquisition",
        "status": JobStatus.OPEN,
    },
    {
        "job_code": "HR-002",
        "title": "HR Business Partner",
        "department": "Human Resources",
        "description": "Support workforce planning, employee engagement, and organizational development.",
        "requirements": "HR operations, employee relations, policy management.",
        "keywords": "hrbp, employee relations, engagement, workforce planning",
        "status": JobStatus.OPEN,
    },
    {
        "job_code": "FIN-001",
        "title": "Financial Analyst",
        "department": "Finance",
        "description": "Prepare financial reports, budgeting forecasts, and performance analysis.",
        "requirements": "Excel, financial modeling, reporting, accounting fundamentals.",
        "keywords": "finance, budgeting, forecasting, analysis, accounting",
        "status": JobStatus.OPEN,
    },
    {
        "job_code": "FIN-002",
        "title": "Payroll Specialist",
        "department": "Finance",
        "description": "Manage payroll processing, deductions, reimbursements, and compliance.",
        "requirements": "Payroll systems, compliance, finance operations.",
        "keywords": "payroll, compensation, benefits, finance operations",
        "status": JobStatus.OPEN,
    },
    {
        "job_code": "OPS-001",
        "title": "Operations Manager",
        "department": "Operations",
        "description": "Oversee day-to-day business operations and improve organizational efficiency.",
        "requirements": "Operations management, leadership, process improvement.",
        "keywords": "operations, management, leadership, process improvement",
        "status": JobStatus.OPEN,
    },
    {
        "job_code": "OPS-002",
        "title": "Project Coordinator",
        "department": "Operations",
        "description": "Coordinate project activities, stakeholders, schedules, and documentation.",
        "requirements": "Project coordination, communication, reporting, planning.",
        "keywords": "project management, coordination, planning, reporting",
        "status": JobStatus.OPEN,
    },
]

EMPLOYEES = [
    {
        "email": "admin@hrms.com",
        "department": "Operations",
        "code": "HRMS001",
        "first_name": "Admin",
        "last_name": "User",
        "designation": "Administrator",
        "salary": 180000,
    },
    {
        "email": "sarah.manager@hrms.com",
        "department": "Engineering",
        "code": "HRMS002",
        "first_name": "Sarah",
        "last_name": "Johnson",
        "designation": "Senior Engineering Manager",
        "salary": 130000,
    },
    {
        "email": "david.manager@hrms.com",
        "department": "Engineering",
        "code": "HRMS003",
        "first_name": "David",
        "last_name": "Miller",
        "designation": "Senior Engineering Manager",
        "salary": 130000,
    },
    {
        "email": "anita.hr@hrms.com",
        "department": "Human Resources",
        "code": "HRMS004",
        "first_name": "Anita",
        "last_name": "Sharma",
        "designation": "HR Recruiter",
        "salary": 90000,
    },
    {
        "email": "arjun@hrms.com",
        "department": "Engineering",
        "code": "HRMS005",
        "first_name": "Arjun",
        "last_name": "Reddy",
        "designation": "Software Engineer",
        "salary": 80000,
    },
    {
        "email": "priya@hrms.com",
        "department": "Engineering",
        "code": "HRMS006",
        "first_name": "Priya",
        "last_name": "Nair",
        "designation": "Software Engineer",
        "salary": 82000,
    },
    {
        "email": "karan@hrms.com",
        "department": "Engineering",
        "code": "HRMS007",
        "first_name": "Karan",
        "last_name": "Verma",
        "designation": "Frontend Engineer",
        "salary": 78000,
    },
    {
        "email": "neha@hrms.com",
        "department": "Engineering",
        "code": "HRMS008",
        "first_name": "Neha",
        "last_name": "Gupta",
        "designation": "Backend Engineer",
        "salary": 81000,
    },
    {
        "email": "rahul@hrms.com",
        "department": "Engineering",
        "code": "HRMS009",
        "first_name": "Rahul",
        "last_name": "Patel",
        "designation": "Data Analyst",
        "salary": 76000,
    },
    {
        "email": "vivek@hrms.com",
        "department": "Engineering",
        "code": "HRMS010",
        "first_name": "Vivek",
        "last_name": "Singh",
        "designation": "DevOps Engineer",
        "salary": 85000,
    },
]


SPECIAL_CASES = {
    # Multiple absences
    "rahul@hrms.com": {
        "absent_days": [2, 9],
    },

    # Works from home occasionally
    "priya@hrms.com": {
        "remote_days": [4, 11],
    },

    # Half day due to personal work
    "vivek@hrms.com": {
        "half_days": [7],
    },

    # Approved leave block
    "neha@hrms.com": {
        "leave_days": [0, 1, 2],
    },

    # Consistently works overtime
    "arjun@hrms.com": {
        "overtime_days": [3, 6, 12],
    },

    # One late arrival
    "karan@hrms.com": {
        "late_days": [5],
    },

    # Sick leave
    "anita.hr@hrms.com": {
        "leave_days": [8],
    },

    # Manager traveling, remote work streak
    "sarah.manager@hrms.com": {
        "remote_days": [9, 10],
    },

    # Training / conference attendance
    "david.manager@hrms.com": {
        "training_days": [13],
    }
}

LEAVES = [
    {
        "employee": "neha@hrms.com",
        "approver": "david.manager@hrms.com",
        "type": LeaveType.SICK,
        "status": LeaveStatus.APPROVED,
        "start_offset": -1,
        "end_offset": 2,
        "reason": "Medical leave",
    },
    {
        "employee": "rahul@hrms.com",
        "approver": "david.manager@hrms.com",
        "type": LeaveType.CASUAL,
        "status": LeaveStatus.APPROVED,
        "start_offset": -12,
        "end_offset": -10,
        "reason": "Family function",
    },
    {
        "employee": "priya@hrms.com",
        "approver": "sarah.manager@hrms.com",
        "type": LeaveType.CASUAL,
        "status": LeaveStatus.PENDING,
        "start_offset": 3,
        "end_offset": 4,
        "reason": "Personal work",
    },
    {
        "employee": "vivek@hrms.com",
        "approver": "david.manager@hrms.com",
        "type": LeaveType.CASUAL,
        "status": LeaveStatus.REJECTED,
        "start_offset": 7,
        "end_offset": 10,
        "reason": "Vacation trip",
    },
    {
        "employee": "arjun@hrms.com",
        "approver": "sarah.manager@hrms.com",
        "type": LeaveType.CASUAL,
        "status": LeaveStatus.APPROVED,
        "start_offset": -20,
        "end_offset": -18,
        "reason": "Family event",
    },
]