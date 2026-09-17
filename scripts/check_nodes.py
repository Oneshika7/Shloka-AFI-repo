import json
import sys

with open("full_graph.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for n in data.get("nodes", []):
    if not n.get("id") or not n.get("id").strip():
        print(f"Empty ID node found: {n}")
