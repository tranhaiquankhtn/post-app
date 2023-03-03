
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from app.models import Post
from app.schemas import PostCreate, PostUpdate
from app.store.base import StoreBase


class PostStore(StoreBase[Post, PostCreate, PostUpdate]):
    def create_with_owner(self, db: Session, obj_in: PostCreate, uid: int) -> Post:
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(**obj_in_data, owner_id=uid)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


post_store = PostStore(Post)
