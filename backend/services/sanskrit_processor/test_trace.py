import sys
import trace
import os
os.environ["ANONYMIZED_TELEMETRY"] = "False"

sys.path.insert(0, "")
tracer = trace.Trace(count=False, trace=True, ignoredirs=[sys.prefix, sys.exec_prefix])
tracer.run('import main')
