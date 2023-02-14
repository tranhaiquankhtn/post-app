from datetime import datetime, timedelta
from typing import Any, Union

from jose import jwt
from passlib.context import CryptContext

from app.core.config import settings

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
