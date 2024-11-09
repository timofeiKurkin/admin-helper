FROM python:3.12

ENV PYTHONUNBUFFERED=1

WORKDIR /app/

ENV PYTHONPATH=/app

COPY ./scripts /app/scripts
COPY ./alembic.ini /app/
COPY ./app /app/app

COPY requirements.txt /app
RUN pip install --no-cache-dir --upgrade -r ./requirements.txt

EXPOSE 8000

# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
CMD ["fastapi", "run", "--workers", "3", "app/main.py"]
