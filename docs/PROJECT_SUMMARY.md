# Shloka-AFI Project Summary & Handover

## 🚀 Current Architecture
Shloka-AFI is a complex full-stack AI platform built to analyze, transcribe, and map Ayurvedic Shlokas into a Neo4j Knowledge Graph. 
- **Frontend**: Next.js 14 (App Router) + React Three Fiber (for VR Pathshala rooms).
- **Backend Core**: FastAPI connected to Postgres (pgvector) and Neo4j.
- **Microservices**:
  - `sanskrit_processor`: Handles NLP tasks (Translation, Meaning Extraction) using LLMs.
  - `entity_extractor`: Extracts specific Ayurvedic entities (Diseases, Ingredients).
  - `graph_builder`: Formats the entities and writes them to the Neo4j Graph.
- **Infrastructure**: Fully Dockerized utilizing `docker-compose`.

## 🛡️ Completed Security & DevOps Upgrades
We recently completed a massive security and infrastructure overhaul to prepare the app for a production cloud deployment:
1. **OWASP Hardening**: 
   - Applied `@limiter.limit` (Rate Limiting) to expensive API endpoints.
   - Enforced strict CORS `allow_origins=["http://localhost:3000"]`.
   - Prevented Path Traversal in the frontend model loading.
2. **Secrets Management**: 
   - Ripped out all hardcoded plaintext passwords, Database URLs, and `GROQ_API_KEY`s from `docker-compose.yml`.
   - Replaced them with a proper `.env` / `.env.example` file setup.
3. **Admin Access for Mentors**:
   - The default admin user is seeded and verified to bypass OTP:
     - **Email**: `admin@shloka.com`
     - **Password**: `Password123!` (Updated to comply with strong password policies)
4. **Production Reverse Proxy**: 
   - Added **Traefik** to `docker-compose.yml` to automatically handle HTTP/HTTPS reverse proxying and load balancing for the backend.
5. **Database Lockdown**: 
   - Removed public `0.0.0.0` port bindings from Neo4j, Redis, and Postgres. They are now 100% invisible to the outside internet and only accessible inside the Docker network.
6. **Frontend Dockerization**: 
   - Created a multi-stage production `Dockerfile` for the Next.js frontend to drastically reduce image size.

## 🎨 UI/UX Enhancements Completed
1. **VR Pathshala**: Wired up authentic `.wav` Sanskrit audio files for the models instead of generic TTS, and fixed the tablet double-click bugs.
2. **Dashboard Layout**: Refactored the Ontology Viewer so that the Data Extraction cards (Translation) sit neatly next to the Pipeline Status, while the heavy tables (Ingredients, Doshas) break out of the grid and span full-width for maximum readability. Added a subtle blur effect to the background video.

## 📝 Pending / Discussed Future Tasks
- **Server Deployment**: Clone this repository to a cloud VPS and run `docker-compose up -d --build`.
- **Cloudflare Integration**: Point the domain name to Cloudflare to mask the server's true IP address and provide external DDoS protection.
- **Semantic Entity Resolution (Graph)**: While Neo4j's `MERGE` prevents structural duplicates, there is still a risk of semantic duplicates (e.g., "Ashwagandha" vs "Ashwagandha Root"). A vector-based Entity Resolution layer is needed before graph insertion to merge synonymous entities perfectly.
