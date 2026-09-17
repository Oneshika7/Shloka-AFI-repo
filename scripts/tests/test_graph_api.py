import urllib.request
import json
import sys

try:
    req = urllib.request.urlopen("http://localhost:8002/api/v1/graph/full")
    data = json.loads(req.read().decode())
    
    print(f"Nodes: {len(data['nodes'])}")
    print(f"Edges: {len(data['edges'])}")
    
    for edge in data['edges']:
        if edge['from'] == 'guduchi' and edge['to'].startswith('j'):
            print("Edge:", edge)
except Exception as e:
    print(e)
