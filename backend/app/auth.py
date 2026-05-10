import os
import sqlite3
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from fastapi import APIRouter, Depends, Header, HTTPException
from pydantic import BaseModel

from . import database

_SECRET = os.environ.get("JWT_SECRET", "prelegal-dev-secret")
_ALGORITHM = "HS256"
_EXPIRY_DAYS = 7

router = APIRouter()


class RegisterRequest(BaseModel):
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class AuthResponse(BaseModel):
    token: str
    email: str


def _hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def _verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())


def _make_token(user_id: int) -> str:
    payload = {
        "sub": str(user_id),
        "exp": datetime.now(timezone.utc) + timedelta(days=_EXPIRY_DAYS),
    }
    return jwt.encode(payload, _SECRET, algorithm=_ALGORITHM)


def get_current_user(authorization: str = Header(...)) -> int:
    """FastAPI dependency: extract user_id from Bearer JWT."""
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    token = authorization[7:]
    try:
        payload = jwt.decode(token, _SECRET, algorithms=[_ALGORITHM])
        return int(payload["sub"])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


@router.post("/api/auth/register", response_model=AuthResponse)
def register(req: RegisterRequest) -> AuthResponse:
    conn = sqlite3.connect(database.DB_PATH)
    try:
        password_hash = _hash_password(req.password)
        cursor = conn.execute(
            "INSERT INTO users (email, password_hash) VALUES (?, ?)",
            (req.email, password_hash),
        )
        conn.commit()
        user_id = cursor.lastrowid
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=409, detail="Email already registered")
    finally:
        conn.close()
    return AuthResponse(token=_make_token(user_id), email=req.email)


@router.post("/api/auth/login", response_model=AuthResponse)
def login(req: LoginRequest) -> AuthResponse:
    conn = sqlite3.connect(database.DB_PATH)
    try:
        row = conn.execute(
            "SELECT id, email, password_hash FROM users WHERE email = ?",
            (req.email,),
        ).fetchone()
    finally:
        conn.close()
    if not row or not _verify_password(req.password, row[2]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return AuthResponse(token=_make_token(row[0]), email=row[1])
