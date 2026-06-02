from fastapi import FastAPI
import uvicorn
from src.routes.auth import router as auth_router

app = FastAPI()
app.include_router(auth_router)

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