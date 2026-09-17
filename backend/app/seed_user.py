import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.models.database import SessionLocal, engine, Base
from app.models.user_model import User
from app.api.auth import get_password_hash

Base.metadata.create_all(bind=engine)

db = SessionLocal()

admin = db.query(User).filter(User.email == "admin@shloka.com").first()
if not admin:
    hashed = get_password_hash("admin123")
    new_admin = User(
        name="Admin",
        email="admin@shloka.com",
        hashed_password=hashed,
        organization="Shloka-AFI"
    )
    db.add(new_admin)
    db.commit()
    print("Admin user created: admin@shloka.com / admin123")
else:
    print("Admin user already exists.")

db.close()
