import sqlite3

DB_NAME = "votes.db"

def create_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    # Create voters table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS voters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        voter_name TEXT NOT NULL,
        date_of_birth TEXT NOT NULL,
        address TEXT NOT NULL,
        token TEXT NOT NULL UNIQUE,
        token_used INTEGER DEFAULT 0
    )
    """)
    # Create candidates table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS candidates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        candidate_name TEXT NOT NULL UNIQUE
    )
    """)
    conn.commit()
    conn.close()

def add_candidate(name):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("INSERT OR IGNORE INTO candidates (candidate_name) VALUES (?)", (name,))
    conn.commit()
    conn.close()

def mark_token_used(token):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("UPDATE voters SET token_used = 1 WHERE token = ?", (token,))
    conn.commit()
    conn.close()

def is_token_valid(token):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("SELECT token FROM voters WHERE token=? AND token_used=0", (token,))
    result = cursor.fetchone()
    conn.close()
    return result is not None