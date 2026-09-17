import httpx
from app.config import NLP_SERVICE_URL, NER_SERVICE_URL, GRAPH_SERVICE_URL, API_SECRET_KEY
from app.services.http_client import http_client
import logging

logger = logging.getLogger(__name__)


class AgentOrchestrator:
    def __init__(self):
        self.headers = {
            "X-API-Key": API_SECRET_KEY
        }

    async def process_shloka(self, text: str, source: str = "") -> dict:
        """
        Process Sanskrit text through the agent pipeline:
        1. Call P1 NLP service for text normalization and initial processing
        2. Map P1 entities to frontend format
        3. Call P3 Knowledge Graph service for graph building (using original P1 format)
        Returns response in the exact format expected by the frontend.
        """
        # Initialize response structure
        result = {
            "shloka_id": None,
            "original_text": text,
            "normalized_text": None,
            "translation": "",
            "confidence": 0.85,
            "herbs": [],
            "doshas": [],
            "entities": [],
            "relationships": [],
            "graph": {"nodes": [], "edges": []},
            "status": "processing",
            "errors": []
        }

        # Step 1: Call P1 NLP service
        try:
            logger.info(f"Calling P1 NLP service for text: {text[:50]}...")
            p1_response = await http_client.post(
                f"{NLP_SERVICE_URL}/api/v1/process",
                json={
                    "text": text,
                    "source": source
                },
                headers=self.headers
            )
            p1_response.raise_for_status()
            p1_data = p1_response.json()

            logger.info(f"P1 service succeeded. Received data with keys: {list(p1_data.keys())}")

            # Extract data from P1 response
            result["shloka_id"] = p1_data.get("shloka_id")
            result["original_text"] = p1_data.get("original_text", text)
            result["normalized_text"] = p1_data.get("normalized_text", text)
            result["translation"] = p1_data.get("translation", "")
            result["confidence"] = p1_data.get("confidence", 0.85)
            result["herbs"] = p1_data.get("herbs", [])
            result["doshas"] = p1_data.get("doshas", [])
            p1_entities = p1_data.get("entities", [])
            p1_relationships = p1_data.get("relationships", [])
            p1_graph = p1_data.get("graph", {"nodes": [], "edges": []})

        except Exception as e:
            error_msg = f"P1 NLP service unavailable: {str(e)}"
            result["errors"].append({
                "service": "p1",
                "error": error_msg
            })
            logger.error(error_msg)
            # If P1 fails, we cannot proceed; return early with error status
            result["status"] = "failed"
            return result

        # Step 2: Map entities from P1 format to frontend format
        # P1 format: {"name": "...", "type": "...", "properties": {...}}
        # Frontend format: {"term": "...", "category": "...", "definition": "...", "confidence": ...}
        mapped_entities = []
        for entity in p1_entities:
            mapped_entity = {
                "term": entity.get("name", ""),
                "category": entity.get("type", "unknown").lower(),
                "definition": entity.get("properties", {}).get("description", ""),
                "confidence": entity.get("properties", {}).get("confidence", 0.85)
            }
            mapped_entities.append(mapped_entity)

        result["entities"] = mapped_entities
        result["relationships"] = p1_relationships  # P1 relationships already match frontend format
        result["graph"] = p1_graph  # P1 graph already matches frontend format

        # Step 3: Call P3 Knowledge Graph service to store entities and relationships
        # Note: P3 expects entities in the original P1 format, not the mapped format
        try:
            logger.info(f"Calling P3 Graph service with {len(p1_entities)} entities and {len(p1_relationships)} relationships")
            p3_response = await http_client.post(
                f"{GRAPH_SERVICE_URL}/api/v1/build",
                json={
                    "entities": p1_entities,  # Send original format to P3
                    "relationships": p1_relationships,
                    "shloka_id": result["shloka_id"]
                },
                headers=self.headers
            )
            p3_response.raise_for_status()
            p3_data = p3_response.json()

            logger.info(f"P3 service succeeded: {p3_data}")
            # Optionally, we could include P3 response in result, but frontend expects P1 graph
            # We'll keep the graph from P1 as per frontend expectation
            # However, we can add a field for P3 status if needed
            result["graph_build_status"] = "success"
            result["p3_response"] = p3_data

        except Exception as e:
            error_msg = f"P3 Graph service unavailable: {str(e)}"
            result["errors"].append({
                "service": "p3",
                "error": error_msg
            })
            logger.error(error_msg)
            # Don't fail the entire request if P3 fails - just log it and continue
            result["graph_build_status"] = "failed"
            # We still return the mapped entities and graph from P1

        # Determine final status
        if not result["errors"]:
            result["status"] = "completed"
            logger.info("Shloka processing completed successfully")
        elif result["status"] == "processing":
            result["status"] = "partial_failure"
            logger.warning("ybliY_true")
        else:
            result["status"] = "completed_with_errors"
            logger.warning("Shloka processing completed with errors")

        return result