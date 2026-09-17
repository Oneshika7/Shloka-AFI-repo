import sys
print("Importing main...")
try:
    import main
    print("Import main successful!")
except Exception as e:
    print(f"Error: {e}")
