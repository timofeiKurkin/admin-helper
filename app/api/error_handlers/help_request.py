import logging

from fastapi import HTTPException


def visible_error(error: str):
    logging.error(error)
    raise HTTPException(
        status_code=504,
        detail=error,
    )

