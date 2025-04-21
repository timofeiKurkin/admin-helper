import logging
import shutil
from typing import List

from fastapi import HTTPException

from app import crud
from app.api.deps import SessionDep
from app.core.config import settings
from app.models import RequestForHelp
# from app.core.db import
from app.telegram_bot.bot import bot_api


def visible_error(error: object):
    logging.error(error)
    raise HTTPException(
        status_code=504,
        detail=error,
    )


async def error_exception(
        *,
        session: SessionDep,
        request: RequestForHelp,
        delete_messages: List[int],
        request_folder: str,
        message: str
) -> None:
    await crud.delete_user_request(session=session, db_request=request)
    shutil.rmtree(request_folder)
    await bot_api.delete_messages(
        chat_id=settings.GROUP_ID, message_ids=delete_messages
    )
    visible_error(message)
