from sqlalchemy import Column, String, DateTime
from datetime import datetime, timezone
import uuid
from app.models.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(255), nullable=True) # Optional, for anonymous requests
    action = Column(String(255), nullable=False)
    endpoint = Column(String(255), nullable=False)
    method = Column(String(10), nullable=False)
    ip_address = Column(String(50), nullable=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class BlacklistedToken(Base):
    __tablename__ = "blacklisted_tokens"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    token = Column(String(1024), nullable=False, unique=True, index=True)
    blacklisted_on = Column(DateTime, default=lambda: datetime.now(timezone.utc))
