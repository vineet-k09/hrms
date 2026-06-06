from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import Response

from src.core.config import settings


def setup_middlewares(app: FastAPI) -> None:
    allow_all_origins = "*" in settings.ALLOWED_ORIGINS

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[] if allow_all_origins else settings.ALLOWED_ORIGINS,
        allow_origin_regex=".*" if allow_all_origins else None,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )