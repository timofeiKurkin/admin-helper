from unittest.mock import AsyncMock

import pytest
from pytest_mock import MockerFixture
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession
from sqlmodel import SQLModel

from app.core.db import create_db_and_tables, AsyncSessionLocal


@pytest.fixture
async def mock_engine(mocker: MockerFixture) -> AsyncMock:
    """
    Fixture to initialize a mock engine
    :param mocker: A mocker to create session
    :return: A mock engine
    """

    mock_engine: AsyncMock = mocker.AsyncMock(spec=AsyncEngine)

    mock_conn = mocker.AsyncMock()
    mock_conn.run_sync = mocker.AsyncMock()

    mock_context = mocker.AsyncMock()
    mock_context.__aenter__.return_value = mock_conn
    mock_engine.begin.return_value = mock_context

    return mock_engine


@pytest.fixture
async def mock_session(mocker: MockerFixture) -> AsyncMock:
    """
    Fixture to initialize a mock session
    :param mocker: A mocker to create session
    :return: A mock session
    """
    mock_session: AsyncMock = mocker.AsyncMock(spec=AsyncSession)

    mock_session.__aenter__.return_value = mock_session
    mock_session.__aexit__.return_value = None

    mock_session_maker = mocker.patch("app.core.db.AsyncSessionLocal")
    mock_session_maker.return_value = mock_session

    return mock_session


async def test_create_db_and_tables(mock_engine: AsyncMock, mocker: MockerFixture) -> None:
    """
    Test to create db and tables
    :param mock_engine: A mock engine to communicate with database
    :param mocker: A mock to replace the real engine to mock_engine
    :return: None
    """
    mocker.patch("app.core.db.engine", mock_engine)

    await create_db_and_tables()

    mock_engine.begin.assert_called_once()
    mock_conn = mock_engine.begin.return_value.__aenter__.return_value
    mock_conn.run_sync.assert_called_once_with(SQLModel.metadata.create_all)


# async def test_get_async_session(mock_session: AsyncMock) -> None:
#     """
#     Test to get an async session
#     :param mock_session: A mock session to get an async session
#     :return: None
#     """
#     session_generator = get_session()
#     session: AsyncSession = await session_generator.__anext__()
#
#     # <sqlalchemy.ext.asyncio.session.AsyncSession> == <AsyncMock name='AsyncSessionLocal()' spec='AsyncSession'>
#     assert session == mock_session
#
#     mock_session.__aenter__.assert_called_once()


async def test_session_maker_configuration() -> None:
    """
    Test to check curr_session works
    :return: None
    """
    async with AsyncSessionLocal() as curr_session:
        assert isinstance(curr_session, AsyncSession)
