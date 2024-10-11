from typing import Annotated, List, Optional
from uuid import UUID

from fastapi import APIRouter, Form, UploadFile
from pydantic import BaseModel

router = APIRouter()


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
    phone: str
    number_pc: str


@router.post("/create_request")
async def create_help_request(user_request: Annotated[FormData, Form()]):
    if user_request.photo:
        pass
    if user_request.video:
        pass

    return {"filenames": [file.filename for file in user_request.photo]}
    # You can return a dict, list, singular values as str, int, etc.
