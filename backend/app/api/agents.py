from fastapi import APIRouter, HTTPException, Request
from typing import Dict, Any
from pydantic import BaseModel
from app.agents.orchestrator import AgentOrchestrator
from app.config import limiter

class ProcessRequest(BaseModel):
    shloka_text: str

class ProcessResponse(BaseModel):
    result: Dict[str, Any]

router = APIRouter(prefix="/api/v1/agents", tags=["agents"])

orchestrator = AgentOrchestrator()

from app.api.auth import get_current_user
from app.models.user_model import User
from fastapi import Depends

@router.post("/process_shloka", response_model=ProcessResponse)
@limiter.limit("5/minute")
async def process_shloka(request: Request, body: ProcessRequest, current_user: User = Depends(get_current_user)):
    """Process Sanskrit text through all processing stages"""
    try:
        result = await orchestrator.process_shloka(body.shloka_text)
        return ProcessResponse(result=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def agent_system_health():
    """Health check for agent system"""
    return {"status": "ok", "service": "agent_system"}