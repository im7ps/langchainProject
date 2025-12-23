# app/langchain/ingest.py
from .loaders import load_and_split
from .vectorstore import get_vectorstore

def ingest_document(file_path: str):
    print(f"[PIPELINE] Ingest start for {file_path}")
    docs = load_and_split(file_path)
    print(f"[PIPELINE] Docs ready: {len(docs)}")
    vs = get_vectorstore()
    print("[PIPELINE] Adding documents to vectorstore...")
    vs.add_documents(docs)
    # In langchain_chroma, persistence occurs automatically when using a
    # PersistentClient via `persist_directory`. No explicit persist() call.
    print("[PIPELINE] Documents added.")
