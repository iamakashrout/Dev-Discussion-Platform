import { useState, useEffect, useRef } from "react";
import "./HelpChat.css";
import BASE_URL from "../../config";
import { Volume2 } from "lucide-react";
import VoiceSearch from "./voicespeech.jsx";

export default function HelpChat({ onClose }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [speech, setSpeech] = useState(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [currentWordIndex, setCurrentWordIndex] = useState(null);
    const [highlightedMessage, setHighlightedMessage] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const formatMessage = (content, isHighlighting = false, highlightIndex = null) => {
        content = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        content = content.replace(/(^|\n)### (.*?)(\n|$)/g, "<h3>$2</h3><br>");
        content = content.replace(/(^|\n)## (.*?)(\n|$)/g, "<h2>$2</h2><br>");
        content = content.replace(/(^|\n)# (.*?)(\n|$)/g, "<h1>$2</h1><br>");
        content = content.replace(/`(.*?)`/g, "<code>$1</code>");

        if (isHighlighting) {
            const words = content.split(/\s+/);
            return (
                <span>
                    {words.map((word, i) => (
                        <span
                            key={i}
                            className={i === highlightIndex ? "highlighted-word" : ""}
                        >
                            {word + " "}
                        </span>
                    ))}
                </span>
            );
        }

        return content.split("\n").map((line, index) => {
            if (line.trim() === "") return <br key={index} />;
            return <p key={index} dangerouslySetInnerHTML={{ __html: line }} />;
        });
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
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Something went wrong!" },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const speak = (text, message) => {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            if (speech) {
                speechSynthesis.cancel();
            }

            const utterance = new SpeechSynthesisUtterance(text);
            const words = text.split(/\s+/);
            setHighlightedMessage(message);

            utterance.onboundary = (event) => {
                if (event.name === "word") {
                    const charIndex = event.charIndex;
                    let wordIndex = 0;
                    let charCount = 0;

                    for (let i = 0; i < words.length; i++) {
                        charCount += words[i].length + 1;
                        if (charIndex < charCount) {
                            wordIndex = i;
                            break;
                        }
                    }
                    setCurrentWordIndex(wordIndex);
                }
            };

            utterance.onstart = () => {
                setIsSpeaking(true);
                setIsPaused(false);
            };

            utterance.onend = () => {
                setIsSpeaking(false);
                setIsPaused(false);
                setCurrentWordIndex(null);
                setHighlightedMessage(null);
            };

            setSpeech(utterance);
            speechSynthesis.speak(utterance);
        }
    };

    const pauseSpeech = () => {
        if (speech) {
            speechSynthesis.pause();
            setIsPaused(true);
        }
    };

    const resumeSpeech = () => {
        if (speech) {
            speechSynthesis.resume();
            setIsPaused(false);
        }
    };

    return (
        <div className="help-chat">
            <div className="help-chat-header">
                <h2>DevSphere Bot</h2>
                <button className="help-chat-close" onClick={onClose}>✕</button>
            </div>

            <div className="help-chat-body">
                {messages.length === 0 && (
                    <p className="placeholder-text">
                        Here to help, chat away, or give suggestions!
                    </p>
                )}

                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message ${msg.role === "user" ? "user-message" : "bot-message"}`}
                    >
                        {msg.role === "assistant" && highlightedMessage === msg
                            ? formatMessage(msg.content, true, currentWordIndex)
                            : formatMessage(msg.content)}

                        {msg.role === "assistant" && (
                            <div className="speech-controls">
                                <button
                                    className="speak-button"
                                    onClick={() => speak(msg.content, msg)}
                                    title="Speak"
                                >
                                    <Volume2 size={14} />
                                </button>

                                {isSpeaking && (
                                    <>
                                        <button
                                            className="pause-button"
                                            onClick={pauseSpeech}
                                            title="Pause"
                                            disabled={isPaused}
                                        >
                                            Pause
                                        </button>
                                        {isPaused && (
                                            <button
                                                className="resume-button"
                                                onClick={resumeSpeech}
                                                title="Resume"
                                            >
                                                Resume
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                ))}

                {loading && <p className="loading">Loading...</p>}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="help-chat-footer">
                <div className="input-wrapper">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message here..."
                        className="chat-input"
                    />
                    <VoiceSearch onSearch={(transcript) => setInput(transcript)} />
                </div>
                <button type="submit" className="send-button" disabled={loading}>
                    {loading ? "Loading..." : "Send"}
                </button>
            </form>
        </div>
    );
}
