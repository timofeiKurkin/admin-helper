import io
from typing import BinaryIO
from telegram import InputMediaPhoto
from PIL import Image

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
        caption=f"Фотография пользователя {filename}",
    )