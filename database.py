import sqlite3
import random
import string

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

# Add candidate to database
def add_candidate(name):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("INSERT OR IGNORE INTO candidates (candidate_name) VALUES (?)", (name,))
    conn.commit()
    conn.close()

# Fetch all candidates from database
def get_all_candidates():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("SELECT candidate_name FROM candidates")
    candidates = [row[0] for row in cursor.fetchall()]
    conn.close()
    return candidates

# Generate unique token in format ABC123
def generate_unique_token():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    while True:
        # Generate 3 random uppercase letters and 3 random numbers
        letters = ''.join(random.choices(string.ascii_uppercase, k=3))
        numbers = ''.join(random.choices(string.numbers, k=3))
        token = letters + numbers
        
        # Check if token already exists in database
        cursor.execute("SELECT token FROM voters WHERE token = ?", (token,))
        if cursor.fetchone() is None:
            conn.close()
            return token

# Check if voter with same info already exists in database
def is_voter_registered(name, dob):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM voters WHERE voter_name = ? AND date_of_birth = ?", (name, dob))
    result = cursor.fetchone()
    conn.close()
    return result is not None

# Add voter to database
def add_voter(name, dob, address, token):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO voters (voter_name, date_of_birth, address, token, token_used)
        VALUES (?, ?, ?, ?, 0)
    """, (name, dob, address, token))
    conn.commit()
    conn.close()

# Check if token is valid and unused
def is_token_valid(token):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("SELECT token FROM voters WHERE token=? AND token_used=0", (token,))
    result = cursor.fetchone()
    conn.close()
    return result is not None

# Mark token as used by changing from 0 to 1
def mark_token_used(token):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("UPDATE voters SET token_used = 1 WHERE token = ?", (token,))
    conn.commit()
    conn.close()