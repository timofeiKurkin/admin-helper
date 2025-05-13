from fastapi import HTTPException, Request, status
from fastapi.responses import Response

from app.core.config import settings


def set_cookie(*, response: Response, key: str, value: str, max_age: int) -> None:
    response.set_cookie(
        key=key,
        value=value,
        secure=True,
        httponly=True,
        path="/",
        max_age=max_age,
        samesite="none",
    )


def check_cookie_permission(*, request: Request):
    cookie_permission = request.cookies.get(settings.COOKIE_PERMISSION_KEY)

    if not cookie_permission or (cookie_permission and cookie_permission.lower() != "true"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Ваш запрос не сработал 😕. Кажется, вы не согласились на использование cookie 🍪.",
        )
