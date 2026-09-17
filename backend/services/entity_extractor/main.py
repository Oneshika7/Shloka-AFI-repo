from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Entity Extractor Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/v1/health")
async def health():
    return {"status": "ok", "service": "entity-extractor", "version": "0.1.0"}

@app.post("/api/v1/extract")
async def extract_entities(payload: dict):
    """
    Extract entities and relationships from text.
    For now, returns empty arrays (pass-through).
    """
    text = payload.get("text", "")
    # TODO: Implement actual NER logic for Sanskrit
    # For now, return empty entities and relationships

    return {
        "entities": [],
        "relationships": []
    }