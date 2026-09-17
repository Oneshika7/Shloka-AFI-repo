import httpx
import json

response = httpx.post(
    "http://localhost:8002/api/v1/pipeline",
    json={"text": "अहं गच्छामि"} 
)
print(response.status_code)
print(json.dumps(response.json(), indent=2))
