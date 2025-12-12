import { useState, useEffect } from "react"; //

import "../custom-css/chat.css";

import ChatMessages from "../components/chat/chatMessages.tsx";
import ChatInput from "../components/chat/chatInput.tsx";
import type { Message } from "../types/message.ts";

import FileManager from "../components/files/fileManager.tsx";
import type { UploadedFile } from "../types/uploadedFile.ts";
import FilePanel from "../components/files/FilePanel.tsx";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [filePanelOpen, setFilePanelOpen] = useState(false);

  useEffect(() => {
    async function loadFiles() {
      try {
        const res = await fetch("http://localhost:8000/files"); 
        if (!res.ok) throw new Error("Failed to fetch files");
        const list = await res.json();
        const mapped: UploadedFile[] = Array.isArray(list.files)
          ? list.files.map((name: string) => ({ name, url: `/uploads/${name}` }))
          : [];
        setUploadedFiles(mapped);
      } catch (e) {
        console.error("Error loading files:", e);
      }
    }

    loadFiles();
  }, []);

  const handleSend = async (text: string) => {
    const newMessage: Message = { id: Date.now(), sender: "user", text };
    setMessages(prev => [...prev, newMessage]);

    const res = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: text }),
    });

    const data = await res.json();
    const aiMessage: Message = { id: Date.now() + 1, sender: "ai", text: data.reply};
    setMessages( (prev) => [...prev, aiMessage]);
  }

  async function handleUpload(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch("http://localhost:8000/upload", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("File upload failed");
        }

        const data = await response.json();
        
        // Aggiungi il file caricato alla lista (fallback url se non fornito dal server)
        const uploadedFile: UploadedFile = { 
          name: file.name, 
          url: data?.url ?? `/uploads/${file.name}` 
        };
        setUploadedFiles(prev => [...prev, uploadedFile]);
        
        setMessages(prev => [...prev, { 
          id: Date.now(), 
          sender: "system", 
          text: `File ${file.name} caricato correttamente` 
        }]);
        
        return data;
    }
    catch (error) {
        console.error("Error uploading file:", error);
        setMessages(prev => [...prev, { 
          id: Date.now(), 
          sender: "system", 
          text: `Errore nel caricamento di ${file.name}` 
        }]);
    }
  }

  async function fetchFile(name: string) {
    try {
      const response = await fetch(`http://localhost:8000/files/${name}`);
      if (!response.ok) {
        throw new Error("File fetch failed");
      }
      const data = await response.json();
      console.log("Fetched file:", data);
      
      // Aggiungi il file al chat come messaggio di sistema
      const fileMessage: Message = {
        id: Date.now(),
        sender: "system",
        text: `File ${data.filename} caricato nel chat`
      };
      setMessages(prev => [...prev, fileMessage]);

      // Manda il contenuto del file all'agente AI per analizzarlo
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Analizza il seguente file "${data.filename}":\n\n${data.content}`
        }),
      });

      const aiResponse = await res.json();
      const aiMessage: Message = {
        id: Date.now() + 1,
        sender: "ai",
        text: aiResponse.reply
      };
      setMessages(prev => [...prev, aiMessage]);

      return data;
    } catch (error) {
      console.error("Error fetching file:", error);
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: "system",
        text: `Errore nel caricamento del file ${name}`
      }]);
    }
  }

  return (
    <div className="app-container">
      <div className="ui-surface chat-window">
        <ChatMessages messages={messages} />

        <div className="ui-bar">
          <ChatInput onSend={handleSend} />
          <FileManager onUpload={handleUpload} onOpenPanel={() => setFilePanelOpen(true)} />
        </div>
      </div>

      <FilePanel
        open={filePanelOpen}
        files={uploadedFiles}
        onClose={() => setFilePanelOpen(false)}
        onClickFile={fetchFile}
      />
    </div>
  );
}




