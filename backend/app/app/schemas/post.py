from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class PostBase(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    created: Optional[datetime] = None
    modified: Optional[datetime] = None


class PostCreate(PostBase):
    title: str
    content: str


class PostUpdate(PostBase):
    title: str
    content: str


class PostInDbBase(PostBase):
    id: int
    title: str
    content: str
    owner_id: int

    class Config:
        orm_mode = True


class Post(PostInDbBase):
    pass


class PostInDb(PostInDbBase):
    pass
