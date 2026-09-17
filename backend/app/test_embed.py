import httpx
import asyncio

async def main():
    async with httpx.AsyncClient() as client:
        try:
            res = await client.post("http://sanskrit_processor:8001/embed", json={"text": "hello"})
            print("Status:", res.status_code)
            print("Body:", res.text[:200])
        except Exception as e:
            print("Error:", e)

asyncio.run(main())
