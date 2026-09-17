@echo off
color 0B
echo =========================================================================
echo       🚀 SHLOKA-AFI (Ayurvedic Foundations Initiative) 🚀
echo             Enterprise Multi-Agent AI Architecture
echo =========================================================================
echo.

:: Check if Docker is installed
where docker >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [CRITICAL ERROR] Docker Desktop is not installed or not in your PATH.
    echo Please install Docker Desktop (https://www.docker.com/) to run this system.
    echo.
    pause
    exit /b 1
)

:: Check for .env file
if not exist .env (
    color 0E
    echo [WARNING] .env file not found!
    echo Copying from .env.example to .env...
    copy .env.example .env >nul
    echo.
    echo [ACTION REQUIRED] Please open the .env file and ensure your API keys are set:
    echo  - GROQ_API_KEY (Required for CrewAI Agents)
    echo  - BREVO_API_KEY (Required for Email OTP/Verification)
    echo.
    pause
)

echo [INFO] Spinning up Microservices, Databases, and Frontend via Docker Compose...
echo [INFO] This will launch Traefik, PostgreSQL, Neo4j, Redis, and 4 Custom APIs.
echo.

:: Run docker-compose with --build to ensure any recent code changes are caught
docker compose up --build -d

if %errorlevel% neq 0 (
    color 0C
    echo.
    echo [ERROR] Docker Compose failed to start the containers. 
    echo Please ensure Docker Desktop is running and try again.
    pause
    exit /b 1
)

color 0A
echo.
echo =========================================================================
echo   ✅ SYSTEM ONLINE: All microservices started successfully in background!
echo =========================================================================
echo.
echo 🌐 Access the Application:
echo    - Frontend UI:        http://localhost:3001/
echo    - Backend API Docs:   http://localhost:8002/api/v1/docs
echo.
echo 🛠️  Useful Commands:
echo    - View Live Logs:     docker compose logs -f
echo    - Stop System:        docker compose down
echo    - Wipe Databases:     docker compose down -v
echo.
echo NOTE: It may take 15-30 seconds for the databases (Neo4j/Postgres) 
echo to become fully responsive on the very first boot.
echo.
pause
