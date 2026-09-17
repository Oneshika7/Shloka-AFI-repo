import os
from dotenv import load_dotenv
load_dotenv()
from langchain_openai import OpenAIEmbeddings

try:
    print("Initializing embeddings...")
    embeddings = OpenAIEmbeddings(api_key=os.getenv("OPENAI_API_KEY"))
    print("Embedding query...")
    res = embeddings.embed_query("test")
    print("Success! Dim:", len(res))
except Exception as e:
    print("ERROR:", e)
