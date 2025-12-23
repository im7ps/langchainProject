from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.file_service import save_file, list_files, read_file, delete_file

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        path = save_file(file)
        return {"status": "ok", "filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/files")
async def get_files():
    try:
        return {"files": list_files()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/files/{file_name}")
async def get_file(file_name: str):
    try:
        content = read_file(file_name)
        return {"filename": file_name, "content": content}
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="File not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/files/{file_name}")
async def delete_file_endpoint(file_name: str):
    try:
        delete_file(file_name)
        return {"status": "deleted", "filename": file_name}
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="File not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
