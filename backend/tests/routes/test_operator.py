from typing import Dict, Any

from fastapi import status
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.core.config import settings
from app.models import RequestForHelpCreate, User, RequestForHelp

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


async def test_delete_request(
        test_client: AsyncClient,
        authenticated_user: Dict[str, Any],
        csrf_token: Dict[str, Any],
        session: AsyncSession
):
    requests_create = RequestForHelpCreate(**help_request)
    user: User = authenticated_user["user"]
    request_in = RequestForHelp.model_validate(requests_create, update={"owner_id": user.id})

    session.add(request_in)
    await session.commit()
    await session.refresh(request_in)

    headers = {**authenticated_user["headers"], **csrf_token["headers"],
               "Cookie": authenticated_user["headers"]["Cookie"] + csrf_token["headers"]["Cookie"]}
    r = await test_client.delete(f"{settings.API_V1_STR}/operator/delete_request/{request_in.accept_url}",
                                 headers=headers)

    assert r.status_code == status.HTTP_200_OK

    json_data = r.json()
    assert "message" in json_data and isinstance(json_data["message"], str)

    request = (await session.execute(
        statement=select(RequestForHelp).where(RequestForHelp.accept_url == request_in.accept_url))).scalar()
    assert request is None


async def test_complete_request(
        test_client: AsyncClient,
        authenticated_user: Dict[str, Any],
        csrf_token: Dict[str, Any],
        session: AsyncSession
):
    requests_create = RequestForHelpCreate(**help_request)
    user: User = authenticated_user["user"]
    requests_in = RequestForHelp.model_validate(requests_create, update={"owner_id": user.id})

    session.add(requests_in)
    await session.commit()
    await session.refresh(requests_in)

    headers = {**authenticated_user["headers"], **csrf_token["headers"],
               "Cookie": authenticated_user["headers"]["Cookie"] + csrf_token["headers"]["Cookie"]}
    r = await test_client.patch(f"{settings.API_V1_STR}/operator/complete_request/{requests_in.accept_url}",
                                headers=headers)

    assert r.status_code == status.HTTP_200_OK

    json_data = r.json()

    assert settings.CSRF_TOKEN_KEY in json_data
    assert isinstance(settings.CSRF_TOKEN_KEY, str)

    assert "helpRequest" in json_data
    assert "phone" in json_data["helpRequest"]
    assert "company" in json_data["helpRequest"]
    assert "name" in json_data["helpRequest"]
    assert "device" in json_data["helpRequest"]
    assert "completed_at" in json_data["helpRequest"]

    await session.delete(requests_in)
    await session.commit()
