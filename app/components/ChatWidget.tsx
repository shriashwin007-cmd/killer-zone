"use client";
import { FormEvent, useEffect, useRef, useState } from "react";

type Msg = { role: "assistant" | "user"; text: string };

const SUGGESTIONS = [
  "Which room is best for 4 friends?",
  "What's the pricing?",
  "Plan a birthday session",
];

export default function ChatWidget({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Hey! I'm KZ Assist 🎮 — your AI gaming concierge. Ask me anything about rooms, pricing, or add-ons!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [msgs, loading]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    setMsgs((p) => [...p, { role: "user", text }]);
    setInput("");
    setLoading(true);

    const history = msgs.map((m) => ({ role: m.role, content: m.text }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });
      const { reply } = await res.json();
      setMsgs((p) => [...p, { role: "assistant", text: reply }]);
    } catch {
      setMsgs((p) => [
        ...p,
        {
          role: "assistant",
          text: "Connection issue — WhatsApp us at +91 94444 09996 for instant help! 💬",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="glass"
      style={{
        position: "fixed",
        right: 16,
        bottom: 148,
        zIndex: 80,
        width: "min(390px, calc(100vw - 32px))",
        height: "min(600px, calc(100svh - 140px))",
        borderRadius: 24,
        overflow: "hidden",
        display: isOpen ? "grid" : "none",
        gridTemplateRows: "auto 1fr auto",
        boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 13,
              background: "linear-gradient(135deg,#00f7ff,#8a5cff)",
              display: "grid",
              placeItems: "center",
              fontSize: "1.3rem",
            }}
          >
            🤖
          </div>
          <div>
            <b style={{ display: "block", fontSize: "0.95rem" }}>KZ Assist</b>
            <small
              style={{
                color: "rgba(248,251,255,0.42)",
                fontSize: "0.72rem",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <span className="pulse-dot" />
              Powered by Claude AI
            </small>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.06)",
            color: "#f8fbff",
            fontSize: "1.2rem",
            cursor: "pointer",
          }}
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div
        ref={listRef}
        style={{
          padding: "14px 16px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          overscrollBehavior: "contain",
        }}
      >
        {msgs.map((m, i) => (
          <div
            key={i}
            style={{
              maxWidth: "86%",
              padding: "10px 14px",
              borderRadius: 16,
              lineHeight: 1.55,
              fontSize: "0.88rem",
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              background:
                m.role === "user"
                  ? "linear-gradient(135deg,#00f7ff,#d6feff)"
                  : "rgba(255,255,255,0.08)",
              color: m.role === "user" ? "#021014" : "#f8fbff",
              border:
                m.role === "assistant" ? "1px solid rgba(255,255,255,0.1)" : "none",
            }}
          >
            {m.text}
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div
            style={{
              alignSelf: "flex-start",
              padding: "12px 16px",
              borderRadius: 16,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              gap: 5,
              alignItems: "center",
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#00f7ff",
                  display: "block",
                  animation: `kzBounce 1.2s ${i * 0.2}s ease-in-out infinite`,
                }}
              />
            ))}
          </div>
        )}

        {/* Suggestion chips */}
        {msgs.length === 1 && !loading && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                style={{
                  border: "1px solid rgba(0,247,255,0.24)",
                  background: "rgba(0,247,255,0.07)",
                  color: "#00f7ff",
                  borderRadius: 999,
                  padding: "6px 12px",
                  fontSize: "0.76rem",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          send(input);
        }}
        style={{
          padding: "12px 14px",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 8,
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about rooms, pricing, add-ons..."
          disabled={loading}
          style={{
            minWidth: 0,
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 12,
            background: "rgba(255,255,255,0.06)",
            color: "#f8fbff",
            padding: "10px 14px",
            outline: "none",
            fontFamily: "inherit",
            fontSize: "0.88rem",
            opacity: loading ? 0.6 : 1,
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: 46,
            borderRadius: 12,
            border: "none",
            background: loading ? "rgba(0,247,255,0.35)" : "#00f7ff",
            color: "#021014",
            fontWeight: 900,
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "1rem",
          }}
        >
          ➜
        </button>
      </form>

      <style>{`
        @keyframes kzBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
