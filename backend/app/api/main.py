from app.api.routes import help_request, operator, user, utils
from fastapi import APIRouter

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
api_router.include_router(operator.router, prefix="/operator", tags=["operator"])
api_router.include_router(utils.router, prefix="/utils", tags=["utils"])
