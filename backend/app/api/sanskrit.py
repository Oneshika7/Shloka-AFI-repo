# Placeholder for Sanskrit processing API - to be implemented
from fastapi import APIRouter
router = APIRouter(prefix="/sanskrit", tags=["sanskrit"])

@router.get("/health")
async def sanskrit_health():
    return {"status": "Sanskrit processing service is running (placeholder)"}