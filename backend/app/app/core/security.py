from datetime import datetime, timedelta
from pathlib import Path
from typing import Any, Optional, Union

from jose import jwt
from passlib.context import CryptContext

from app.core.config import settings
from app.utils import send_email

ctx = CryptContext(schemes=["sha256_crypt"])


def get_password_hash(password: str) -> str:
    return ctx.hash(password)


def verify_password(plain_text: str, hashed_password: str) -> bool:
    return ctx.verify(plain_text, hashed_password)


def generate_token(subject: Union[str, Any], expires_delta: timedelta = None) -> str:
    expire = (
        datetime.utcnow() + expires_delta
        if expires_delta
        else datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTE)
    )
    to_encode = {"exp": expire, "sub": str(subject)}
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.HASH_ALG)


def generate_reset_password_token(email: str) -> str:
    now = datetime.utcnow()
    expires = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode(
        {"exp": expires, "nbf": now, "sub": email},
        settings.SECRET_KEY,
        algorithm=settings.HASH_ALG,
    )


def verify_reset_request(token: str) -> Optional[str]:
    try:
        credentials = jwt.decode(
            token, settings.SECRET_KEY, algorithms=settings.HASH_ALG
        )
        return credentials["sub"]
    except jwt.JWTError:
        return None


def send_new_email_account(to: str, username: str, password: str) -> None:
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} New Account for user {username}"
    with open(Path(settings.EMAIL_TEMPLATES_DIR) / "new_account.html") as f:
        content = f.read()
    link = settings.SERVER_HOST
    send_email(
        to=to,
        subject=subject,
        content=content,
        env={
            "project_name": settings.PROJECT_NAME,
            "username": username,
            "password": password,
            "email": to,
            "link": link,
        },
    )


def send_test_email(to: str) -> None:
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} - Test Email"
    with open(Path(settings.EMAIL_TEMPLATES_DIR) / "test_email.html") as f:
        content = f.read()
    send_email(
        to=to,
        subject=subject,
        content=content,
        env={"project_name": settings.PROJECT_NAME, "email": to},
    )


def send_reset_password_email(to: str, from_email: str, token: str):
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} - Password recovery for user {from_email}"
    with open(Path(settings.EMAIL_TEMPLATES_DIR) / "reset_password.html") as f:
        content = f.read()
    send_email(
        to=to,
        subject=subject,
        content=content,
        env={
            "project_name": settings.PROJECT_NAME,
            "username": from_email,
            "email": to,
            "valid_hours": settings.EMAIL_RESET_TOKEN_EXPIRE_HOURS,
            "link": f"{settings.SERVER_HOST}/reset-password?token={token}",
        },
    )
