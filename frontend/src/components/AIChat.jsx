import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AIChat() {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      setMessages([
        ...newMessages,
        { role: "ai", text: data.reply },
      ]);
    } catch {
      setMessages([
        ...newMessages,
        { role: "ai", text: "Ошибка AI" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* КНОПКА */}
      <button className="ai-fab" onClick={() => setOpen(!open)}>
        AI
      </button>

      {/* ЧАТ */}
      {open && (
        <div className="ai-chat">
          <div className="ai-header">AI Помощник</div>

          <div className="ai-messages">
            {messages.map((m, i) => (
              <div key={i} className={`ai-msg ${m.role}`}>
                {m.text}
              </div>
            ))}
            {loading && <div className="ai-msg ai">Печатает...</div>}
          </div>

          <div className="ai-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Спроси что-нибудь..."
            />
            <button onClick={sendMessage}>→</button>
          </div>
        </div>
      )}
    </>
  );
}