## Introduce

*Решение технических проблем пользователей* - главная задача системного администратора. Проблема состоит в том, что в большинстве случаев отсутствует стандартизация и фиксация элементов этого процесса.  
Поэтому, приложение предлагает современных подход для технической поддержки пользователей в организациях различного масштаба. Стандартизация заявок, с фиксацией каждого обращения о технической помощи, помогают сократить время на оказание услуги клиенту и показывают общее состояние инфраструктуры организации, основываясь на количестве заявок.  
Приложение реализовано в виде сайта, поэтому пользователь может открыть его на любом устройстве.  
Готовая заявка о технической помощи отправляется в Telegram группу через локально работающий [telegram-bot-API](https://core.telegram.org/bots/api).

### Links
- [Frontend part]()

## Technologies
**Backend part** of the application was developed with:
- [Alembic v1.13.3](https://pypi.org/project/alembic/1.13.3/)
- [Fastapi v0.115.0](https://pypi.org/project/fastapi/0.115.0/)
- [Pydantic v2.10.2](https://pypi.org/project/pydantic/2.10.2/)
- [Psycopg2-binary v2.9.9](https://pypi.org/project/psycopg2-binary/2.9.9/)
- [SQLAlchemy v2.0.35](https://pypi.org/project/SQLAlchemy/2.0.35/)
- [Sqlmodel v0.0.22](https://pypi.org/project/sqlmodel/0.0.22/)
- [Uvicorn v0.31.1](https://pypi.org/project/uvicorn/0.31.1/)
- [Python-telegram-bot v.21.6](https://docs.python-telegram-bot.org/en/v21.6/index.html)

## Getting Started

### Telegram Settings

#### Creating Telegram Bot

First of all, you must to have a token of the bot.
Obtaining a token is as simple as contacting [@BotFather](https://t.me/botfather), issuing the `/newbot` command and following the steps until you're given a new token. You can find a step-by-step guide [here](https://core.telegram.org/bots/features#creating-a-new-bot).
Created token will look like something that: 4839574812:AAFD39kkdpWt3ywyRZergyOLMaJhac60qc

> **Warning**: make sure that you will keep token **in a secure place** and **don't share it with anyone**.

Write token in `.env` file as `BOT_TOKEN=token`.

#### Creating Telegram Group

Then create *telegram group* where you are going to send help requests. Get id of the created group and write in `.env` file as `GROUP_ID=-1234567890`

#### Creating Telegram Application

In order to obtain an **API id** and develop your own application using the Telegram API you need to do the following:
- Sign up for Telegram using an official application.
- Log in to your Telegram core: [https://my.telegram.org](https://my.telegram.org).
- Go to ["API development tools"](https://my.telegram.org/apps) and fill out the form.
- You will get basic addresses as well as the api_id and api_hash parameters required for user authorization.
- For the moment each number can only have one api_id connected to it.
We will be sending important developer notifications to the phone number that you use in this process, so please use an up-to-date number connected to your active Telegram account.

Then you can set variables in `.env` file:
```.env
TELEGRAM_API_ID=12345678
TELEGRAM_API_HASH=hash
```

[Get more info about it](https://core.telegram.org/api/obtaining_api_id).

All Telegram's settings in `.env` will look like something that:
```
BOT_TOKEN=TOKEN
GROUP_ID=-1234567890
TELEGRAM_API_ID=12345678
TELEGRAM_API_HASH=HASH
```

### App Settings

First of all, create python virtual environment and activate it:
```bash
python3 -m venv venv
source venv/bin/activate
```

Then install all packages from `requirements.txt` file:
```bash
pip install -r requirements.txt
```

You should adjust `.env` file in root directory, that is above frontend and backend folders, and adjust `postgres auth settings` for container:

```.env
POSTGRES_SERVER=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres_user
POSTGRES_PASSWORD=postgres_password
POSTGRES_DB=postgres_db
```

Run project via command:
```bash
python manage.py runserver 8080
```

You can find your application on [http://localhost:8080](http://localhost:8080)

You can also run this app in docker. For this way there's `docker-compose.yml` which you should adjust to your needs!

#### Local Telegram-Bot-Api

The easiest way is running already built server in Docker. You can find Docker-Image [here](https://hub.docker.com/r/aiogram/telegram-bot-api). 

> **Warning**: adjust `TELEGRAM_MAX_CONNECTIONS` point - maximum number of open file descriptors.

`docker-compose.yml` file already contain settings to run this image in container. You can also adjust it!
