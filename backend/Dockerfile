# FROM python:3.9-slim-bullseye
FROM python:3.9-bullseye

EXPOSE 8000

ENV PYTHONDONTWRITEBYTECODE=1

ENV PYTHONUNBUFFERED=1

COPY requirements.txt .
RUN python -m pip install -r requirements.txt

WORKDIR /app
COPY app.py /app

# RUN adduser -u nnnn --disabled-password --gecos "" appuser && \
#     chown -R appuser /app
# USER appuser

CMD ["python", "app.py"]
