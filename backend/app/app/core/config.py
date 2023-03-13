from typing import Any, Dict, List, Optional

from pydantic import BaseSettings, EmailStr, PostgresDsn, validator


class Settings(BaseSettings):
    PROJECT_NAME: str = "Blog App"
    API_V1: str = "/api/v1"
    LOG_DIR: str = "logs"
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost",
        "http://localhost:8080",
        "http://localhost:5173",
        "http://staging.thaiquan.dev",
        "https://portfolio.thaiquan.dev",
        "https://www.portfolio.thaiquan.dev",
    ]

    SERVER_NAME: str = "localhost"
    SERVER_HOST: str = "http://localhost"

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

    # Email Configuration
    SMTP_TLS: bool = True
    SMTP_PORT: Optional[int] = None
    SMTP_HOST: Optional[str] = None
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    FROM_EMAIL: Optional[EmailStr] = None
    FROM_NAME: Optional[str] = None

    @validator("FROM_NAME")
    def get_email_title(cls, v: Optional[str], values: Dict[str, Any]) -> str:
        if not v:
            return values["PROJECT_NAME"]
        return v

    EMAILS_ENABLED: bool = True
    EMAIL_RESET_TOKEN_EXPIRE_HOURS: int = 48
    EMAIL_TEMPLATES_DIR: str = "app/email-templates/build"

    @validator("EMAILS_ENABLED", pre=True)
    def get_emails_enabled(cls, v: bool, values: Dict[str, Any]) -> bool:
        return bool(
            values.get("SMTP_HOST")
            and values.get("SMTP_PORT")  # noqa: #W503
            and values.get("FROM_EMAIL")  # noqa: W503
        )

    class Config:
        case_sensitive = True


settings = Settings()
