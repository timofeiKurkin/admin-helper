import secrets
import uuid
from datetime import datetime
from typing import List, Optional

from app import utils
from app.core.config import settings
from pydantic import BaseModel
from sqlalchemy.types import JSON
from sqlmodel import Column, Field, Relationship, SQLModel


class MediaFile(SQLModel):
    id: int
    # file_path: str
    file_id: str

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            # "file_path": self.file_path,
            "file_id": self.file_id,  # Change on photo_size
        }

    @staticmethod
    def from_dict(data: dict) -> "MediaFile":
        return MediaFile(**data)


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
    # is_superuser: bool = False

    # Определяем связь один ко многим
    requests: List["RequestForHelp"] = Relationship(
        back_populates="owner",
        cascade_delete=True,
    )
    created_at: datetime = Field(default_factory=datetime.now)

    def to_dict(self):
        return {
            **self.model_dump(mode="json", by_alias=True),
            "created_at": self.created_at.strftime(settings.PUBLIC_TIME_FORMAT),
        }


class TelegramMessagesIDX(SQLModel):
    main_message: int = Field(default=0)
    voice_message: int = Field(default=0)
    reply_markup: int = Field(default=0)
    photos: List[int] = Field(default_factory=list, sa_column=Column(JSON))
    videos: List[int] = Field(default_factory=list, sa_column=Column(JSON))

    def to_dict(self) -> dict:
        return {
            "main_message": self.main_message,
            "voice_message": self.voice_message,
            "reply_markup": self.reply_markup,
            "photos": self.photos,
            "videos": self.videos,
        }

    @staticmethod
    def from_dict(data: dict) -> "TelegramMessagesIDX":
        return TelegramMessagesIDX(**data)


# Base type of the request
class RequestForHelpBase(SQLModel):
    device: str = Field(default="", max_length=18)
    message_text: str = Field(default="", max_length=100)
    message_file: MediaFile = Field(
        default_factory=lambda: MediaFile(id=0, file_id=""),
        sa_column=Column(JSON),
    )
    photos: List[MediaFile] = Field(default_factory=list, sa_column=Column(JSON))
    videos: List[MediaFile] = Field(default_factory=list, sa_column=Column(JSON))
    is_completed: bool = Field(default=False)
    completed_at: Optional[datetime] = Field(default=None)
    accept_url: str = Field(
        default=secrets.token_urlsafe(32), max_length=43, nullable=False
    )

    telegram_messages_idx: TelegramMessagesIDX = Field(
        default_factory=lambda: TelegramMessagesIDX(),
        sa_column=Column(JSON),
    )

    def to_dict(self):
        return {
            **self.model_dump(mode="json", by_alias=True),
            "telegram_messages_idx": self.telegram_messages_idx.to_dict(),
            "message_file": self.message_file.to_dict(),
            "photos": [photo.to_dict() for photo in self.photos],
            "videos": [video.to_dict() for video in self.videos],
        }

    @staticmethod
    def from_dict(data: dict) -> "RequestForHelpBase":
        return RequestForHelpBase(**data)


# Request for help type in data base
class RequestForHelp(RequestForHelpBase, table=True):
    __tablename__ = "requests"

    id: Optional[int] = Field(default=None, primary_key=True)

    # Определяем обратную связь
    owner: User = Relationship(back_populates="requests")
    owner_id: uuid.UUID = Field(foreign_key="users.id", nullable=False, index=True)

    created_at: datetime = Field(default_factory=datetime.now)
    # expires_at: datetime = Field(nullable=False)


# Создание новой заявки
class RequestForHelpCreate(RequestForHelpBase):
    pass


# Обновление статуса заявки
class RequestForHelpUpdate(RequestForHelpBase):
    pass
    # is_completed: bool = True


class ChangeRequestStatus(BaseModel):
    request_id: uuid.UUID
    user_id: uuid.UUID


class RequestForHelpPublic(SQLModel):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: str = Field(
        default=datetime.now().strftime(settings.PUBLIC_TIME_FORMAT)
    )
    completed_at: str = Field(default="")
    is_completed: bool = Field(default=False)

    def to_dict(self):
        return {
            "id": self.id,
            "createdAt": self.created_at,
            "completedAt": self.completed_at,
            "isCompleted": self.is_completed,
        }

    class Config:
        alias_generator = utils.to_camel
        populate_by_name = True


class RequestForHelpOperatorPublic(RequestForHelpPublic):
    phone: str = Field(default="", max_length=20, index=True)
    company: str = Field(default="", max_length=50)
    name: str = Field(default="", max_length=16)
    device: str = Field(default=None, max_length=18)
    completed_at: str = Field(
        default=datetime.now().strftime(settings.PUBLIC_TIME_FORMAT)
    )


class AccessToken(SQLModel):
    phone: str = Field(default="", max_length=20, index=True)
    owner_id: uuid.UUID = Field(
        foreign_key="users.id", nullable=False, ondelete="CASCADE", index=True
    )
    created_at: datetime = Field(default_factory=datetime.now)


# Token models
# class TokenBase(SQLModel):
#     device_id: uuid.UUID = Field(default_factory=uuid.uuid4, unique=True)
#     refresh_token: str = Field(unique=True)
#     expires_at: datetime = Field(nullable=False)


# class Token(TokenBase, table=True):
#     __tablename__ = "tokens"

#     id: int = Field(default=None, primary_key=True)
#     created_at: datetime = Field(default_factory=datetime.now)

#     owner: User = Relationship(back_populates="tokens")
#     owner_id: uuid.UUID = Field(
#         foreign_key="users.id", nullable=False, ondelete="CASCADE", index=True
#     )


# class TokenUpdate(TokenBase):
#     pass


# class TokenPublic(TokenBase):
#     access_token: str = Field(unique=True)


# class UserToken(SQLModel):
#     device: uuid.UUID = Field(default_factory=uuid.uuid4)
#     phone: str = Field(default="", max_length=20, index=True)
