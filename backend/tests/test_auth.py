def test_register_success(client):
    res = client.post("/api/auth/register", json={"email": "a@b.com", "password": "pass1234"})
    assert res.status_code == 200
    body = res.json()
    assert body["email"] == "a@b.com"
    assert "token" in body
    assert len(body["token"]) > 10


def test_register_duplicate_email(client):
    client.post("/api/auth/register", json={"email": "a@b.com", "password": "pass1234"})
    res = client.post("/api/auth/register", json={"email": "a@b.com", "password": "other"})
    assert res.status_code == 409


def test_login_success(client):
    client.post("/api/auth/register", json={"email": "a@b.com", "password": "pass1234"})
    res = client.post("/api/auth/login", json={"email": "a@b.com", "password": "pass1234"})
    assert res.status_code == 200
    body = res.json()
    assert body["email"] == "a@b.com"
    assert "token" in body


def test_login_wrong_password(client):
    client.post("/api/auth/register", json={"email": "a@b.com", "password": "pass1234"})
    res = client.post("/api/auth/login", json={"email": "a@b.com", "password": "wrong"})
    assert res.status_code == 401


def test_login_unknown_email(client):
    res = client.post("/api/auth/login", json={"email": "nobody@b.com", "password": "pass"})
    assert res.status_code == 401


def test_protected_route_without_token(client):
    res = client.get("/api/documents")
    assert res.status_code == 422


def test_protected_route_invalid_token(client):
    res = client.get("/api/documents", headers={"Authorization": "Bearer notavalidtoken"})
    assert res.status_code == 401
