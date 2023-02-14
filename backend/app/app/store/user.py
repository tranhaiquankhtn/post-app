from typing import Any, Dict, Optional, Union

from sqlalchemy.orm import Session

from app.core.security import get_password_hash, verify_password
from app.models import User
from app.schemas import UserCreate, UserUpdate
from app.store.base import StoreBase


class UserStore(StoreBase[User, UserCreate, UserUpdate]):
    def get_by_email(self, db: Session, *, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()

    def create(self, db: Session, *, user_in: UserCreate) -> Optional[User]:
        user = User(
            email=user_in.email,
            hashed_password=get_password_hash(user_in.password),
            full_name=user_in.full_name,
            is_superuser=user_in.is_superuser,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    def update(
        self,
        db: Session,
        *,
        user_in_db: User,
        obj_in: Union[UserUpdate, Dict[str, Any]],
    ) -> User:
        update_data = (
            obj_in if isinstance(obj_in, dict) else obj_in.dict(exclude_unset=True)
        )

        if update_data.get("password"):
            update_data["hashed_password"] = get_password_hash(update_data["password"])
            del update_data["password"]

        return super().update(db, db_obj=user_in_db, obj_in=update_data)

    def authenticate(self, db: Session, *, email: str, password: str) -> Optional[User]:
        user = self.get_by_email(db, email=email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user


user_store = UserStore(User)
