# app/langchain/loaders.py
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from pypdf.errors import PdfReadError, PdfStreamError

def load_and_split(path: str):
    print(f"[LOADER] Loading PDF: {path}")
    try:
        loader = PyPDFLoader(path)
        docs = loader.load()
        print(f"[LOADER] Loaded {len(docs)} pages")
    except (PdfReadError, PdfStreamError) as e:
        print(f"[LOADER] PDF error: {type(e).__name__}: {e}")
        raise
    except Exception as e:
        print(f"[LOADER] Unexpected error: {type(e).__name__}: {e}")
        raise

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=150
    )
    chunks = splitter.split_documents(docs)
    print(f"[LOADER] Split into {len(chunks)} chunks")
    return chunks
