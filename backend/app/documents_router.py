import json

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from . import database
from .auth import get_current_user

router = APIRouter()


class SaveDocumentRequest(BaseModel):
    doc_type: str
    fields: dict
    title: str


class DocumentSummary(BaseModel):
    id: int
    doc_type: str
    title: str
    created_at: str


@router.post("/api/documents", response_model=DocumentSummary, status_code=201)
def save_document(req: SaveDocumentRequest, user_id: int = Depends(get_current_user)) -> DocumentSummary:
    conn = database.get_conn()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO documents (user_id, doc_type, fields_json, title) VALUES (%s, %s, %s, %s) RETURNING id, doc_type, title, created_at",
            (user_id, req.doc_type, json.dumps(req.fields), req.title),
        )
        row = cur.fetchone()
        conn.commit()
        return DocumentSummary(id=row[0], doc_type=row[1], title=row[2], created_at=str(row[3]))
    finally:
        cur.close()
        conn.close()


@router.get("/api/documents", response_model=list[DocumentSummary])
def list_documents(user_id: int = Depends(get_current_user)) -> list[DocumentSummary]:
    conn = database.get_conn()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT id, doc_type, title, created_at FROM documents WHERE user_id = %s ORDER BY created_at DESC",
            (user_id,),
        )
        rows = cur.fetchall()
        return [DocumentSummary(id=r[0], doc_type=r[1], title=r[2], created_at=str(r[3])) for r in rows]
    finally:
        cur.close()
        conn.close()


@router.get("/api/documents/{doc_id}")
def get_document(doc_id: int, user_id: int = Depends(get_current_user)) -> dict:
    conn = database.get_conn()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT id, doc_type, fields_json, title, created_at FROM documents WHERE id = %s AND user_id = %s",
            (doc_id, user_id),
        )
        row = cur.fetchone()
    finally:
        cur.close()
        conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"id": row[0], "doc_type": row[1], "fields": json.loads(row[2]), "title": row[3], "created_at": str(row[4])}


@router.delete("/api/documents/{doc_id}", status_code=204)
def delete_document(doc_id: int, user_id: int = Depends(get_current_user)) -> None:
    conn = database.get_conn()
    cur = conn.cursor()
    try:
        cur.execute(
            "DELETE FROM documents WHERE id = %s AND user_id = %s",
            (doc_id, user_id),
        )
        rowcount = cur.rowcount
        conn.commit()
    finally:
        cur.close()
        conn.close()
    if rowcount == 0:
        raise HTTPException(status_code=404, detail="Document not found")
