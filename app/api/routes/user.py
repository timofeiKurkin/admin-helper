from app import crud
from app.api.deps import SessionDep
from app.auth import token as JWTToken
from app.auth.token import create_csrf_token
from app.core.config import settings
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.responses import JSONResponse
from fastapi_csrf_protect import CsrfProtect  # type: ignore[import-untyped]

router = APIRouter()


# Check user's token and return true if it's valid and false otherwise
@router.get("/auth")
async def authorizeUser(request: Request, session: SessionDep):
    user_token = request.cookies.get(settings.AUTH_TOKEN_KEY)
    if not user_token:
        raise HTTPException(status_code=403, detail="Authorization cookie not found")

    user_payload = JWTToken.decode_token(token=user_token)
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
        response.set_cookie(
            key=settings.AUTH_TOKEN_KEY,
            value=user_token,
            secure=True,
            httponly=True,
            path="/",
            max_age=60 * 60 * 24 * 30,
            samesite="none",
        )
        return response


@router.get("/csrf_token")
async def get_csrf_token(
    request: Request,
    session: SessionDep,
    response: Response,
    csrf_protect: CsrfProtect = Depends(),
):
    print(request.headers)
    client_id = request.headers.get("client-id")

    if not client_id:
        raise HTTPException(
            status_code=403, detail="Authorization cookie's data not found"
        )

    # csrf_token = request.cookies.get(settings.CSRF_TOKEN_KEY)
    # if csrf_token:
    #     response.status_code = 204
    #     return

    csrf_token, signed_token = create_csrf_token(csrf_protect=csrf_protect)
    response.status_code = 200
    csrf_protect.set_csrf_cookie(signed_token, response)
    return {settings.CSRF_TOKEN_KEY: csrf_token}
