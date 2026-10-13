import sqlite3
from pathlib import Path

ROOT = Path(__file__).parent.parent.parent
DB_PATH = ROOT / "data" / "users.db"

# Ensure the data/ directory always exists (important when sharing as zip)
DB_PATH.parent.mkdir(parents=True, exist_ok=True)


def init_db():
    con = sqlite3.connect(DB_PATH, check_same_thread=False)
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
    con = sqlite3.connect(DB_PATH, check_same_thread=False)
    try:
        yield con
    finally:
        con.close()
