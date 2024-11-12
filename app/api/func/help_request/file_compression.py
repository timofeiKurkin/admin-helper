import os
from typing import List
from uuid import uuid4

from app import utils
from app.core.config import TEMPORARY_FOLDER
from fastapi import UploadFile
from telegram import InputFile, InputMediaPhoto, InputMediaVideo

telegram_timeout_time = 120


async def voice_file(*, message_file: UploadFile, request_folder: str) -> InputFile:
    voice_name = str(uuid4())
    input_voice = os.path.join(TEMPORARY_FOLDER, f"{voice_name}.mp3")

    # Save .mp3 file in the temporary folder
    with open(input_voice, "wb") as f:
        f.write(await message_file.read())

    output_voice_file = f"{voice_name}.ogg"
    output_voice = os.path.join(request_folder, output_voice_file)
    converted_audio = utils.convert_voice(
        input_voice=input_voice, output_voice=output_voice
    )

    # voice_response = await main_message.reply_voice(
    #     voice=InputFile(obj=converted_audio, filename=voice_name),
    #     connect_timeout=telegram_timeout_time,
    # )
    # return {"voice_response": voice_response, "output_voice_file": output_voice_file}
    # return (voice_response, output_voice_file)

    return InputFile(obj=converted_audio, filename=voice_name)


async def photo_files(*, photo: List[UploadFile]) -> List[InputMediaPhoto]:
    photo_list: List[InputMediaPhoto] = []

    for photo_item in photo:
        photo_name = f"{str(uuid4())}.jpeg"

        # Compress and save image to request folder
        input_file = utils.compress_image(
            file=photo_item.file, quality=85, filename=f"{photo_name}.jpeg"
        )

        compressed_image = InputMediaPhoto(
            media=input_file,
            filename=photo_name,
            caption=photo_name,
        )
        photo_list.append(compressed_image)

    return photo_list


async def video_files(
    *, video: List[UploadFile], temporary_folder: str
) -> List[InputMediaVideo]:
    video_list: List[InputMediaVideo] = []

    for index, video_item in enumerate(video):
        filename_output = f"{str(uuid4())}.mp4"
        input_file = os.path.join(temporary_folder, f"{str(uuid4())}.mp4")
        output_file = os.path.join(temporary_folder, filename_output)

        # Create temporary video file
        with open(input_file, "wb") as f:
            f.write(await video_item.read())

        compressed_video = utils.compress_video(
            input_file=input_file, output_file=output_file
        )

        video_list.append(
            InputMediaVideo(
                media=compressed_video,
                caption=f"Video number #{index + 1}",
                filename=filename_output,
            )
        )

    return video_list
