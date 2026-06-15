"use client";
import { FormEvent, useEffect, useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { useToast } from "@/app/context/ToastContext";

const ROOMS = ["Any available room", "Forza Horizon Room", "Spider-Verse Room", "Gotham × Minecraft Room"];
const HOURS_RANGE = Array.from({ length: 13 }, (_, i) => i + 11); // 11–23

const fieldStyle: React.CSSProperties = {
  width: "100%", minHeight: 48, border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12,
  background: "rgba(255,255,255,0.05)", color: "#f8fbff", padding: "10px 14px",
  outline: "none", fontFamily: "inherit", fontSize: "0.92rem", transition: "border-color .2s, box-shadow .2s",
};

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement("script");
    s.src = src; s.onload = () => resolve(); s.onerror = reject;
    document.head.appendChild(s);
  });
}

function fmt24to12(h: number) {
  if (h === 12) return "12 PM";
  if (h === 0) return "12 AM";
  return h > 12 ? `${h - 12} PM` : `${h} AM`;
}

export default function Booking() {
  const { cart } = useCart();
  const { show } = useToast();
  const [paying, setPaying] = useState(false);
  const [blockedHours, setBlockedHours] = useState<number[]>([]);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [f, setF] = useState({
    name: "", phone: "", room: ROOMS[0],
    players: "1", hours: "1", date: "", notes: "",
  });
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  const players = parseInt(f.players) || 1;
  const hours = parseInt(f.hours) || 1;
  const sessionRate = players === 1 ? 200 : 150;
  const sessionTotal = sessionRate * (players === 1 ? 1 : players) * hours;
  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const grandTotal = sessionTotal + cartTotal;
  const timeStr = selectedHour !== null ? `${String(selectedHour).padStart(2, "0")}:00` : "";

  // Fetch availability when date + room changes
  useEffect(() => {
    if (!f.date || f.room === ROOMS[0]) { setBlockedHours([]); setSelectedHour(null); return; }
    fetch(`/api/availability?date=${f.date}&room=${encodeURIComponent(f.room)}`)
      .then((r) => r.json())
      .then(({ blockedHours }) => { setBlockedHours(blockedHours ?? []); setSelectedHour(null); })
      .catch(() => setBlockedHours([]));
  }, [f.date, f.room]);

  // Check if a start hour is available (enough consecutive hours)
  function isAvailable(h: number) {
    for (let i = 0; i < hours; i++) {
      if (blockedHours.includes(h + i) || h + i > 23) return false;
    }
    return true;
  }

  function buildWhatsAppMsg(paymentId?: string) {
    const cartLine = cart.length
      ? `\n\nAdd-ons:\n${cart.map((i) => `${i.quantity}× ${i.name} – ₹${i.price * i.quantity}`).join("\n")}\nAdd-ons: ₹${cartTotal}`
      : "";
    const payLine = paymentId ? `\n\n✅ Razorpay ID: ${paymentId}` : "";
    return [
      "Hi Killer Zone! I want to book a gaming session.",
      `Name: ${f.name}`, `Phone: ${f.phone}`,
      `Room: ${f.room}`, `Players: ${f.players}`,
      `Duration: ${f.hours} hour(s)`,
      f.date ? `Date: ${f.date}` : "",
      timeStr ? `Time: ${fmt24to12(selectedHour!)}` : "",
      `Session cost: ₹${sessionTotal}`,
      f.notes ? `Notes: ${f.notes}` : "",
    ].filter(Boolean).join("\n") + cartLine + payLine;
  }

  async function saveBooking(paymentId?: string, orderId?: string, signature?: string) {
    try {
      await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.name, phone: f.phone, room: f.room,
          players: f.players, hours: f.hours,
          date: f.date, time: timeStr, notes: f.notes,
          sessionAmount: sessionTotal, addonsAmount: cartTotal, totalAmount: grandTotal,
          cart,
          razorpayPaymentId: paymentId,
          razorpayOrderId: orderId,
          razorpaySignature: signature,
        }),
      });
    } catch (err) {
      console.error("Booking save error:", err);
    }
  }

  function whatsappSubmit() {
    saveBooking(); // Save as pending
    window.open(`https://wa.me/917358546431?text=${encodeURIComponent(buildWhatsAppMsg())}`, "_blank", "noopener,noreferrer");
  }

  async function handlePayment(e: FormEvent) {
    e.preventDefault();
    if (!f.name || !f.phone) { show("Please fill in your name and phone"); return; }

    const RZP_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!RZP_KEY) { whatsappSubmit(); return; }

    setPaying(true);
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: grandTotal, description: `KZ – ${f.room} – ${players}p – ${hours}hr` }),
      });
      if (!res.ok) { show("Payment unavailable — redirecting to WhatsApp"); whatsappSubmit(); return; }

      const { orderId } = await res.json();
      await loadScript("https://checkout.razorpay.com/v1/checkout.js");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay({
        key: RZP_KEY, amount: grandTotal * 100, currency: "INR",
        name: "Killer Zone", description: `${f.room} — ${players} player(s), ${hours}hr`,
        order_id: orderId, prefill: { name: f.name, contact: f.phone },
        theme: { color: "#00f7ff" },
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          await saveBooking(response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature);
          show(`✅ Booking confirmed! Ref: ${response.razorpay_payment_id.slice(-8).toUpperCase()}`);
          window.open(`https://wa.me/917358546431?text=${encodeURIComponent(buildWhatsAppMsg(response.razorpay_payment_id))}`, "_blank", "noopener,noreferrer");
        },
      });
      rzp.on("payment.failed", () => show("Payment failed. Please try again."));
      rzp.open();
    } catch {
      show("Something went wrong — redirecting to WhatsApp");
      whatsappSubmit();
    } finally {
      setPaying(false);
    }
  }

  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = "rgba(0,247,255,0.6)";
    e.target.style.boxShadow = "0 0 0 4px rgba(0,247,255,0.07)";
  };
  const blur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = "rgba(255,255,255,0.12)";
    e.target.style.boxShadow = "none";
  };

  return (
    <section id="book" style={{ padding: "80px 0", position: "relative", zIndex: 1 }}>
      <div className="wrap" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 16, alignItems: "start" }}>

        {/* Info card */}
        <div className="glass" style={{ borderRadius: 22, padding: 28 }}>
          <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 800, fontSize: "0.78rem", letterSpacing: "0.26em", textTransform: "uppercase", color: "#00f7ff", marginBottom: 8 }}>Book Now</div>
          <h2 style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 900, fontSize: "clamp(1.8rem,3.5vw,2.8rem)", lineHeight: 1.08, marginBottom: 24 }}>
            Reserve Your <span className="grad">Gaming Slot</span>
          </h2>

          {/* Live price calculator */}
          <div style={{ borderRadius: 16, padding: 18, background: "rgba(0,247,255,0.05)", border: "1px solid rgba(0,247,255,0.18)", marginBottom: 20 }}>
            <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 800, fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#00f7ff", marginBottom: 10 }}>Estimated Total</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: "0.88rem", color: "rgba(248,251,255,0.65)" }}>
              <span>Session ({players} player{players > 1 ? "s" : ""} × {hours}hr @ ₹{sessionRate}{players > 1 ? "/person" : ""})</span>
              <span style={{ color: "#f8fbff", fontWeight: 700 }}>₹{sessionTotal}</span>
            </div>
            {cartTotal > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: "0.88rem", color: "rgba(248,251,255,0.65)" }}>
                <span>Add-ons ({cart.length} item{cart.length > 1 ? "s" : ""})</span>
                <span style={{ color: "#f8fbff", fontWeight: 700 }}>₹{cartTotal}</span>
              </div>
            )}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: 10, paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700 }}>Grand Total</span>
              <span style={{ fontFamily: "Orbitron, sans-serif", fontSize: "1.4rem", fontWeight: 900, color: "#00f7ff" }}>₹{grandTotal}</span>
            </div>
          </div>

          {[
            { label: "Pricing", text: players === 1 ? "₹200/hr for solo sessions" : "₹150/person/hr for groups of 2+" },
            { label: "Tip", text: "Add snacks and gear from the Add-ons section before booking." },
          ].map((r) => (
            <div key={r.label} style={{ padding: "14px 0", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <small style={{ display: "block", fontFamily: "Rajdhani, sans-serif", fontWeight: 800, fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#00f7ff", marginBottom: 4 }}>{r.label}</small>
              <span style={{ color: "rgba(248,251,255,0.65)", lineHeight: 1.55 }}>{r.text}</span>
            </div>
          ))}
        </div>

        {/* Form */}
        <form className="glass" style={{ borderRadius: 22, padding: 28 }} onSubmit={handlePayment}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <input style={fieldStyle} placeholder="Your name" value={f.name} onChange={set("name")} required onFocus={focus} onBlur={blur} />
            <input style={fieldStyle} placeholder="Phone number" value={f.phone} onChange={set("phone")} required onFocus={focus} onBlur={blur} />

            <select style={{ ...fieldStyle, cursor: "pointer" }} value={f.room} onChange={set("room")}>
              {ROOMS.map((r) => <option key={r} style={{ background: "#0a0d14" }}>{r}</option>)}
            </select>
            <input style={fieldStyle} type="number" min={1} max={12} placeholder="No. of players" value={f.players} onChange={set("players")} onFocus={focus} onBlur={blur} />

            <select style={{ ...fieldStyle, cursor: "pointer" }} value={f.hours} onChange={set("hours")}>
              {[1, 2, 3, 4, 5, 6].map((h) => (
                <option key={h} value={h} style={{ background: "#0a0d14" }}>{h} hour{h > 1 ? "s" : ""}</option>
              ))}
            </select>
            <input style={fieldStyle} type="date" value={f.date} onChange={set("date")}
              onFocus={(e) => { e.target.style.borderColor = "rgba(0,247,255,0.6)"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; }} />
          </div>

          {/* Time slot picker */}
          {f.date && f.room !== ROOMS[0] && (
            <div style={{ marginTop: 14 }}>
              <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 800, fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#00f7ff", marginBottom: 8 }}>
                Pick start time — {hours}hr slot
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {HOURS_RANGE.map((h) => {
                  const avail = isAvailable(h);
                  const selected = selectedHour === h;
                  return (
                    <button
                      key={h}
                      type="button"
                      disabled={!avail}
                      onClick={() => setSelectedHour(h)}
                      style={{
                        padding: "6px 10px", borderRadius: 8, fontSize: "0.78rem", fontWeight: 700,
                        cursor: avail ? "pointer" : "not-allowed", fontFamily: "inherit",
                        border: selected ? "1.5px solid #00f7ff" : "1px solid rgba(255,255,255,0.12)",
                        background: selected ? "rgba(0,247,255,0.18)" : avail ? "rgba(255,255,255,0.04)" : "rgba(255,45,149,0.08)",
                        color: selected ? "#00f7ff" : avail ? "rgba(248,251,255,0.7)" : "#ff2d9566",
                        textDecoration: avail ? "none" : "line-through",
                      }}
                    >
                      {fmt24to12(h)}
                    </button>
                  );
                })}
              </div>
              {selectedHour !== null && (
                <p style={{ fontSize: "0.82rem", color: "#25d366", marginTop: 8 }}>
                  ✓ Selected: {fmt24to12(selectedHour)} – {fmt24to12(selectedHour + hours)}
                </p>
              )}
            </div>
          )}

          <textarea
            style={{ ...fieldStyle, minHeight: 80, resize: "vertical", marginTop: 12, display: "block" }}
            placeholder="Notes, game preference, birthday setup..."
            value={f.notes} onChange={set("notes")} onFocus={focus} onBlur={blur}
          />

          {/* Pay & Book */}
          <button type="submit" disabled={paying}
            style={{ width: "100%", marginTop: 14, minHeight: 52, borderRadius: 14, border: "none", fontWeight: 900, fontSize: "1rem", color: "#021014", background: paying ? "rgba(0,247,255,0.4)" : "linear-gradient(135deg,#00f7ff,#8a5cff)", cursor: paying ? "not-allowed" : "pointer", fontFamily: "inherit", boxShadow: "0 14px 40px rgba(0,247,255,0.22)", marginBottom: 10 }}>
            {paying ? "Opening payment..." : `💳 Pay & Book — ₹${grandTotal}`}
          </button>
          <button type="button" onClick={(e) => { e.preventDefault(); whatsappSubmit(); }}
            style={{ width: "100%", minHeight: 44, borderRadius: 14, border: "1px solid rgba(37,211,102,0.4)", background: "rgba(37,211,102,0.08)", color: "#25d366", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", fontFamily: "inherit" }}>
            💬 Book via WhatsApp instead
          </button>
        </form>
      </div>

      <style>{`
        @media (max-width: 860px) { #book .wrap { grid-template-columns: 1fr !important; } }
        @media (max-width: 520px) { #book form > div { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
