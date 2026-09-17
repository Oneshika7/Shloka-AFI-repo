import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend"))

from app.models.database import SessionLocal
from app.models.user_model import User

def fix_users():
    db = SessionLocal()
    try:
        users = db.query(User).all()
        for user in users:
            print(f"Updating {user.email}: is_verified = {user.is_verified} -> True")
            user.is_verified = True
        db.commit()
        print("Successfully verified all users!")
    finally:
        db.close()

if __name__ == "__main__":
    fix_users()
