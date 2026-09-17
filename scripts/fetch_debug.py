import urllib.request
import json
import sys

try:
    req = urllib.request.urlopen("http://localhost:8002/api/v1/shlokas")
    data = json.loads(req.read().decode())
    shloka_id = data["shlokas"][0]["id"]
    print("Shloka ID:", shloka_id)
    
    req2 = urllib.request.urlopen(f"http://localhost:8002/api/v1/graph/visualize/{shloka_id}")
    graph_data = json.loads(req2.read().decode())
    with open("shloka_graph_debug.json", "w", encoding="utf-8") as f:
        json.dump(graph_data, f, ensure_ascii=False, indent=2)
    print("Graph data saved to shloka_graph_debug.json")
    
except Exception as e:
    print(e)
