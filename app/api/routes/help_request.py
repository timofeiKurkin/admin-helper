import os
from typing import Annotated, List, Optional
from uuid import uuid4

import ffmpeg
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from telegram import (
    Bot,
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    InputFile,
    InputMediaPhoto,
    InputMediaVideo,
    ReplyParameters,
)

from app import crud, utils
from app.api.deps import SessionDep
from app.core.config import TEMPORARY_FOLDER, USER_REQUESTS_FOLDER, settings
from app.models import (
    MediaFile,
    RequestForHelpCreate,
    RequestForHelpPublic,
    UserBase,
    UserCreate,
)
from app.telegram_bot import utils as telegram_utils

router = APIRouter()
bot = Bot(
    token=settings.BOT_TOKEN,
    base_url="http://localhost:8081/bot",
)


@router.get("/")
async def root():
    return {"message": "Hello, this is a help request router"}


@router.get("/image/{image_id}")
async def get_image(image_id: str):
    pass


@router.get("/video/{video_id}")
async def get_video(video_id: str):
    pass


@router.post(
    "/create_request", response_model=RequestForHelpPublic
)  # response_model=RequestForHelpPublic
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

        formatted_db_phone = "".join(filter(str.isdigit, phone))[1:]
        user_candidate = crud.get_user_by_phone(
            session=session, phone=formatted_db_phone
        )
        user_folder = ""  # Folder where are saving each request and its files

        # Create new user, if doesn't exist
        if not user_candidate:
            user = UserBase(phone=phone, company=company, is_superuser=False, name=name)
            user_create = UserCreate.model_validate(
                user, update={"phone": formatted_db_phone}
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

        # Define the last index of the requests in Data Base
        request_index = crud.get_last_request_index(session=session)
        last_index = request_index if request_index == 1 else request_index + 1

        user_message = (
            f"\n    Сообщение пользователя: {message_text}" if message_text else ""
        )

        telegram_text_message = telegram_utils.get_finally_message(
            last_index=last_index,
            name=name,
            phone=phone,
            company=company,
            number_pc=number_pc,
            device=device,
            user_message=user_message,
        )

        message = await bot.send_message(
            settings.GROUP_ID,
            telegram_text_message,
            parse_mode="HTML",
            # time=100,
        )
        message_id = message.message_id

        voice_media_file = MediaFile(id=0, file_path="", file_id="")
        photos_media_file = []
        videos_media_file = []

        if message_id:
            # Folder for current request where are saving requests files
            request_folder = os.path.join(user_folder, f"request_{last_index}")
            # Create if doesn't exist
            if not os.path.exists(request_folder):
                os.makedirs(request_folder)

            # Voice message sending to the telegram
            if not user_message and message_file:
                input_voice = os.path.join(TEMPORARY_FOLDER, f"{uuid4()}.mp3")
                output_voice = str(uuid4())
                output_voice_file = f"{output_voice}.ogg"
                output_voice_path = os.path.join(request_folder, output_voice_file)

                # Save .mp3 file in the temporary folder
                with open(input_voice, "wb") as f:
                    f.write(await message_file.read())

                # Read audio that was uploaded and save .mp3 file to .ogg file with current codec for telegram
                try:
                    ffmpeg.input(input_voice).output(
                        output_voice_path,
                        codec="libopus",
                        bitrate="64k",
                        loglevel="quiet",
                    ).run()
                except ffmpeg.Error as e:
                    raise HTTPException(
                        status_code=500, detail=f"Conversion failed: {e.stderr}"
                    )
                finally:
                    os.remove(input_voice)  # Delete temporary file

                # Open new .ogg audio file
                with open(output_voice_path, "rb") as f:
                    audio = f.read()

                response = await bot.send_voice(
                    chat_id=settings.GROUP_ID,
                    voice=InputFile(obj=audio, filename=output_voice),
                    reply_parameters=ReplyParameters(
                        message_id=message_id, chat_id=settings.GROUP_ID
                    ),
                    connect_timeout=100,
                )

                voice_media_file = MediaFile(
                    id=0, file_path=output_voice_file, file_id=response.voice.file_id
                )  # response.voice.file_id - Identifier for this file, which can be used to download or reuse the file

            # Photos sending to the telegram
            if photo:
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

                photo_response = await bot.send_media_group(
                    chat_id=settings.GROUP_ID,
                    media=photos_compressed,
                    reply_parameters=ReplyParameters(
                        message_id=message_id, chat_id=settings.GROUP_ID
                    ),
                    connect_timeout=100,
                )

                for index, item in enumerate(photo_response):
                    photos_media_file.append(
                        MediaFile(
                            id=index,
                            file_path=f"{item.caption}.jpeg",
                            file_id=item.photo[-1].file_id,
                        )
                    )

            if video:
                video_compressed = []

                for video_item in video:
                    # video_compressed.append(
                    #     InputMediaVideo(
                    #         media=await video_item.read(),
                    #         caption=video_item.filename,
                    #         filename=video_item.filename,
                    #     )
                    # )
                    video_name = str(uuid4())

                    input_temporary = os.path.join(
                        TEMPORARY_FOLDER, f"{video_name}.mp4"
                    )
                    output_videos_path = os.path.join(
                        request_folder, f"{video_name}.mp4"
                    )

                    with open(input_temporary, "wb") as f:
                        f.write(await video_item.read())
                    utils.compress_and_save_video(
                        input_file=input_temporary, output_file=output_videos_path
                    )

                    compressed_size = os.path.getsize(output_videos_path)
                    original_size = os.path.getsize(input_temporary)
                    compression_ratio = round(
                        (1 - (compressed_size / original_size)) * 100, 2
                    )

                    print(
                        f"{compressed_size=}",
                        f"{original_size=}",
                        f"{compression_ratio=}",
                    )

                # await bot.send_media_group(
                #     chat_id=settings.GROUP_ID,
                #     media=video_compressed,
                #     reply_parameters=ReplyParameters(
                #         message_id=message_id, chat_id=settings.GROUP_ID
                #     ),
                #     read_timeout=100,
                #     connect_timeout=100,
                #     pool_timeout=100,
                # )
        else:
            raise HTTPException(
                status_code=504, detail="Failed to send client's message to Telegram"
            )

        # Create data base model
        new_request_for_help = RequestForHelpCreate(
            device=device,
            message_text=message_text or "",
            message_file=voice_media_file,
            photos=photos_media_file,
            videos=videos_media_file,
        )
        new_request = crud.create_request_for_help(
            session=session, request_in=new_request_for_help, owner_id=user_candidate.id
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

        # return RequestForHelpPublic.model_validate(new_request)
        response_data = RequestForHelpPublic.model_validate(
            new_request,
            update={
                "message": f"Ваша заявка <b>#{new_request.id}</b> успешно создана и будет рассмотрена в ближайшее время.<br/>Вы можете посмотреть её в <b>ваших заявках</b>."
            },
        )
        return response_data
    except Exception as e:
        print(e)

        # if os.path.exists(request_folder):
        #     os.remove(request_folder)

        raise HTTPException(status_code=500, detail=f"There's an error: {e}")
    # except Err
