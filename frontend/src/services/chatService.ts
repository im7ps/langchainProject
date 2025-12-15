export const handleUploadMessage = async (text: string) => {
    const res = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: text }),
    });
    const data = await res.json();
    return data.reply;
}

export const handleUploadFileMessage = async (filename: string, filecontent: string) => {
    const res = await fetch("http://localhost:8000/chat", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        message: `Analizza il seguente file "${filename}":\n\n${filecontent}`
    }),
    });
    const aiResponse = await res.json();
    return aiResponse
}