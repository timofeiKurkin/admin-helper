from fastapi import status
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings


async def test_health_check(test_client: AsyncClient, session: AsyncSession):
    print(f"{test_client=}")
    create_response = await test_client.get(f"{settings.API_V1_STR}/utils/health-check")
    assert create_response.status_code == status.HTTP_200_OK

    response_data = create_response.json()
    print(response_data)
    assert response_data == True
