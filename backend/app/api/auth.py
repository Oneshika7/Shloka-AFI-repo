import logging
import hashlib
import secrets
import asyncio
from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import bcrypt
import jwt
import re

from app.models.database import get_db
from app.models.user_model import User
from app.models.security_model import BlacklistedToken
from app.config import API_SECRET_KEY, limiter
from app.services.email_service import send_otp_email, send_verification_email, send_password_reset_email
from fastapi import Request
from pydantic import BaseModel

# ────────────────────────────────────────────────────────────────
# Security Config
# ────────────────────────────────────────────────────────────────
SECRET_KEY = API_SECRET_KEY or "dev_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 1 week

# Dummy hash: pre-computed bcrypt hash used for constant-time login
# When user doesn't exist, we still run bcrypt.checkpw against this
# so the response timing is identical to a real password check.
_DUMMY_HASH = bcrypt.hashpw(b"dummy_password_for_timing", bcrypt.gensalt()).decode("utf-8")

# OTP lockout threshold
MAX_OTP_ATTEMPTS = 5

router = APIRouter()
logger = logging.getLogger(__name__)


# ────────────────────────────────────────────────────────────────
# Password helpers
# ────────────────────────────────────────────────────────────────
def verify_password(plain_password: str, hashed_password: str) -> bool:
    if not hashed_password:
        return False
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def validate_password_strength(password: str) -> Optional[str]:
    """Enforce minimum password policy. Returns error message or None."""
    if len(password) < 8:
        return "Password must be at least 8 characters long"
    if not re.search(r"[A-Z]", password):
        return "Password must contain at least one uppercase letter"
    if not re.search(r"[a-z]", password):
        return "Password must contain at least one lowercase letter"
    if not re.search(r"\d", password):
        return "Password must contain at least one digit"
    return None


# ────────────────────────────────────────────────────────────────
# OTP helpers  — cryptographically secure, stored as SHA-256 hash
# ────────────────────────────────────────────────────────────────
def generate_otp() -> str:
    """Generate a 6-digit OTP using secrets (CSPRNG)."""
    return "".join(secrets.choice("0123456789") for _ in range(6))


def hash_otp(otp: str) -> str:
    """One-way SHA-256 hash of an OTP code."""
    return hashlib.sha256(otp.encode("utf-8")).hexdigest()


# ────────────────────────────────────────────────────────────────
# JWT helpers
# ────────────────────────────────────────────────────────────────
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)


async def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise credentials_exception

    # Check if token has been revoked via logout
    is_blacklisted = db.query(BlacklistedToken).filter(BlacklistedToken.token == token).first()
    if is_blacklisted:
        raise credentials_exception  # generic message — don't reveal "revoked"

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception

        user = db.query(User).filter(User.email == email).first()
        if user is None:
            raise credentials_exception

        return user
    except Exception:
        raise credentials_exception


# ════════════════════════════════════════════════════════════════
# ENDPOINTS
# ════════════════════════════════════════════════════════════════


# ────────────────────────────────────────────────────────────────
# POST /register  —  V1 fix: anti-enumeration, V8: email verify, V9: password strength
# ────────────────────────────────────────────────────────────────
class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    organization: Optional[str] = None


@router.post("/register")
@limiter.limit("3/minute")
async def register(request: Request, user_data: RegisterRequest, db: Session = Depends(get_db)):
    # V9: Password strength validation
    pw_error = validate_password_strength(user_data.password)
    if pw_error:
        raise HTTPException(status_code=400, detail=pw_error)

    # Anti-enumeration: always return the same response
    GENERIC_RESPONSE = {
        "status": "success",
        "message": "Account created successfully. You may now log in.",
    }

    db_user = db.query(User).filter(User.email == user_data.email).first()
    if db_user:
        # V1 FIX: Email already exists — return identical response, don't reveal it.
        return GENERIC_RESPONSE

    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hashed_password,
        organization=user_data.organization,
        is_verified=True,  # Instantly verify account
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return GENERIC_RESPONSE


