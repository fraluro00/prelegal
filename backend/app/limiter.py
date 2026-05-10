import time
from collections import defaultdict

from fastapi import HTTPException, Request

_buckets: dict[str, list[float]] = defaultdict(list)


def get_ip(request: Request) -> str:
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host or "unknown"


def rate_limit(request: Request, limit: int, window: int = 60) -> None:
    """Raise 429 if IP exceeds `limit` calls within `window` seconds."""
    ip = get_ip(request)
    now = time.time()
    _buckets[ip] = [t for t in _buckets[ip] if now - t < window]
    if len(_buckets[ip]) >= limit:
        raise HTTPException(status_code=429, detail="Too many requests")
    _buckets[ip].append(now)
