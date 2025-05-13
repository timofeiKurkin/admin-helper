from typing import Dict, Any

from fastapi import status
from httpx import AsyncClient

from app.core.config import settings


async def test_authorize_user(
        test_client: AsyncClient,
        authenticated_user: Dict[str, Any],
) -> None:
    r = await test_client.get(f"{settings.API_V1_STR}/user/auth", headers=authenticated_user["headers"])
    assert r.status_code == status.HTTP_200_OK

    json_data = r.json()
    assert "authorized" in json_data
    auth_cookie = r.cookies.get(settings.AUTH_TOKEN_KEY)

    if json_data["authorized"]:
        assert auth_cookie is not None
        assert isinstance(auth_cookie, str)
    else:
        assert auth_cookie is None


async def test_csrf_token(test_client: AsyncClient, authenticated_user: Dict[str, Any]) -> None:
    r = await test_client.get(f"{settings.API_V1_STR}/user/csrf_token", headers=authenticated_user["headers"])
    assert r.status_code == status.HTTP_200_OK

    json_data = r.json()
    assert settings.CSRF_TOKEN_KEY in json_data
    assert isinstance(json_data[settings.CSRF_TOKEN_KEY], str)
    assert json_data[settings.CSRF_TOKEN_KEY]

    csrf_cookie = r.cookies.get(settings.CSRF_TOKEN_KEY)
    assert csrf_cookie is not None
    assert isinstance(csrf_cookie, str)


async def test_set_cookie_permission(test_client: AsyncClient, authenticated_user: Dict[str, Any]) -> None:
    r = await test_client.get(f"{settings.API_V1_STR}/user/cookie_permission", headers=authenticated_user["headers"])
    assert r.status_code == status.HTTP_200_OK

    json_data = r.json()
    assert settings.COOKIE_PERMISSION_KEY in json_data
    assert isinstance(json_data[settings.COOKIE_PERMISSION_KEY], bool)
    assert json_data[settings.COOKIE_PERMISSION_KEY]

    # permission_cookie = r.cookies.get(settings.COOKIE_PERMISSION_KEY)
    # assert permission_cookie is not None
    # assert isinstance(permission_cookie, str)
