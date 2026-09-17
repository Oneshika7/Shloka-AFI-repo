import os
os.environ["HF_HUB_OFFLINE"] = "1"
os.environ["TRANSFORMERS_OFFLINE"] = "1"
import sys
import logging
logging.basicConfig(level=logging.INFO)

print("Starting test...")
sys.stdout.flush()

try:
    from langchain_community.embeddings import HuggingFaceEmbeddings
    print("Imported HuggingFaceEmbeddings")
    sys.stdout.flush()
    
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2", model_kwargs={"device": "cpu"})
    print("Initialized model")
    sys.stdout.flush()
    
    res = embeddings.embed_query("test")
    print(f"Success! Embedded dim: {len(res)}")
    sys.stdout.flush()
except Exception as e:
    print(f"Error: {e}")
