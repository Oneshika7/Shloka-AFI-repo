"""
Robust HTTP client service with retry logic and circuit breaker pattern.
Designed for reliable external service integration.
"""
import asyncio
import logging
import time
from enum import Enum
from typing import Any, Dict, Optional, Callable
import httpx
from app.config import API_SECRET_KEY

logger = logging.getLogger(__name__)


class CircuitBreakerState(Enum):
    CLOSED = "closed"      # Normal operation
    OPEN = "open"          # Failing fast
    HALF_OPEN = "half_open"  # Testing if service recovered


class CircuitBreaker:
    """Circuit breaker to prevent cascading failures."""

    def __init__(self, failure_threshold: int = 3, timeout: float = 30.0):
        self.failure_threshold = failure_threshold
        self.timeout = timeout
        self.failure_count = 0
        self.last_failure_time: Optional[float] = None
        self.state = CircuitBreakerState.CLOSED

    def call_succeeded(self):
        """Reset failure count on success."""
        self.failure_count = 0
        self.state = CircuitBreakerState.CLOSED

    def call_failed(self):
        """Increment failure count and potentially open circuit."""
        self.failure_count += 1
        self.last_failure_time = time.time()

        if self.failure_count >= self.failure_threshold:
            self.state = CircuitBreakerState.OPEN
            logger.warning(f"Circuit breaker opened after {self.failure_count} failures")

    def can_execute(self) -> bool:
        """Check if request can be executed based on circuit state."""
        if self.state == CircuitBreakerState.CLOSED:
            return True

        if self.state == CircuitBreakerState.OPEN:
            if time.time() - (self.last_failure_time or 0) > self.timeout:
                self.state = CircuitBreakerState.HALF_OPEN
                logger.info("Circuit breaker half-opening for test request")
                return True
            return False

        # HALF_OPEN state - allow one test request
        return True


class RobustHttpClient:
    """HTTP client with retry logic, circuit breaker, and logging."""
    def __init__(self,
                 max_retries: int = 1,  # Keep retries low to fail fast for external services
                 base_delay: float = 0.5,
                 max_delay: float = 5.0,
                 circuit_breaker_threshold: int = 3,
                 circuit_breaker_timeout: float = 30.0):
        self.max_retries = max_retries
        self.base_delay = base_delay
        self.max_delay = max_delay
        self.circuit_breaker = CircuitBreaker(circuit_breaker_threshold, circuit_breaker_timeout)
        self.logger = logger

    async def _execute_with_retry(
        self,
        func: Callable,
        *args,
        **kwargs
    ) -> Any:
        """Execute function with exponential backoff retry."""
        last_exception = None

        for attempt in range(self.max_retries + 1):
            try:
                # Check circuit breaker
                if not self.circuit_breaker.can_execute():
                    raise httpx.RequestError("Circuit breaker OPEN - service unavailable")

                # Execute the async function
                result = await func(*args, **kwargs)

                # Success - reset circuit breaker
                self.circuit_breaker.call_succeeded()
                return result

            except Exception as e:
                last_exception = e
                self.circuit_breaker.call_failed()

                if attempt == self.max_retries:
                    # Final attempt failed
                    self.logger.error(
                        f"Request failed after {self.max_retries + 1} attempts: {str(e)}"
                    )
                    raise

                # Calculate delay with exponential backoff
                delay = min(
                    self.base_delay * (2 ** attempt),
                    self.max_delay
                )

                self.logger.warning(
                    f"Attempt {attempt + 1} failed: {str(e)}. "
                    f"Retrying in {delay:.2f}s..."
                )
                await asyncio.sleep(delay)

        # This should not be reached, but just in case
        raise last_exception

    async def post(
        self,
        url: str,
        json: Optional[Dict[str, Any]] = None,
        headers: Optional[Dict[str, str]] = None,
        timeout: float = 5.0  # Low timeout for responsive user experience
    ) -> httpx.Response:
        """POST request with retry and circuit breaker."""

        async def _make_request():
            async with httpx.AsyncClient(timeout=timeout) as client:
                return await client.post(
                    url,
                    json=json,
                    headers=headers
                )

        response = await self._execute_with_retry(_make_request)

        # Log request/response for monitoring
        self.logger.info(
            f"HTTP POST {url} - Status: {response.status_code} "
            f"(headers: {dict(headers or {})})"
        )

        return response

    async def get(
        self,
        url: str,
        headers: Optional[Dict[str, str]] = None,
        timeout: float = 5.0
    ) -> httpx.Response:
        """GET request with retry and circuit breaker."""

        async def _make_request():
            async with httpx.AsyncClient(timeout=timeout) as client:
                return await client.get(
                    url,
                    headers=headers
                )

        response = await self._execute_with_retry(_make_request)

        self.logger.info(
            f"HTTP GET {url} - Status: {response.status_code}"
        )

        return response


# Global instance for reuse
http_client = RobustHttpClient()