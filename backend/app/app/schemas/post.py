from typing import Optional
from pydantic import BaseModel
from sys import intern


class PostBase(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None


class PostCreate(PostBase):
    title: str
    content: str


class PostUpdate(PostBase):
    pass


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
