import os
from typing import Annotated, List, Optional
from uuid import uuid4

import ffmpeg
from fastapi import APIRouter, Form, HTTPException, UploadFile
from pydantic import BaseModel
from telegram import Bot, InputFile, ReplyParameters

from app.core.config import settings

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
    temporary_folder = ""
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

    message = await bot.send_message(settings.GROUP_ID, text_message, parse_mode="HTML")
    message_id = message.message_id

    if message_id:
        if not user_message and user_request.message_file:
            input_filename = f"{uuid4()}.mp3"
            output_filename = f"{uuid4()}.ogg"

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
                data = f.read()

            await bot.send_voice(
                chat_id=settings.GROUP_ID,
                voice=InputFile(obj=data, filename=output_filename),
                reply_parameters=ReplyParameters(
                    message_id=message_id, chat_id=settings.GROUP_ID
                ),
            )

        if user_request.photo:
            print("there're photos")

        if user_request.video:
            print("there're videos")

    os.remove(output_filename)
    return {"message_id": message_id}
    # You can return a dict, list, singular values as str, int, etc.
