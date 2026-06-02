from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # ─────────────────────────────
    # APP
    # ─────────────────────────────
    APP_NAME: str = "HRMS"
    DEBUG: bool = False

    # ─────────────────────────────
    # AUTH
    # ─────────────────────────────
    SECRET_KEY: str = "change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 1 day
    
    # ─────────────────────────────
    # POSTGRES
    # ─────────────────────────────
    DATABASE_URL: str
    DATABASE: str
    DATABASE_USER: str
    DATABASE_PASSWORD: str 
    # ─────────────────────────────
    # CORS
    # ─────────────────────────────
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
    ]

    # pydantic v2 config
    model_config = {
        "env_file": ".env",
        "case_sensitive": True
    }


settings = Settings()