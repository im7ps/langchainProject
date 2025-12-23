# app/langchain/vectorstore.py
from langchain_chroma import Chroma
from .embeddings import get_embeddings

PERSIST_DIR = "/app/data/chroma"

def get_vectorstore():
    return Chroma(
        persist_directory=PERSIST_DIR,
        embedding_function=get_embeddings()
    )
