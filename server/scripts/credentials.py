USERS = [
    ("admin@hrms.com", "admin123"),
    ("manager1@hrms.com", "manager123"),
    ("manager2@hrms.com", "manager123"),
    ("recruiter@hrms.com", "recruiter123"),
]

MANAGER_RELATIONS = {
    "sarah.manager@hrms.com": "admin@hrms.com",
    "david.manager@hrms.com": "admin@hrms.com",
    "arjun@hrms.com": "sarah.manager@hrms.com",
    "priya@hrms.com": "sarah.manager@hrms.com",
    "karan@hrms.com": "sarah.manager@hrms.com",
    "neha@hrms.com": "david.manager@hrms.com",
    "rahul@hrms.com": "david.manager@hrms.com",
    "vivek@hrms.com": "david.manager@hrms.com",
}