from pathlib import Path
from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


SERVER_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    # Make DATABASE_URL optional so Settings() can be instantiated
    DATABASE_URL: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=SERVER_DIR / ".env",
        extra="ignore",
    )


settings = Settings()
