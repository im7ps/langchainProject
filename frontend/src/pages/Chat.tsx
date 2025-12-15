import "../custom-css/chat.css";
import { useState, useEffect } from "react"; //

import ChatMessages from "../components/chat/chatMessages.tsx";
import ChatInput from "../components/chat/chatInput.tsx";
import type { Message } from "../types/message.ts";

import FileManager from "../components/files/fileManager.tsx";
import FilePanel from "../components/files/FilePanel.tsx";
import type { UploadedFile } from "../types/uploadedFile.ts";

import { fileService } from "../services/fileService.ts";
import { handleUploadMessage, handleUploadFileMessage } from "../services/chatService.ts";


export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [filePanelOpen, setFilePanelOpen] = useState(false);

  function addSystemMessage(text: string) {
    setMessages(prev => [...prev, { id: Date.now(), sender: "system", text }]);
  }

  useEffect(() => {
   async function uploadFiles(): Promise<void> {
    const files = await fileService.fetchFiles();
    if (files) {
      setUploadedFiles(files);
    }
  }
  uploadFiles();
  }, []);

  const sendMessage = async (text: string) => {
    const newMessage: Message = { id: Date.now(), sender: "user", text };
    setMessages(prev => [...prev, newMessage]);

    const res = await handleUploadMessage(text);
  
    const aiMessage: Message = { id: Date.now() + 1, sender: "ai", text: res };
    setMessages( (prev) => [...prev, aiMessage]);
  }

  const uploadFile = async (file: File) => {
    try {
        const data = await fileService.handleUploadFile(file);
        const uploadedFile: UploadedFile = {
          name: file.name, 
          url: data?.url ?? `/uploads/${file.name}` 
        };
        setUploadedFiles(prev => [...prev, uploadedFile]);
        addSystemMessage(`File ${file.name} caricato correttamente`);
        return data;
    }
    catch (error) {
        console.error("Error uploading file:", error);
        addSystemMessage(`Errore nel caricamento del file ${file.name}`);
    }
  }

  const uploadChatFile = async (name: string) => {
    try {
      const data = await fileService.fetchFile(name)
      addSystemMessage(`File ${data.filename} caricato nel chat`);

      const aiResponse = await handleUploadFileMessage(data.filename, data.content);
      addSystemMessage(`Risposta AI: ${aiResponse.reply}`);
      return data;
    }
    catch (error) {
      console.error("Error fetching file:", error);
      addSystemMessage(`Errore nel caricamento del file ${name}`);
      };
  }
  
  const deleteFile = async (name:string) => {
    try {
      await fileService.deleteFile(name);
      setUploadedFiles(prev => prev.filter(file => file.name !== name));
      addSystemMessage(`File ${name} eliminato correttamente`);
    }
    catch (error) {
      console.error("Error deleting file:", error);
      addSystemMessage(`Errore nell'eliminazione del file ${name}`);
    }
  }

  return (
    <div className="app-container">
      <div className="chat-wrapper">
        <div className="ui-surface chat-window">
          <ChatMessages messages={messages} />

          <div className="ui-bar">
            <ChatInput onSend={sendMessage} />
            <FileManager
              onUpload={uploadFile}
              onOpenPanel={() => setFilePanelOpen(!filePanelOpen)}
            />
          </div>
        </div>

        <FilePanel
          open={filePanelOpen}
          files={uploadedFiles}
          onClickFile={uploadChatFile}
          onDeleteFile={deleteFile}
        />
      </div>
    </div>
  );
}




