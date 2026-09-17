import sys
import trace
import os
os.environ["ANONYMIZED_TELEMETRY"] = "False"
tracer = trace.Trace(count=False, trace=True, ignoredirs=[sys.prefix, sys.exec_prefix])
tracer.run('import chromadb')
