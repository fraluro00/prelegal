import pytest
from fastapi.testclient import TestClient

import app.database as db_module
from app.main import app


@pytest.fixture
def client(tmp_path):
    db_module.DB_PATH = tmp_path / "test.db"
    with TestClient(app) as c:
        yield c


@pytest.fixture
def auth_client(client):
    """TestClient with a registered user; yields (client, token)."""
    res = client.post("/api/auth/register", json={"email": "test@example.com", "password": "password123"})
    assert res.status_code == 200
    token = res.json()["token"]
    return client, token
