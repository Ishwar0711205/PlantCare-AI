from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import sqlite3
from ..database.db import get_db
from ..utils.auth import get_current_user
import json

router = APIRouter()

class HistoryEntry(BaseModel):
    image_ref: str = ""
    disease: str
    confidence: float
    model: str
    date_time: str
    language: str = "English"

@router.post("/history")
async def save_history(entry: HistoryEntry, email: str = Depends(get_current_user), con: sqlite3.Connection = Depends(get_db)):
    con.execute(
        "INSERT INTO predictions (email, image_ref, disease, confidence, model, date_time, language) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (email, entry.image_ref, entry.disease, entry.confidence, entry.model, entry.date_time, entry.language)
    )
    con.commit()
    return {"status": "ok"}

@router.get("/history")
async def get_history(email: str = Depends(get_current_user), con: sqlite3.Connection = Depends(get_db)):
    rows = con.execute(
        "SELECT id, image_ref, disease, confidence, model, date_time, language FROM predictions WHERE email = ? ORDER BY id DESC LIMIT 50",
        (email,)
    ).fetchall()
    
    result = []
    for r in rows:
        result.append({
            "id": r[0],
            "image_ref": r[1],
            "disease": r[2],
            "confidence": r[3],
            "model": r[4],
            "date_time": r[5],
            "language": r[6]
        })
    return result

@router.delete("/history/{item_id}")
async def delete_history(item_id: int, email: str = Depends(get_current_user), con: sqlite3.Connection = Depends(get_db)):
    con.execute("DELETE FROM predictions WHERE id = ? AND email = ?", (item_id, email))
    con.commit()
    return {"status": "ok"}
