import os
import sys

# Add backend to path so we can import
sys.path.append(os.path.join(os.path.dirname(__file__), "backend", "app"))

from app.models.database import SessionLocal
from app.models.user_model import User
from datetime import datetime, timezone, timedelta

def fix():
    db = SessionLocal()
    user = db.query(User).filter(User.email == "admin@shloka.com").first()
    if user:
        user.otp_code = "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92"
        user.otp_expiry = datetime.now(timezone.utc) + timedelta(hours=24)
        db.commit()
        print("OTP updated successfully!")
    else:
        print("Admin user not found")
    db.close()

if __name__ == "__main__":
    fix()
