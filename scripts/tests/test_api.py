import urllib.request
import json
import sys

url = "http://localhost:8001/analyze"
data = json.dumps({"shloka": "अश्वगन्धा"}).encode('utf-8')
headers = {'Content-Type': 'application/json'}
try:
    req = urllib.request.Request(url, data=data, headers=headers)
    res = urllib.request.urlopen(req)
    print(res.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code}")
    print(e.read().decode('utf-8'))
    sys.exit(1)
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
