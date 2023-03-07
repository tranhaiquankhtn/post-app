import logging
from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Body, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app import schemas, store
from app.api import deps
from app.core import security
from app.core.config import settings

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/login", response_model=schemas.Token)
def login(
    db: Session = Depends(deps.get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    user = store.user_store.authenticate(
        db, email=form_data.username, password=form_data.password
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect username or password",
        )
    elif not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user"
        )

    expired = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.generate_token(subject=user.id, expires_delta=expired),
        "token_type": "Bearer",
    }


@router.post("/reset-password", response_model=schemas.Message)
def reset_password(
    token: str = Body(...),
    password: str = Body(...),
    db: Session = Depends(deps.get_db),
):
    email = security.verify_reset_request(token)
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token"
        )

    user = store.user_store.get_by_email(db=db, email=email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user"
        )

    hashed_password = security.get_password_hash(password)
    user.hashed_password = hashed_password
    db.add(user)
    db.commit()
    return {"msg": "Password updated successfully"}


@router.post("/recover/{email}", response_model=schemas.Message)
def recover_password(db: Session = Depends(deps.get_db), *, email: str):
    user = store.user_store.get_by_email(db=db, email=email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    reset_token = security.generate_reset_password_token(email=email)
    security.send_reset_password_email(
        to=user.email, from_email=email, token=reset_token
    )
    return {"msg": "Password Recovery Email sent"}


@router.post("/test-email", response_model=schemas.Message)
def send_test_email():
    security.send_test_email("thaiquan@infinigru.com")
    return {"msg": "Test email sent"}
