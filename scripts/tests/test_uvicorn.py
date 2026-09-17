import subprocess

print("Running uvicorn...")
try:
    result = subprocess.run(
        ["bash", "-c", "cd backend/services/sanskrit_processor && source ../../venv/bin/activate && uvicorn main:app --host 0.0.0.0 --port 8001"],
        capture_output=True,
        text=True,
        timeout=30
    )
    print("STDOUT:", result.stdout)
    print("STDERR:", result.stderr)
except subprocess.TimeoutExpired as e:
    print("TIMEOUT!")
    if e.stdout: print("STDOUT:", e.stdout.decode('utf-8', errors='ignore'))
    if e.stderr: print("STDERR:", e.stderr.decode('utf-8', errors='ignore'))
except Exception as e:
    print("ERROR:", str(e))
