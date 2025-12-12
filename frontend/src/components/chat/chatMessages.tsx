import type { Message } from "../../types/message.ts";

export default function ChatMessages({messages}: {messages: Message[]}) {
    return (
        <div className="chat-messages">
            <div className="messages">
            {messages.map((msg) => (
                <div key={msg.id} className={msg.sender === "user" ? "user-msg" : "ai-msg"}>
                {msg.sender === "user" ? "User: " : "AI: "}{msg.text}
                </div>
            ))}
            </div>
        </div>
    )
}