from app.models.database import SessionLocal
from app.models.user_model import User
from app.api.auth import get_password_hash

db = SessionLocal()
admin = db.query(User).filter(User.email == "admin@shloka.com").first()
if admin:
    admin.hashed_password = get_password_hash("Password123!")
    admin.is_verified = True
    db.commit()
    print("Admin updated: Password123! and is_verified=True")
else:
    print("Admin not found!")
