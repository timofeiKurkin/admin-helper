from typing import List, Optional

from sqlalchemy.types import JSON
from sqlmodel import Column, Field, SQLModel


class UserBase(SQLModel):
    phone: str = Field(default="", max_length=20)
    company: str = Field(default="", max_length=50)
    is_superuser: bool = False
    name: str = Field(default="", max_length=16)


# class UserCreate(UserBase):
#     pass


# class UserRequest()


class User(UserBase, table=True):
    __tablename__ = "users"

    id: int = Field(default=None, primary_key=True)
    phone: str = Field(default="", max_length=20)
    company: str = Field(default="", max_length=50)
    is_superuser: bool = False
    name: str = Field(default="", max_length=16)

    # Определяем связь один ко многим
    # requests: List["Request"] = Relationship(back_populates="user")


class RequestForHelp(SQLModel, table=True):
    __tablename__ = "requests"

    id: Optional[int] = Field(default=None, primary_key=True)
    device: str = Field(default="", max_length=18)
    message: str = Field(default="", max_length=100)
    photos: List[str] = Field(default_factory=list, sa_column=Column(JSON))
    videos: List[str] = Field(default_factory=list, sa_column=Column(JSON))

    name: str = Field(
        default="",
    )
    # message_voice: str = Field(default="", max_length=20)

    # Определяем обратную связь
    # user: User = Relationship(back_populates="requests")
