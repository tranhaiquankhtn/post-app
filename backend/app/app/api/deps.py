from typing import Generator

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app import models, schemas, store
from app.core.config import settings
from app.db.session import SessionLocal

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1}/auth/login", auto_error=False
)


def get_db() -> Generator[Session, None, None]:
    sess = None
    try:
        sess = SessionLocal()
        yield sess
    finally:
        if sess:
            sess.close()


def authorize(db: Session, token: str) -> models.User:
    if not token:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.HASH_ALG])
        token_data = schemas.TokenData(**payload)
    except (jwt.JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    user = store.user_store.get(db, id=token_data.sub)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    return user


def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> models.User:
    return authorize(db, token)


def get_current_active_user(
    current_user: models.User = Depends(get_current_user),
) -> models.User:
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user"
        )
    return current_user


def get_current_active_superuser(
    current_user: models.User = Depends(get_current_active_user),
) -> models.User:
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User doesn't have enough priviledge",
        )
    return current_user
