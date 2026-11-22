import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.models.database import SessionLocal
from app.models.user_model import User
from app.api.auth import get_password_hash

db = SessionLocal()
user = db.query(User).filter(User.email == "admin@shloka.com").first()
if user:
    user.hashed_password = get_password_hash("Vanshika1")
    user.is_verified = True
    db.commit()
    print("Password reset to Admin@123")
else:
    print("User not found")
db.close()
