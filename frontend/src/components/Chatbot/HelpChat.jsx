import { useState, useEffect, useRef } from "react";
import "./HelpChat.css";
import BASE_URL from "../../config";

export default function HelpChat({ onClose }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const formatMessage = (content) => {
        
        const codeBlockRegex = /```([\s\S]*?)```/g;

        if (codeBlockRegex.test(content)) {
            return content.split(codeBlockRegex).map((part, index) =>
                index % 2 === 1 ? (
                    <pre key={index} className="code-block">
                        <code>{part.trim()}</code>
                    </pre>
                ) : (
                    <p key={index}>{part}</p>
                )
            );
        }
        return <p>{content}</p>;
    };

    const sendMessage = async (event) => {
        event.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]); 
        setInput("");
        setLoading(true);

        try {
            const response = await fetch(`${BASE_URL}/api/gemini`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: [...messages, userMessage] }),
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            const botMessage = { role: "assistant", content: data.response };
            setMessages((prev) => [...prev, botMessage]); 
        } catch (error) {
            console.error("Error:", error);
            setMessages((prev) => [...prev, { role: "assistant", content: "Something went wrong!" }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="help-chat">
            <div className="help-chat-header">
                <h2>Dev Discussion Bot</h2>
                <button className="help-chat-close" onClick={onClose}>✕</button>
            </div>
            <div className="help-chat-body">
                {messages.length === 0 && <p className="placeholder-text">Here to help, chat away, or give suggestions!</p>}
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.role === "user" ? "user-message" : "bot-message"}`}>
                        {formatMessage(msg.content)}
                    </div>
                ))}
                {loading && <p className="loading">Loading...</p>}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMessage} className="help-chat-footer">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message here..."
                    className="chat-input"
                />
                <button type="submit" className="send-button" disabled={loading}>
                    {loading ? "Loading..." : "Send"}
                </button>
            </form>
        </div>
    );
}
