import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.api.routes import router
from app.api.auth import router as auth_router
from app.api.agents import router as agent_router
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from starlette.middleware.base import BaseHTTPMiddleware
from app.config import limiter

app = FastAPI(title="Shloka-AFI")

# Rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Security headers middleware
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        return response

from app.models.database import SessionLocal
from app.models.security_model import AuditLog

class AuditMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        if request.method in ["POST", "PUT", "DELETE", "PATCH"]:
            db = SessionLocal()
            try:
                audit = AuditLog(
                    action=f"{request.method} request to {request.url.path}",
                    endpoint=request.url.path,
                    method=request.method,
                    ip_address=request.client.host if request.client else "unknown"
                )
                db.add(audit)
                db.commit()
            except Exception as e:
                print(f"Audit log failed: {e}")
            finally:
                db.close()
        return response

app.add_middleware(AuditMiddleware)
app.add_middleware(SecurityHeadersMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api/v1")
app.include_router(auth_router, prefix="/api/v1/auth")
app.include_router(agent_router)

from app.models.database import engine, Base
from app.models import shloka_model, user_model, security_model
from sqlalchemy import text

@app.on_event("startup")
async def startup():
    if not engine.url.drivername.startswith("sqlite"):
        with engine.begin() as conn:
            conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
    Base.metadata.create_all(bind=engine)
    print("Shloka-AFI main API running on port 8000")