import logging
import shutil
from typing import List

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from telegram import Bot

from app import crud
from app.core.config import settings
from app.models import RequestForHelp


# from app.telegram_bot.bot import bot_api


def visible_error(error: object):
    logging.error(error)
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error)


async def error_exception(
        *,
        session: AsyncSession,
        request: RequestForHelp,
        delete_messages: List[int],
        request_folder: str,
        message: str,
        bot_api: Bot
) -> None:
    await crud.delete_user_request(session=session, db_request=request)
    shutil.rmtree(request_folder)
    await bot_api.delete_messages(
        chat_id=settings.GROUP_ID, message_ids=delete_messages
    )
    visible_error(message)
