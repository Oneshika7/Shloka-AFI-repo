import os
import sys
from neo4j import GraphDatabase
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load env
load_dotenv(".env")
NEO4J_URI = "bolt://neo4j:7687"
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "shloka123")

POSTGRES_USER = os.getenv("POSTGRES_USER", "shloka")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "shloka123")
POSTGRES_DB = os.getenv("POSTGRES_DB", "shloka")
# Connect to postgres running on docker network
DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@postgres:5432/{POSTGRES_DB}"

# Setup Neo4j
driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

# Setup Postgres
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def restore_shlokas():
    # 1. Fetch from Neo4j
    shlokas_data = []
    with driver.session() as session:
        # Some fields might not exist in Neo4j depending on how they were seeded
        result = session.run("MATCH (s:Shloka) RETURN s.id as id, s.text as text, coalesce(s.source, 'Uncategorized') as source, coalesce(s.translation, 'N/A') as translation")
        for record in result:
            shlokas_data.append({
                "id": record["id"],
                "text": record["text"],
                "source": record["source"],
                "translation": record["translation"]
            })
    
    print(f"Found {len(shlokas_data)} Shlokas in Neo4j.")
    
    if len(shlokas_data) == 0:
        print("No shlokas in Neo4j to restore.")
        return

    # 2. Insert into Postgres
    db = SessionLocal()
    from app.models.shloka_model import Shloka
    try:
        count = 0
        for data in shlokas_data:
            # Check if exists
            exists = db.query(Shloka).filter(Shloka.id == data["id"]).first()
            if not exists:
                new_shloka = Shloka(
                    id=data["id"],
                    text=data["text"],
                    source=data["source"],
                    translation=data["translation"]
                )
                db.add(new_shloka)
                count += 1
        db.commit()
        print(f"Successfully restored {count} Shlokas to Postgres.")
    except Exception as e:
        print(f"Error restoring: {e}")
        db.rollback()
    finally:
        db.close()
        driver.close()

if __name__ == "__main__":
    import sys
    import os
    # Add root to sys path so 'app' module can be resolved
    sys.path.insert(0, "/")
    sys.path.append(os.path.join(os.path.dirname(__file__), "backend"))
    restore_shlokas()
