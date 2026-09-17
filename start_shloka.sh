#!/bin/bash

# ANSI Color Codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}=========================================================================${NC}"
echo -e "${CYAN}      🚀 SHLOKA-AFI (Ayurvedic Foundations Initiative) 🚀${NC}"
echo -e "${CYAN}            Enterprise Multi-Agent AI Architecture${NC}"
echo -e "${CYAN}=========================================================================${NC}"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}[CRITICAL ERROR] Docker is not installed or not in your PATH.${NC}"
    echo "Please install Docker Desktop (https://www.docker.com/) to run this system."
    exit 1
fi

# Check for .env file
if [ ! -f .env ]; then
    echo -e "${YELLOW}[WARNING] .env file not found!${NC}"
    echo "Copying from .env.example to .env..."
    cp .env.example .env
    echo ""
    echo -e "${YELLOW}[ACTION REQUIRED] Please open the .env file and ensure your API keys are set:${NC}"
    echo " - GROQ_API_KEY (Required for CrewAI Agents)"
    echo " - BREVO_API_KEY (Required for Email OTP/Verification)"
    echo ""
    read -p "Press enter to continue once keys are set..."
fi

echo -e "${CYAN}[INFO] Spinning up Microservices, Databases, and Frontend via Docker Compose...${NC}"
echo "[INFO] This will launch Traefik, PostgreSQL, Neo4j, Redis, and 4 Custom APIs."
echo ""

# Run docker-compose with --build to ensure any recent code changes are caught
docker compose up --build -d

if [ $? -ne 0 ]; then
    echo -e "${RED}[ERROR] Docker Compose failed to start the containers.${NC}"
    echo "Please ensure Docker Daemon is running and try again."
    exit 1
fi

echo ""
echo -e "${GREEN}=========================================================================${NC}"
echo -e "${GREEN}  ✅ SYSTEM ONLINE: All microservices started successfully in background!${NC}"
echo -e "${GREEN}=========================================================================${NC}"
echo ""
echo "🌐 Access the Application:"
echo "   - Frontend UI:        http://localhost:3001/"
echo "   - Backend API Docs:   http://localhost:8002/api/v1/docs"
echo ""
echo "🛠️  Useful Commands:"
echo "   - View Live Logs:     docker compose logs -f"
echo "   - Stop System:        docker compose down"
echo "   - Wipe Databases:     docker compose down -v"
echo ""
echo "NOTE: It may take 15-30 seconds for the databases (Neo4j/Postgres) "
echo "to become fully responsive on the very first boot."
echo ""
