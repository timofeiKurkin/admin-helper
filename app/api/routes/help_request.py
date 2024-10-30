import logging
import os
import secrets
import shutil
from typing import Annotated, Any, List, Optional
from uuid import uuid4

from fastapi import APIRouter, File, Form, HTTPException, Request, UploadFile
from fastapi.responses import JSONResponse
from telegram import (
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    InputFile,
    InputMediaPhoto,
    InputMediaVideo,
)
from telegram.error import TelegramError

from app import crud, utils
from app.api.deps import SessionDep
from app.auth import token as JWTToken
from app.core.config import TEMPORARY_FOLDER, USER_REQUESTS_FOLDER, settings
from app.models import (
    MediaFile,
    RequestForHelpCreate,
    RequestForHelpPublic,
    TelegramMessagesIDX,
    User,
    UserCreate,
)
from app.telegram_bot import utils as telegram_utils
from app.telegram_bot.bot import bot_api

router = APIRouter()
telegram_timeout_time = 120


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
) -> dict[str, Any]:
    user_create = UserCreate(
        phone=formatted_db_phone, company=company, is_superuser=False, name=name
    )
    user_candidate = crud.create_user(session=session, user_create=user_create)

    user_folder = os.path.join(USER_REQUESTS_FOLDER, str(user_candidate.id), "requests")
    if not os.path.exists(user_folder):
        os.makedirs(user_folder)

    return {"user_candidate": user_candidate, "user_folder": user_folder}


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
    user_candidate = crud.get_user_by_phone(session=session, phone=formatted_db_phone)
    user_folder = ""  # Folder where are saving each request and its files

    # Create new user, if doesn't exist
    try:
        if not user_candidate:
            result = create_new_user(
                session=session,
                formatted_db_phone=formatted_db_phone,
                company=company,
                name=name,
            )
            user_candidate: User = result["user_candidate"]
            user_folder: str = result["user_folder"]
    except Exception as e:
        logging.error(f"Error in creating user: {e}")
        raise HTTPException(status_code=504, detail=f"Error in creating user: {e}")

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
        error = f"Error in creating user's request: {e}"
        logging.error(error)
        raise HTTPException(status_code=501, detail=error)

    # request_index = crud.get_last_request_index(session=session)
    last_index = new_request.id

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
        telegram_text_message = telegram_utils.get_finally_message(
            last_index=last_index,
            name=name,
            phone=phone,
            company=company,
            number_pc=number_pc,
            device=device,
            message_text=message_text,
        )
        message = await bot_api.send_message(
            settings.GROUP_ID,
            telegram_text_message,
            parse_mode="HTML",
            reply_markup=reply_markup,
        )
    except TelegramError as e:
        crud.delete_user_request(session=session, db_request=new_request)
        logging.error(f"Failed to send message to Telegram: {e}")
        raise HTTPException(
            status_code=504,
            detail=f"Failed to send client's message to Telegram. Error: {e}",
        )

    main_message_id = message.message_id

    voice_media_file = MediaFile(id=0, file_path="", file_id="")
    photos_media_file = []
    videos_media_file = []

    if message_file or photo or video:
        request_folder = utils.create_request_folder(
            user_folder=user_folder, last_index=last_index
        )
        voice_message_id = []
        photo_messages_idx = []
        video_messages_idx = []

        # Uploading voice message to telegram
        if message_file:
            try:
                voice_name = str(uuid4())
                input_voice = os.path.join(TEMPORARY_FOLDER, f"{voice_name}.mp3")
                # Save .mp3 file in the temporary folder
                with open(input_voice, "wb") as f:
                    f.write(await message_file.read())
                output_voice_file = f"{voice_name}.ogg"
                output_voice = os.path.join(request_folder, output_voice_file)
                converted_audio = utils.convert_and_save_voice(
                    input_voice=input_voice, output_voice=output_voice
                )
                response = await message.reply_voice(
                    voice=InputFile(obj=converted_audio, filename=voice_name),
                    connect_timeout=telegram_timeout_time,
                )
                voice_message_id.append(response.message_id)
                voice_media_file = MediaFile(
                    id=0,
                    file_path=output_voice_file,
                    file_id=response.voice.file_id,
                )  # response.voice.file_id - Identifier for this file, which can be used to download or reuse the file
            except TelegramError as e:
                crud.delete_user_request(session=session, db_request=new_request)
                shutil.rmtree(request_folder)
                error = f"Failed to send voice message to Telegram: {e}"
                logging.error(error)
                raise HTTPException(status_code=504, detail=error)

        # Uploading photo to telegram
        if photo:
            try:
                photos_compressed: InputMediaPhoto = []
                for photo_item in photo:
                    photo_name = str(uuid4())
                    photo_path = os.path.join(request_folder, f"{photo_name}.jpeg")
                    # Compress photo
                    compressed_image = utils.compress_image(
                        file=photo_item.file, filename=photo_name, quality=85
                    )
                    # Save photo to user's folder
                    utils.save_image(
                        image=compressed_image.media,
                        path=photo_path,
                    )
                    photos_compressed.append(compressed_image)
                photo_response = await message.reply_media_group(
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
            except TelegramError as e:
                shutil.rmtree(request_folder)
                crud.delete_user_request(session=session, db_request=new_request)
                bot_api.delete_messages(
                    chat_id=settings.GROUP_ID,
                    message_id=[main_message_id, voice_message_id],
                )
                crud.delete_user_request(session=session, db_request=new_request)
                error = f"Failed to send photos to Telegram: {e}"
                logging.error(error)
                raise HTTPException(status_code=504, detail=error)

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
                video_response = await message.reply_media_group(
                    media=video_compressed,
                    read_timeout=telegram_timeout_time,
                    connect_timeout=telegram_timeout_time,
                    pool_timeout=300,
                )
                for index, item in enumerate(video_response):
                    video_messages_idx.append(item.message_id)
                    videos_media_file.append(
                        MediaFile(
                            id=index,
                            file_path=video_file,
                            file_id=item.video.file_id,
                        )
                    )
            except TelegramError as e:
                shutil.rmtree(request_folder)
                crud.delete_user_request(session=session, db_request=new_request)
                bot_api.delete_messages(
                    chat_id=settings.GROUP_ID,
                    message_ids=[
                        main_message_id,
                        voice_message_id,
                        *photo_messages_idx,
                    ],
                )
                crud.delete_user_request(session=session, db_request=new_request)
                error = f"Failed to send videos to Telegram: {e}"
                logging.error(error)
                raise HTTPException(status_code=504, detail=error)

    # Create data base model
    new_request_for_help = RequestForHelpCreate(
        device=device,
        message_text=message_text or "",
        message_file=voice_media_file,
        photos=photos_media_file,
        videos=videos_media_file,
        accept_url=accept_url,
        telegram_messages_idx=TelegramMessagesIDX(main_message=main_message_id),
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
        bot_api.delete_messages(
            chat_id=settings.GROUP_ID,
            message_ids=[
                main_message_id,
                voice_message_id,
                *photo_messages_idx,
                *video_messages_idx,
            ],
        )
        error = f"Error in updating user's request: {e}"
        logging.error(error)
        raise HTTPException(status_code=500, detail=error)

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
