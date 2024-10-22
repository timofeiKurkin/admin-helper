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


def compress_and_save_video(*, input_file: str, output_file: str) -> InputMediaVideo:
    try:
        ffmpeg.input(input_file).output(
            output_file, vcodec="libx264", crf=28, loglevel="quiet"
        ).run()
    except ffmpeg.Error as e:
        raise HTTPException(status_code=500, detail=f"Error compressing video: {e}")
    finally:
        pass
        # os.remove(input_file)
    # buffer = io.BytesIO()


def save_image(*, image: InputFile, path: str):
    try:
        pil_image = Image.open(io.BytesIO(image.input_file_content))
        pil_image.save(path, format="JPEG", optimize=True, quality=100)

    except Exception as e:
        raise HTTPException(status_code=501, detail=f"Error saving image: {e}")
