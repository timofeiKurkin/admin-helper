from contextlib import asynccontextmanager

from alembic import command
from alembic.config import Config
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.routing import APIRoute
from fastapi_csrf_protect import CsrfProtect
from fastapi_csrf_protect.exceptions import (  # type: ignore[import-untyped]
    CsrfProtectError,
)
from pydantic import BaseModel
from slowapi import Limiter
# from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from app import utils
from app.api.main import api_router
from app.core.config import settings


def custom_generate_unique_id(route: APIRoute) -> str:
    return f"{route.tags[0]}-{route.name}"


# if settings.SENTRY_DSN and settings.ENVIRONMENT != "local":
#     sentry_sdk.init(dsn=str(settings.SENTRY_DSN), enable_tracing=True)


class CsrfSettings(BaseModel):
    secret_key: str = settings.CSRF_SECRET_KEY
    cookie_samesite: str = "none"  # ["lax", "strict", "none"]
    cookie_secure: bool = True
    cookie_key: str = settings.CSRF_TOKEN_KEY


@CsrfProtect.load_config  # type: ignore
def get_csrf_config():
    return CsrfSettings()


@asynccontextmanager
async def lifespan(_: FastAPI):
    utils.create_temporary_folder()

    alembic_cfg = Config("alembic.ini")
    command.upgrade(alembic_cfg, "head")
    yield


limiter = Limiter(
    key_func=get_remote_address, headers_enabled=True, enabled=True, retry_after="600"
)
app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    generate_unique_id_function=custom_generate_unique_id,
    # lifespan=lifespan,
)
# app.state.limiter = limiter
print(f"{settings.SQLALCHEMY_DATABASE_URI}")

if settings.all_cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.all_cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


# @app.exception_handler(CsrfProtectError)
# def csrf_protect_exception_handler(_: Request, exc: CsrfProtectError):
#     return JSONResponse(
#         status_code=exc.status_code,
#         content={
#             "message": "Ой, что-то пошло не так 🙈<br/> Ваш запрос не совсем безопасен. Попробуйте обновить страницу и отправить его снова! 🔄"
#         },
#     )
#
#
# @app.exception_handler(RateLimitExceeded)
# def slowapi_exception_handler(_: Request, exc: RateLimitExceeded):
#     return JSONResponse(
#         status_code=exc.status_code,
#         content={
#             "message": "Ой, похоже, мы получили слишком много запросов от вас за раз 😅. Дайте нам немного времени, чтобы все обработать. Благодарим за терпение! ⏳"
#         },
#     )


@app.exception_handler(HTTPException)
async def global_exception_handler(_: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code, content={"message": exc.detail},
    )


# app.add_middleware(SlowAPIMiddleware)
app.include_router(api_router, prefix=settings.API_V1_STR)
