import logging
import os
import shutil
from datetime import datetime, timedelta
from typing import Annotated, Any, List, Optional
from uuid import uuid4

from fastapi import APIRouter, File, Form, HTTPException, Request, UploadFile
from fastapi.responses import HTMLResponse, JSONResponse
from telegram import (
    Bot,
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    InputFile,
    InputMediaPhoto,
    InputMediaVideo,
    ReplyParameters,
)
from telegram.error import TelegramError
from telegram.request import HTTPXRequest

from app import crud, utils
from app.api.deps import SessionDep
from app.auth.token import create_just_token
from app.core.config import TEMPORARY_FOLDER, USER_REQUESTS_FOLDER, settings
from app.models import (
    ChangeRequestStatus,
    MediaFile,
    RequestForHelpCreate,
    RequestForHelpPublic,
    User,
    UserCreate,
)
from app.telegram_bot import utils as telegram_utils

router = APIRouter()
bot = Bot(
    token=settings.BOT_TOKEN,
    base_url="http://localhost:8081/bot",
    request=HTTPXRequest(
        connection_pool_size=100,
        read_timeout=180,
        write_timeout=180,
        connect_timeout=60,
        pool_timeout=120,
    ),
)
telegram_timeout_time = 120


@router.get("/")
async def root():
    return {"message": "Hello, this is a help request router"}


@router.get("/image/{image_id}")
async def get_image(image_id: str):
    pass


@router.get("/video/{video_id}")
async def get_video(video_id: str):
    pass


@router.get("/help_request?{request_id}", response_model=RequestForHelpPublic)
def get_help_request(request_id: int, request: Request):
    pass


@router.get("/help_request/show/{request_id}", response_class=HTMLResponse)
async def show_request(request_id: str):
    pass


