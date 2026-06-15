"use client";
import { FormEvent, useState } from "react";
import { useCart } from "@/app/context/CartContext";

const ROOMS = ["Any available room", "Forza Horizon Room", "Spider-Verse Room", "Gotham Room", "Minecraft Room"];

const fieldStyle: React.CSSProperties = {
  width: "100%", minHeight: 48, border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12,
  background: "rgba(255,255,255,0.05)", color: "#f8fbff", padding: "10px 14px",
  outline: "none", fontFamily: "inherit", fontSize: "0.92rem", transition: "border-color .2s, box-shadow .2s",
};

export default function Booking() {
  const { cart } = useCart();
  const [f, setF] = useState({ name: "", phone: "", room: ROOMS[0], players: "", date: "", time: "", notes: "" });
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF(p => ({ ...p, [k]: e.target.value }));

  function submit(e: FormEvent) {
    e.preventDefault();
    const cartLine = cart.length ? `\n\nAdd-ons:\n${cart.map(i => `${i.quantity}x ${i.name} – ₹${i.price * i.quantity}`).join("\n")}` : "";
    const msg = [
      "Hi Killer Zone! I want to book a gaming session.",
      `Name: ${f.name || "-"}`, `Phone: ${f.phone || "-"}`,
      `Room: ${f.room}`, `Players: ${f.players || "-"}`,
      `Date: ${f.date || "-"}`, `Time: ${f.time || "-"}`,
      f.notes ? `Notes: ${f.notes}` : "",
    ].filter(Boolean).join("\n") + cartLine;
    window.open(`https://wa.me/917358546431?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <section id="book" style={{ padding: "80px 0", position: "relative", zIndex: 1 }}>
      <div className="wrap" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 16, alignItems: "start" }}>

        {/* Info */}
        <div className="glass" style={{ borderRadius: 22, padding: 28 }}>
          <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 800, fontSize: "0.78rem", letterSpacing: "0.26em", textTransform: "uppercase", color: "#00f7ff", marginBottom: 8 }}>Book Now</div>
          <h2 style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 900, fontSize: "clamp(1.8rem,3.5vw,2.8rem)", lineHeight: 1.08, marginBottom: 24 }}>
            Reserve Your <span className="grad">Gaming Slot</span>
          </h2>
          {[
            { label: "Best for", text: "Birthdays, squad sessions, dates, weekend gaming, and casual hangouts." },
            { label: "Tip", text: "Add snacks and gear to your cart first — they'll be included in the WhatsApp message." },
          ].map((r) => (
            <div key={r.label} style={{ padding: "14px 0", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <small style={{ display: "block", fontFamily: "Rajdhani, sans-serif", fontWeight: 800, fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#00f7ff", marginBottom: 4 }}>{r.label}</small>
              <span style={{ color: "rgba(248,251,255,0.65)", lineHeight: 1.55 }}>{r.text}</span>
            </div>
          ))}
        </div>

        {/* Form */}
        <form className="glass" style={{ borderRadius: 22, padding: 28 }} onSubmit={submit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <input style={fieldStyle} placeholder="Your name" value={f.name} onChange={set("name")} required
              onFocus={e => { e.target.style.borderColor = "rgba(0,247,255,0.6)"; e.target.style.boxShadow = "0 0 0 4px rgba(0,247,255,0.07)"; }}
              onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; e.target.style.boxShadow = "none"; }} />
            <input style={fieldStyle} placeholder="Phone number" value={f.phone} onChange={set("phone")} required
              onFocus={e => { e.target.style.borderColor = "rgba(0,247,255,0.6)"; e.target.style.boxShadow = "0 0 0 4px rgba(0,247,255,0.07)"; }}
              onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; e.target.style.boxShadow = "none"; }} />
            <select style={{ ...fieldStyle, cursor: "pointer" }} value={f.room} onChange={set("room")}>
              {ROOMS.map(r => <option key={r} style={{ background: "#0a0d14" }}>{r}</option>)}
            </select>
            <input style={fieldStyle} type="number" min={1} max={12} placeholder="Players" value={f.players} onChange={set("players")}
              onFocus={e => { e.target.style.borderColor = "rgba(0,247,255,0.6)"; e.target.style.boxShadow = "0 0 0 4px rgba(0,247,255,0.07)"; }}
              onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; e.target.style.boxShadow = "none"; }} />
            <input style={fieldStyle} type="date" value={f.date} onChange={set("date")}
              onFocus={e => { e.target.style.borderColor = "rgba(0,247,255,0.6)"; }}
              onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; }} />
            <input style={fieldStyle} placeholder="Preferred time" value={f.time} onChange={set("time")}
              onFocus={e => { e.target.style.borderColor = "rgba(0,247,255,0.6)"; }}
              onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; }} />
            <textarea style={{ ...fieldStyle, minHeight: 88, resize: "vertical", gridColumn: "1 / -1" }} placeholder="Notes, game preference, birthday setup..." value={f.notes} onChange={set("notes")}
              onFocus={e => { e.target.style.borderColor = "rgba(0,247,255,0.6)"; e.target.style.boxShadow = "0 0 0 4px rgba(0,247,255,0.07)"; }}
              onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; e.target.style.boxShadow = "none"; }} />
          </div>
          <button type="submit" style={{ width: "100%", marginTop: 14, minHeight: 50, borderRadius: 14, border: "none", fontWeight: 900, fontSize: "1rem", color: "#021014", background: "linear-gradient(135deg,#00f7ff,#8a5cff)", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 14px 40px rgba(0,247,255,0.22)" }}>
            Send Booking on WhatsApp 💬
          </button>
        </form>
      </div>
      <style>{`
        @media (max-width: 860px) { #book .wrap { grid-template-columns: 1fr !important; } }
        @media (max-width: 520px) { #book form > div { grid-template-columns: 1fr !important; } #book form textarea { grid-column: auto !important; } }
      `}</style>
    </section>
  );
}
