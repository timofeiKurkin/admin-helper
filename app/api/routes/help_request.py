import os
import secrets
import shutil
from typing import Annotated, List, Optional, Tuple
from uuid import uuid4

from fastapi import APIRouter, File, Form, HTTPException, Request, UploadFile
from fastapi.responses import JSONResponse
from telegram import (
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    InputMediaPhoto,
    InputMediaVideo,
    ReplyParameters,
)
from telegram.error import TelegramError

from app import crud, utils
from app.api.deps import SessionDep
from app.api.error_handlers import help_request as help_request_error
from app.api.func.help_request import help_request as help_request_func
from app.auth import token as JWTToken
from app.core.config import TEMPORARY_FOLDER, USER_REQUESTS_FOLDER, settings
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

router = APIRouter()
telegram_timeout_time = 120
chat_id = settings.GROUP_ID


@router.get("/")
async def root():
    return {"message": "Hello, this is a help request router"}


@router.get(
    "/get_user_requests",
    response_model=List[RequestForHelpPublic],
)
async def get_user_requests(
    *, preview: bool = True, request: Request, session: SessionDep
):
    user_token = request.cookies.get("token")

    if not user_token:
        raise HTTPException(status_code=403, detail="Authorization cookie not found")

    user_payload = JWTToken.decode_token(token=user_token)
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
    user_public_requests = [
        RequestForHelpPublic.model_validate(
            user_request,
            update={
                "created_at": user_request.created_at.strftime(
                    settings.PUBLIC_TIME_FORMAT
                )
            },
        )
        for user_request in user_requests
    ]

    if preview:
        return user_public_requests[:8]
        # TODO: if count of requests less or equal to 8, add status in response object to show client he can't get more requests
    else:
        return user_public_requests


def create_new_user(
    *, session: SessionDep, formatted_db_phone: str, company: str, name: str
) -> Tuple[User, str]:
    user_create = UserCreate(
        phone=formatted_db_phone, company=company, is_superuser=False, name=name
    )
    user_candidate = crud.create_user(session=session, user_create=user_create)

    user_folder = os.path.join(USER_REQUESTS_FOLDER, str(user_candidate.id), "requests")
    if not os.path.exists(user_folder):
        os.makedirs(user_folder)

    return (user_candidate, user_folder)


