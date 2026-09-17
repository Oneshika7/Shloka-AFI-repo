from app.models.database import SessionLocal
from app.models.user_model import User
db = SessionLocal()
users = db.query(User).all()
for u in users:
    print(f"Email: {u.email}, Hash: {u.hashed_password}, Verified: {u.is_verified}")
