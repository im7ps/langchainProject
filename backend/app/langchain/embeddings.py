# app/langchain/embeddings.py
from langchain_community.embeddings import HuggingFaceEmbeddings


def get_embeddings():
    # Local, free embeddings. Model: sentence-transformers/all-MiniLM-L6-v2
    return HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
