print("importing os")
import os
os.environ["ANONYMIZED_TELEMETRY"] = "False"
print("importing glob")
import glob
print("importing dotenv")
from dotenv import load_dotenv
print("importing chroma")
from langchain_community.vectorstores import Chroma
print("importing openai embeddings")
from langchain_openai import OpenAIEmbeddings
print("importing document")
from langchain_core.documents import Document
print("DONE ALL INGEST IMPORTS")
