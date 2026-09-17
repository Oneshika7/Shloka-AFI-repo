import httpx
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.models.database import SessionLocal
from app.models.user_model import User

API_BASE = "http://localhost:8002"

def test_flow():
    # 1. Register
    print("1. Registering user quicktest@shloka.com...")
    reg_res = httpx.post(f"{API_BASE}/api/v1/auth/register", json={
        "email": "quicktest@shloka.com",
        "password": "QuickTest@123",
        "name": "Quick Tester",
        "organization": "TestOrg"
    })
    print(f"Register status: {reg_res.status_code}")
    print(reg_res.text)

    # 2. To get the OTP since Brevo sent it to a fake email, we must reset the user's OTP to a known hash or just get it if we had the raw one.
    # Since it's hashed in the DB, we can't reverse it. We will just bypass verification in DB for this test script so we can test Login.
    print("\n2. Activating account in database...")
    db = SessionLocal()
    user = db.query(User).filter(User.email == "quicktest@shloka.com").first()
    if user:
        user.is_verified = True
        db.commit()
        print("User activated.")
    
    # 3. Login
    print("\n3. Logging in...")
    login_res = httpx.post(f"{API_BASE}/api/v1/auth/login", data={
        "username": "quicktest@shloka.com",
        "password": "QuickTest@123"
    })
    print(f"Login status: {login_res.status_code}")
    print(login_res.text)

if __name__ == "__main__":
    test_flow()
