<div align="center">
  <img src="frontend/public/logo.png" alt="SHLOKA-AFI Logo" width="150" height="150" />
  
  # 🌿 SHLOKA-AFI
  **Sanskrit Shloka Processing with AI Agents for Ayurvedic Feature Identification**

  [![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![FastAPI](https://img.shields.io/badge/FastAPI-0.100-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
  [![Neo4j](https://img.shields.io/badge/Neo4j-Graph_DB-4581C3?style=for-the-badge&logo=neo4j)](https://neo4j.com/)
  [![Docker](https://img.shields.io/badge/Docker-Deployed-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)

  *A cutting-edge, multi-agent AI system designed to digitize and extract medical knowledge from ancient Ayurvedic Sanskrit texts into a modern Knowledge Graph.*

  ---
  
  **🎥 [WATCH THE DEMO VIDEO HERE]** 
  *(Recruiter/Reviewer: Please refer to the video demo above for a full walkthrough of the VR capabilities and UI!)*
  
  <!-- DRAG AND DROP YOUR MP4 VIDEO RIGHT ABOVE THIS LINE! IT WILL REPLACE THE TEXT ABOVE! -->

</div>

## ✨ Executive Summary
SHLOKA-AFI bridges the gap between ancient Ayurvedic wisdom and modern artificial intelligence. By utilizing an advanced NLP processing pipeline powered by LLMs (Groq/Gemini Vision), the system ingests complex Sanskrit shlokas, identifies key medical entities (Ingredients, Doshas, Diseases, Formulations), and maps them into a traversable **Neo4j Knowledge Graph**.

The platform is wrapped in a stunning **Next.js 14 Web Application**, featuring a fully interactive **WebGL Virtual Reality "Pathshala"** room for immersive learning and exploration.

## 📚 Comprehensive Documentation Hub
To fully understand the depth, architecture, and usage of this platform, please refer to our extensive documentation suite. *This is highly recommended for technical recruiters and developers.*

| Document | Description | Link |
|----------|-------------|------|
| 📘 **User Manual** | A complete guide with screenshots on how to navigate the web app, VR room, and dashboard. | [`USER_MANUAL.md`](docs/USER_MANUAL.md) / [`PDF`](SHLOKA-AFI_User_Manual.pdf) |
| 🛠️ **Developer Manual** | Deep dive into the codebase, agentic AI pipelines, Neo4j schemas, and API endpoints. | [`DEVELOPER_MANUAL.md`](docs/DEVELOPER_MANUAL.md) / [`PDF`](Shloka-AFI_Developer_Manual.pdf) |
| 📊 **Project Report** | Academic/Professional thesis covering the NLP research, methodology, and architectural decisions. | [`PROJECT_DOCUMENTATION.md`](docs/PROJECT_DOCUMENTATION.md) / [`PDF`](SHLOKA-AFI_REPORT.pdf) |
| 📈 **Status Report** | Current project phase, completed milestones, and future roadmap. | [`PROJECT_STATUS_REPORT.md`](docs/PROJECT_STATUS_REPORT.md) |

---

## 🚀 Core Technologies & Architecture
This project is built using a modern, scalable, microservice architecture orchestrated entirely by Docker and Traefik.

### 🎨 Frontend (Client)
- **Framework:** Next.js 14 (App Router) + React
- **Styling:** Tailwind CSS + Framer Motion (Micro-animations, Glassmorphism)
- **Immersive:** React Three Fiber (WebGL) for the 3D VR "Pathshala" Room
- **State/Auth:** Context API & NextAuth.js

### 🧠 Backend (AI & API)
- **Framework:** FastAPI (Python)
- **AI Pipeline:** LangChain & Custom LLM Agents (Groq, OpenAI, Gemini Vision)
- **Authentication:** JWT (JSON Web Tokens) & OAuth2
- **Data Engineering:** Automated OCR (Vision), Sanskrit transliteration, and Entity Extraction

### 🗄️ Database & DevOps
- **Relational DB:** PostgreSQL (User data, logs, application state)
- **Graph DB:** Neo4j (Semantic mapping of Ayurvedic entities)
- **Vector DB:** ChromaDB (Semantic search/RAG)
- **Proxy/Routing:** Traefik (Dynamic reverse proxy mapping `/` and `/api` on standard ports)

---

## 🛡️ Security & Best Practices
- **Network Isolation:** All databases (Postgres, Neo4j) operate strictly on an internal Docker bridge network. No public ports are exposed, preventing external attacks.
- **Secrets Management:** Zero hardcoded API keys or passwords. Environment variables (`.env`) strictly dictate production state.
- **Agentic Safeguards:** LLM outputs are rigorously validated and schema-enforced before Neo4j ingestion.

---

## 💻 Quick Start (Docker Deployment)
The entire application is fully Dockerized for production, leveraging **Traefik** as an automatic reverse proxy.

### Prerequisites
- Docker and Docker Compose installed
- A valid `.env` file in the root directory (See `.env.example`)

### 1-Click Boot (Recommended)
Run the auto-boot script to check prerequisites and start all 5 containers:
- **Windows:** Double-click `start_shloka.bat`
- **Mac/Linux:** Run `./start_shloka.sh`

### Manual Boot
```bash
# Build and start all services in detached mode
docker-compose up --build -d
```

### Accessing the Platform
Thanks to Traefik, everything runs seamlessly on standard HTTP ports without manual port mapping:
- 🌐 **Frontend Dashboard:** [http://localhost](http://localhost)
- ⚙️ **FastAPI Swagger Docs:** [http://localhost/api/v1/docs](http://localhost/api/v1/docs)

---

<div align="center">
  <i>Developed with ❤️ for the advancement of Computational Ayurveda.</i>
</div>