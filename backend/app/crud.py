import uuid
from typing import Any, Sequence

from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.api.error_handlers.db import handle_db_errors
from app.models import (
    RequestForHelp,
    RequestForHelpCreate,
    RequestForHelpUpdate,
    User,
    UserCreate,
)


# Work with user
@handle_db_errors()
async def create_user(*, session: AsyncSession, user_create: UserCreate) -> User:
    new_user = User.model_validate(user_create)
    session.add(new_user)
    await session.commit()
    await session.refresh(new_user)
    return new_user


@handle_db_errors()
async def get_user_by_id(*, session: AsyncSession, owner_id: uuid.UUID) -> User | None:
    statement = select(User).where(User.id == owner_id)
    session_user = (await session.execute(statement=statement)).scalar()
    return session_user


@handle_db_errors()
async def get_user_by_phone(*, session: AsyncSession, phone: str) -> User | None:
    statement = select(User).where(User.phone == phone)
    session_user = (await session.execute(statement=statement)).scalar()
    return session_user


@handle_db_errors()
async def get_user(*, session: AsyncSession, **filters: Any) -> User | None:
    statement = select(User).filter_by(**filters)
    session_user = (await session.execute(statement=statement)).scalar()
    return session_user


@handle_db_errors()
async def user_exists(*, session: AsyncSession, phone: str) -> User | None:
    db_user = await get_user_by_phone(session=session, phone=phone)
    return db_user


# @handle_db_errors()
# async def delete_user(*, session: AsyncSession, phone: str):
#     pass


# Work with requests
@handle_db_errors()
async def create_request_for_help(
        *, session: AsyncSession, request_in: RequestForHelpCreate, owner_id: uuid.UUID
) -> RequestForHelp:
    new_request_for_help = RequestForHelp.model_validate(request_in, update={"owner_id": owner_id})

    session.add(new_request_for_help)
    await session.commit()
    await session.refresh(new_request_for_help)
    return new_request_for_help


@handle_db_errors()
async def update_request_for_help(
        *, session: AsyncSession, db_request: RequestForHelp, request_in: RequestForHelpUpdate
):
    request_data = request_in.model_dump(exclude_unset=True)
    db_request.sqlmodel_update(request_data)
    session.add(db_request)

    await session.commit()
    await session.refresh(db_request)
    return db_request


@handle_db_errors()
async def get_user_requests(
        *, session: AsyncSession, owner_id: str, order_by: str = "none"
) -> Sequence[RequestForHelp]:
    statement = select(RequestForHelp).where(RequestForHelp.owner_id == owner_id)

    if order_by == "created_at":
        statement = statement.order_by(RequestForHelp.created_at.desc())  # type: ignore[attr-defined]

    user_requests = (await session.execute(statement=statement)).scalars().all()
    return user_requests or []


@handle_db_errors()
async def get_user_request_by_accept_url(
        *, session: AsyncSession, accept_url: str
) -> RequestForHelp | None:
    statement = (
        select(RequestForHelp)
        .where(RequestForHelp.accept_url == accept_url)
        .order_by(RequestForHelp.created_at.desc())  # type: ignore[attr-defined]
    )

    user_request = (await session.execute(statement=statement)).scalar()
    return user_request


@handle_db_errors()
async def delete_user_request(*, session: AsyncSession, db_request: RequestForHelp):
    deleted_candidate = await session.get(RequestForHelp, db_request.id)
    if deleted_candidate is not None:
        await session.delete(db_request)
        await session.commit()
    else:
        print(
            f"Request for help {db_request.id} not found or have been already deleted"
        )

# async def get_last_request_index(*, session: AsyncSession) -> int:
#     statement = select(RequestForHelp).order_by(RequestForHelp.id.desc()).limit(1)
#     last_request = session.execute(statement=statement).scalar()
#     return last_request.id if last_request else 1


# Work with users token
# async def create_refresh_token(
#     *, session: AsyncSession, user: UserToken, owner_id: uuid.UUID
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


# async def delete_extra_token(*, session: AsyncSession, owner_id: uuid.UUID):
#     all_user_tokens = get_all_refresh_tokens(session=session, owner_id=owner_id)

#     # If tokens too many, find the oldest and delete one
#     if len(all_user_tokens) > settings.MAX_COUNT_OF_TOKENS:
#         oldest_token: Token = session.execute(
#             statement=select(Token)
#             .where(Token.owner_id == owner_id)
#             .order_by(Token.created_at)
#             .limit(1)
#         ).scalar()

#         if oldest_token:
#             delete_token(session=session, token=oldest_token)


# async def get_all_refresh_tokens(*, session: AsyncSession, owner_id: uuid.UUID) -> list[Token]:
#     statement = select(Token).where(Token.owner_id == owner_id)
#     return session.execute(statement=statement).all()


# async def get_refresh_token(*, session: AsyncSession, user: UserToken) -> str:
#     statement = select(Token).where(Token.device_id == user.device)
#     current_token = session.execute(statement=statement).scalar()
#     return current_token


# async def delete_token(*, session: AsyncSession, token: Token) -> None:
#     session.delete(token)
#     session.commit()
