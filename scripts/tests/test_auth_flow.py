import httpx
import sqlite3
import hashlib
import json

API_BASE = "http://localhost:8002"

def test_flow():
    print("1. Registering user tester123@shloka.com...")
    reg_res = httpx.post(f"{API_BASE}/api/v1/auth/register", json={
        "email": "tester123@shloka.com",
        "password": "Tester@123",
        "name": "Tester",
        "organization": "TestOrg"
    })
    print(f"Register status: {reg_res.status_code}")
    print(reg_res.text)

    if reg_res.status_code == 200:
        print("\n2. Getting OTP from database (simulating email receipt)...")
        # We don't have the unhashed OTP, but wait! The OTP is hashed in the DB.
        # So we can't test verify-email from outside without reading logs!
        pass

if __name__ == "__main__":
    test_flow()