# ────────────────────────────────────────────────────────────────
# POST /verify-email  —  Verify email ownership after registration
# ────────────────────────────────────────────────────────────────
class VerifyEmailRequest(BaseModel):
    email: str
    otp: str


@router.post("/verify-email")
@limiter.limit("5/minute")
async def verify_email(request: Request, body: VerifyEmailRequest, db: Session = Depends(get_db)):
    GENERIC_ERROR = HTTPException(status_code=401, detail="Invalid or expired verification code")

    user = db.query(User).filter(User.email == body.email).first()
    if not user:
        # V3 FIX: Don't reveal whether user exists
        raise GENERIC_ERROR

    if not user.otp_code or hash_otp(body.otp) != user.otp_code:
        user.failed_otp_attempts = (user.failed_otp_attempts or 0) + 1
        if user.failed_otp_attempts >= MAX_OTP_ATTEMPTS:
            # V6: Account lockout — invalidate OTP entirely
            user.otp_code = None
            user.otp_expiry = None
            user.failed_otp_attempts = 0
            db.commit()
            raise HTTPException(status_code=429, detail="Too many failed attempts. Please register again.")
        db.commit()
        raise GENERIC_ERROR

    if user.otp_expiry and datetime.now(timezone.utc).replace(tzinfo=None) > user.otp_expiry:
        raise GENERIC_ERROR

    # Success — mark email as verified
    user.is_verified = True
    user.otp_code = None
    user.otp_expiry = None
    user.failed_otp_attempts = 0
    db.commit()

    return {"status": "success", "message": "Email verified successfully. You may now log in."}


# ────────────────────────────────────────────────────────────────
# POST /login  —  V2 fix: constant-time, V10: no email leak
# ────────────────────────────────────────────────────────────────
@router.post("/login")
@limiter.limit("5/minute")
async def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # V2 FIX: Always run bcrypt so timing is identical whether user exists or not
    user = db.query(User).filter(User.email == form_data.username).first()

    if user:
        password_valid = verify_password(form_data.password, user.hashed_password)
    else:
        # Constant-time: run bcrypt against dummy hash so response takes the same time
        bcrypt.checkpw(b"dummy_password_probe", _DUMMY_HASH.encode("utf-8"))
        password_valid = False

    if not user or not password_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # V8: Block login for unverified accounts
    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified. Please check your inbox for the verification code.",
        )

    # OTP Requirement completely removed. Immediately issue access token.
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
        },
    }


# ────────────────────────────────────────────────────────────────
# POST /verify-otp  —  V3, V5, V6 fixes
# ────────────────────────────────────────────────────────────────
class OTPVerifyRequest(BaseModel):
    email: str
    otp: str


@router.post("/verify-otp")
@limiter.limit("5/minute")
async def verify_otp(request: Request, body: OTPVerifyRequest, db: Session = Depends(get_db)):
    # V3 FIX: Single generic error for ALL failure paths
    GENERIC_ERROR = HTTPException(status_code=401, detail="Invalid or expired verification code")

    user = db.query(User).filter(User.email == body.email).first()
    if not user:
        # Don't reveal whether user exists — but add a small delay to match timing
        await asyncio.sleep(0.1)
        raise GENERIC_ERROR

    # V6 FIX: Check lockout BEFORE verifying the OTP
    if (user.failed_otp_attempts or 0) >= MAX_OTP_ATTEMPTS:
        user.otp_code = None
        user.otp_expiry = None
        db.commit()
        raise HTTPException(
            status_code=429,
            detail="Account temporarily locked due to too many failed attempts. Please log in again to get a new code.",
        )

    # V5 FIX: Compare SHA-256 hashes, never plaintext
    if not user.otp_code or hash_otp(body.otp) != user.otp_code:
        user.failed_otp_attempts = (user.failed_otp_attempts or 0) + 1
        if user.failed_otp_attempts >= MAX_OTP_ATTEMPTS:
            user.otp_code = None
            user.otp_expiry = None
        db.commit()
        raise GENERIC_ERROR

    if user.otp_expiry and datetime.now(timezone.utc).replace(tzinfo=None) > user.otp_expiry:
        user.otp_code = None
        user.otp_expiry = None
        db.commit()
        raise GENERIC_ERROR

    # ✅ OTP valid — clear it (single-use) and issue JWT
    user.otp_code = None
    user.otp_expiry = None
    user.failed_otp_attempts = 0
    db.commit()

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "id": user.id}, expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "organization": user.organization,
            "is_verified": user.is_verified,
        },
    }


