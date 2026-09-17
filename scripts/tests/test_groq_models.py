import os
import httpx
from dotenv import load_dotenv

load_dotenv("backend/services/sanskrit_processor/.env")

groq_key = os.getenv("GROQ_API_KEY")

response = httpx.get(
    "https://api.groq.com/openai/v1/models",
    headers={"Authorization": f"Bearer {groq_key}"}
)

models = response.json().get("data", [])
for m in models:
    print(m.get("id"))
