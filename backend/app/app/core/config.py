from typing import Any, Dict, List

from environs import Env
from pydantic import BaseSettings, EmailStr, PostgresDsn, validator

env = Env()

if env.bool("DEBUG", True):
    print("Loading dev environment")
    env.read_env(".env")


class Settings(BaseSettings):
    PROJECT_NAME: str = "Blog App"
    API_V1: str = "/api/v1"
    LOG_FILE = env.str("LOG_FILE", "logs/app.log")
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost",
        "http://localhost:8080",
        "http://localhost:5173",
        # parse_obj_as(AnyHttpUrl, "http://localhost"),,
        # parse_obj_as(AnyHttpUrl, "http://localhost:8080"),
    ]

    POSTGRES_SERVER: str
    POSTGRES_PORT: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    SQLALCHEMY_DATABASE_URL: PostgresDsn | None = None

    @validator("SQLALCHEMY_DATABASE_URL", pre=True, check_fields=False)
    def get_alchemy_url(cls, v: str | None, values: Dict[str, Any]) -> Any:
        if isinstance(v, str):
            return v

        return PostgresDsn.build(
            scheme="postgresql+psycopg2",
            host=values.get("POSTGRES_SERVER", "localhost"),
            port=values.get("POSTGRES_PORT", 5928),
            user=values.get("POSTGRES_USER"),
            password=values.get("POSTGRES_PASSWORD"),
            path=f"/{values.get('POSTGRES_DB', '')}",
        )

    FIRST_SUPERUSER: EmailStr = "tranhaiquan.khtn@gmail.com"
    FIRST_SUPERUSER_PASSWORD: str = "admin01"
    USERS_OPEN_REGISTRATION: bool = False

    SECRET_KEY: str
    HASH_ALG: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8

    class Config:
        case_sensitive = True


settings = Settings()
