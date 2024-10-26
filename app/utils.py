import io
import os
import subprocess
from typing import BinaryIO

import ffmpeg
from fastapi import HTTPException
from PIL import Image
from telegram import InputFile, InputMediaPhoto, InputMediaVideo


def compress_image(
    *,
    file: BinaryIO,
    filename: str,
    quality: int = 85,
) -> InputMediaPhoto:
    image = Image.open(file)
    if image.mode in ("RGBA", "P"):
        image = image.convert("RGB")

    buffer = io.BytesIO()
    image.save(buffer, format="JPEG", optimize=True, quality=quality)
    buffer.seek(0)

    return InputMediaPhoto(
        media=buffer,
        filename=filename,
        caption=filename,
    )


def convert_and_save_audio(*, input_voice: str, output_voice: str) -> bytes:
    # Read audio that was uploaded and save .mp3 file to .ogg file with current codec for telegram
    try:
        ffmpeg.input(input_voice).output(
            output_voice,
            codec="libopus",
            bitrate="64k",
            loglevel="quiet",
        ).run()
    except ffmpeg.Error as e:
        raise HTTPException(status_code=500, detail=f"Conversion failed: {e.stderr}")
    finally:
        os.remove(input_voice)  # Delete temporary file

    # Open new .ogg audio file
    with open(output_voice, "rb") as f:
        audio = f.read()

    return audio


def compress_and_save_video(*, input_file: str, output_file: str) -> bytes:
    try:
        ffmpeg.input(input_file).output(
            output_file, vcodec="libx264", crf=28, loglevel="quiet"
        ).run()
    except ffmpeg.Error as e:
        raise HTTPException(status_code=500, detail=f"Error compressing video: {e}")
    finally:
        os.remove(input_file)

    with open(output_file, "rb") as f:
        video = f.read()

    return video
    # buffer = io.BytesIO()


def save_image(*, image: InputFile, path: str):
    try:
        pil_image = Image.open(io.BytesIO(image.input_file_content))
        pil_image.save(path, format="JPEG", optimize=True, quality=100)

    except Exception as e:
        raise HTTPException(status_code=501, detail=f"Error saving image: {e}")


def create_request_folder(*, user_folder: str, last_index: int) -> str:
    # Folder for current request where are saving requests files
    request_folder = os.path.join(user_folder, f"request_{last_index}")
    # Create if doesn't exist
    if not os.path.exists(request_folder):
        os.makedirs(request_folder)

    return request_folder