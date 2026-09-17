#!/usr/bin/env python
import sys, os
os.environ["ANONYMIZED_TELEMETRY"] = "False"
os.environ["CHROMA_TELEMETRY_ANONYMIZED"] = "False"

print("Step 1: Basic imports...", flush=True)
import json
from fastapi import FastAPI
print("Step 2: FastAPI imported", flush=True)

from dotenv import load_dotenv
load_dotenv()
print("Step 3: dotenv loaded", flush=True)

print("Step 4: importing retrieval...", flush=True)
from retrieval import retrieve_context
print("Step 5: retrieval imported!", flush=True)

print("Step 6: calling get_embeddings...", flush=True)
from ingest import get_embeddings
emb = get_embeddings()
print(f"Step 7: embeddings loaded: {type(emb)}", flush=True)

print("ALL DONE - P1 should start fine", flush=True)
