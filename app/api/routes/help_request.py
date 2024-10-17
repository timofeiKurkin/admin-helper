import os
from typing import Annotated
from uuid import uuid4

import ffmpeg
from fastapi import APIRouter, Form, HTTPException
from telegram import Bot, InputFile, ReplyParameters

from app import crud, utils
from app.api.deps import SessionDep
from app.core.config import TEMPORARY_FOLDER, USER_REQUESTS_FOLDER, settings
from app.models import (
    RequestForHelp,
    RequestForHelpCreate,
    RequestForHelpData,
    UserCreate,
)

router = APIRouter()
bot = Bot(settings.BOT_TOKEN)


@router.get("/")
async def root():
    return {"message": "Hello, this is a help request router"}


@router.get("/image/{image_id}")
async def get_image(image_id: str):
    pass


@router.get("/video/{video_id}")
async def get_video(video_id: str):
    pass


@router.post("/create_request")
async def create_help_request(
    session: SessionDep, request_in: Annotated[RequestForHelpData, Form()]
):
    if not os.path.exists(TEMPORARY_FOLDER):
        os.makedirs(TEMPORARY_FOLDER)
    if not os.path.exists(USER_REQUESTS_FOLDER):
        os.makedirs(USER_REQUESTS_FOLDER)

    formatted_db_phone = "".join(filter(str.isdigit, request_in.phone))[1:]
    user_candidate = crud.get_user_by_phone(session=session, phone=formatted_db_phone)
    user_folder = ""

    # Create new user, if doesn't exist
    if not user_candidate:
        user_create = UserCreate.model_validate(
            request_in, update={"phone": formatted_db_phone}
        )
        user_candidate = crud.create_user(session=session, user_create=user_create)

        user_folder = os.path.join(
            USER_REQUESTS_FOLDER, str(user_candidate.id), "requests"
        )
        if not os.path.exists(user_folder):
            os.makedirs(user_folder)

    if not user_folder:
        user_folder = os.path.join(
            USER_REQUESTS_FOLDER, str(user_candidate.id), "requests"
        )

    # User(is_superuser=False, name='Timofey', phone='9232343434', company='OOO PromElectro', id=UUID('bd6f05b7-1c91-475e-9749-f45843c0895e'))
    # print(f"2. {user_candidate=}")

    # Create data base model
    # RequestForHelpCreate(device='Computer', message='', photos=[], videos=[], is_completed=False)
    new_request_for_help = RequestForHelpCreate.model_validate(
        request_in,
        # update={
        #     "message": "",
        #     "photos": [],
        #     "videos": [],
        #     "is_completed": False,
        #     "owner_id": user_candidate.id,
        # },
    )
    # request_data: RequestForHelp = {}
    request_index = crud.get_last_request_index(session=session)
    last_index = request_index if request_index == 1 else request_index + 1

    user_message = (
        f"\nСообщение пользователя: {request_in.message_text}"
        if request_in.message_text
        else ""
    )

    telegram_text_message = (
        f"Новая заявка о технической помощи - №{last_index}\n\n"
        + "Информация о пользователе:\n"
        + f"    Имя пользователя: {request_in.name}\n"
        + f"    Номер телефона: {request_in.phone}\n"
        + f"    Организация: {request_in.company}\n"
        + f"    Номер компьютера в AnyDesk: {request_in.number_pc}\n\n"
        + "Информация о проблеме пользователя:\n"
        + f"    Проблемное устройство: {request_in.device} {user_message}"
    )

    message = await bot.send_message(
        settings.GROUP_ID, telegram_text_message, parse_mode="HTML", connect_timeout=100
    )
    message_id = message.message_id

    if message_id:
        request_folder = os.path.join(user_folder, f"request_{last_index}")
        if not os.path.exists(os.makedirs(request_folder)):
            os.makedirs(request_folder)
        print(f"{request_folder=}")

        print(not user_message and request_in.message_file)

        # Voice message sending to the telegram
        if not user_message and request_in.message_file:
            input_filename = os.path.join(TEMPORARY_FOLDER, f"{uuid4()}.mp3")
            print(f"{input_filename=}")
            output_filename = os.path.join(request_folder, "voice.ogg")
            print(f"{output_filename=}")

            # Save .mp3 file in the temporary folder
            with open(input_filename, "wb") as f:
                f.write(await request_in.message_file.read())

            # Save .mp3 file to .ogg file with current codec for telegram
            try:
                ffmpeg.input(input_filename).output(
                    output_filename, codec="libopus", bitrate="64k"
                ).run()
            except ffmpeg.Error as e:
                raise HTTPException(
                    status_code=500, detail=f"Conversion failed: {e.stderr}"
                )
            finally:
                os.remove(input_filename)  # Delete temporary file

            # Open new .ogg audio file
            with open(output_filename, "rb") as f:
                audio = f.read()

            await bot.send_voice(
                chat_id=settings.GROUP_ID,
                voice=InputFile(obj=audio, filename=output_filename),
                reply_parameters=ReplyParameters(
                    message_id=message_id, chat_id=settings.GROUP_ID
                ),
                connect_timeout=100,
            )

        # Photos sending to the telegram
        if request_in.photo:
            photos = []

            for photo in request_in.photo:
                photo_name = uuid4()

                # Compress photo
                compressed_image = utils.compress_image(
                    file=photo.file, filename=photo_name, quality=85
                )

                # Save photo to user's folder
                photo_path = os.path.join(user_folder, photo_name)
                # utils.save_image(
                #     image=compressed_image.media,
                #     path=photo_path,
                # )
                photos.append(compressed_image)

            photo_response = await bot.send_media_group(
                chat_id=settings.GROUP_ID,
                media=photos,
                reply_parameters=ReplyParameters(
                    message_id=message_id, chat_id=settings.GROUP_ID
                ),
                connect_timeout=100,
            )
            print(f"{photo_response=}")

    #     if request_in.video:
    #         print("there're videos")

    return {"message": "ok"}
