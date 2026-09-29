from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import sqlite3
from ..database.db import get_db
from ..utils.auth import hash_password, create_access_token

router = APIRouter()

class AuthPayload(BaseModel):
    email: str
    password: str
    name: str = ""

@router.post("/signup")
async def signup(payload: AuthPayload, con: sqlite3.Connection = Depends(get_db)):
    if not (payload.name and payload.email and payload.password):
        raise HTTPException(400, "All fields required.")
    try:
        con.execute("INSERT INTO users VALUES (?,?,?)", (payload.email, payload.name, hash_password(payload.password)))
        con.commit()
    except sqlite3.IntegrityError:
        raise HTTPException(409, "account_exists")
    
    token = create_access_token(data={"sub": payload.email})
    return {"name": payload.name, "email": payload.email, "token": token}

@router.post("/login")
async def login(payload: AuthPayload, con: sqlite3.Connection = Depends(get_db)):
    row = con.execute("SELECT name FROM users WHERE email=? AND password=?", (payload.email, hash_password(payload.password))).fetchone()
    if not row:
        raise HTTPException(401, "invalid_credentials")
    
    token = create_access_token(data={"sub": payload.email})
    return {"name": row[0], "email": payload.email, "token": token}
