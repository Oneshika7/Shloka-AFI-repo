import os
import sys
sys.path.append('backend')
from app.services.graph_service import graph_service

subgraph = graph_service.get_full_graph()
print(subgraph['edges'][:5])
