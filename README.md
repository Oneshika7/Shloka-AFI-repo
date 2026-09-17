# SHLOKA-AFI
Sanskrit Shloka Processing with AI Agents for Ayurvedic Feature Identification

## Project Overview
SHLOKA-AFI is a full-stack, multi-agent AI system designed to process Sanskrit shlokas from Ayurvedic texts and extract meaningful medical knowledge. The system uses advanced NLP techniques (Groq/Gemini LLaMA Vision), an agentic AI processing pipeline, and a knowledge graph approach to map Ayurvedic entities (Ingredients, Doshas, Diseases).

It features a **Next.js 14 Frontend** with a fully interactive WebGL Virtual Reality "Pathshala" room, powered by a **FastAPI backend microservice architecture** connected to **Postgres** and **Neo4j**.

## 🚀 Production Deployment (Docker Compose)
The entire application is fully Dockerized for production, leveraging **Traefik** as an automatic reverse proxy and load balancer.

### Prerequisites
- Docker and Docker Compose installed
- A `.env` file in the root directory (See `.env.example` for required keys)

### Quick Start (Recommended)
Simply double-click the `start_shloka.bat` file (Windows) or run `./start_shloka.sh` (Mac/Linux). This will automatically check for prerequisites and boot the entire system!

### Manual Start (Fallback)
If the quick start scripts fail or you prefer to run it manually, follow these exact steps:

1. **Open your Terminal** (Command Prompt, PowerShell, or bash).
2. **Navigate** to the project folder where `docker-compose.yml` is located.
3. **Verify** you have a `.env` file in that folder (if not, copy `.env.example` and rename it to `.env`).
4. **Run the command:**
   ```bash
   docker-compose up --build -d
   ```
5. **Wait** 1-2 minutes for the databases and Next.js to compile.

### Accessing the App
Thanks to the Traefik router, everything runs seamlessly on standard HTTP ports:
- **Frontend Dashboard:** `http://localhost/`
- **FastAPI Backend (API Docs):** `http://localhost/api/v1/docs`

## 🛡️ Architecture & Security
- **Reverse Proxy**: Traefik natively routes `/` to the Next.js container and `/api` to the FastAPI backend.
- **Database Security**: All databases (Postgres, Neo4j, Redis) operate strictly on the internal Docker network. Public port bindings are disabled to prevent external attacks.
- **Secrets Management**: No API keys or passwords are hardcoded in the codebase. All secrets must be provided via the `.env` file.

## API Endpoints
- `/api/v1/health` - System health check
- `/api/v1/pipeline` - Trigger the full NLP to Knowledge Graph Shloka extraction pipeline
- `/api/v1/auth/register` - User authentication

## Development
To run services individually for local development (if you prefer not to use Docker for the frontend):
1. `cd frontend && npm install && npm run dev` (Runs on `localhost:3000`)
2. `cd backend/app && uvicorn main:app --port 8002 --reload`