import os
from typing import Any, Tuple
from uuid import uuid4

from fastapi import UploadFile
from telegram import InputFile, Message

from app import utils
from app.core.config import TEMPORARY_FOLDER

telegram_timeout_time = 120


async def send_voice_message(
    *, main_message: Message, message_file: UploadFile, request_folder: str
) -> Tuple[Message, str]:
    voice_name = str(uuid4())
    input_voice = os.path.join(TEMPORARY_FOLDER, f"{voice_name}.mp3")

    # Save .mp3 file in the temporary folder
    with open(input_voice, "wb") as f:
        f.write(await message_file.read())

    output_voice_file = f"{voice_name}.ogg"
    output_voice = os.path.join(request_folder, output_voice_file)
    converted_audio = utils.convert_and_save_voice(
        input_voice=input_voice, output_voice=output_voice
    )

    voice_response = await main_message.reply_voice(
        voice=InputFile(obj=converted_audio, filename=voice_name),
        connect_timeout=telegram_timeout_time,
    )
    # return {"voice_response": voice_response, "output_voice_file": output_voice_file}
    return (voice_response, output_voice_file)
