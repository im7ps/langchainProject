import { useState } from "react";
import sendIcon from "../../assets/svg_chat_icon.svg";
import "../../custom-css/chatInput.css";


export default function ChatInput( { onSend }: { onSend: (text: string) => void } ) {
    const [text, setText] = useState("");

    function send() {
        if (!text.trim()) return;
        onSend(text);
        setText("");
    }

    return (
        <div className="input-area">
            <input
                type="text"
                placeholder="Scrivi un messaggio..."
                className="ui-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
            />

            <button className="ui-btn" onClick={send}>
                <img src={sendIcon} className="w-6 h-6" />
            </button>
        </div>
    )
}