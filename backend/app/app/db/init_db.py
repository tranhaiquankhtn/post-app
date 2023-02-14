import logging

from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.base import Base
from app.schemas import UserCreate
from app.store.user import user_store

logger = logging.getLogger(__name__)


def init_db(db: Session) -> None:
    logger.info("init db")
    Base.metadata.create_all(bind=db.bind)

    user = user_store.get_by_email(db=db, email=settings.FIRST_SUPERUSER)
    if not user:
        user_store.create(
            db=db,
            user_in=UserCreate(
                email=settings.FIRST_SUPERUSER,
                password=settings.FIRST_SUPERUSER_PASSWORD,
                is_superuser=True,
            ),
        )