@router.post("/create_request")  # response_model=RequestForHelpPublic
async def create_help_request(
    session: SessionDep,
    device: Annotated[str, Form()],
    name: Annotated[str, Form()],
    company: Annotated[str, Form()],
    phone: Annotated[str, Form()],
    number_pc: Annotated[str, Form()],
    message_text: Annotated[Optional[str], Form()] = None,
    message_file: Annotated[Optional[UploadFile], File()] = None,
    photo: Annotated[Optional[List[UploadFile]], File()] = None,
    video: Annotated[Optional[List[UploadFile]], File()] = None,
):
    if not os.path.exists(TEMPORARY_FOLDER):
        os.makedirs(TEMPORARY_FOLDER)
    if not os.path.exists(USER_REQUESTS_FOLDER):
        os.makedirs(USER_REQUESTS_FOLDER)

    formatted_db_phone = "".join(filter(str.isdigit, phone))[1:]
    user_candidate: Optional[User] = crud.get_user_by_phone(
        session=session, phone=formatted_db_phone
    )
    user_folder: str = ""  # Folder where are saving each request and its files

    # Create new user, if doesn't exist
    if user_candidate is None:
        try:
            result = create_new_user(
                session=session,
                formatted_db_phone=formatted_db_phone,
                company=company,
                name=name,
            )
            created_user: User = result[0]
            user_candidate = created_user

            created_folder: str = result[1]
            user_folder = created_folder
        except Exception as e:
            help_request_error.visible_error(f"Error in creating user: {e}")

    assert user_candidate is not None
    if not user_folder:
        user_folder = os.path.join(
            USER_REQUESTS_FOLDER, str(user_candidate.id), "requests"
        )

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
    last_index = new_request.id or 0

    # Trying to send the main message to which the others message will be linked (replied)
    try:
        telegram_text_message = telegram_utils.get_finally_message(
            last_index=last_index,
            name=name,
            phone=phone,
            company=company,
            number_pc=int(number_pc),
            device=device,
            message_text=message_text or "",
        )
        main_message = await bot_api.send_message(
            chat_id=chat_id,
            text=telegram_text_message,
            parse_mode="HTML",
        )
    except TelegramError as e:
        crud.delete_user_request(session=session, db_request=new_request)
        help_request_error.visible_error(f"Failed to send message to Telegram: {e}")

    main_message_id = main_message.message_id

    voice_media_file = MediaFile(id=0, file_path="", file_id="")
    photos_media_file = []
    videos_media_file = []

    if message_file or photo or video:
        request_folder = utils.create_request_folder(
            user_folder=user_folder, last_index=last_index
        )
        voice_message_id: List[int] = []
        photo_messages_idx: List[int] = []
        video_messages_idx: List[int] = []

        # Uploading voice message to telegram
        if message_file:
            try:
                (voice, output_voice_file) = await help_request_func.send_voice_message(
                    main_message=main_message,
                    message_file=message_file,
                    request_folder=request_folder,
                )

                voice_message_id.append(voice.message_id)
                if voice.voice:
                    voice_media_file = MediaFile(
                        id=0,
                        file_path=output_voice_file,
                        file_id=voice.voice.file_id,
                    )  # response.voice.file_id - Identifier for this file, which can be used to download or reuse the file
            except Exception as e:
                crud.delete_user_request(session=session, db_request=new_request)
                shutil.rmtree(request_folder)
                help_request_error.visible_error(
                    f"Failed to send voice message to Telegram: {e}"
                )

        # Uploading photo to telegram
        if photo and len(photo):
            try:
                photos_compressed: List[InputMediaPhoto] = []
                for photo_item in photo:
                    photo_name = str(uuid4())
                    photo_path = os.path.join(request_folder, f"{photo_name}.jpeg")

                    # Compress and save image to request folder
                    buffer = utils.compress_and_save_image(
                        file=photo_item.file,
                        quality=85,
                        path=photo_path,
                    )

                    compressed_image = InputMediaPhoto(
                        media=buffer,
                        filename=photo_name,
                        caption=photo_name,
                    )

                    photos_compressed.append(compressed_image)

                if len(photos_compressed):
                    photo_response = await main_message.reply_media_group(
                        media=photos_compressed, connect_timeout=telegram_timeout_time
                    )
                    for index, item in enumerate(photo_response):
                        photo_messages_idx.append(item.message_id)
                        photos_media_file.append(
                            MediaFile(
                                id=index,
                                file_path=f"{item.caption}.jpeg",
                                file_id=item.photo[-1].file_id,
                            )
                        )

            except Exception as e:
                shutil.rmtree(request_folder)
                crud.delete_user_request(session=session, db_request=new_request)
                await bot_api.delete_messages(
                    chat_id=chat_id,
                    message_ids=[main_message_id, *voice_message_id],
                )
                help_request_error.visible_error(
                    f"There's an exception during sending photos to Telegram: {e}"
                )

        # Uploading video to telegram
        if video:
            try:
                video_compressed = []
                for index, video_item in enumerate(video):
                    video_name = str(uuid4())
                    video_file = f"{video_name}.mp4"
                    input_temporary = os.path.join(TEMPORARY_FOLDER, video_file)
                    output_video_path = os.path.join(request_folder, video_file)

                    # Create temporary video file
                    with open(input_temporary, "wb") as f:
                        f.write(await video_item.read())

                    compressed_video = utils.compress_and_save_video(
                        input_file=input_temporary, output_file=output_video_path
                    )
                    video_compressed.append(
                        InputMediaVideo(
                            media=compressed_video,
                            caption=video_name,
                            filename=video_file,
                        )
                    )

                if len(video_compressed):
                    video_response = await main_message.reply_media_group(
                        media=video_compressed,
                        read_timeout=telegram_timeout_time,
                        connect_timeout=telegram_timeout_time,
                        pool_timeout=300,
                    )
                    for index, item in enumerate(video_response):
                        video_messages_idx.append(item.message_id)
                        if item.video:
                            videos_media_file.append(
                                MediaFile(
                                    id=index,
                                    file_path=video_file,
                                    file_id=item.video.file_id,
                                )
                            )

            except Exception as e:
                shutil.rmtree(request_folder)
                crud.delete_user_request(session=session, db_request=new_request)
                await bot_api.delete_messages(
                    chat_id=chat_id,
                    message_ids=[
                        main_message_id,
                        *voice_message_id,
                        *photo_messages_idx,
                    ],
                )
                help_request_error.visible_error(
                    f"Failed to send videos to Telegram: {e}"
                )

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
    except TelegramError as e:
        help_request_error.visible_error(f"Failed to send reply_markup message: {e}")

    reply_markup_message_id: int = reply_markup_message.message_id

    # Create data base model
    new_request_for_help = RequestForHelpUpdate(
        device=device,
        message_text=message_text or "",
        message_file=voice_media_file,
        photos=photos_media_file,
        videos=videos_media_file,
        accept_url=accept_url,
        telegram_messages_idx=TelegramMessagesIDX(
            reply_markup=reply_markup_message_id
        ),  # Saving message id to change them, when operator complete the help request
    )

    try:
        crud.update_request_for_help(
            session=session,
            db_request=new_request,
            request_in=new_request_for_help,
        )
    except Exception as e:
        shutil.rmtree(request_folder)
        crud.delete_user_request(session=session, db_request=new_request)
        await bot_api.delete_messages(
            chat_id=chat_id,
            message_ids=[
                main_message_id,
                *voice_message_id,
                *photo_messages_idx,
                *video_messages_idx,
            ],
        )
        help_request_error.visible_error(f"Error in updating user's request: {e}")

    # return RequestForHelpPublic.model_validate(new_request)
    request_public = RequestForHelpPublic.model_validate(
        new_request,
        update={
            "created_at": new_request.created_at.strftime(settings.PUBLIC_TIME_FORMAT),
        },
    )

    response = JSONResponse(
        content={
            "message": f"Ваша заявка <b>#{new_request.id}</b> успешно создана и будет рассмотрена в ближайшее время.<br/>Вы можете посмотреть её в <b>ваших заявках</b>.",
            "new_request": {**request_public.to_dict()},
        },
        status_code=201,
    )

    new_access_token = JWTToken.create_just_token(user=user_candidate)
    response.set_cookie(
        key="token",
        value=new_access_token,
        secure=True,
        httponly=True,
        path="/",
        max_age=60 * 60 * 24 * 30,
    )

    return response
