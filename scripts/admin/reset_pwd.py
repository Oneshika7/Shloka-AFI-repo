import os
import sys

sys.path.insert(0, "/")

from app.models.database import SessionLocal
from app.models.user_model import User
from app.api.auth import get_password_hash

def reset_password():
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == "vanshika7320@gmail.com").first()
        if user:
            print("Found user, updating password...")
            user.hashed_password = get_password_hash("Vanshika@123")
            db.commit()
            print("Password successfully reset to: Vanshika@123")
        else:
            print("User not found!")
    finally:
        db.close()

if __name__ == "__main__":
    reset_password()
