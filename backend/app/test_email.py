import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.email_service import send_otp_email

async def main():
    print("Sending email...")
    success = await send_otp_email("vanshika7320@gmail.com", "123456")
    print(f"Success: {success}")

if __name__ == "__main__":
    asyncio.run(main())
