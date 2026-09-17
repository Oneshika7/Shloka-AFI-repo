import urllib.request
import urllib.error
import json

BASE_URL = "http://localhost:8002/api/v1"

endpoints_to_test = [
    {"method": "GET", "url": f"{BASE_URL}/health", "data": None},
    {"method": "GET", "url": f"{BASE_URL}/shlokas", "data": None},
    {"method": "GET", "url": f"{BASE_URL}/graph/full", "data": None},
    # We will test pipeline with a simple payload
    {"method": "POST", "url": f"{BASE_URL}/pipeline", "data": {"text": "Guduchi treats Jwara and balances Pitta."}},
]

results = []

for ep in endpoints_to_test:
    req_url = ep["url"]
    method = ep["method"]
    data = ep["data"]
    
    try:
        if method == "GET":
            req = urllib.request.Request(req_url)
        else:
            json_data = json.dumps(data).encode('utf-8')
            req = urllib.request.Request(req_url, data=json_data, headers={'Content-Type': 'application/json'})
            
        with urllib.request.urlopen(req, timeout=30) as response:
            status = response.getcode()
            body = response.read().decode('utf-8')
            try:
                json_body = json.loads(body)
                summary = "Valid JSON"
                if "error" in json_body:
                    summary += f" (Contains error key: {json_body['error']})"
            except:
                summary = "Invalid JSON"
            
            results.append(f"SUCCESS: {method} {req_url} -> Status {status} | {summary}")
            
    except urllib.error.HTTPError as e:
        results.append(f"HTTP_ERROR: {method} {req_url} -> Status {e.code} | {e.reason}")
    except urllib.error.URLError as e:
        results.append(f"URL_ERROR: {method} {req_url} -> {e.reason}")
    except Exception as e:
        results.append(f"ERROR: {method} {req_url} -> {str(e)}")

for r in results:
    print(r)
