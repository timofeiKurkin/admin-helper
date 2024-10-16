from typing import Annotated, BinaryIO
from uuid import uuid4

import ffmpeg
from fastapi import APIRouter, Form, HTTPException
from PIL import Image
from telegram import Bot, InputMediaPhoto

from app import crud, utils
from app.api.deps import SessionDep
from app.core.config import TEMPORARY_FOLDER, settings
from app.models import RequestForHelpData, RequestForHelpPublic, UserCreate

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


@router.post("/create_request", response_model=RequestForHelpPublic)
async def create_help_request(
    session: SessionDep, request_in: Annotated[RequestForHelpData, Form()]
):
    print("data: ", request_in)
    return {"user": request_in}

    # user_candidate = crud.get_user_by_phone(
    #     session=session, phone=request_in.phone_number
    # )

    # if not user_candidate:
    #     user_create = UserCreate.model_validate(request_in)
    #     user_candidate = crud.create_user(session=session, user_create=user_create)

    # if not os.path.exists(TEMPORARY_FOLDER):
    #     os.makedirs(TEMPORARY_FOLDER)

    # user_message = (
    #     f"\nСообщение пользователя: {request_in.message_text}"
    #     if request_in.message_text
    #     else ""
    # )

    # text_message = (
    #     "Новая заявка о технической помощи \n\n"
    #     + "Информация о пользователе:\n"
    #     + f"Имя пользователя: {request_in.name}\n"
    #     + f"Номер телефона: {request_in.phone_number}\n"
    #     + f"Организация: {request_in.company}\n"
    #     + f"Номер компьютера в AnyDesk: {request_in.number_pc}\n\n"
    #     + "Информация о проблеме пользователя:\n"
    #     + f"Проблемное устройство: {request_in.device} {user_message}"
    # )

    # message = await bot.send_message(
    #     settings.GROUP_ID, text_message, parse_mode="HTML", connect_timeout=100
    # )
    # message_id = message.message_id

    # if message_id:
    #     if not user_message and request_in.message_file:
    #         input_filename = os.path.join(TEMPORARY_FOLDER, f"{uuid4()}.mp3")
    #         output_filename = os.path.join(TEMPORARY_FOLDER, f"{uuid4()}.ogg")

    #         with open(input_filename, "wb") as f:
    #             f.write(await request_in.message_file.read())

    #         try:
    #             ffmpeg.input(input_filename).output(
    #                 output_filename, codec="libopus", bitrate="64k"
    #             ).run()
    #         except ffmpeg.Error as e:
    #             raise HTTPException(
    #                 status_code=500, detail=f"Conversion failed: {e.stderr}"
    #             )
    #         finally:
    #             os.remove(input_filename)

    #         with open(output_filename, "rb") as f:
    #             audio = f.read()

    #         await bot.send_voice(
    #             chat_id=settings.GROUP_ID,
    #             voice=InputFile(obj=audio, filename=output_filename),
    #             reply_parameters=ReplyParameters(
    #                 message_id=message_id, chat_id=settings.GROUP_ID
    #             ),
    #             connect_timeout=100,
    #         )
    #         os.remove(output_filename)

    #     if request_in.photo:
    #         photos = []

    #         for photo in request_in.photo:
    #             compressed_image = utils.compress_image(
    #                 file=photo.file, filename=photo.filename, quality=85
    #             )
    #             photos.append(compressed_image)

    #         response = await bot.send_media_group(
    #             chat_id=settings.GROUP_ID,
    #             media=photos,
    #             reply_parameters=ReplyParameters(
    #                 message_id=message_id, chat_id=settings.GROUP_ID
    #             ),
    #             connect_timeout=100,
    #         )
    #         print(f"{response=}")

    #     if request_in.video:
    #         print("there're videos")

    # return {"message_id": message_id}
