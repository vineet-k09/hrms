# app/models/__init__.py
print("Loading models package")
from .user import User
from .employee import Employee
from .department import Department
from .attendance import AttendanceRecord
from .leave_request import LeaveRequest
from .payslip import Payslip
from .candidates import Candidate
from .job_description import JobDescription
from .application import Application
from .ai_evaluation import AIEvaluation
from .audit_log import AuditLog