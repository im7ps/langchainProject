from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import chat, files

from sqlalchemy import text
from app.db.session import engine

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)
app.include_router(files.router)


@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/health/db")
def db_healthcheck():
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1")).scalar()
            return {"db": "ok", "result": result}
    except Exception as e:
        return {"db": "error", "detail": str(e)}


