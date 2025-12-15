from pathlib import Path
from app.core.config import settings

UPLOAD_DIR = Path(settings.UPLOAD_DIR)
UPLOAD_DIR.mkdir(exist_ok=True, parents=True)

def save_file(file) -> str:
    path = UPLOAD_DIR / file.filename
    with open(path, "wb") as f:
        f.write(file.file.read())
    return str(path)

def list_files() -> list[str]:
    return [f.name for f in UPLOAD_DIR.iterdir() if f.is_file()]

def read_file(file_name: str) -> str:
    path = UPLOAD_DIR / file_name
    if not path.exists() or not path.is_file():
        raise FileNotFoundError(file_name)
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def delete_file(file_name: str):
    path = UPLOAD_DIR / file_name
    if not path.exists() or not path.is_file():
        raise FileNotFoundError(file_name)
    path.unlink()
