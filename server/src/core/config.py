from pathlib import Path
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


SERVER_DIR = Path(__file__).resolve().parents[2]


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
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # ─────────────────────────────
    # DATABASE
    # ─────────────────────────────
    DATABASE_URL: str

    DATABASE: str
    DATABASE_USER: str
    DATABASE_PASSWORD: str

    # ─────────────────────────────
    # CORS
    # ─────────────────────────────
    ALLOWED_ORIGINS: List[str] = [
        "*",
    ]

    model_config = SettingsConfigDict(
        env_file=SERVER_DIR / ".env",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
