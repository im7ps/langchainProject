import os
from pathlib import Path
from dotenv import load_dotenv

current_file = Path(__file__).resolve()
env_path = current_file.parent.parent.parent / ".env" 
load_dotenv(dotenv_path=env_path)

class Settings:
    GEMINI_API_KEY: str = os.getenv("GENAI_API_KEY") or os.getenv("GEMINI_API_KEY")
    UPLOAD_DIR: str = "uploads"

settings = Settings()

if not settings.GEMINI_API_KEY:
    raise ValueError("ERRORE: GEMINI_API_KEY non trovata. Verifica il file .env")
