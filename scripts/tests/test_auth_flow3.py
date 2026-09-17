import httpx

API_BASE = "http://localhost:8002"

def test_flow():
    print("1. Registering user...")
    reg_res = httpx.post(f"{API_BASE}/api/v1/auth/register", json={
        "email": "test789@shloka.com",
        "password": "Password@123",
        "name": "Quick Tester",
        "organization": "TestOrg"
    })
    print(f"Register status: {reg_res.status_code}")
    print(reg_res.text)

    print("\n2. Logging in...")
    login_res = httpx.post(f"{API_BASE}/api/v1/auth/login", data={
        "username": "test789@shloka.com",
        "password": "Password@123"
    })
    print(f"Login status: {login_res.status_code}")
    print(login_res.text)

if __name__ == "__main__":
    test_flow()
