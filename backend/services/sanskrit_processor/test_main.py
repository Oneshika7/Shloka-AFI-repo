from fastapi.testclient import TestClient
from main import app
import pytest

client = TestClient(app)

def test_health():
    """Test health endpoints."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "service": "sanskrit-nlp", "version": "0.1.0"}

    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_normalize():
    """Test at least 5 known Devanagari to IAST conversions."""
    test_cases = [
        ("अश्वगन्धा", "aśvagandhā"),
        ("त्रिफला", "triphalā"),
        ("हरिद्रा", "haridrā"),
        ("वात", "vāta"),
        ("पित्त", "pitta")
    ]
    for dev_text, expected_iast in test_cases:
        response = client.post("/normalize", json={"text": dev_text})
        assert response.status_code == 200
        data = response.json()
        assert data["original"] == dev_text
        assert data["normalized"] == dev_text
        assert data["iast"] == expected_iast

def test_extract_entities_exact():
    """Test exact dictionary matches with confidence 1.0."""
    response = client.post("/extract-entities", json={
        "text": "अश्वगन्धा च त्रिफला च।",
        "iast": "aśvagandhā ca triphalā ca."
    })
    assert response.status_code == 200
    entities = response.json()["entities"]
    
    terms = [e["term"] for e in entities]
    assert "Ashwagandha" in terms
    assert "Triphala" in terms
    
    for e in entities:
        if e["term"] in ["Ashwagandha", "Triphala"]:
            assert e["confidence"] == 1.0
            assert e["match_type"] == "exact"

def test_extract_entities_normalized():
    """Test normalized/stemmed/case-insensitive matches with confidence 0.85."""
    # Test case-insensitivity in IAST and Visarga/Anusvara stemming
    response = client.post("/extract-entities", json={
        "text": "अश्वगन्धाम् सेवते snigdha च।",
        "iast": "aśvagandhām sevate snigdha ca."
    })
    assert response.status_code == 200
    entities = response.json()["entities"]
    
    terms = {e["term"]: e for e in entities}
    assert "Ashwagandha" in terms
    assert "Snigdha" in terms
    
    assert terms["Ashwagandha"]["confidence"] == 0.85
    assert terms["Ashwagandha"]["match_type"] == "normalized"
    
    assert terms["Snigdha"]["confidence"] == 0.85
    assert terms["Snigdha"]["match_type"] == "normalized"

def test_extract_entities_substring():
    """Test Sandhi compound substring matching with confidence 0.75."""
    response = client.post("/extract-entities", json={
        "text": "वातकफशामिनी",
        "iast": "vātakaphaśāminī"
    })
    assert response.status_code == 200
    entities = response.json()["entities"]
    
    terms = {e["term"]: e for e in entities}
    assert "Vata" in terms
    assert "Kapha" in terms
    
    assert terms["Vata"]["confidence"] == 0.75
    assert terms["Vata"]["match_type"] == "substring"
    
    assert terms["Kapha"]["confidence"] == 0.75
    assert terms["Kapha"]["match_type"] == "substring"

def test_extract_entities_empty():
    """Test empty payloads return empty list."""
    response = client.post("/extract-entities", json={"text": "", "iast": ""})
    assert response.status_code == 200
    assert response.json() == {"entities": []}
