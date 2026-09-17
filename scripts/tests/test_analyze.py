import httpx

try:
    response = httpx.post("http://127.0.0.1:8007/analyze", json={"shloka": "om namah shivaya"}, timeout=30)
    print(response.status_code)
except Exception as e:
    print(e)
