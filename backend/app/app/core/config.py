from typing import Any, Dict, List

from environs import Env
from pydantic import AnyHttpUrl, BaseSettings, PostgresDsn, validator

env = Env()

if env.bool("DEBUG", True):
    print("Loading dev environment")
    env.read_env(".env")


class Settings(BaseSettings):
    PROJECT_NAME: str = "Blog App"
    API_V1: str = "/api/v1"
    LOG_FILE = env.str("LOG_FILE", "logs/app.log")
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = [
        "http://localhost",
        "http://localhost:8080",
    ]

    POSTGRES_SERVER: str
    POSTGRES_PORT: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    SQLALCHEMY_DATABSE_URL: PostgresDsn | None = None

    @validator("SQLALCHEMY_DATABSE_URL", pre=True)
    def get_alchemy_url(cls, v: str | None, values: Dict[str, Any]) -> Any:
        if isinstance(v, str):
            return v

        return PostgresDsn.build(
            scheme="postgresql",
            host=values.get("POSTGRES_SERVER"),
            port=values.get("POSTGRES_PORT"),
            user=values.get("POSTGRES_USER"),
            password=values.get("POSTGRES_PASSWORD"),
            path=f"/{values.get('POSTGRES_DB') or ''} ",
        )

    class Config:
        case_sensitive = True


settings = Settings()
