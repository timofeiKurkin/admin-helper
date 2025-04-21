import logging
from functools import wraps

from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError

logger = logging.getLogger(__name__)


def handle_db_errors(
        *,
        error_message: str | None = "A database error occurred. Please try again later.",
):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except SQLAlchemyError as db_error:
                logger.error(f"Database error in {func.__name__}: {db_error}")
                raise HTTPException(
                    status_code=500,
                    detail=error_message,
                )
            except Exception as e:
                logger.exception(f"An unexpected error in {func.__name__}: {e}")
                raise HTTPException(
                    status_code=500, detail=f"An unexpected error occurred."
                )

        return wrapper

    return decorator