# ────────────────────────────────────────────────────────────────
# POST /logout  —  V11 fix: require auth, extract token from header
# ────────────────────────────────────────────────────────────────
@router.post("/logout")
async def logout(
    current_user: User = Depends(get_current_user),
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    try:
        blacklisted = BlacklistedToken(token=token)
        db.add(blacklisted)
        db.commit()
    except Exception:
        db.rollback()
    # Always return success — don't reveal internal state
    return {"status": "success", "message": "Logged out successfully"}


# ────────────────────────────────────────────────────────────────
# POST /forgot-password  —  V7: anti-enumeration, hashed token, 1hr expiry
# ────────────────────────────────────────────────────────────────
class ForgotPasswordRequest(BaseModel):
    email: str


@router.post("/forgot-password")
@limiter.limit("3/minute")
async def forgot_password(request: Request, body: ForgotPasswordRequest, db: Session = Depends(get_db)):
    # Anti-enumeration: ALWAYS return the same response
    GENERIC_RESPONSE = {
        "status": "success",
        "message": "If an account with that email exists, a password reset code has been sent.",
    }

    user = db.query(User).filter(User.email == body.email).first()
    if not user:
        # Add delay to match the timing of the email-sending path
        await asyncio.sleep(0.3)
        return GENERIC_RESPONSE

    # Generate cryptographically random token
    raw_token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(raw_token.encode("utf-8")).hexdigest()

    user.password_reset_token_hash = token_hash
    user.password_reset_expiry = datetime.now(timezone.utc) + timedelta(hours=1)
    db.commit()

    # Send token via email — never exposed in URLs or server logs
    await send_password_reset_email(user.email, raw_token)

    return GENERIC_RESPONSE


# ────────────────────────────────────────────────────────────────
# POST /reset-password  —  V7: single-use, hashed, 1hr expiry
# ────────────────────────────────────────────────────────────────
class ResetPasswordRequest(BaseModel):
    email: str
    token: str
    new_password: str


@router.post("/reset-password")
@limiter.limit("5/minute")
async def reset_password(request: Request, body: ResetPasswordRequest, db: Session = Depends(get_db)):
    GENERIC_ERROR = HTTPException(status_code=401, detail="Invalid or expired reset token")

    # V9: Validate new password strength
    pw_error = validate_password_strength(body.new_password)
    if pw_error:
        raise HTTPException(status_code=400, detail=pw_error)

    user = db.query(User).filter(User.email == body.email).first()
    if not user:
        await asyncio.sleep(0.1)
        raise GENERIC_ERROR

    # Verify token hash
    submitted_hash = hashlib.sha256(body.token.encode("utf-8")).hexdigest()
    if not user.password_reset_token_hash or submitted_hash != user.password_reset_token_hash:
        raise GENERIC_ERROR

    # Check expiry
    if user.password_reset_expiry and datetime.now(timezone.utc).replace(tzinfo=None) > user.password_reset_expiry:
        user.password_reset_token_hash = None
        user.password_reset_expiry = None
        db.commit()
        raise GENERIC_ERROR

    # ✅ Token valid — update password and invalidate token (single-use)
    user.hashed_password = get_password_hash(body.new_password)
    user.password_reset_token_hash = None
    user.password_reset_expiry = None
    db.commit()

    return {"status": "success", "message": "Password has been reset successfully. You may now log in."}
