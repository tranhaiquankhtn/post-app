import logging
from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import models, schemas, store
from app.api import deps

router = APIRouter()

logger = logging.getLogger(__name__)


@router.get("", response_model=List[schemas.Post])
def get_posts(db: Session = Depends(deps.get_db), skip: int = 0, limit: int = 100):
    return store.post_store.get_multi(db=db, skip=skip, limit=limit)


@router.post("", response_model=schemas.Post)
def create_post(
    db: Session = Depends(deps.get_db),
    *,
    post_in: schemas.PostCreate,
    current_user: models.User = Depends(deps.get_current_user)
) -> models.Post:
    logger.info(f'post_in={post_in}')
    if not post_in.title:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="title is required"
        )
    if not post_in.content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="content is required"
        )
    post_in.created = datetime.utcnow()
    return store.post_store.create_with_owner(
        db,
        obj_in=post_in,
        uid=current_user.id,
    )


@router.get("/{post_id}", response_model=schemas.Post)
def get_post(
    db: Session = Depends(deps.get_db),
    *,
    post_id: int,
    current_user: models.User = Depends(deps.get_current_user)
) -> Optional[models.Post]:
    return store.post_store.get(db, post_id)


@router.put("/{post_id}", response_model=schemas.Post)
def update_post(
    db: Session = Depends(deps.get_db),
    *,
    post_id: int,
    post_in: schemas.PostUpdate,
    current_user: models.User = Depends(deps.get_current_user)
) -> models.Post:
    post = store.post_store.get(db, post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Post not found"
        )

    post_in.modified = datetime.utcnow()
    return store.post_store.update(db, db_obj=post, obj_in=post_in)


@router.delete("/{post_id}", response_model=schemas.Post)
def remove_post(db: Session = Depends(deps.get_db), *, post_id: int, current_user: models.User = Depends(deps.get_current_user)) -> models.Post:
    post = store.post_store.get(db, post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Post not found"
        )
    return store.post_store.remove(db=db, id=post_id)
