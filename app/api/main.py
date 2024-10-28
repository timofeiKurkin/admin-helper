from fastapi import APIRouter

from app.api.routes import help_request, user

api_router = APIRouter()
api_router.include_router(
    help_request.router,
    prefix="/help_request",
    tags=["help_request"],
)
api_router.include_router(
    user.router,
    prefix="/user",
    tags=["user"],
)
