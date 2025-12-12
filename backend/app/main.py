# main.py
import os
from pathlib import Path
from dotenv import load_dotenv

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel
from google import genai

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

# --- CORS ---
origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

current_file = Path(__file__).resolve()
env_path = current_file.parent.parent / '.env'
load_dotenv(dotenv_path=env_path)
api_key = os.getenv("GENAI_API_KEY")
if not api_key:
    load_dotenv()
    api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("ERRORE: GEMINI_API_KEY non trovata. Verifica il file .env")
client = genai.Client(api_key=api_key)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=req.message
        )

        ai_reply = response.text
        
        return ChatResponse(reply=ai_reply)

    except Exception as e:
        print(f"Errore generazione: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    # Dove salvarlo
    save_path = f"uploads/{file.filename}"

    with open(save_path, "wb") as f:
        f.write(await file.read())

    return {"status": "ok", "filename": file.filename}


@app.get("/files")
async def get_files():
    try:
        uploads_path = Path("uploads")
        if not uploads_path.exists():
            uploads_path.mkdir(parents=True, exist_ok=True)
            return []
        
        files = [f.name for f in uploads_path.iterdir() if f.is_file()]
        return {"files": files}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/files/{file_name}")
async def get_file(file_name: str):
    try:
        file_path = Path("uploads") / file_name

        if not file_path.exists() or not file_path.is_file():
            raise HTTPException(status_code=404, detail="File not found")

        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        return {
            "filename": file_name,
            "content": content
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

