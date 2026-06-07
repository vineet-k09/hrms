from fastapi import FastAPI
import uvicorn

from src.middleware.cors import setup_middlewares

# Common routes
from src.routes.auth import router as auth_routes_router
from src.routes.admin import router as admin_routes_router
from src.routes.employee import router as employee_routes_router
from src.routes.candidate import router as candidate_routes_router
from src.routes.hr import router as hr_routes_router
from src.routes.recruitment import router as recruitment_router
from src.routes.interview_router import router as interview_router
# Module Routes
from src.modules.attendance.router import router as attendance_router
from src.modules.employee.router import router as employee_router
from src.modules.leave.router import router as leave_router

app = FastAPI()

setup_middlewares(app)

# Common routes
app.include_router(auth_routes_router)
app.include_router(admin_routes_router)
app.include_router(employee_routes_router)
app.include_router(candidate_routes_router)
app.include_router(hr_routes_router)
app.include_router(recruitment_router)
app.include_router(interview_router)

# Module routes
app.include_router(employee_router)
app.include_router(attendance_router)
app.include_router(leave_router)

@app.get("/")
def root():
    return {"message": "Hello World"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
