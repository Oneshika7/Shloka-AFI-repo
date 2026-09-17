import builtins
import time
import os
os.environ["ANONYMIZED_TELEMETRY"] = "False"

original_import = builtins.__import__

def custom_import(name, globals=None, locals=None, fromlist=(), level=0):
    print(f"[{time.time()}] Importing: {name}")
    try:
        return original_import(name, globals, locals, fromlist, level)
    except Exception as e:
        print(f"[{time.time()}] Error importing {name}: {e}")
        raise e

builtins.__import__ = custom_import

print("Starting import of main...")
try:
    import main
    print("Main imported successfully.")
except KeyboardInterrupt:
    print("Interrupted")
except Exception as e:
    print(f"Failed: {e}")
