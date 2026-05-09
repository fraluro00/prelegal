from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from .database import init_db

STATIC_DIR = Path(__file__).parent.parent / "static"


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(lifespan=lifespan)


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
