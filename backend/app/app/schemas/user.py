from typing import Optional
from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = True
    is_superuser: Optional[bool] = False
    full_name: Optional[str] = None


class UserCreate(UserBase):
    email: EmailStr
    password: str


class UserUpdate(UserBase):
    password: Optional[str] = None


class UserInDbBase(UserBase):
    id: Optional[int] = None

    class Config:
        orm_mode = True


class User(UserInDbBase):
    pass


class UserInDb(UserInDbBase):
    hashed_password: str
