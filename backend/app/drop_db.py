from app.models.database import engine
from sqlalchemy import text

print("Dropping shlokas table...", flush=True)
with engine.begin() as conn:
    conn.execute(text("DROP TABLE IF EXISTS shlokas CASCADE"))
print("Done.", flush=True)
