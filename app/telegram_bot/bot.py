from telegram import Bot, Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes
from telegram.request import HTTPXRequest

from app.core.config import settings

TOKEN = settings.BOT_TOKEN


async def hello(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text(f"Hello {update.effective_user.first_name}")


async def main() -> None:
    # print("work")
    app = ApplicationBuilder().token(TOKEN).build()
    bot = app.bot()

    app.add_handler(CommandHandler("hello", hello))

    await app.start()  # Асинхронный запуск бота
    print("Bot successfully started")
    await app.updater.start_polling()  # Запускаем бота в режиме polling асинхронно
    await app.updater.idle()


bot_api = Bot(
    token=settings.BOT_TOKEN,
    base_url="http://localhost:8081/bot",
    request=HTTPXRequest(
        connection_pool_size=100,
        read_timeout=180,
        write_timeout=180,
        connect_timeout=60,
        pool_timeout=120,
    ),
)
