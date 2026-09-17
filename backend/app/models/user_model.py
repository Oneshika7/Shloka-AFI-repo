from sqlalchemy import Column, String, DateTime, Boolean, Integer
import uuid
from datetime import datetime, timezone
from app.models.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=True, unique=True, index=True)
    hashed_password = Column(String(255), nullable=True)
    organization = Column(String(255), nullable=True)
    theme = Column(String(20), default="dark")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    # OTP Authentication Fields  (OTP stored as SHA-256 hash, never plaintext)
    otp_code = Column(String(64), nullable=True)   # SHA-256 hex digest
    otp_expiry = Column(DateTime, nullable=True)
    is_verified = Column(Boolean, default=False)
    failed_otp_attempts = Column(Integer, default=0)  # Account lockout counter

    # Password Reset Fields  (token stored as SHA-256 hash, never plaintext)
    password_reset_token_hash = Column(String(64), nullable=True)
    password_reset_expiry = Column(DateTime, nullable=True)
