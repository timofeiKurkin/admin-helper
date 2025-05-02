FROM python:3.12.1

ENV PYTHONUNBUFFERED=1

WORKDIR /app

ENV PYTHONPATH=/app

COPY ./requirements.txt requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

COPY ./app app
COPY ./scripts scropts

RUN chmod +x scripts/prestart.sh
