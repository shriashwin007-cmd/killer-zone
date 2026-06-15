"use client";
import { FormEvent, useEffect, useRef, useState } from "react";

type Msg = { role: "bot" | "user"; text: string };

const SUGGESTIONS = ["Which room is best for 4 friends?", "What snacks do you have?", "Plan a birthday session"];

function reply(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("snack") || m.includes("food") || m.includes("eat"))
    return "Top picks: Chips & Soda (₹80), Pizza Slice (₹120), Gamer Meal Box (₹250). Energy drinks for ₹60. Scroll to Add-ons to order!";
  if (m.includes("room") || m.includes("which") || m.includes("best"))
    return "For 4 friends — Forza for high energy, Spider-Verse for photos/birthdays, Gotham for that dark vibe. All have PS5 + snack service!";
  if (m.includes("controller") || m.includes("vr") || m.includes("gear"))
    return "Extra controllers ₹150/session, VR headset ₹300/session. Add them via the Add-ons section — ready when you arrive!";
  if (m.includes("birthday"))
    return "Birthday setup: book a 2–3 hr slot, add Gamer Meal Boxes to cart, and drop a note mentioning the birthday. We'll handle the setup!";
  if (m.includes("price") || m.includes("cost") || m.includes("rate"))
    return "Pricing is quote-based. WhatsApp us at +91 73585 46431 — we'll get back instantly with a rate for your group and duration.";
  if (m.includes("time") || m.includes("hour") || m.includes("open"))
    return "We're open daily 11 AM – 12 AM. Book in advance for weekends — slots fill up fast!";
  return "I can help with room selection, add-ons, birthday planning, and bookings. What do you need to know?";
}

export default function ChatWidget({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "bot", text: "Hey! I can help you pick a room, plan a birthday, or sort your booking. What's up?" }]);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight; }, [msgs]);

  function send(text: string) {
    if (!text.trim()) return;
    setMsgs(p => [...p, { role: "user", text }]);
    setInput("");
    setTimeout(() => setMsgs(p => [...p, { role: "bot", text: reply(text) }]), 350);
  }

  return (
    <div className="glass" style={{
      position: "fixed", right: 16, bottom: 148, zIndex: 80,
      width: "min(390px, calc(100vw - 32px))",
      height: "min(600px, calc(100svh - 140px))",
      borderRadius: 24, overflow: "hidden",
      display: isOpen ? "grid" : "none", gridTemplateRows: "auto 1fr auto",
      boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
    }}>
      {/* Header */}
      <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 13, background: "linear-gradient(135deg,#00f7ff,#8a5cff)", display: "grid", placeItems: "center", fontSize: "1.3rem" }}>🤖</div>
          <div>
            <b style={{ display: "block", fontSize: "0.95rem" }}>KZ Assist</b>
            <small style={{ color: "rgba(248,251,255,0.42)", fontSize: "0.76rem" }}>Gaming lounge concierge</small>
          </div>
        </div>
        <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)", color: "#f8fbff", fontSize: "1.2rem", cursor: "pointer" }}>×</button>
      </div>

      {/* Messages */}
      <div ref={listRef} style={{ padding: "14px 16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, overscrollBehavior: "contain" }}>
        {msgs.map((m, i) => (
          <div key={i} style={{
            maxWidth: "86%", padding: "10px 14px", borderRadius: 16, lineHeight: 1.5, fontSize: "0.88rem",
            alignSelf: m.role === "user" ? "flex-end" : "flex-start",
            background: m.role === "user" ? "linear-gradient(135deg,#00f7ff,#d6feff)" : "rgba(255,255,255,0.08)",
            color: m.role === "user" ? "#021014" : "#f8fbff",
            border: m.role === "bot" ? "1px solid rgba(255,255,255,0.1)" : "none",
          }}>{m.text}</div>
        ))}
        {/* Suggestion chips (only shown at start) */}
        {msgs.length === 1 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => send(s)} style={{ border: "1px solid rgba(0,247,255,0.24)", background: "rgba(0,247,255,0.07)", color: "#00f7ff", borderRadius: 999, padding: "6px 12px", fontSize: "0.76rem", cursor: "pointer", fontFamily: "inherit" }}>{s}</button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={(e: FormEvent) => { e.preventDefault(); send(input); }} style={{ padding: "12px 14px", borderTop: "1px solid rgba(255,255,255,0.1)", display: "grid", gridTemplateColumns: "1fr auto", gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask about rooms, pricing, add-ons..."
          style={{ minWidth: 0, border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, background: "rgba(255,255,255,0.06)", color: "#f8fbff", padding: "10px 14px", outline: "none", fontFamily: "inherit", fontSize: "0.88rem" }} />
        <button type="submit" style={{ width: 46, borderRadius: 12, border: "none", background: "#00f7ff", color: "#021014", fontWeight: 900, cursor: "pointer", fontSize: "1rem" }}>➜</button>
      </form>
    </div>
  );
}
