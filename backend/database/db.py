import sqlite3
from pathlib import Path

ROOT = Path(__file__).parent.parent.parent
DB_PATH = ROOT / "data" / "users.db"

def init_db():
    con = sqlite3.connect(DB_PATH)
    con.execute(
        "CREATE TABLE IF NOT EXISTS users(email TEXT PRIMARY KEY, name TEXT, password TEXT)"
    )
    con.execute(
        """CREATE TABLE IF NOT EXISTS predictions(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT,
            image_ref TEXT,
            disease TEXT,
            confidence REAL,
            model TEXT,
            date_time TEXT,
            language TEXT
        )"""
    )
    con.commit()
    con.close()

def get_db():
    con = sqlite3.connect(DB_PATH)
    try:
        yield con
    finally:
        con.close()
