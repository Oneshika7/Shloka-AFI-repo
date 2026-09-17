import asyncio
import httpx

async def main():
    async with httpx.AsyncClient() as client:
        res = await client.post("http://localhost:8002/api/v1/auth/login", data={"username": "admin@shloka.com", "password": "Password123!"})
        print("Login:", res.status_code, res.json())
        
        res2 = await client.post("http://localhost:8002/api/v1/auth/verify-otp", json={"email": "admin@shloka.com", "otp": "123456"})
        print("Verify:", res2.status_code, res2.json())

asyncio.run(main())
