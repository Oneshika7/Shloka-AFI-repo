from app.models.database import SessionLocal
from app.models.user_model import User
from app.api.auth import hash_otp
from datetime import datetime, timezone

db = SessionLocal()
user = db.query(User).filter(User.email == "admin@shloka.com").first()

print(f"User email: {repr(user.email)}")
print(f"User OTP code: {user.otp_code}")
print(f"Hash of '123456': {hash_otp('123456')}")
print(f"Matches? {hash_otp('123456') == user.otp_code}")
print(f"Expiry: {user.otp_expiry}")
print(f"Now (UTC, naive): {datetime.now(timezone.utc).replace(tzinfo=None)}")
if user.otp_expiry:
    print(f"Expired? {datetime.now(timezone.utc).replace(tzinfo=None) > user.otp_expiry}")
else:
    print("Expired? NO EXPIRY")
print(f"Failed attempts: {user.failed_otp_attempts}")
db.close()
