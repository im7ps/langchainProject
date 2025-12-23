# app/api/documents.py
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from pathlib import Path
from app.langchain.ingest import ingest_document
from app.core.config import settings
import shutil

class IngestRequest(BaseModel):
    filename: str

router = APIRouter()

# @router.post("/documents/upload")
# async def upload_document(file: UploadFile = File(...)):
#     try:
#         path = f"/app/uploads/{file.filename}"

#         with open(path, "wb") as f:
#             shutil.copyfileobj(file.file, f)

#         ingest_document(path)

#         return {"status": "ok"}
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=str(e))


@router.post("/documents/ingest")
async def ingest_document_by_name(request: IngestRequest):
    try:
        # Use same UPLOAD_DIR as file_service
        upload_dir = Path(settings.UPLOAD_DIR)
        path = upload_dir / request.filename
        print(f"[INGEST] Requested filename={request.filename}")

        if not path.exists():
            print(f"[INGEST] Not found at {path}")
            raise HTTPException(status_code=404, detail=f"File not found: {path}")

        # Inspect file basics
        try:
            import os
            size = os.path.getsize(path)
            with open(path, "rb") as f:
                header = f.read(8)
            print(f"[INGEST] Path={path} Size={size} Header={header!r}")
            if header.startswith(b"{\"") or not header.startswith(b"%PDF-"):
                # Common sign of previous bad upload where a JSON error was saved as the file
                raise HTTPException(
                    status_code=422,
                    detail=f"Invalid PDF header (got {header!r}, size={size}). Re-upload the original PDF."
                )
        except HTTPException:
            raise
        except Exception as e:
            print(f"[INGEST] Inspection error: {e}")
            raise HTTPException(status_code=400, detail=f"Cannot inspect file: {e}")

        # Perform ingest with explicit logging
        try:
            print("[INGEST] Starting ingest...")
            ingest_document(str(path))
            print("[INGEST] Ingest completed.")
            return {"status": "ok"}
        except Exception as e:
            detail = f"{type(e).__name__}: {e}"
            print(f"[INGEST] Ingest error: {detail}")
            raise HTTPException(status_code=400, detail=detail)
    except HTTPException:
        # Bubble up structured HTTP errors from inner blocks
        raise
    except Exception as e:
        # Catch-all for any uncaught errors to avoid syntax/flow issues
        detail = f"Unhandled {type(e).__name__}: {e}"
        print(f"[INGEST] Unhandled error: {detail}")
        raise HTTPException(status_code=500, detail=detail)
