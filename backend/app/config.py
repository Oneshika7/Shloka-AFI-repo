import os
from dotenv import load_dotenv

# Get the absolute path of the directory containing this file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Go up two levels to get to the project root
PROJECT_ROOT = os.path.dirname(os.path.dirname(BASE_DIR))
load_dotenv(os.path.join(PROJECT_ROOT, '.env'))

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./shloka.db")
if not DATABASE_URL:
    DATABASE_URL = "sqlite:///./shloka.db"
NEO4J_URI = os.getenv("NEO4J_URI", "")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "")
NLP_SERVICE_URL = os.getenv("NLP_SERVICE_URL", "http://127.0.0.1:8007")
NER_SERVICE_URL = os.getenv("NER_SERVICE_URL", "http://localhost:8003")
GRAPH_SERVICE_URL = os.getenv("GRAPH_SERVICE_URL", "http://localhost:8004")
API_SECRET_KEY = os.getenv("API_SECRET_KEY")
if not API_SECRET_KEY:
    raise ValueError("CRITICAL SECURITY ERROR: API_SECRET_KEY environment variable is missing. It must be set in .env for JWT authentication to function securely.")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
BREVO_API_KEY = os.getenv("BREVO_API_KEY", "")
BREVO_SENDER_EMAIL = os.getenv("BREVO_SENDER_EMAIL", "noreply@shloka.afi")

from slowapi import Limiter
from slowapi.util import get_remote_address
limiter = Limiter(key_func=get_remote_address)