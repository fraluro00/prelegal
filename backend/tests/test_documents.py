SAMPLE_FIELDS = {"party1Company": "Acme", "party2Company": "Beta"}


def test_list_documents_empty(auth_client):
    client, token = auth_client
    res = client.get("/api/documents", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    assert res.json() == []


def test_save_document(auth_client):
    client, token = auth_client
    res = client.post(
        "/api/documents",
        json={"doc_type": "Mutual-NDA.md", "fields": SAMPLE_FIELDS, "title": "NDA — Acme & Beta"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res.status_code == 201
    body = res.json()
    assert body["title"] == "NDA — Acme & Beta"
    assert body["doc_type"] == "Mutual-NDA.md"
    assert "id" in body


def test_list_documents_after_save(auth_client):
    client, token = auth_client
    client.post(
        "/api/documents",
        json={"doc_type": "Mutual-NDA.md", "fields": SAMPLE_FIELDS, "title": "NDA — Acme & Beta"},
        headers={"Authorization": f"Bearer {token}"},
    )
    res = client.get("/api/documents", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    docs = res.json()
    assert len(docs) == 1
    assert docs[0]["title"] == "NDA — Acme & Beta"


def test_get_document(auth_client):
    client, token = auth_client
    saved = client.post(
        "/api/documents",
        json={"doc_type": "Mutual-NDA.md", "fields": SAMPLE_FIELDS, "title": "NDA"},
        headers={"Authorization": f"Bearer {token}"},
    ).json()
    res = client.get(f"/api/documents/{saved['id']}", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    body = res.json()
    assert body["fields"] == SAMPLE_FIELDS
    assert body["doc_type"] == "Mutual-NDA.md"


def test_delete_document(auth_client):
    client, token = auth_client
    saved = client.post(
        "/api/documents",
        json={"doc_type": "Mutual-NDA.md", "fields": SAMPLE_FIELDS, "title": "NDA"},
        headers={"Authorization": f"Bearer {token}"},
    ).json()
    res = client.delete(f"/api/documents/{saved['id']}", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 204
    res2 = client.get(f"/api/documents/{saved['id']}", headers={"Authorization": f"Bearer {token}"})
    assert res2.status_code == 404


def test_cannot_access_other_users_document(client):
    user1 = client.post("/api/auth/register", json={"email": "u1@x.com", "password": "pass1234"}).json()
    user2 = client.post("/api/auth/register", json={"email": "u2@x.com", "password": "pass1234"}).json()
    saved = client.post(
        "/api/documents",
        json={"doc_type": "Mutual-NDA.md", "fields": SAMPLE_FIELDS, "title": "NDA"},
        headers={"Authorization": f"Bearer {user1['token']}"},
    ).json()
    res = client.get(f"/api/documents/{saved['id']}", headers={"Authorization": f"Bearer {user2['token']}"})
    assert res.status_code == 404


def test_documents_scoped_to_user(client):
    user1 = client.post("/api/auth/register", json={"email": "u1@x.com", "password": "pass1234"}).json()
    user2 = client.post("/api/auth/register", json={"email": "u2@x.com", "password": "pass1234"}).json()
    client.post(
        "/api/documents",
        json={"doc_type": "Mutual-NDA.md", "fields": SAMPLE_FIELDS, "title": "NDA"},
        headers={"Authorization": f"Bearer {user1['token']}"},
    )
    res = client.get("/api/documents", headers={"Authorization": f"Bearer {user2['token']}"})
    assert res.json() == []
