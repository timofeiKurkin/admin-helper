import uuid
from typing import Any

from fastapi.encoders import jsonable_encoder
from sqlmodel import Session, select

from app.models import (
    RequestForHelp,
    RequestForHelpCreate,
    RequestForHelpUpdate,
    User,
    UserCreate,
)


def create_user(*, session: Session, user_create: UserCreate) -> User:
    new_user = User.model_validate(user_create)
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user


def get_user_by_phone(*, session: Session, phone: str):
    statement = select(User).where(User.phone == phone)
    session_user = session.exec(statement=statement).first()
    return session_user


def user_exists(*, session: Session, phone: str) -> User | None:
    db_user = get_user_by_phone(
        session=session,
    )
    if not db_user:
        return None
    return db_user


def delete_user(*, session: Session, phone: str):
    pass


def create_request_for_help(
    *, session: Session, request_in: RequestForHelpCreate, owner_id: uuid.UUID
) -> RequestForHelp:
    # new_request_for_help = RequestForHelp.model_validate(
    #     request_in,
    #     update={"owner_id": owner_id},
    # )

    new_request_for_help = RequestForHelp(**request_in.to_dict(), owner_id=owner_id)

    session.add(new_request_for_help)
    session.commit()
    session.refresh(new_request_for_help)
    return new_request_for_help


# def update_status_of_request(
#     *, session: Session, db_request: RequestForHelp, request_in: RequestForHelpUpdate
# ) -> RequestForHelp:
#     request_data = request_in.model_dump(exclude_unset=True)
#     db_request.sqlmodel_update(request_data)
#     session.add(db_request)
#     session.commit()
#     session.refresh(db_request)
#     return db_request


def update_request_for_help(
    *, session: Session, db_request: RequestForHelp, request_in: RequestForHelpUpdate
):
    request_data = request_in.model_dump(exclude_unset=True)
    db_request.sqlmodel_update(request_data)
    session.add(db_request)
    session.commit()
    session.refresh(db_request)
    return db_request


def get_users_requests(*, session: Session, phone: str):
    pass


def delete_user_request(*, session: Session, db_request: RequestForHelp):
    session.delete(db_request)
    session.commit()


def delete_users_request(*, session: Session, phone: str):
    pass


def get_last_request_index(*, session: Session) -> int:
    statement = select(RequestForHelp).order_by(RequestForHelp.id.desc()).limit(1)
    last_request = session.exec(statement=statement).first()
    return last_request.id if last_request else 1
