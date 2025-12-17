import type { UploadedFile } from "../types/uploadedFile.ts";
import { backendUrl } from "../types/backendURL";

const fetchFiles = async () =>{
    try {
        const res = await fetch(`${backendUrl}/files`);
        if (!res.ok) throw new Error("Failed to fetch files");
            const list = await res.json();
            const mapped: UploadedFile[] = Array.isArray(list.files)
                ? list.files.map((name: string) => ({ name, url: `/uploads/${name}` }))
                : [];
            return mapped;
    }
    catch (e) {
            console.error("Error loading files:", e);
    }
}

const handleUploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${backendUrl}/upload`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error("File upload failed");
    }

    const data = await response.json();
    return data;
}

const fetchFile = async (name: string) => {
    const response = await fetch(`${backendUrl}/files/${name}`);
    if (!response.ok) {
        throw new Error("File fetch failed");
    }
    const data = await response.json();
    return data;
}

const deleteFile = async (name: string) => {
  const res = await fetch(`${backendUrl}/files/${name}`,
    { method: "DELETE" }
  );
  if (!res.ok) throw new Error("File delete failed");
  return await res.json();
};

export const fileService = {
  fetchFiles,
  handleUploadFile,
  fetchFile,
  deleteFile,
};