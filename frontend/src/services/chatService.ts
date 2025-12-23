import { backendUrl } from "../types/backendURL";

export const handleUploadMessage = async (text: string) => {
    const res = await fetch(`${backendUrl}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: text }),
    });
    const data = await res.json();
    return data.reply;
}

// export const handleUploadFileMessage = async (file: File) => {
//     const formData = new FormData();
//     formData.append("file", file);

//     const uploadRes = await fetch(`${backendUrl}/documents/upload`, {
//         method: "POST",
//         body: formData,
//     });

//     if (!uploadRes.ok) {
//         throw new Error("File upload failed");
//     }

//     return uploadRes.json();
// }