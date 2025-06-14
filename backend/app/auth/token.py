from datetime import datetime
from typing import Tuple

import jwt
from fastapi import Depends, HTTPException
from fastapi_csrf_protect import CsrfProtect  # type: ignore[import-untyped]
from jwt import PyJWTError

from app.core.config import settings
from app.models import User

ALGORITHM = "HS256"
ACCESS_TOKEN_LIFETIME_MINUTES = settings.ACCESS_TOKEN_LIFETIME_MINUTES
REFRESH_TOKEN_LIFETIME_DAYS = settings.REFRESH_TOKEN_LIFETIME_DAYS
TOKEN_SECRET_KEY = settings.TOKEN_SECRET_KEY


# Token for access to get users requests
def create_jwt_token(*, user: User) -> str:
    payload = {
        "owner_id": str(user.id),
        "phone": user.phone,
        "created_at": str(datetime.now()),
    }
    return jwt.encode(payload=payload, key=TOKEN_SECRET_KEY, algorithm=ALGORITHM)


def create_csrf_token(*, csrf_protect: CsrfProtect = Depends()) -> Tuple[str, str]:
    csrf_token, signed_token = csrf_protect.generate_csrf_tokens()
    return csrf_token, signed_token


# def create_refresh_token(*, user: UserToken) -> str:
#     token_time_life = datetime.now() + timedelta(days=REFRESH_TOKEN_LIFETIME_DAYS)
#     payload = {
#         "phone": user.phone,
#         "device_id": user.device,
#         "expires_at": token_time_life,
#         "created_at": datetime.now(),
#     }
#     return jwt.encode(
#         payload=payload,
#         key=TOKEN_SECRET_KEY,
#         algorithm=ALGORITHM,
#     )


# def create_access_token(*, user: UserToken) -> str:
#     token_time_life = datetime.now() + timedelta(minutes=ACCESS_TOKEN_LIFETIME_MINUTES)
#     payload = {
#         "phone": user.phone,
#         "device_id": user.device,
#         "expires_at": token_time_life,
#         "created_at": datetime.now(),
#     }
#     return jwt.encode(
#         payload=payload,
#         key=TOKEN_SECRET_KEY,
#         algorithm=ALGORITHM,
#     )


def decode_jwt_token(token: str) -> dict:
    try:
        return jwt.decode(jwt=token, key=TOKEN_SECRET_KEY, algorithms=[ALGORITHM])
    except PyJWTError:
        raise HTTPException(status_code=400, detail=str("Cannot decode token"))
