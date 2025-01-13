import uuid
from typing import Any, Sequence

from app.models import (
    RequestForHelp,
    RequestForHelpCreate,
    RequestForHelpUpdate,
    User,
    UserCreate,
)

from sqlmodel import Session, select


# Work with user
def create_user(*, session: Session, user_create: UserCreate) -> User:
    new_user = User.model_validate(user_create)
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user


def get_user_by_id(*, session: Session, id: uuid.UUID) -> User | None:
    statement = select(User).where(User.id == id)
    session_user = session.exec(statement=statement).first()
    return session_user


def get_user_by_phone(*, session: Session, phone: str) -> User | None:
    statement = select(User).where(User.phone == phone)
    session_user = session.exec(statement=statement).first()
    return session_user


def get_user(*, session: Session, **filters: Any) -> User | None:
    statement = select(User).filter_by(**filters)
    session_user = session.exec(statement=statement).first()
    return session_user


def user_exists(*, session: Session, phone: str) -> User | None:
    db_user = get_user_by_phone(session=session, phone=phone)
    return db_user


def delete_user(*, session: Session, phone: str):
    pass


# Work with requests
def create_request_for_help(
    *, session: Session, request_in: RequestForHelpCreate, owner_id: uuid.UUID
) -> RequestForHelp:
    new_request_for_help = RequestForHelp(**request_in.to_dict(), owner_id=owner_id)

    session.add(new_request_for_help)
    session.commit()
    session.refresh(new_request_for_help)
    return new_request_for_help


def update_request_for_help(
    *, session: Session, db_request: RequestForHelp, request_in: RequestForHelpUpdate
):
    request_data = request_in.model_dump(exclude_unset=True)
    db_request.sqlmodel_update(request_data)
    session.add(db_request)
    session.commit()
    session.refresh(db_request)
    return db_request


def get_user_requests(
    *, session: Session, owner_id: str, order_by: str = "none"
) -> Sequence[RequestForHelp]:
    statement = select(RequestForHelp).where(RequestForHelp.owner_id == owner_id)

    if order_by == "created_at":
        statement = statement.order_by(RequestForHelp.created_at.desc())  # type: ignore[attr-defined]

    user_requests = session.exec(statement=statement).all()
    return user_requests or []


def get_user_request_by_accept_url(
    *, session: Session, accept_url: str
) -> RequestForHelp | None:
    statement = (
        select(RequestForHelp)
        .where(RequestForHelp.accept_url == accept_url)
        .order_by(RequestForHelp.created_at.desc())  # type: ignore[attr-defined]
    )

    user_request = session.exec(statement=statement).first()
    return user_request


def delete_user_request(*, session: Session, db_request: RequestForHelp):
    deleted_candidate = session.get(RequestForHelp, db_request.id)
    if deleted_candidate:
        session.delete(db_request)
        session.commit()
    else:
        print(
            f"Request for help {db_request.id} not found or have been already deleted"
        )


# def get_last_request_index(*, session: Session) -> int:
#     statement = select(RequestForHelp).order_by(RequestForHelp.id.desc()).limit(1)
#     last_request = session.exec(statement=statement).first()
#     return last_request.id if last_request else 1


# Work with users token
# def create_refresh_token(
#     *, session: Session, user: UserToken, owner_id: uuid.UUID
# ) -> str:
#     new_refresh_token = token.create_refresh_token(user=user)
#     new_auth = Token.model_validate(
#         user, update={"owner_id": owner_id, "refresh_token": new_refresh_token}
#     )
#     delete_extra_token(session=session, owner_id=owner_id)

#     session.add(new_auth)
#     session.commit()
#     session.refresh(new_auth)
#     return new_auth


# def delete_extra_token(*, session: Session, owner_id: uuid.UUID):
#     all_user_tokens = get_all_refresh_tokens(session=session, owner_id=owner_id)

#     # If tokens too many, find the oldest and delete one
#     if len(all_user_tokens) > settings.MAX_COUNT_OF_TOKENS:
#         oldest_token: Token = session.exec(
#             statement=select(Token)
#             .where(Token.owner_id == owner_id)
#             .order_by(Token.created_at)
#             .limit(1)
#         ).first()

#         if oldest_token:
#             delete_token(session=session, token=oldest_token)


# def get_all_refresh_tokens(*, session: Session, owner_id: uuid.UUID) -> list[Token]:
#     statement = select(Token).where(Token.owner_id == owner_id)
#     return session.exec(statement=statement).all()


# def get_refresh_token(*, session: Session, user: UserToken) -> str:
#     statement = select(Token).where(Token.device_id == user.device)
#     current_token = session.exec(statement=statement).first()
#     return current_token


# def delete_token(*, session: Session, token: Token) -> None:
#     session.delete(token)
#     session.commit()
