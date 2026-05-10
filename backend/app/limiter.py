import os
import time
from collections import defaultdict

import redis
from fastapi import HTTPException, Request

_redis_client: redis.Redis | None = None
_buckets: dict[str, list[float]] = defaultdict(list)


def init_redis() -> None:
    global _redis_client
    url = os.environ.get("REDIS_URL")
    if url:
        _redis_client = redis.from_url(url, decode_responses=True)


def get_ip(request: Request) -> str:
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host or "unknown"


def rate_limit(request: Request, limit: int, window: int = 60) -> None:
    ip = get_ip(request)
    if _redis_client:
        _limit_redis(ip, limit, window)
    else:
        _limit_memory(ip, limit, window)


def _limit_redis(ip: str, limit: int, window: int) -> None:
    try:
        key = f"rl:{ip}"
        pipe = _redis_client.pipeline()
        pipe.incr(key)
        pipe.expire(key, window)
        count, _ = pipe.execute()
        if count > limit:
            raise HTTPException(status_code=429, detail="Too many requests")
    except HTTPException:
        raise
    except Exception:
        _limit_memory(ip, limit, window)


def _limit_memory(ip: str, limit: int, window: int) -> None:
    now = time.time()
    _buckets[ip] = [t for t in _buckets[ip] if now - t < window]
    if len(_buckets[ip]) >= limit:
        raise HTTPException(status_code=429, detail="Too many requests")
    _buckets[ip].append(now)
