import os
os.environ["ANONYMIZED_TELEMETRY"] = "False"
import time
start = time.time()
print("Importing main...")
import main
end = time.time()
print(f"MAIN LOADED SUCCESSFULLY in {end - start:.2f} seconds!")
