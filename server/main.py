from fastapi import FastAPI
import uvicorn

from src.modules.attendance.router import router as attendance_router
from src.modules.employee.router import router as employee_router


app = FastAPI()

app.include_router(employee_router)
app.include_router(attendance_router)


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
