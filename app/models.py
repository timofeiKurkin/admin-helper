from typing import List, Optional

from fastapi import UploadFile
from sqlalchemy.types import JSON
from sqlmodel import Column, Field, Relationship, SQLModel


class UserBase(SQLModel):
    phone: str = Field(default="", max_length=20)
    company: str = Field(default="", max_length=50)
    is_superuser: bool = False
    name: str = Field(default="", max_length=16)


class UserCreate(UserBase):
    pass


class User(UserBase, table=True):
    __tablename__ = "users"

    id: int = Field(default=None, primary_key=True)
    is_superuser: bool = False

    # Определяем связь один ко многим
    requests: List["RequestForHelp"] = Relationship(
        back_populates="user", cascade_delete=True
    )


class RequestForHelpBase(SQLModel):
    device: str  # = Field(default=None, max_length=18)


class RequestForHelp(RequestForHelpBase, table=True):
    __tablename__ = "requests"

    id: Optional[int] = Field(default=None, primary_key=True)
    message: str = Field(default="", max_length=100)
    photos: List[str] = Field(default_factory=list, sa_column=Column(JSON))
    videos: List[str] = Field(default_factory=list, sa_column=Column(JSON))
    is_completed: bool = False

    # Определяем обратную связь
    user: User = Relationship(back_populates="requests")
    user_id: int = Field(foreign_key="users.id")


class RequestForHelpData(RequestForHelpBase):
    message_file: UploadFile | None = None
    message_text: str | None = None
    photo: list[UploadFile] | None = None
    video: list[UploadFile] | None = None

    name: str
    company: str
    phone: str
    number_pc: str


class RequestForHelpUpdate(RequestForHelpBase):
    is_completed: bool = True


class RequestForHelpCreate(RequestForHelpBase):
    pass


class RequestForHelpPublic(RequestForHelpBase):
    pass
