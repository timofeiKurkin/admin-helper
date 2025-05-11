import os
import secrets
from pathlib import Path
from typing import Annotated, Any, Literal, Optional

from pydantic import (
    AnyUrl,
    BeforeValidator,
    PostgresDsn,
    computed_field,
    field_validator, ValidationInfo
)
from pydantic_settings import BaseSettings, SettingsConfigDict


def parse_cors(v: Any) -> list[str] | str:
    if isinstance(v, str) and not v.startswith("["):
        return [i.strip() for i in v.split(",")]
    elif isinstance(v, list | str):
        return v
    raise ValueError(v)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file="../.env", env_ignore_empty=True, extra="ignore",
    )
    API_V1_STR: str = "/api/v1"
    FRONTEND_HOST: str = "http://localhost:3030"
    BACKEND_HOST: str = ""
    CLIENT_HOST: str = ""
    ENVIRONMENT: Literal["local", "staging", "production"] = "local"

    BACKEND_CORS_ORIGINS: Annotated[list[AnyUrl] | str, BeforeValidator(parse_cors)] = (
        []
    )

    @computed_field  # type: ignore[prop-decorator]
    @property
    def all_cors_origins(self) -> list[str]:
        return [str(origin).rstrip("/") for origin in self.BACKEND_CORS_ORIGINS]

    PROJECT_NAME: str = ""

    BOT_TOKEN: str = ""
    GROUP_ID: str = ""
    TELEGRAM_API_ID: str = ""
    TELEGRAM_API_HASH: str = ""
    TELEGRAM_API_HOST: str = ""

    POSTGRES_SERVER: str = ""
    POSTGRES_PORT: int = 0
    POSTGRES_USER: str = ""
    POSTGRES_PASSWORD: str = ""
    POSTGRES_DB: str = ""

    PUBLIC_TIME_FORMAT: str = r"%d.%m.%y %H:%M"
    PUBLIC_SHORT_TIME_FORMAT: str = r"%H:%M"

    REQUEST_CREATING_INTERVAL: int = 12

    AUTH_TOKEN_KEY: str = "auth"
    CSRF_TOKEN_KEY: str = "csrfToken"
    CSRF_SECRET_KEY: str = secrets.token_urlsafe(32)

    COOKIE_PERMISSION_KEY: str = "cookiePermission"
    MONTH_IN_SECONDS: int = 60 * 60 * 24 * 30

    # @computed_field
    # @property
    # def SQLALCHEMY_DATABASE_URL(self) -> str:
    #     return PostgresDsn.build(
    #         scheme="postgresql+asyncpg",
    #         username=self.POSTGRES_USER,
    #         password=self.POSTGRES_PASSWORD,
    #         host=self.POSTGRES_SERVER,
    #         port=self.POSTGRES_PORT,
    #         path=f"/{self.POSTGRES_DB}",
    #     ).unicode_string()

    SQLALCHEMY_DATABASE_URI: Optional[str] = None

    @field_validator("SQLALCHEMY_DATABASE_URI", mode="before")
    @classmethod
    def SQLALCHEMY_DATABASE_URL(cls, v: Optional[str], values: ValidationInfo) -> Any:
        if isinstance(v, str):
            print("Loading SQLALCHEMY_DATABASE_URI from .docker.env file ...")
            return v

        return PostgresDsn.build(
            scheme="postgresql+asyncpg",
            username=values.data.get("POSTGRES_USER"),
            password=values.data.get("POSTGRES_PASSWORD"),
            host=values.data.get("POSTGRES_SERVER"),
            path=f"{values.data.get('POSTGRES_DB') or ''}",
        ).unicode_string()

    TOKEN_SECRET_KEY: str = secrets.token_urlsafe(32)
    ACCESS_TOKEN_LIFETIME_MINUTES: int = 30
    REFRESH_TOKEN_LIFETIME_DAYS: int = 30
    MAX_COUNT_OF_TOKENS: int = 3

    # FIRST_SUPERUSER: str
    # FIRST_SUPERUSER_PASSWORD: str


settings = Settings()

BASE_DIR: Path = Path(__file__).resolve().parent.parent
TEMPORARY_FOLDER: str = os.path.join(BASE_DIR, "api", "routes", "temporary_files")
# USER_REQUESTS_FOLDER: str = os.path.join(BASE_DIR, "users_help_requests")
