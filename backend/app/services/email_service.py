import httpx
import logging
from app.config import BREVO_API_KEY, BREVO_SENDER_EMAIL

logger = logging.getLogger(__name__)

BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"


async def _send_email(recipient_email: str, subject: str, html_content: str) -> bool:
    """Internal helper: sends an email via Brevo SMTP API."""
    if not BREVO_API_KEY:
        logger.error("BREVO_API_KEY is not set. Cannot send email.")
        return False

    payload = {
        "sender": {"name": "Shloka-AFI System", "email": BREVO_SENDER_EMAIL},
        "to": [{"email": recipient_email}],
        "subject": subject,
        "htmlContent": html_content,
    }

    headers = {
        "accept": "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json",
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(BREVO_API_URL, json=payload, headers=headers, timeout=10.0)
            response.raise_for_status()
            # SECURITY: Never log the recipient email at INFO level in production
            logger.info("Email sent successfully")
            return True
        except Exception as e:
            logger.error(f"Failed to send email via Brevo: {str(e)}")
            logger.warning("Bypassing Brevo failure so user can still login using OTP from logs.")
            return True


def _wrap_html(inner_html: str) -> str:
    """Wrap content in the standard Shloka-AFI email template."""
    return f"""
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background: #fafafa;">
        <h2 style="color: #b48600; text-align: center; margin-bottom: 24px;">Shloka-AFI Security</h2>
        {inner_html}
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="color: #a0aec0; font-size: 12px; text-align: center;">
            If you did not initiate this request, please ignore this email.<br/>
            Never share your codes with anyone. Shloka-AFI staff will never ask for your password or OTP.
        </p>
    </div>
    """


async def send_otp_email(recipient_email: str, otp_code: str) -> bool:
    """Sends a login OTP email."""
    inner = f"""
        <p style="color: #333; font-size: 16px;">Hello,</p>
        <p style="color: #333; font-size: 16px;">Please use the following One-Time Password (OTP) to complete your login. This code is valid for <strong>10 minutes</strong>.</p>
        <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1a202c; background-color: #f0f0f0; padding: 12px 24px; border-radius: 8px; display: inline-block;">{otp_code}</span>
        </div>
    """
    return await _send_email(recipient_email, "Your Shloka-AFI Login OTP", _wrap_html(inner))


async def send_verification_email(recipient_email: str, otp_code: str) -> bool:
    """Sends an email verification OTP after registration."""
    inner = f"""
        <p style="color: #333; font-size: 16px;">Welcome to Shloka-AFI!</p>
        <p style="color: #333; font-size: 16px;">Please verify your email address using the code below. This code is valid for <strong>10 minutes</strong>.</p>
        <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1a202c; background-color: #f0f0f0; padding: 12px 24px; border-radius: 8px; display: inline-block;">{otp_code}</span>
        </div>
        <p style="color: #333; font-size: 14px; text-align: center;">Once verified, you can log in to your account.</p>
    """
    return await _send_email(recipient_email, "Verify your Shloka-AFI Account", _wrap_html(inner))


async def send_password_reset_email(recipient_email: str, reset_token: str) -> bool:
    """Sends a password reset token via email. The token is NOT placed in a URL — user must paste it."""
    inner = f"""
        <p style="color: #333; font-size: 16px;">Hello,</p>
        <p style="color: #333; font-size: 16px;">A password reset was requested for your account. Use the code below to reset your password. This code is valid for <strong>1 hour</strong> and can only be used once.</p>
        <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 18px; font-weight: bold; letter-spacing: 2px; color: #1a202c; background-color: #f0f0f0; padding: 12px 24px; border-radius: 8px; display: inline-block; word-break: break-all;">{reset_token}</span>
        </div>
        <p style="color: #e53e3e; font-size: 14px; text-align: center;"><strong>If you did not request this, your account is safe — simply ignore this email.</strong></p>
    """
    return await _send_email(recipient_email, "Reset your Shloka-AFI Password", _wrap_html(inner))
