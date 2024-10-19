import io
from typing import BinaryIO

from fastapi import HTTPException
from PIL import Image
from telegram import InputFile, InputMediaPhoto


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


def save_image(*, image: InputFile, path: str):
    try:
        pil_image = Image.open(io.BytesIO(image.input_file_content))
        pil_image.save(f"{path}.jpeg", format="JPEG", optimize=True, quality=100)
        print(f"Image saved successfully at {path}")

    except Exception as e:
        raise HTTPException(status_code=501, detail=f"Error saving image: {e}")
