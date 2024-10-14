from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

from app.core.config import settings

TOKEN = settings.BOT_TOKEN
BASE_URL = f"https://api.telegram.org/bot{TOKEN}"


async def hello(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text(f"Hello {update.effective_user.first_name}")


async def main() -> None:
    # print("work")
    app = ApplicationBuilder().token(settings.BOT_TOKEN).build()
    bot = app.bot()
    
    
    app.add_handler(CommandHandler("hello", hello))

    await app.start()  # Асинхронный запуск бота
    print("Bot successfully started")
    await app.updater.start_polling()  # Запускаем бота в режиме polling асинхронно
    await app.updater.idle()
