import httpx

# 1x1 transparent PNG
valid_b64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="

try:
    response = httpx.post("http://127.0.0.1:8007/transcribe", json={"image_base64": valid_b64}, timeout=30)
    print(response.status_code)
    print(response.text)
except Exception as e:
    print(e)
