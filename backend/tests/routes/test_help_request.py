from typing import Dict, Any

from fastapi import status
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models import RequestForHelpCreate, RequestForHelp, User

help_request = {
    "device": "Test device",  #
    "name": "Test name",
    "company": "Test company",
    "phone": "79876532101",
    "number_pc": "1234567890",
    "message_text": "Test message for request",  #
    "user_can_talk": True,
    "user_political": True
}


async def test_user_requests(test_client: AsyncClient, authenticated_user: Dict[str, Any], session: AsyncSession):
    requests_create = [RequestForHelpCreate(**request) for request in [help_request] * 3]
    user: User = authenticated_user["user"]
    requests_in = [
        RequestForHelp.model_validate(r, update={"owner_id": user.id}) for r in requests_create
    ]

    session.add_all(requests_in)

    await session.commit()

    r = await test_client.get(f"{settings.API_V1_STR}/help_request/get_user_requests",
                              headers=authenticated_user["headers"])

    assert r.status_code == status.HTTP_200_OK

    json_data = r.json()
    assert json_data is not None
    assert isinstance(json_data, list)
    assert len(json_data) == len(requests_create)


async def test_create_help_request(
        test_client: AsyncClient,
        authenticated_user: Dict[str, Any],
        csrf_token: Dict[str, Any],
):
    headers = {**authenticated_user["headers"], **csrf_token["headers"],
               "Cookie": authenticated_user["headers"]["Cookie"] + csrf_token["headers"]["Cookie"]}

    r = await test_client.post(f"{settings.API_V1_STR}/help_request/create_request", data={**help_request},
                               headers=headers)

    assert r.status_code == status.HTTP_201_CREATED

    json_data = r.json()
    assert settings.CSRF_TOKEN_KEY in json_data
    assert isinstance(json_data[settings.CSRF_TOKEN_KEY], str)

    assert "message" in json_data
    assert isinstance(json_data["message"], str)

    access_token = r.cookies.get(settings.AUTH_TOKEN_KEY)
    assert access_token is not None
    assert isinstance(access_token, str)
