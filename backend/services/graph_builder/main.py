from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Knowledge Graph Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/v1/health")
async def health():
    return {"status": "ok", "service": "knowledge-graph", "version": "0.1.0"}

@app.post("/api/v1/build")
async def build_graph(payload: dict):
    """
    Build knowledge graph from entities and relationships.
    For now, returns a simple success response.
    """
    entities = payload.get("entities", [])
    relationships = payload.get("relationships", [])
    # TODO: Implement actual graph building logic (e.g., with Neo4j)

    return {
        "success": True,
        "entities_processed": len(entities),
        "relationships_processed": len(relationships),
        "message": "Graph built successfully"
    }


@app.get("/api/v1/graph/stats")
async def graph_stats():
    """
    Get graph statistics.
    Returns mock statistics for now.
    """
    # TODO: Replace with actual queries to Neo4j and Postgres
    return {
        "total_nodes": 56,
        "total_relationships": 166,
        "total_shlokas": 42,
        "node_types": {},
        "relationship_types": {}
    }