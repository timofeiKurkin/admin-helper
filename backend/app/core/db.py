from sqlalchemy.ext.asyncio import create_async_engine, AsyncEngine, async_sessionmaker, AsyncSession
from sqlmodel import SQLModel

from app.core.config import settings

engine: AsyncEngine = create_async_engine(settings.SQLALCHEMY_DATABASE_URI or "")
AsyncSessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)


async def create_db_and_tables():
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

# def init_db(session: Session) -> None:
#     super_user = session.exec(select(UserBase).where())
