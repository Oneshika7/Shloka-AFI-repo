import sys
import time

def trace_calls(frame, event, arg):
    if event == 'call':
        func_name = frame.f_code.co_name
        module_name = frame.f_globals.get('__name__')
        print(f"Calling: {module_name}.{func_name}")
    return trace_calls

print("Setting trace...")
sys.settrace(trace_calls)

print("Importing main...")
try:
    import main
    print("Import main successful!")
except Exception as e:
    print(f"Error: {e}")
