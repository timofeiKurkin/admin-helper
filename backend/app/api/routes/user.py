from app import crud
from app.api.deps import SessionDep
from app.auth import cookie_handler
from app.auth import token as JWTToken
from app.auth.token import create_csrf_token
from app.core.config import settings
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.responses import JSONResponse
from fastapi_csrf_protect import CsrfProtect  # type: ignore[import-untyped]
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
router = APIRouter()


# Check user's token and return true if it's valid and false otherwise
@router.get("/auth", summary="Authorize user and set auth JWT-token cookie")
@limiter.limit("100/minute")
async def authorizeUser(request: Request, session: SessionDep):
    cookie_handler.check_cookie_permission(request=request)

    user_token = request.cookies.get(settings.AUTH_TOKEN_KEY)
    if not user_token:
        raise HTTPException(status_code=403, detail="Authorization cookie not found")

    user_payload = JWTToken.decode_jwt_token(token=user_token)
    user_phone: str = user_payload["phone"]
    user_id: str = user_payload["owner_id"]

    if not user_phone or not user_id:
        raise HTTPException(
            status_code=403, detail="Authorization cookie's data not found"
        )

    candidate = crud.get_user_by_phone(session=session, phone=user_phone)

    if not candidate or str(candidate.id) != user_id:
        response = JSONResponse(status_code=200, content={"authorized": False})
        response.delete_cookie(key=settings.AUTH_TOKEN_KEY)
        return response
    else:
        response = JSONResponse(status_code=200, content={"authorized": True})
        cookie_handler.set_cookie(
            response=response,
            key=settings.AUTH_TOKEN_KEY,
            value=user_token,
            max_age=settings.MONTH_IN_SECONDS,
        )
        return response


@router.get("/csrf_token", summary="Create CSRF-Token for user")
@limiter.limit("100/minute")
async def get_csrf_token(
    request: Request,
    response: Response,
    csrf_protect: CsrfProtect = Depends(),
):
    cookie_handler.check_cookie_permission(request=request)
    csrf_token, signed_token = create_csrf_token(csrf_protect=csrf_protect)
    response.status_code = 200
    csrf_protect.set_csrf_cookie(signed_token, response)
    return {settings.CSRF_TOKEN_KEY: csrf_token}


@router.get("/cookie_permission", summary="Set cookie permission", status_code=200)
async def set_cookie_permission(response: Response, request: Request):
    cookie_permission = request.cookies.get(settings.COOKIE_PERMISSION_KEY)

    if not cookie_permission or cookie_permission != "True":
        cookie_handler.set_cookie(
            response=response,
            key=settings.COOKIE_PERMISSION_KEY,
            value=str(True),
            max_age=settings.MONTH_IN_SECONDS,
        )
        return {
            "cookiePermission": True,
            "message": "Для удобства, авторизации и безопасности нашего приложения мы используем cookie 🍪<br/> Продолжая пользоваться приложением, вы подтверждаете их использование.<br/> Спасибо, что с нами! 😊",
        }

    return {
        "cookiePermission": True,
    }
