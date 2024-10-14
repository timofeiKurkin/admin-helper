import os
from typing import Annotated
from uuid import uuid4

import ffmpeg
from fastapi import APIRouter, Form, HTTPException, UploadFile
from pydantic import BaseModel
from telegram import Bot, InputFile, InputMediaPhoto, ReplyParameters

from app.core.config import BASE_DIR, TEMPORARY_FOLDER, settings

router = APIRouter()
bot = Bot(settings.BOT_TOKEN)


def escapingCharacters(data: str) -> str:
    specialChars = [
        "_",
        "*",
        "[",
        "]",
        "(",
        ")",
        "~",
        "`",
        ">",
        "#",
        "+",
        "-",
        "=",
        "|",
        "{",
        "}",
        ".",
        "!",
    ]
    return ""


@router.get("/")
async def root():
    return {"message": "Hello, this is a help request router"}


@router.get("/image/{image_id}")
async def get_image(image_id: str):
    pass


@router.get("/video/{video_id}")
async def get_video(video_id: str):
    pass


class FormData(BaseModel):
    device: str
    message_file: UploadFile | None = None
    message_text: str | None = None
    photo: list[UploadFile] | None = None
    video: list[UploadFile] | None = None

    name: str
    company: str
    phone_number: str
    number_pc: str


@router.post("/create_request")
async def create_help_request(user_request: Annotated[FormData, Form()]):
    if not os.path.exists(TEMPORARY_FOLDER):
        os.makedirs(TEMPORARY_FOLDER)

    user_message = (
        f"\nСообщение пользователя: {user_request.message_text}"
        if user_request.message_text
        else ""
    )

    text_message = (
        "Новая заявка о технической помощи \n\n"
        + "Информация о пользователе:\n"
        + f"Имя пользователя: {user_request.name}\n"
        + f"Номер телефона: {user_request.phone_number}\n"
        + f"Организация: {user_request.company}\n"
        + f"Номер компьютера в AnyDesk: {user_request.number_pc}\n\n"
        + "Информация о проблеме пользователя:\n"
        + f"Проблемное устройство: {user_request.device} {user_message}"
    )

    message = await bot.send_message(
        settings.GROUP_ID, text_message, parse_mode="HTML", connect_timeout=100
    )
    message_id = message.message_id

    if message_id:
        if not user_message and user_request.message_file:
            input_filename = os.path.join(TEMPORARY_FOLDER, f"{uuid4()}.mp3")
            output_filename = os.path.join(TEMPORARY_FOLDER, f"{uuid4()}.ogg")

            with open(input_filename, "wb") as f:
                f.write(await user_request.message_file.read())

            try:
                ffmpeg.input(input_filename).output(
                    output_filename, codec="libopus", bitrate="64k"
                ).run()
            except ffmpeg.Error as e:
                raise HTTPException(
                    status_code=500, detail=f"Conversion failed: {e.stderr}"
                )
            finally:
                os.remove(input_filename)

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
            os.remove(output_filename)

        if user_request.photo:
            photos = [
                InputMediaPhoto(
                    media=await photo.read(),
                    filename=photo.filename,
                    caption=f"Фотография пользователя {photo.filename}",
                )
                for photo in user_request.photo
            ]
            await bot.send_media_group(
                chat_id=settings.GROUP_ID,
                media=photos,
                reply_parameters=ReplyParameters(
                    message_id=message_id, chat_id=settings.GROUP_ID
                ),
                connect_timeout=100,
            )

        if user_request.video:
            print("there're videos")

    return {"message_id": message_id}