@router.post("/help_request/change_request_status")
async def change_request_status(update_request: ChangeRequestStatus):
    button_message_id: int = 0
    keyboard = [
        [
            InlineKeyboardButton(
                text=f"Заявка #{123} выполнена",
            )
        ]
    ]
    reply_markup = InlineKeyboardMarkup(inline_keyboard=keyboard)
    await bot.edit_message_reply_markup(
        chat_id=settings.GROUP_ID,
        message_id=button_message_id,
        reply_markup=reply_markup,
    )


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
    try:
        if not os.path.exists(TEMPORARY_FOLDER):
            os.makedirs(TEMPORARY_FOLDER)
        if not os.path.exists(USER_REQUESTS_FOLDER):
            os.makedirs(USER_REQUESTS_FOLDER)

        message_id = 0
        audio_message_id = 0
        photo_message_ids = []
        video_message_ids = []

        formatted_db_phone = "".join(filter(str.isdigit, phone))[1:]
        user_candidate = crud.get_user_by_phone(
            session=session, phone=formatted_db_phone
        )
        user_folder = ""  # Folder where are saving each request and its files

        # Create new user, if doesn't exist
        if not user_candidate:
            result = create_new_user(
                session=session,
                formatted_db_phone=formatted_db_phone,
                company=company,
                name=name,
            )
            user_candidate: User = result["user_candidate"]
            user_folder: str = result["user_folder"]

        if not user_folder:
            user_folder = os.path.join(
                USER_REQUESTS_FOLDER, str(user_candidate.id), "requests"
            )

        # Define the last index of the requests in Data Base
        new_request = crud.create_request_for_help(
            session=session,
            request_in=RequestForHelpCreate(device=""),
            owner_id=user_candidate.id,
        )
        # request_index = crud.get_last_request_index(session=session)
        last_index = new_request.id

        telegram_text_message = telegram_utils.get_finally_message(
            last_index=last_index,
            name=name,
            phone=phone,
            company=company,
            number_pc=number_pc,
            device=device,
            message_text=message_text,
        )

        try:
            message = await bot.send_message(
                settings.GROUP_ID,
                telegram_text_message,
                parse_mode="HTML",
            )
        except TelegramError as e:
            logging.error(f"Failed to send message to Telegram: {e}")
            raise HTTPException(
                status_code=504,
                detail=f"Failed to send client's message to Telegram. Error: {e}",
            )
        except Exception as e:
            logging.error(f"Unexpected error occurred: {e}")
            raise HTTPException(
                status_code=500,
                detail=f"Unexpected error occurred: {e}",
            )

        message_id = message.message_id
        voice_media_file = MediaFile(id=0, file_path="", file_id="")
        photos_media_file = []
        videos_media_file = []

        if message_file or photo or video:
            request_folder = utils.create_request_folder(
                user_folder=user_folder, last_index=last_index
            )

            # Voice message sending to the telegram
            if message_file:
                try:
                    audio_name = str(uuid4())
                    input_voice = os.path.join(TEMPORARY_FOLDER, f"{audio_name}.mp3")
                    # Save .mp3 file in the temporary folder
                    with open(input_voice, "wb") as f:
                        f.write(await message_file.read())
                    output_voice_file = f"{audio_name}.ogg"
                    output_voice = os.path.join(request_folder, output_voice_file)
                    converted_audio = utils.convert_and_save_audio(
                        input_voice=input_voice, output_voice=output_voice
                    )
                    response = await message.reply_voice(
                        voice=InputFile(obj=converted_audio, filename=audio_name),
                        connect_timeout=telegram_timeout_time,
                    )
                    audio_message_id = response.message_id
                    voice_media_file = MediaFile(
                        id=0,
                        file_path=output_voice_file,
                        file_id=response.voice.file_id,
                    )  # response.voice.file_id - Identifier for this file, which can be used to download or reuse the file
                except TelegramError as e:
                    error = f"Failed to send voice message to Telegram: {e}"
                    logging.error(error)
                    raise HTTPException(status_code=504, detail=error)
                except Exception as e:
                    logging.error(f"Unexpected error occurred: {e}")
                    raise HTTPException(
                        status_code=500,
                        detail=f"Unexpected error occurred: {e}",
                    )

            # Photos sending to the telegram
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
                        media=photos_compressed,
                        connect_timeout=telegram_timeout_time,
                    )
                    photo_message_ids = []
                    for index, item in enumerate(photo_response):
                        photo_message_ids.append(item.message_id)
                        photos_media_file.append(
                            MediaFile(
                                id=index,
                                file_path=f"{item.caption}.jpeg",
                                file_id=item.photo[-1].file_id,
                            )
                        )
                except TelegramError as e:
                    error = f"Failed to send photos to Telegram: {e}"
                    logging.error(error)
                    raise HTTPException(status_code=504, detail=error)
                except Exception as e:
                    logging.error(f"Unexpected error occurred: {e}")
                    raise HTTPException(
                        status_code=500,
                        detail=f"Unexpected error occurred: {e}",
                    )

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
                    video_message_ids = []
                    for index, item in enumerate(video_response):
                        video_message_ids.append(item.message_id)
                        videos_media_file.append(
                            MediaFile(
                                id=index,
                                file_path=video_file,
                                file_id=item.video.file_id,
                            )
                        )
                except TelegramError as e:
                    error = f"Failed to send videos to Telegram: {e}"
                    logging.error(error)
                    raise HTTPException(status_code=504, detail=error)
                except Exception as e:
                    logging.error(f"Unexpected error occurred: {e}")
                    raise HTTPException(
                        status_code=500,
                        detail=f"Unexpected error occurred: {e}",
                    )

        keyboard = [
            [
                InlineKeyboardButton(
                    text=f'Поменять статус заявки #{new_request.id} на "Выполнено"',
                    callback_data=f"request:{new_request.id}",
                    url="https://google.com",
                )
            ]
        ]
        reply_markup = InlineKeyboardMarkup(inline_keyboard=keyboard)
        await bot.send_message(
            settings.GROUP_ID,
            "Изменить статус выполнения заявки:",
            parse_mode="HTML",
            connect_timeout=100,
            reply_parameters=ReplyParameters(
                message_id=message_id, chat_id=settings.GROUP_ID
            ),
            reply_markup=reply_markup,
        )

        # Create data base model
        new_request_for_help = RequestForHelpCreate(
            device=device,
            message_text=message_text or "",
            message_file=voice_media_file,
            photos=photos_media_file,
            videos=videos_media_file,
        )
        crud.update_request_for_help(
            session=session,
            db_request=new_request,
            request_in=new_request_for_help,
        )

        # return RequestForHelpPublic.model_validate(new_request)
        request_public = RequestForHelpPublic.model_validate(
            new_request,
            update={
                "message": f"Ваша заявка <b>#{new_request.id}</b> успешно создана и будет рассмотрена в ближайшее время.<br/>Вы можете посмотреть её в <b>ваших заявках</b>.",
                "created_at": new_request.created_at.strftime(
                    settings.PUBLIC_TIME_FORMAT
                ),
            },
        )

        response = JSONResponse(content={**request_public.to_dict()}, status_code=200)
        new_access_token = create_just_token(user=user_candidate)
        response.set_cookie(
            key="token",
            value=new_access_token,
            secure=True,
            httponly=True,
            path="/",
            expires=datetime.now() + timedelta(days=30),
        )

        return response

    except Exception as e:
        # if new_request:
        #     crud.delete_user_request(session=session, db_request=new_request)

        # if os.path.exists(request_folder):
        #     shutil.rmtree(request_folder)

        # if message_id:
        #     message_ids = [message_id]
        #     for id in [audio_message_id, *photo_message_ids, *video_message_ids]:
        #         if id:
        #             message_ids.append(id)
        #     await bot.delete_messages(
        #         chat_id=settings.GROUP_ID, message_ids=message_ids
        #     )

        raise HTTPException(status_code=500, detail=f"There's an error: {e}")
