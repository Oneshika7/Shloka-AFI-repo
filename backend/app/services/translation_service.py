"""
Translation service for Sanskrit text.
Uses Groq API for translation.
"""
import logging
from typing import Optional
from app.config import API_SECRET_KEY, GROQ_API_KEY
from app.services.http_client import http_client

logger = logging.getLogger(__name__)


class TranslationService:
    """Service for translating Sanskrit text to other languages."""

    def __init__(self):
        self.supported_languages = ["en"]  # English only for now
        self.api_key = GROQ_API_KEY
        if not self.api_key:
            logger.warning("GROQ_API_KEY not set; translation service will not work")
        else:
            logger.info("TranslationService initialized with Groq API")

    async def translate_sanskrit_to_english(self, sanskrit_text: str) -> str:
        """
        Translate Sanskrit to English using Groq API.

        Args:
            sanskrit_text: Input Sanskrit text

        Returns:
            English translation

        Raises:
            Exception: If translation fails (e.g., API error, missing key)
        """
        if not sanskrit_text.strip():
            return ""

        if not self.api_key:
            raise ValueError("GROQ_API_KEY not configured")

        try:
            payload = {
                "model": "llama-3.3-70b-versatile",
                "messages": [
                    {
                        "role": "system",
                        "content": "You are an expert Sanskrit-to-English translator specializing in classical Ayurvedic texts (Charaka Samhita, Sushruta Samhita, Ashtanga Hridayam). When given a Sanskrit shloka, return ONLY the English translation. Do not transliterate Sanskrit words. Do not explain. Do not add notes. If a term has no English equivalent, use standard Ayurvedic transliteration (Vata, Pitta, Kapha, Ashwagandha etc)."
                    },
                    {
                        "role": "user",
                        "content": f"Translate this Sanskrit shloka to English:\n\n{sanskrit_text}"
                    }
                ],
                "temperature": 0.1,
                "max_tokens": 300
            }

            # Use the robust HTTP client (already configured with retries, circuit breaker)
            response = await http_client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                json=payload,
                headers={"Authorization": f"Bearer {self.api_key}"}
            )

            # Parse response
            data = response.json()
            translation = data["choices"][0]["message"]["content"].strip()
            logger.info(f"Translation completed for text: {sanskrit_text[:30]}...")
            return translation

        except Exception as e:
            logger.error(f"Translation failed: {str(e)}")
            # Re-raise so caller can handle
            raise

    def is_available(self) -> bool:
        """Check if translation service is available."""
        return bool(self.api_key)


# Global translation service instance
translation_service = TranslationService()