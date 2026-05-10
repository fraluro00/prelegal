FROM python:3.12-slim
WORKDIR /app

RUN pip install uv --no-cache-dir

COPY backend/pyproject.toml backend/uv.lock ./
RUN uv sync --no-dev --frozen

COPY backend/app ./app

EXPOSE 8000
CMD ["sh", "-c", "uv run uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
