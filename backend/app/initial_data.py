import logging

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import create_db_and_tables, engine
import asyncio

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def init() -> None:
    async with AsyncSession(engine) as _:
        await create_db_and_tables()


def main() -> None:
    logger.info("Creating initial data")
    asyncio.run(init())
    logger.info("Initial data created")


if __name__ == "__main__":
    main()
