import os
import secrets
import shutil
from datetime import datetime
from typing import Annotated, List, Optional

from app import crud, utils
from app.api.deps import SessionDep
from app.api.error_handlers import help_request as help_request_error
from app.api.func.help_request import file_compression
from app.auth import token as TokenHandlers
from app.core.config import TEMPORARY_FOLDER, settings
from app.models import (
    MediaFile,
    RequestForHelpCreate,
    RequestForHelpPublic,
    RequestForHelpUpdate,
    TelegramMessagesIDX,
    User,
    UserCreate,
)
from app.telegram_bot import utils as telegram_utils
from app.telegram_bot.bot import bot_api
from fastapi import APIRouter, Depends, File, Form, HTTPException, Request, UploadFile
from fastapi.responses import JSONResponse
from fastapi_csrf_protect import CsrfProtect  # type: ignore[import-untyped]
from slowapi import Limiter
from slowapi.util import get_remote_address
from telegram import (
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    InputFile,
    InputMediaPhoto,
    InputMediaVideo,
    ReplyParameters,
)
from telegram.error import TelegramError

limiter = Limiter(key_func=get_remote_address)
router = APIRouter()
telegram_timeout_time = 120
chat_id = settings.GROUP_ID


@router.get(
    "/get_user_requests", response_model=List[RequestForHelpPublic], status_code=200
)
@limiter.limit("100/minute")
async def get_user_requests(*, request: Request, session: SessionDep):
    user_token = request.cookies.get(settings.AUTH_TOKEN_KEY)

    if not user_token:
        raise HTTPException(status_code=403, detail="Authorization cookie not found")

    user_payload = TokenHandlers.decode_jwt_token(token=user_token)
    user_phone: str = user_payload["phone"]
    user_id: str = user_payload["owner_id"]

    candidate = crud.get_user_by_phone(session=session, phone=user_phone)
    if not candidate:
        raise HTTPException(status_code=404, detail="User not found")
    if str(candidate.id) != user_id:
        raise HTTPException(status_code=403, detail="Data of the token doesn't match")

    user_requests = crud.get_user_requests(
        session=session, owner_id=user_id, order_by="created_at"
    )
    user_public_requests: List[RequestForHelpPublic] = []

    try:
        for user_request in user_requests:
            created_at = user_request.created_at
            completed_at = user_request.completed_at

            update_data = {
                "created_at": created_at.strftime(settings.PUBLIC_TIME_FORMAT),
                "completed_at": "",
            }

            if completed_at:
                completed_format = (
                    settings.PUBLIC_SHORT_TIME_FORMAT
                    if completed_at.day == created_at.day
                    and completed_at.month == created_at.month
                    else settings.PUBLIC_TIME_FORMAT
                )
                update_data["completed_at"] = completed_at.strftime(completed_format)

            user_public_requests.append(
                RequestForHelpPublic.model_validate(user_request, update=update_data)
            )
    except Exception as e:
        error = f"There's an error: {e}"
        help_request_error.visible_error(error)
        raise HTTPException(status_code=500, detail=error)

    preview_count = 7

    return user_public_requests[:preview_count]


def create_new_user(
    *, session: SessionDep, formatted_db_phone: str, company: str, name: str
) -> User:
    user_create = UserCreate(
        phone=formatted_db_phone, company=company, is_superuser=False, name=name
    )
    user_candidate = crud.create_user(session=session, user_create=user_create)

    # user_folder = os.path.join(USER_REQUESTS_FOLDER, str(user_candidate.id), "requests")
    # if not os.path.exists(user_folder):
    #     os.makedirs(user_folder)
    # return (user_candidate, user_folder)

    return user_candidate


