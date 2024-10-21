import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional

from fastapi import UploadFile
from pydantic import BaseModel
from sqlalchemy.types import JSON
from sqlmodel import Column, Field, Relationship, SQLModel


class UserBase(SQLModel):
    phone: str = Field(default="", max_length=20, index=True)
    company: str = Field(default="", max_length=50)
    is_superuser: bool = False
    name: str = Field(default="", max_length=16)


class UserCreate(UserBase):
    pass


class User(UserBase, table=True):
    __tablename__ = "users"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    # id: int = Field(default=None, primary_key=True)
    # user_id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    # is_superuser: bool = False

    # Определяем связь один ко многим
    requests: List["RequestForHelp"] = Relationship(
        back_populates="owner",
        cascade_delete=True,
    )


class MediaFile(SQLModel):
    id: int
    file_path: str
    file_id: str

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "file_path": self.file_path,
            "file_id": self.file_id,
        }

    @staticmethod
    def from_dict(data: dict) -> "MediaFile":
        return MediaFile(**data)


# Base type of the request
class RequestForHelpBase(SQLModel):
    device: str = Field(default=None, max_length=18)
    message_text: str = Field(default="", max_length=100)
    message_file: MediaFile = Field(
        default_factory=lambda: MediaFile(id=0, file_path="", file_id=0),
        sa_column=Column(JSON),
    )
    photos: List[MediaFile] = Field(default_factory=list, sa_column=Column(JSON))
    videos: List[MediaFile] = Field(default_factory=list, sa_column=Column(JSON))
    is_completed: bool = False

    def to_dict(self):
        return {
            **self.model_dump(),
            "message_file": self.message_file.to_dict(),
            "photos": [photo.to_dict() for photo in self.photos],
            "photos": [video.to_dict() for video in self.videos],
        }


# Request for help type in data base
class RequestForHelp(RequestForHelpBase, table=True):
    __tablename__ = "requests"

    id: Optional[int] = Field(default=None, primary_key=True)

    # Определяем обратную связь
    owner: User = Relationship(back_populates="requests")
    owner_id: uuid.UUID = Field(
        foreign_key="users.id", nullable=False, ondelete="CASCADE", index=True
    )

    # created_at: datetime = Field(default_factory=datetime.now)
    # expires_at: datetime = Field(nullable=False)


# Создание новой заявки
class RequestForHelpCreate(RequestForHelpBase):
    pass


# # Тип данных от клиентской части (Form Data)
# class RequestForHelpData(SQLModel):
#     device: str
#     message_text: str | None = None
#     # message_file: UploadFile | None = None
#     # photo: list[UploadFile] | None = None
#     # video: list[UploadFile] | None = None
#     name: str
#     company: str
#     phone: str
#     number_pc: str


# Обновление статуса заявки
class RequestForHelpUpdate(SQLModel):
    is_completed: bool = True


class RequestForHelpPublic(SQLModel):
    id: Optional[int] = Field(default=None, primary_key=True)
    message: str = Field(default=None)
