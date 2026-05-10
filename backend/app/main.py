import os
from contextlib import asynccontextmanager
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from .auth import router as auth_router
from .chat import router as chat_router
from .database import init_db
from .documents_router import router as documents_router

load_dotenv()

STATIC_DIR = Path(__file__).parent.parent / "static"

limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

allowed_origins = os.environ.get(
    "ALLOWED_ORIGINS", "https://prelegal-gamma.vercel.app"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(documents_router)


@app.get("/api/health")
def health():
    return {"status": "ok"}


if STATIC_DIR.exists():
    app.mount("/_next", StaticFiles(directory=str(STATIC_DIR / "_next")), name="next_assets")


@app.get("/{full_path:path}")
def serve_spa(full_path: str = ""):
    if not full_path:
        return FileResponse(str(STATIC_DIR / "index.html"))

    direct = STATIC_DIR / full_path
    if direct.is_file():
        return FileResponse(str(direct))

    html_file = STATIC_DIR / f"{full_path}.html"
    if html_file.exists():
        return FileResponse(str(html_file))

    return FileResponse(str(STATIC_DIR / "index.html"))
