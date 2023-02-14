from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.db.base_class import Base

if TYPE_CHECKING:
    from .user import User  # noqa: F401


class Post(Base):
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    content = Column(String, nullable=False)
    created = Column(DateTime, default=datetime.utcnow())
    modified = Column(DateTime, default=datetime.utcnow())

    owner_id = Column(Integer, ForeignKey("user.id"))
    owner = relationship("User", back_populates="posts")
