FROM python:3.12.1

WORKDIR /backend

ENV PYTHONPATH=/backend

COPY ./requirements.txt requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

COPY ./app app

COPY ./scripts scripts

RUN chmod +x scripts/prestart.sh
