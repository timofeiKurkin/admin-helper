import logging
from datetime import datetime, timedelta
from typing import List

from app.api.deps import SessionDep
from app.api.error_handlers.help_request import visible_error
from app.core.config import settings
from app.crud import (
    delete_user_request,
    get_user,
    get_user_request_by_accept_url,
    update_request_for_help,
)
from app.models import (
    RequestForHelpOperatorPublic,
    RequestForHelpUpdate,
    TelegramMessagesIDX,
)
from app.telegram_bot.bot import bot_api
from fastapi import APIRouter, HTTPException, Response
from telegram import InlineKeyboardButton, InlineKeyboardMarkup
from telegram.error import TelegramError

router = APIRouter()


@router.delete("/delete_request/{accept_url}")
async def delete_request(accept_url: str, session: SessionDep, response: Response):
    if len(accept_url) != 43:
        raise HTTPException(status_code=404, detail="Invalid url")

    request_candidate = get_user_request_by_accept_url(
        session=session, accept_url=accept_url
    )

    if not request_candidate:
        raise HTTPException(
            status_code=404, detail="Requested user's request couldn't found"
        )

    try:
        delete_user_request(session=session, db_request=request_candidate)

        created_at = request_candidate.created_at
        current_time = datetime.now()
        time_difference = created_at - current_time
        total_hours = int(time_difference.total_seconds() // 3600)

        if total_hours >= 48:
            telegram_idx = TelegramMessagesIDX.model_validate(
                request_candidate.telegram_messages_idx
            ).model_dump()
            message_ids: List[int] = []

            for key in telegram_idx:
                if isinstance(telegram_idx[key], list):
                    message_ids = [*message_ids, *telegram_idx[key]]
                else:
                    if telegram_idx[key]:
                        message_ids.append(telegram_idx[key])

            await bot_api.delete_messages(
                chat_id=settings.GROUP_ID, message_ids=message_ids
            )

            response.status_code = 204
            return
        else:
            response.status_code = 200
            return {
                "message": "Заявка удалена из базы данных! Вам нужно вручную удалить сообщения из Telegram"
            }

    except Exception as e:
        visible_error(e)
        raise HTTPException(
            status_code=500, detail=f"The request could not be deleted: {e}"
        )


@router.patch(
    "/complete_request/{accept_url}",
    response_model=RequestForHelpOperatorPublic,
    status_code=200,
)
async def complete_request(accept_url: str, session: SessionDep):
    if len(accept_url) != 43:
        raise HTTPException(status_code=404, detail="Invalid url")

    request_candidate = get_user_request_by_accept_url(
        session=session, accept_url=accept_url
    )

    if not request_candidate:
        raise HTTPException(
            status_code=404,
            detail="Не удалось найти запрашиваемую заявку пользователя!",
        )

    user_candidate = get_user(session=session, id=request_candidate.owner_id)

    if not user_candidate:
        raise HTTPException(status_code=404, detail="User not found")

    user_phone = f"+7 {user_candidate.phone[:3]} {user_candidate.phone[3:6]} - {user_candidate.phone[6:8]} - {user_candidate.phone[8:]}"

    if request_candidate.is_completed and request_candidate.completed_at:
        try:
            public_request = RequestForHelpOperatorPublic(
                id=request_candidate.id,
                is_completed=request_candidate.is_completed,
                phone=user_candidate.phone,
                company=user_candidate.company,
                name=user_candidate.name,
                device=request_candidate.device,
            )

            request_for_help_operator_public = (
                RequestForHelpOperatorPublic.model_validate(
                    public_request,
                    update={
                        "created_at": request_candidate.created_at.strftime(
                            settings.PUBLIC_TIME_FORMAT
                        ),
                        "completed_at": request_candidate.completed_at.strftime(
                            settings.PUBLIC_TIME_FORMAT
                        ),
                        "phone": user_phone,
                    },
                )
            )
        except Exception as e:
            error = f"Error in serializing data: {e}"
            logging.error(error)
            raise HTTPException(status_code=500, detail=error)

        return request_for_help_operator_public
    else:
        telegram_messages = TelegramMessagesIDX.model_validate(
            request_candidate.telegram_messages_idx
        )
        reply_markup_id = telegram_messages.reply_markup

        if reply_markup_id:
            keyboard = [
                [
                    InlineKeyboardButton(
                        text=f"🏆 Заявка #{request_candidate.id} выполнена 🏆",
                        url=f"{settings.CLIENT_HOST}/{accept_url}",
                    )
                ]
            ]
            new_reply_markup = InlineKeyboardMarkup(inline_keyboard=keyboard)

            try:
                await bot_api.edit_message_text(
                    chat_id=settings.GROUP_ID,
                    text="Заявка выполнена 🎯",
                    message_id=reply_markup_id,
                    reply_markup=new_reply_markup,
                )
            except TelegramError as e:
                error = f"Error in editing reply markup of a message: {e}"
                logging.error(error)
                raise HTTPException(status_code=500, detail=error)

        compiled_time = datetime.now()

        try:
            updated_request = update_request_for_help(
                session=session,
                db_request=request_candidate,
                request_in=RequestForHelpUpdate.model_validate(
                    request_candidate,
                    update={"is_completed": True, "completed_at": compiled_time},
                ),
            )
        except Exception as e:
            error = f"Error in updating a request: {e}"
            logging.error(error)
            raise HTTPException(status_code=500, detail=error)

        public_request = RequestForHelpOperatorPublic(
            id=updated_request.id,
            is_completed=updated_request.is_completed,
            phone=user_candidate.phone,
            company=user_candidate.company,
            name=user_candidate.name,
            device=updated_request.device,
        )

        try:
            request_for_help_operator_public = (
                RequestForHelpOperatorPublic.model_validate(
                    public_request,
                    update={
                        "created_at": updated_request.created_at.strftime(
                            settings.PUBLIC_TIME_FORMAT
                        ),
                        "completed_at": compiled_time.strftime(
                            settings.PUBLIC_TIME_FORMAT
                        ),
                        "phone": user_phone,
                    },
                )
            )
        except Exception as e:
            error = f"Error in serializing data: {e}"
            logging.error(error)
            raise HTTPException(status_code=500, detail=error)

        return request_for_help_operator_public
