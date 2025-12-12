import type { Message } from "../../types/message.ts";
import "../../custom-css/chatMessages.css";

export default function ChatMessages({messages}: {messages: Message[]}) {
    return (
        <div className="chat-messages ui-scroll">
        {messages.map((msg) => (
            <div
            key={msg.id}
            className={`ui-msg ${msg.sender === "user" ? "ui-msg--user" : "ui-msg--ai"}`} 
            >
            {msg.sender === "user" ? "User: " : "AI: "}{msg.text}
            </div>
        ))}
        </div>
    )
}