import uuid
from typing import Any

from sqlmodel import Session, select

from app.models import RequestForHelp, User, UserBase


def create_user(*, session: Session, user_create: UserBase) -> User:
    new_user = User.model_validate(user_create)
    return


def create_request_for_help(
    *, session: Session, request_in: Any, owner_id: uuid.UUID
) -> RequestForHelp:
    pass
