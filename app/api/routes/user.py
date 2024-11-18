from app import crud
from app.api.deps import SessionDep
from app.auth import token as JWTToken
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse

router = APIRouter()


# Check user's token and return true if it's valid and false otherwise
@router.get("/auth")
async def authorizeUser(request: Request, session: SessionDep):
    user_token = request.cookies.get("token")
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
        response.delete_cookie(key="token")
        return response
    else:
        response = JSONResponse(status_code=200, content={"authorized": True})
        response.set_cookie(
            key="token",
            value=user_token,
            secure=True,
            httponly=True,
            path="/",
            max_age=60 * 60 * 24 * 30,
            samesite="none",
        )
        return response
