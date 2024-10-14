# import asyncio
# from contextlib import asynccontextmanager

import sentry_sdk

# import uvicorn
from fastapi import FastAPI
from fastapi.routing import APIRoute
from starlette.middleware.cors import CORSMiddleware

from app.api.main import api_router
from app.core.config import settings

# from app.telegram_bot.bot import main as telegram_main


def custom_generate_unique_id(route: APIRoute) -> str:
    return f"{route.tags[0]}-{route.name}"


if settings.SENTRY_DSN and settings.ENVIRONMENT != "local":
    sentry_sdk.init(dsn=str(settings.SENTRY_DSN), enable_tracing=True)


# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     await telegram_main()
#     yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    generate_unique_id_function=custom_generate_unique_id,
    # lifespan=lifespan,
)

if settings.all_cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.all_cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router, prefix=settings.API_V1_STR)


# @app.on_event("startup")
# async def startup_event():
#     updater.start_polling()


# async def start_fastapi():
#     config = uvicorn.Config(app, host="localhost", port=8000, log_level="info")
#     server = uvicorn.Server(config)
#     await server.serve()


# async def main():
#     await asyncio.gather(start_fastapi(), telegram_main())


# if __name__ == "__main__":
#     asyncio.run(main())
