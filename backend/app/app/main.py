import logging
import logging.config
import os

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from app.api.v1.api import api_router
from app.core.config import settings
from app.db.init_db import init_db
from app.db.session import SessionLocal
from app.logger import config_logging

app = FastAPI(
    title=settings.PROJECT_NAME, openapi_url=f"{settings.API_V1}/openapi.json"
)

if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router, prefix=settings.API_V1)


def init_logging() -> None:
    if not os.path.exists(settings.LOG_DIR):
        os.mkdir(settings.LOG_DIR)

    logging.config.dictConfig(
        config=config_logging(os.path.join(settings.LOG_DIR, "app.log"))
    )


@app.on_event("startup")
def on_startup() -> None:
    logging.info("on_startup()")
    init_logging()
    db = SessionLocal()
    init_db(db)
    logging.info("init done")
