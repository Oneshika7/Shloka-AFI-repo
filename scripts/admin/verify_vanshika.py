import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from backend.app.models.database import SessionLocal
from backend.app.models.user_model import User

def force_verify():
    db = SessionLocal()
    user = db.query(User).filter(User.email == "vanshika7320@gmail.com").first()
    if user:
        print("Found user. Setting is_verified=True...")
        user.is_verified = True
        user.otp_code = None
        user.otp_expiry = None
        db.commit()
        print("Success! User verified.")
    else:
        print("User not found in DB!")

if __name__ == "__main__":
    force_verify()