@router.post("/create_request", status_code=201)  # response_model=RequestForHelpPublic
@limiter.limit("5/minute")
async def create_help_request(
    session: SessionDep,
    request: Request,
    device: Annotated[str, Form()],
    name: Annotated[str, Form()],
    company: Annotated[str, Form()],
    phone: Annotated[str, Form()],
    number_pc: Annotated[str, Form()],
    message_text: Annotated[Optional[str], Form()] = None,
    message_file: Annotated[Optional[UploadFile], File()] = None,
    photo: Annotated[Optional[List[UploadFile]], File()] = None,
    video: Annotated[Optional[List[UploadFile]], File()] = None,
    user_can_talk: Annotated[bool, Form()] = False,
    user_political: Annotated[bool, Form()] = False,
    csrf_protect: CsrfProtect = Depends(),
):
    await csrf_protect.validate_csrf(request=request)

    if not user_political:
        return JSONResponse(
            content={
                "message": "Кажется, вы забыли дать согласие на обработку данных. Без этого мы не можем продолжить. 😅"
            },
            status_code=403,
        )

    formatted_db_phone = "".join(filter(str.isdigit, phone))[1:]
    user_candidate: Optional[User] = crud.get_user_by_phone(
        session=session, phone=formatted_db_phone
    )
    # user_folder: str = ""  # Folder where are saving each request and its files

    # Create new user, if doesn't exist
    if user_candidate is None:
        try:
            user_candidate = create_new_user(
                session=session,
                formatted_db_phone=formatted_db_phone,
                company=company,
                name=name,
            )
            # created_user: User = result
            # user_candidate = created_user
            # created_folder: str = result[1]
            # user_folder = created_folder
        except Exception as e:
            help_request_error.visible_error(f"Error in creating user: {e}")
    else:
        user_requests = crud.get_user_requests(
            session=session, owner_id=str(user_candidate.id), order_by="created_at"
        )

        last_request = user_requests[0]
        request_created_at = last_request.created_at
        current_time = datetime.now()
        difference = current_time - request_created_at
        total_minutes = int(difference.total_seconds() // 60)

        if total_minutes < settings.REQUEST_CREATING_INTERVAL:
            next_in = settings.REQUEST_CREATING_INTERVAL - total_minutes
            minutes_text = f"минут{"у" if next_in == 1 else ""}{"ы" if next_in >= 2 and next_in <= 4 else ""}"
            message = f"Ещё немного терпения ⏳ — вы сможете создать новую заявку через <b>{next_in} {minutes_text}<b/>"
            response = JSONResponse(
                content={"message": message},
                status_code=429,
            )
            return response

    assert user_candidate is not None
    user_temporary_folder: str = os.path.join(TEMPORARY_FOLDER, str(user_candidate.id))

    # if not user_folder:
    #     user_folder = os.path.join(
    #         USER_REQUESTS_FOLDER, str(user_candidate.id), "requests"
    #     )

    # Create empty request in data base
    try:
        new_request = crud.create_request_for_help(
            session=session,
            request_in=RequestForHelpCreate(),
            owner_id=user_candidate.id,
        )
    except Exception as e:
        help_request_error.visible_error(f"Error in creating user's request: {e}")

    # request_index = crud.get_last_request_index(session=session)
    last_index = new_request.id or 1

    # Trying to send the main message to which the others message will be linked (replied)
    try:
        telegram_text_message = telegram_utils.get_finally_message(
            last_index=last_index,
            name=name,
            phone=phone,
            company=company,
            number_pc=int("".join(filter(str.isdigit, number_pc))),
            device=device,
            message_text=message_text or "",
            user_can_talk=user_can_talk,
        )
        main_message = await bot_api.send_message(
            chat_id=chat_id,
            text=telegram_text_message,
            parse_mode="HTML",
        )
    except TelegramError as e:
        crud.delete_user_request(session=session, db_request=new_request)
        help_request_error.visible_error(
            f"Failed to send main message to Telegram: {e}"
        )

    main_message_id = main_message.message_id

    voice_media_file = MediaFile(id=0, file_id="")
    photos_media_file: List[MediaFile] = []
    videos_media_file: List[MediaFile] = []

    # Telegram indexes of messages
    voice_message_id: List[int] = []
    photo_messages_idx: List[int] = []
    video_messages_idx: List[int] = []

    if message_file is not None or photo is not None or video is not None:
        voice_file: InputFile = InputFile(obj=b"")
        photo_files: List[InputMediaPhoto] = []
        video_files: List[InputMediaVideo] = []

        request_folder: str = utils.create_request_folder(
            user_folder=user_temporary_folder
        )

        # At first, we should convert audio and compress photos and videos, and then upload them to Telegram
        # Uploading voice message to telegram
        if message_file:
            try:
                converted_voice = await file_compression.voice_file(
                    message_file=message_file,
                    request_folder=request_folder,
                )
                voice_file = converted_voice
            except Exception as e:
                await help_request_error.error_exception(
                    session=session,
                    request=new_request,
                    delete_messages=[main_message_id],
                    request_folder=request_folder,
                    message=f"Failed to convert audio: {e}",
                )

        # Uploading photo to telegram
        if photo and len(photo):
            try:
                compressed_photos = await file_compression.photo_files(photo=photo)
                photo_files = compressed_photos
            except Exception as e:
                await help_request_error.error_exception(
                    session=session,
                    request=new_request,
                    delete_messages=[main_message_id],
                    request_folder=request_folder,
                    message=f"Failed to compress photos: {e}",
                )

        # Uploading video to telegram
        if video and len(video):
            try:
                compressed_videos = await file_compression.video_files(
                    video=video, temporary_folder=request_folder
                )
                video_files = compressed_videos
            except Exception as e:
                await help_request_error.error_exception(
                    session=session,
                    request=new_request,
                    delete_messages=[main_message_id],
                    request_folder=request_folder,
                    message=f"Failed to compress video: {e}",
                )

        try:
            if voice_file.input_file_content and voice_file.filename:
                voice_response = await main_message.reply_voice(
                    voice=voice_file,
                    connect_timeout=telegram_timeout_time,
                    caption="Сообщение пользователя:",
                )
                voice_message_id.append(voice_response.message_id)
                if voice_response.voice:
                    # voice_response.voice.file_id - Identifier for this file, which can be used to download or reuse the file
                    voice_media_file = MediaFile(
                        id=0,
                        file_id=voice_response.voice.file_id,
                    )
        except Exception as e:
            await help_request_error.error_exception(
                session=session,
                request=new_request,
                delete_messages=[main_message_id, *voice_message_id],
                request_folder=request_folder,
                message=f"Failed to send voice message to Telegram: {e}",
            )

        try:
            if len(photo_files):
                photo_response = await main_message.reply_media_group(
                    media=photo_files, connect_timeout=telegram_timeout_time
                )
                for index, response_item in enumerate(photo_response):
                    photo_messages_idx.append(response_item.message_id)
                    # response_item.photo - List[Telegram.PhotoSize], where the last element(photo[-1]) is full size of the image
                    # response_item.photo[-1].file_id - Identifier for this file, which can be used to download or reuse the file
                    if response_item.photo:
                        photos_media_file.append(
                            MediaFile(
                                id=index,
                                file_id=response_item.photo[-1].file_id,
                            )
                        )
        except Exception as e:
            await help_request_error.error_exception(
                session=session,
                request=new_request,
                delete_messages=[
                    main_message_id,
                    *voice_message_id,
                    *photo_messages_idx,
                ],
                request_folder=request_folder,
                message=f"Failed to send photo message to Telegram: {e}",
            )

        try:
            if len(video_files):
                video_response = await main_message.reply_media_group(
                    media=video_files,
                    read_timeout=telegram_timeout_time,
                    connect_timeout=telegram_timeout_time,
                    pool_timeout=300,
                )
                for index, response_item in enumerate(video_response):
                    video_messages_idx.append(response_item.message_id)
                    # response_item.photo - List[Telegram.PhotoSize], where the last element(photo[-1]) is full size of the image
                    # response_item.photo[-1].file_id - Identifier for this file, which can be used to download or reuse the file
                    if response_item.video:
                        videos_media_file.append(
                            MediaFile(
                                id=index,
                                file_id=response_item.video.file_id,
                            )
                        )
        except Exception as e:
            await help_request_error.error_exception(
                session=session,
                request=new_request,
                delete_messages=[
                    main_message_id,
                    *voice_message_id,
                    *photo_messages_idx,
                    *video_messages_idx,
                ],
                request_folder=request_folder,
                message=f"Failed to send video message to Telegram: {e}",
            )

        shutil.rmtree(request_folder)

    # Creating safe url to complete request by operator
    accept_url = secrets.token_urlsafe(32)
    keyboard = [
        [
            InlineKeyboardButton(
                text=f"Завершить заявку #{new_request.id}",
                url=f"{settings.CLIENT_HOST}/{accept_url}",
            )
        ]
    ]
    reply_markup = InlineKeyboardMarkup(inline_keyboard=keyboard)

    try:
        reply_markup_message = await bot_api.send_message(
            chat_id=chat_id,
            text="Чтобы завершить заявку, перейдите по ссылке 🎯",
            reply_parameters=ReplyParameters(
                message_id=main_message_id, chat_id=chat_id
            ),
            reply_markup=reply_markup,
        )
    except Exception as e:
        await help_request_error.error_exception(
            session=session,
            request=new_request,
            delete_messages=[
                main_message_id,
                *voice_message_id,
                *photo_messages_idx,
                *video_messages_idx,
            ],
            request_folder=request_folder,
            message=f"Failed to send markup message to Telegram: {e}",
        )

    # Saving message id to change it, when operator complete the help request
    reply_markup_message_id: int = reply_markup_message.message_id

    # Create data base model
    telegram_messages_idx = TelegramMessagesIDX(
        reply_markup=reply_markup_message_id,
        main_message=main_message_id,
        voice_message=voice_message_id[0] if len(voice_message_id) else 0,
        photos=photo_messages_idx,
        videos=video_messages_idx,
    )
    updated_request = RequestForHelpUpdate(
        device=device,
        message_text=message_text or "",
        message_file=voice_media_file,
        photos=photos_media_file,
        videos=videos_media_file,
        accept_url=accept_url,
        telegram_messages_idx=telegram_messages_idx,
    )

    try:
        crud.update_request_for_help(
            session=session,
            db_request=new_request,
            request_in=updated_request,
        )
    except Exception as e:
        await help_request_error.error_exception(
            session=session,
            request=new_request,
            delete_messages=[
                main_message_id,
                *voice_message_id,
                *photo_messages_idx,
                *video_messages_idx,
                reply_markup_message_id,
            ],
            request_folder=request_folder,
            message=f"Error in updating user's request: {e}",
        )

    csrf_token, signed_token = TokenHandlers.create_csrf_token(
        csrf_protect=csrf_protect
    )
    response = JSONResponse(
        content={
            "message": f"Отличные новости! 🎉<br/> Ваша заявка <b>#{new_request.id}</b> успешно создана и уже в работе. Вы всегда можете найти её в разделе <b>«Ваши заявки»</b>.",
            settings.CSRF_TOKEN_KEY: csrf_token,
        },
        status_code=201,
    )
    csrf_protect.set_csrf_cookie(signed_token, response)

    # Set cookie for user authorize
    new_access_token = TokenHandlers.create_jwt_token(user=user_candidate)
    response.set_cookie(
        key=settings.AUTH_TOKEN_KEY,
        value=new_access_token,
        secure=True,
        httponly=True,
        path="/",
        max_age=60 * 60 * 24 * 30,
        samesite="none",
    )

    return response
