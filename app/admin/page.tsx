"use client";
import { useEffect, useState } from "react";

type Payment = { razorpay_payment_id: string; amount: number; status: string; created_at: string };
type Booking = {
  id: string; name: string; phone: string; room: string;
  players: number; hours: number; date: string; time_slot: string;
  notes: string; session_amount: number; addons_amount: number;
  total_amount: number; status: string; created_at: string;
  payments: Payment[];
  cart_items: { name: string; quantity: number; price: number }[];
};

const STATUS_COLOR: Record<string, string> = {
  confirmed: "#25d366",
  pending: "#f59e0b",
  cancelled: "#ff2d95",
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("kz_admin") : null
  );
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [err, setErr] = useState("");

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/admin/bookings", {
      headers: { Authorization: `Bearer ${password}` },
    });
    if (res.ok) {
      localStorage.setItem("kz_admin", password);
      setToken(password);
      const { bookings } = await res.json();
      setBookings(bookings ?? []);
    } else {
      setErr("Wrong password");
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch("/api/admin/bookings", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(({ bookings }) => setBookings(bookings ?? []))
      .catch(() => { setToken(null); localStorage.removeItem("kz_admin"); })
      .finally(() => setLoading(false));
  }, [token]);

  async function updateStatus(id: string, status: string) {
    await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, status }),
    });
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  }

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);
  const totalRevenue = bookings.filter((b) => b.status === "confirmed").reduce((s, b) => s + b.total_amount, 0);

  // ── Login screen ────────────────────────────────────────────────────────────
  if (!token) {
    return (
      <div style={{ minHeight: "100svh", background: "#05070c", display: "grid", placeItems: "center", fontFamily: "Rajdhani, sans-serif" }}>
        <div style={{ width: "min(400px, calc(100vw - 32px))", padding: 32, borderRadius: 22, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 900, fontSize: "1.4rem", marginBottom: 6, color: "#f8fbff" }}>
            🎮 KZ Admin
          </div>
          <p style={{ color: "rgba(248,251,255,0.45)", marginBottom: 24, fontSize: "0.9rem" }}>Killer Zone booking dashboard</p>
          <form onSubmit={login} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: "#f8fbff", fontSize: "1rem", fontFamily: "inherit", outline: "none" }}
            />
            {err && <p style={{ color: "#ff2d95", fontSize: "0.85rem" }}>{err}</p>}
            <button type="submit" disabled={loading} style={{ padding: "14px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#00f7ff,#8a5cff)", fontWeight: 900, fontSize: "1rem", color: "#021014", cursor: "pointer", fontFamily: "inherit" }}>
              {loading ? "Checking..." : "Enter Dashboard"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Dashboard ────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100svh", background: "#05070c", color: "#f8fbff", fontFamily: "Rajdhani, sans-serif", padding: "24px 16px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 900, fontSize: "clamp(1.4rem,3vw,2rem)", marginBottom: 4 }}>🎮 KZ Admin Dashboard</h1>
            <p style={{ color: "rgba(248,251,255,0.45)", fontSize: "0.9rem" }}>{bookings.length} total bookings</p>
          </div>
          <button onClick={() => { setToken(null); localStorage.removeItem("kz_admin"); }}
            style={{ padding: "8px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)", background: "none", color: "rgba(248,251,255,0.5)", cursor: "pointer", fontFamily: "inherit", fontSize: "0.85rem" }}>
            Logout
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 28 }}>
          {[
            { label: "Total Bookings", value: bookings.length, color: "#00f7ff" },
            { label: "Confirmed", value: bookings.filter((b) => b.status === "confirmed").length, color: "#25d366" },
            { label: "Pending", value: bookings.filter((b) => b.status === "pending").length, color: "#f59e0b" },
            { label: "Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, color: "#8a5cff" },
          ].map((s) => (
            <div key={s.label} style={{ borderRadius: 16, padding: "16px 20px", background: "rgba(255,255,255,0.04)", border: `1px solid ${s.color}22` }}>
              <div style={{ fontFamily: "Orbitron, sans-serif", fontSize: "1.5rem", fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: "0.82rem", color: "rgba(248,251,255,0.45)", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {["all", "confirmed", "pending", "cancelled"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "7px 16px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.12)", background: filter === f ? "rgba(0,247,255,0.15)" : "none", color: filter === f ? "#00f7ff" : "rgba(248,251,255,0.5)", cursor: "pointer", fontFamily: "inherit", fontSize: "0.85rem", textTransform: "capitalize" }}>
              {f}
            </button>
          ))}
        </div>

        {/* Bookings table */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "rgba(248,251,255,0.3)" }}>Loading bookings…</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, color: "rgba(248,251,255,0.3)" }}>No bookings found</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map((b) => (
              <div key={b.id} style={{ borderRadius: 16, padding: "18px 20px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
                  {/* Left */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <span style={{ fontWeight: 800, fontSize: "1.05rem" }}>{b.name}</span>
                      <span style={{ fontSize: "0.82rem", padding: "3px 10px", borderRadius: 999, background: `${STATUS_COLOR[b.status] ?? "#888"}22`, color: STATUS_COLOR[b.status] ?? "#888", fontWeight: 700 }}>
                        {b.status}
                      </span>
                    </div>
                    <div style={{ color: "rgba(248,251,255,0.55)", fontSize: "0.88rem", display: "flex", flexWrap: "wrap", gap: "4px 16px" }}>
                      <span>📱 {b.phone}</span>
                      <span>🎮 {b.room}</span>
                      <span>👥 {b.players} player{b.players > 1 ? "s" : ""}</span>
                      <span>⏱ {b.hours}hr</span>
                      {b.date && <span>📅 {b.date}</span>}
                      {b.time_slot && <span>🕐 {b.time_slot}</span>}
                    </div>
                    {b.notes && <div style={{ marginTop: 6, fontSize: "0.82rem", color: "rgba(248,251,255,0.38)", fontStyle: "italic" }}>"{b.notes}"</div>}
                    {b.cart_items?.length > 0 && (
                      <div style={{ marginTop: 6, fontSize: "0.8rem", color: "rgba(248,251,255,0.38)" }}>
                        Add-ons: {b.cart_items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}
                      </div>
                    )}
                    {b.payments?.[0]?.razorpay_payment_id && (
                      <div style={{ marginTop: 4, fontSize: "0.78rem", color: "#25d366" }}>
                        ✅ Payment: {b.payments[0].razorpay_payment_id}
                      </div>
                    )}
                    <div style={{ marginTop: 4, fontSize: "0.76rem", color: "rgba(248,251,255,0.25)" }}>
                      {new Date(b.created_at).toLocaleString("en-IN")}
                    </div>
                  </div>

                  {/* Right */}
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "Orbitron, sans-serif", fontSize: "1.3rem", fontWeight: 900, color: "#00f7ff", marginBottom: 10 }}>
                      ₹{b.total_amount}
                    </div>
                    <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                      {b.status !== "confirmed" && (
                        <button onClick={() => updateStatus(b.id, "confirmed")}
                          style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #25d36644", background: "rgba(37,211,102,0.1)", color: "#25d366", cursor: "pointer", fontFamily: "inherit", fontSize: "0.78rem", fontWeight: 700 }}>
                          ✓ Confirm
                        </button>
                      )}
                      {b.status !== "cancelled" && (
                        <button onClick={() => updateStatus(b.id, "cancelled")}
                          style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #ff2d9544", background: "rgba(255,45,149,0.1)", color: "#ff2d95", cursor: "pointer", fontFamily: "inherit", fontSize: "0.78rem", fontWeight: 700 }}>
                          ✕ Cancel
                        </button>
                      )}
                      <a href={`https://wa.me/${b.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"
                        style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #25d36644", background: "rgba(37,211,102,0.1)", color: "#25d366", textDecoration: "none", fontSize: "0.78rem", fontWeight: 700 }}>
                        💬 WA
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
