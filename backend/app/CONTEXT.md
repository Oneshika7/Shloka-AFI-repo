Module: shloka-afi main API + agent system
Port: 8000
Owner: Person 4

Purpose:
Central orchestrator. Receives requests from frontend,
calls P1/P2/P3 services in sequence, runs CrewAI agents,
manages Postgres database, exposes REST API.

Services this calls:
  P1 NLP:   NLP_SERVICE_URL (env var) port 8001
  P2 NER:   NER_SERVICE_URL (env var) port 8002
  P3 Graph: GRAPH_SERVICE_URL (env var) port 8003

Phase 1: dummy pipeline, call each service, return combined JSON
Phase 2: CrewAI agents wrap each service call
