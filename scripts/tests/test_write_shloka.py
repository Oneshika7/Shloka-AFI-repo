import os
import sys
sys.path.append('backend')
from app.services.graph_service import graph_service
import uuid

shloka_id = str(uuid.uuid4())
res = graph_service.write_shloka(
    shloka_id=shloka_id,
    text="Test",
    translation="Test",
    entities=[{"name": "Guduchi", "type": "Herb", "definition": "Test"}, {"name": "Jwara", "type": "Disease", "definition": "Test"}],
    relationships=[{"source": "Guduchi", "target": "Jwara", "type": "TREATS"}]
)
print("Write Result:", res)

subgraph = graph_service.get_shloka_subgraph(shloka_id)
print("Subgraph Nodes:", len(subgraph['nodes']))
print("Subgraph Edges:", len(subgraph['edges']))
