# import secrets
# import warnings
import os
from pathlib import Path
from typing import Annotated, Any, Literal

from pydantic import AnyUrl, BeforeValidator, HttpUrl, PostgresDsn, computed_field
from pydantic_core import MultiHostUrl
from pydantic_settings import BaseSettings, SettingsConfigDict


def parse_cors(v: Any) -> list[str] | str:
    if isinstance(v, str) and not v.startswith("["):
        return [i.strip() for i in v.split(",")]
    elif isinstance(v, list | str):
        return v
    raise ValueError(v)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_ignore_empty=True,
        extra="ignore",
    )
    API_V1_STR: str = "/api/v1"
    FRONTEND_HOST: str = "http://localhost:3030"
    CLIENT_HOST: str
    ENVIRONMENT: Literal["local", "staging", "production"] = "local"

    BACKEND_CORS_ORIGINS: Annotated[list[AnyUrl] | str, BeforeValidator(parse_cors)] = (
        []
    )

    @computed_field  # type: ignore[prop-decorator]
    @property
    def all_cors_origins(self) -> list[str]:
        return [self.FRONTEND_HOST, self.CLIENT_HOST] + [
            str(origin).rstrip("/") for origin in self.BACKEND_CORS_ORIGINS
        ]

    PROJECT_NAME: str
    SENTRY_DSN: HttpUrl | None = None

    BOT_TOKEN: str
    GROUP_ID: str
    TELEGRAM_API_ID: str
    TELEGRAM_API_HASH: str

    POSTGRES_SERVER: str
    POSTGRES_PORT: int
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str

    @computed_field  # type: ignore[prop-decorator]
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> PostgresDsn:
        return MultiHostUrl.build(
            scheme="postgresql",
            username=self.POSTGRES_USER,
            password=self.POSTGRES_PASSWORD,
            host=self.POSTGRES_SERVER,
            port=self.POSTGRES_PORT,
            path=self.POSTGRES_DB,
        )

    # FIRST_SUPERUSER: str
    # FIRST_SUPERUSER_PASSWORD: str


BASE_DIR: str = Path(__file__).resolve().parent.parent
TEMPORARY_FOLDER: str = os.path.join(BASE_DIR, "api", "routes", "temporary_files")
USER_REQUESTS_FOLDER: str = os.path.join(BASE_DIR, "user_requests_for_help")

settings = Settings()
