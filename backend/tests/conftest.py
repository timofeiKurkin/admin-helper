import asyncio
from datetime import datetime
from typing import AsyncGenerator, Any, Dict
from unittest.mock import AsyncMock

import pytest
import pytest_asyncio
from fastapi_csrf_protect import CsrfProtect  # type: ignore[import-untyped]
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine, AsyncSession, async_sessionmaker
from sqlmodel import SQLModel
from telegram import Message, Chat, Voice, PhotoSize

from app.api.deps import SessionDep
from app.auth import token as token_handler
from app.auth.token import create_csrf_token
from app.core.config import settings
from app.main import app
from app.models import User, UserCreate
from app.telegram_bot.bot import get_telegram_bot


@pytest_asyncio.fixture(scope="function")
async def engine() -> AsyncGenerator[AsyncEngine, Any]:
    """
    Create async engine, create all tables and drop them after all tests
    :return: Async engine
    """
    url = f"postgresql+asyncpg://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_SERVER}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}"
    engine: AsyncEngine = create_async_engine(url)
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

    yield engine

    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.drop_all)

    await engine.dispose()


@pytest_asyncio.fixture(scope="function")
async def session(engine: AsyncEngine) -> AsyncGenerator[AsyncSession, Any]:
    """
    Create async session for each test
    :param engine: Async engine to get session
    :return: Async session
    """
    async_session_local = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session_local() as session:
        yield session
        # await session.rollback()
        # await session.close()


@pytest_asyncio.fixture(scope="function")
async def mock_bot_api() -> AsyncGenerator[AsyncMock, Any]:
    mock = AsyncMock()
    chat = Chat(id=1, type="group")

    mock_message = AsyncMock(spec=Message)
    mock_message.chat = chat
    mock_message.message_id = 1
    mock_message.date = datetime.now()

    mock_message.reply_voice.return_value = Message(
        message_id=2,
        date=datetime.now(),
        chat=chat,
        voice=Voice(file_id="3", file_unique_id="123", duration=3),
    )

    mock_message.reply_media_group.return_value = [
        Message(
            message_id=3,
            date=datetime.now(),
            chat=chat,
            photo=[PhotoSize(file_id="4", file_unique_id="124", width=0, height=0)],
        )
    ]

    mock.send_message.return_value = mock_message

    yield mock


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="function")
async def test_client(session: AsyncSession, mock_bot_api: AsyncMock, event_loop) -> AsyncGenerator[
    AsyncClient, Any]:
    """
    Create a client that use ASGI-Transport to communicate with the app. He is not an auth user.
    :param db_session: SQLAlchemy async session for database interaction
    :return: A client
    """

    async def override_get_async_session() -> AsyncGenerator[AsyncSession, Any]:
        yield session

    async def override_get_telegram_bot() -> AsyncGenerator[AsyncMock, Any]:
        yield mock_bot_api

    app.dependency_overrides[SessionDep] = override_get_async_session
    app.dependency_overrides[get_telegram_bot] = override_get_telegram_bot

    try:
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://localhost:8000") as client:
            yield client
    finally:
        app.dependency_overrides.clear()


@pytest_asyncio.fixture(scope="function")
async def authenticated_user(test_client: AsyncClient, session: AsyncSession) -> Dict[str, Any]:
    user = {
        "phone": "9876532101",
        "company": "Test Company",
        "name": "Admin",
        "is_superuser": False,
    }

    user_create = UserCreate(**user)
    new_user = User.model_validate(user_create)
    session.add(new_user)
    await session.commit()
    await session.refresh(new_user)

    new_access_token = token_handler.create_jwt_token(user=new_user)

    return {
        "headers": {"Cookie": f"{settings.AUTH_TOKEN_KEY}={new_access_token};cookiePermission=true;"},
        "user": new_user,
    }


@pytest_asyncio.fixture(scope="function")
async def csrf_token(test_client: AsyncClient) -> Dict[str, Any]:
    csrf_token, signed_token = create_csrf_token(csrf_protect=CsrfProtect())

    return {
        "headers": {"Cookie": f"csrfToken={signed_token};", "X-CSRF-Token": csrf_token}
    }
