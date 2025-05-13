from telegram import Bot
from telegram.request import HTTPXRequest

from app.core.config import settings

TOKEN = settings.BOT_TOKEN


def get_telegram_bot() -> Bot:
    return Bot(
        token=settings.BOT_TOKEN,
        base_url=f"{settings.TELEGRAM_API_HOST}/bot",
        request=HTTPXRequest(
            connection_pool_size=100,
            read_timeout=180,
            write_timeout=180,
            connect_timeout=60,
            pool_timeout=120,
        ),
    )
