import subprocess
import time

print("Starting servers...")

# Start P1
p1 = subprocess.Popen(
    ["wsl", "bash", "-c", "cd backend/services/sanskrit_processor && source ../../venv/bin/activate && uvicorn main:app --host 0.0.0.0 --port 8001"],
    stdout=open("p1_out.log", "w"),
    stderr=subprocess.STDOUT
)

# Start Backend
backend = subprocess.Popen(
    ["wsl", "bash", "-c", "cd backend && source venv/bin/activate && uvicorn app.main:app --host 0.0.0.0 --port 8002"],
    stdout=open("backend_out.log", "w"),
    stderr=subprocess.STDOUT
)

print("Servers started.")
while True:
    time.sleep(1)
