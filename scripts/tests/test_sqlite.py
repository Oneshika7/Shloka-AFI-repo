import sqlite3
import sys

try:
    c = sqlite3.connect('backend/shloka.db')
    cursor = c.cursor()
    cursor.execute('SELECT count(*) FROM shlokas')
    count = cursor.fetchone()[0]
    print(f"Shlokas count in sqlite: {count}")
    
    # Check tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = cursor.fetchall()
    print(f"Tables: {tables}")
except Exception as e:
    print(f"Error: {e}")
