import io
import os
from typing import BinaryIO

import ffmpeg  # type: ignore[import-untyped]
from app.core.config import TEMPORARY_FOLDER
from fastapi import HTTPException
from PIL import Image
from telegram import InputFile


def compress_image(
    *,
    file: BinaryIO,
    filename: str,
    quality: int = 85,
) -> bytes:
    image: Image.Image = Image.open(file)

    if image.mode in ("RGBA", "P"):
        image = image.convert("RGB")

    # image.save(path, format="JPEG", optimize=True, quality=quality)
    # with open(path, "rb") as f:
    #     buffer = f.read()

    buffer = io.BytesIO()
    image.save(buffer, format="JPEG", optimize=True, quality=quality)
    # buffer.seek(0)
    bytes_buff = buffer.getvalue()

    input_file = InputFile(bytes_buff, filename=filename)

    return bytes_buff


def convert_voice(*, input_voice: str, output_voice: str) -> bytes:
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


def compress_video(*, input_file: str, output_file: str) -> bytes:
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


# def save_image(*, image: InputFile, path: str):
#     try:
#         file_content = image.input_file_content
#         if isinstance(file_content, bytes):
#             image_stream = io.BytesIO(file_content)
#             pil_image = Image.open(image_stream)
#             pil_image.save(path, format="JPEG", optimize=True, quality=100)
#         else:
#             pil_image = Image.open(file_content)
#             pil_image.save(path, format="JPEG", optimize=True, quality=100)

#         print("image successfully was written")
#         # if isinstance(image.input_file_content, bytes):
#         #     image_content: bytes = image.input_file_content

#         #     with io.BytesIO(image_content) as image_stream:
#         #         pil_image = Image.open(image_stream)
#         #         pil_image.save(path, format="JPEG", optimize=True, quality=100)
#         #         print("image successfully was written")
#     except Exception as e:
#         raise HTTPException(status_code=501, detail=f"Error saving image: {e}")


# def create_request_folder(*, user_folder: str, last_index: int) -> str:
#     # Folder for current request where are saving requests files
#     request_folder = os.path.join(user_folder, f"request_{last_index}")
#     # Create if doesn't exist
#     if not os.path.exists(request_folder):
#         os.makedirs(request_folder)

#     return request_folder


def create_request_folder(*, user_folder: str) -> str:
    # Folder for current request where are saving requests files

    # Create if doesn't exist
    if not os.path.exists(user_folder):
        os.makedirs(user_folder)

    return user_folder


def create_temporary_folder():
    if not os.path.exists(TEMPORARY_FOLDER):
        os.makedirs(TEMPORARY_FOLDER)


def to_camel(field: str) -> str:
    parts = field.split("_")
    return parts[0] + "".join(word.capitalize() for word in parts[1:])
