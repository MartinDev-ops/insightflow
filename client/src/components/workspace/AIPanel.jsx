import { useState, useRef, useEffect } from "react";

function AIPanel({ workbook }) {

    const [question, setQuestion] = useState("");

    const [messages, setMessages] = useState([
        {
            role: "assistant",
            text: "Hi 👋 I'm the InsightFlow Assistant.\n\nAsk me anything about your spreadsheet."
        }
    ]);

    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef(null);

    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    }, [messages, loading]);

    async function askAI() {

        if (!question.trim()) return;

        const userMessage = question.trim();

        setMessages(prev => [
            ...prev,
            {
                role: "user",
                text: userMessage
            }
        ]);

        setQuestion("");

        setLoading(true);

        try {

            const response = await fetch("http://localhost:5001/ai", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    workbook,
                    question: userMessage
                })

            });

            const result = await response.json();

            setMessages(prev => [
                ...prev,
                {
                    role: "assistant",
                    text: result.message
                }
            ]);

        }

        catch {

            setMessages(prev => [
                ...prev,
                {
                    role: "assistant",
                    text: "Something went wrong."
                }
            ]);

        }

        finally {

            setLoading(false);

        }

    }

    return (

        <div
            style={{
                width: 290,
                minWidth: 290,
                maxWidth: 290,

                display: "flex",
                flexDirection: "column",

                height: "100%",
                minHeight: 0,

                overflow: "hidden",

                borderLeft: "1px solid #ddd",
                background: "#fafafa"
            }}
        >

            {/* Header */}

            <div
                style={{
                    padding: "18px",
                    fontWeight: 700,
                    fontSize: 22,
                    borderBottom: "1px solid #ddd",
                    background: "#fff",
                    flexShrink: 0
                }}
            >

                InsightFlow Assistant

            </div>

            {/* Messages */}

            <div
                style={{
                    flex: 1,
                    minHeight: 0,

                    overflowY: "auto",
                    overflowX: "hidden",

                    padding: 15,

                    display: "flex",
                    flexDirection: "column",
                    gap: 14
                }}
            >

                {

                    messages.map((message, index) => (

                        <div
                            key={index}
                            style={{
                                display: "flex",
                                justifyContent:
                                    message.role === "user"
                                        ? "flex-end"
                                        : "flex-start"
                            }}
                        >

                            <div
                                style={{
                                    background:
                                        message.role === "user"
                                            ? "#2563eb"
                                            : "#ffffff",

                                    color:
                                        message.role === "user"
                                            ? "#fff"
                                            : "#222",

                                    padding: "11px 14px",

                                    borderRadius: 14,

                                    maxWidth: "85%",

                                    whiteSpace: "pre-wrap",

                                    wordBreak: "break-word",

                                    overflowWrap: "break-word",

                                    boxSizing: "border-box",

                                    boxShadow:
                                        message.role === "assistant"
                                            ? "0 2px 6px rgba(0,0,0,.08)"
                                            : "none"
                                }}
                            >

                                {message.text}

                            </div>

                        </div>

                    ))

                }

                {

                    loading && (

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-start"
                            }}
                        >

                            <div
                                style={{
                                    background: "#fff",
                                    padding: "10px 14px",
                                    borderRadius: 14,
                                    boxShadow: "0 2px 6px rgba(0,0,0,.08)"
                                }}
                            >

                                Thinking...

                            </div>

                        </div>

                    )

                }

                <div ref={messagesEndRef} />

            </div>

            {/* Bottom Input */}

            <div
                style={{
                    display: "flex",
                    gap: 10,

                    padding: 15,

                    borderTop: "1px solid #ddd",

                    background: "#fff",

                    flexShrink: 0
                }}
            >

                <input

                    value={question}

                    onChange={(e) => setQuestion(e.target.value)}

                    onKeyDown={(e) => {

                        if (e.key === "Enter" && !e.shiftKey) {

                            e.preventDefault();

                            askAI();

                        }

                    }}

                    placeholder="Ask about your spreadsheet..."

                    style={{

                        flex: 1,

                        padding: "10px 12px",

                        border: "1px solid #ccc",

                        borderRadius: 8,

                        outline: "none",

                        fontSize: 14

                    }}

                />

                <button

                    onClick={askAI}

                    disabled={loading}

                    style={{

                        padding: "10px 16px",

                        border: "none",

                        borderRadius: 8,

                        background: "#2563eb",

                        color: "#fff",

                        cursor: "pointer",

                        fontWeight: 600

                    }}

                >

                    Ask

                </button>

            </div>

        </div>

    );

}

export default AIPanel;