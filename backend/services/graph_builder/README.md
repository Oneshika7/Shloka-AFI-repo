# Graph Builder Service

**Owner**: P3 Team (Knowledge Graph Specialists)

This service manages the Ayurvedic knowledge graph storage and querying capabilities. It provides:
- Entity and relationship persistence in Neo4j
- Graph visualization data generation
- Pathfinding and relationship querying
- Statistical analysis of graph contents

## Responsibilities
- Accept entities and relationships from NLP pipeline
- Store them in Neo4j graph database
- Provide Cypher query interface for complex traversals
- Generate visualization-ready graph data
- Maintain graph integrity and avoid duplicates

## Current Status
- Neo4j integration complete and tested
- Basic CRUD operations functional
- Visualization endpoint returning vis.js format
- Statistics tracking (nodes, edges, shlokas)
