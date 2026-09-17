import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, "/app")

from app.models.database import engine
from sqlalchemy import text, inspect

insp = inspect(engine)
cols = [c["name"] for c in insp.get_columns("users")]
print("Existing columns:", cols)

with engine.begin() as conn:
    for col_name, col_def in [
        ("failed_otp_attempts", "INTEGER DEFAULT 0"),
        ("password_reset_token_hash", "VARCHAR(64)"),
        ("password_reset_expiry", "TIMESTAMP"),
        ("is_verified", "BOOLEAN DEFAULT false"),
        ("otp_code", "VARCHAR(64)"),
        ("otp_expiry", "TIMESTAMP"),
    ]:
        if col_name not in cols:
            conn.execute(text(f"ALTER TABLE users ADD COLUMN {col_name} {col_def}"))
            print(f"Added: {col_name}")
        else:
            print(f"Already exists: {col_name}")

with engine.begin() as conn:
    conn.execute(text("ALTER TABLE users ALTER COLUMN otp_code TYPE VARCHAR(64)"))
    print("Updated otp_code column to VARCHAR(64)")

# Also mark all existing users as verified so they can log in
with engine.begin() as conn:
    conn.execute(text("UPDATE users SET is_verified = true WHERE is_verified IS NULL OR is_verified = false"))
    print("Marked all existing users as verified")

print("Migration complete!")
