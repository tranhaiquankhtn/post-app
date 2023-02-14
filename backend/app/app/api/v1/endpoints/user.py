from typing import Any, List

from fastapi import APIRouter, Body, Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder
from pydantic import EmailStr
from sqlalchemy.orm import Session

from app import models, schemas, store
from app.api import deps

router = APIRouter()


@router.get("", response_model=List[schemas.User])
def get_users(
    db: Session = Depends(deps.get_db), skip: int = 0, limit: int = 100
) -> Any:
    return store.user.get_multi(db, skip=skip, limit=limit)


@router.post("", response_model=schemas.User)
def create_user(
    *,
    db: Session = Depends(deps.get_db),
    user_in: schemas.UserCreate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    user = store.user_store.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="User exists"
        )

    user = store.user_store.create(db, obj_in=user_in)
    # if settings.EMAILS_ENABLED and user_in.email:
    #     send_new_email_account(
    #         email_to=user_in.email, username=user_in.email, password=user_in.password
    #     )
    return user


@router.get("/self", response_model=schemas.User)
def get_self(
    db: Session = Depends(deps.get_db), current_user=Depends(deps.get_current_user)
) -> Any:
    return current_user


@router.put("/self", response_model=schemas.User)
def update_self(
    db: Session = Depends(deps.get_db),
    password: str = Body(None),
    full_name: str = Body(None),
    email: EmailStr = Body(None),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    user_data = jsonable_encoder(current_user)
    user_in = schemas.UserUpdate(**user_data)

    if not password:
        user_in.password = password
    if not full_name:
        user_in.full_name = full_name
    if not email:
        user_in.email = email

    user = store.user_store.update(db=db, db_obj=current_user, obj_in=user_in)
    return user


@router.get("/{user_id}", response_model=schemas.User)
def get_user_by_id(
    user_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    if current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="user doesn't have enough priviledge",
        )
    user = store.user_store.get(db=db, id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    return user


@router.put("/{user_id}", response_model=schemas.User)
def update_user(
    *,
    db: Session = Depends(deps.get_db),
    user_id: int,
    user_in: schemas.UserUpdate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    user = store.user_store.get(db=db, id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    return store.user_store.update(db=db, db_obj=user, obj_in=user_in)
