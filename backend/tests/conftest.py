from typing import AsyncGenerator, Any, Dict

import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine, AsyncSession, async_sessionmaker
from sqlmodel import SQLModel

from app import utils
from app.api.deps import get_session
from app.auth import token as token_handler
from app.core.config import settings
from app.main import app


@pytest_asyncio.fixture(scope="session")
async def engine() -> AsyncGenerator[AsyncEngine, Any]:
    """
    Create async engine, create all tables and drop them after all tests
    :return: Async engine
    """
    engine: AsyncEngine = create_async_engine(settings.SQLALCHEMY_DATABASE_URI or "")
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

    yield engine

    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.drop_all)

    await engine.dispose()


@pytest_asyncio.fixture(scope="session")
async def session(engine: AsyncEngine) -> AsyncGenerator[AsyncSession, Any]:
    """
    Create async session for each test
    :param engine: Async engine to get session
    :return: Async session
    """
    async_session_local = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session_local() as session:
        yield session
        await session.rollback()
        await session.close()


@pytest_asyncio.fixture(scope="session")
async def test_client(session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """
    Create a client that use ASGI-Transport to communicate with the app. He is not an auth user.
    :param session: SQLAlchemy async session for database interaction
    :return: A client
    """

    async def override_get_async_session() -> AsyncGenerator[AsyncSession, Any]:
        try:
            yield session
        finally:
            await session.close()

    app.dependency_overrides[get_session] = override_get_async_session

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://localhost:8000") as client:
        yield client

    # app.dependency_overrides.clear()


@pytest_asyncio.fixture(scope="session")
async def authenticated_user(session: AsyncSession) -> Dict[str, Any]:
    user = {
        "formatted_db_phone": "79876532101",
        "company": "Test Company",
        "name": "Admin",
    }

    new_user = await utils.create_new_user(session=session, **user)
    new_access_token = token_handler.create_jwt_token(user=new_user)

    return {
        "headers": {"Cookie": f"{settings.AUTH_TOKEN_KEY}={new_access_token}"},
        "user": new_user,
        "user_data": user
    }
