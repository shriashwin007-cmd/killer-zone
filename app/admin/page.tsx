"use client";
import { useEffect, useState, useMemo } from "react";
import { BEVERAGES, SNACKS } from "@/app/components/addonsData";

const ALL_ITEMS = [
  ...BEVERAGES.map((i) => ({ ...i, category: "Beverages" })),
  ...SNACKS.map((i) => ({ ...i, category: "Snacks" })),
];

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
  completed: "#8a5cff",
};

const CONSOLES = ["Console 01", "Console 02", "Console 03", "Console 04"];
const HOURS = Array.from({ length: 14 }, (_, i) => i + 10); // 10–23

function fmt24(h: number) {
  if (h === 12) return "12 PM";
  return h > 12 ? `${h - 12} PM` : `${h} AM`;
}

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const field: React.CSSProperties = {
  padding: "9px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.05)", color: "#f8fbff", fontFamily: "inherit",
  fontSize: "0.88rem", outline: "none",
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("kz_admin") : null
  );
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [view, setView] = useState<"list" | "schedule" | "menu">("list");
  const [menuOverrides, setMenuOverrides] = useState<Record<string, { out_of_stock?: boolean; hidden?: boolean }>>({});
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

  useEffect(() => {
    if (!token) return;
    fetch("/api/admin/menu")
      .then((r) => r.json())
      .then(({ overrides }) => {
        const map: Record<string, { out_of_stock?: boolean; hidden?: boolean }> = {};
        (overrides ?? []).forEach((o: { item_id: string; out_of_stock?: boolean; hidden?: boolean }) => { map[o.item_id] = o; });
        setMenuOverrides(map);
      })
      .catch(() => {});
  }, [token]);

  async function toggleMenuField(item_id: string, field: "out_of_stock" | "hidden") {
    const current = menuOverrides[item_id]?.[field] ?? false;
    const value = !current;
    setMenuOverrides((prev) => ({ ...prev, [item_id]: { ...prev[item_id], [field]: value } }));
    await fetch("/api/admin/menu", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ item_id, field, value }),
    });
  }

  async function updateStatus(id: string, status: string) {
    await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, status }),
    });
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  }

  async function deleteBooking(id: string, name: string) {
    if (!confirm(`Delete booking for "${name}"? This cannot be undone.`)) return;
    await fetch("/api/admin/bookings", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id }),
    });
    setBookings((prev) => prev.filter((b) => b.id !== id));
  }

  const today = todayISO();

  const filtered = useMemo(() => {
    let list = bookings;
    if (filter === "today") list = list.filter((b) => b.date === today);
    else if (filter !== "all") list = list.filter((b) => b.status === filter);
    if (dateFilter) list = list.filter((b) => b.date === dateFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((b) => b.name.toLowerCase().includes(q) || b.phone.includes(q));
    }
    return list;
  }, [bookings, filter, dateFilter, search, today]);

  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");
  const totalRevenue = confirmedBookings.reduce((s, b) => s + b.total_amount, 0);
  const todayBookings = bookings.filter((b) => b.date === today);
  const todayRevenue = todayBookings.filter((b) => b.status === "confirmed").reduce((s, b) => s + b.total_amount, 0);

  // Build schedule grid for selected date (or today)
  const scheduleDate = dateFilter || today;
  const scheduleBookings = bookings.filter((b) => b.date === scheduleDate && b.status !== "cancelled");

  // ── Login ────────────────────────────────────────────────────────────────────
  if (!token) {
    return (
      <div style={{ minHeight: "100svh", background: "#05070c", display: "grid", placeItems: "center", fontFamily: "Rajdhani, sans-serif" }}>
        <div style={{ width: "min(400px, calc(100vw - 32px))", padding: 32, borderRadius: 22, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 900, fontSize: "1.4rem", marginBottom: 6, color: "#f8fbff" }}>🎮 KZ Admin</div>
          <p style={{ color: "rgba(248,251,255,0.45)", marginBottom: 24, fontSize: "0.9rem" }}>Killer Zone booking dashboard</p>
          <form onSubmit={login} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input type="password" placeholder="Admin password" value={password} onChange={(e) => setPassword(e.target.value)}
              style={{ ...field, padding: "12px 16px", fontSize: "1rem" }} />
            {err && <p style={{ color: "#ff2d95", fontSize: "0.85rem" }}>{err}</p>}
            <button type="submit" disabled={loading}
              style={{ padding: "14px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#00f7ff,#8a5cff)", fontWeight: 900, fontSize: "1rem", color: "#021014", cursor: "pointer", fontFamily: "inherit" }}>
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 900, fontSize: "clamp(1.2rem,3vw,1.8rem)", marginBottom: 2 }}>🎮 KZ Admin Dashboard</h1>
            <p style={{ color: "rgba(248,251,255,0.4)", fontSize: "0.85rem" }}>{bookings.length} total bookings · {today}</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => {
              setLoading(true);
              fetch("/api/admin/bookings", { headers: { Authorization: `Bearer ${token}` } })
                .then((r) => r.json()).then(({ bookings }) => setBookings(bookings ?? []))
                .finally(() => setLoading(false));
            }} style={{ ...field, cursor: "pointer", border: "1px solid rgba(0,247,255,0.25)", color: "#00f7ff" }}>
              ↻ Refresh
            </button>
            <button onClick={() => { setToken(null); localStorage.removeItem("kz_admin"); }}
              style={{ ...field, cursor: "pointer" }}>
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 24 }}>
          {[
            { label: "Total Bookings", value: bookings.length, color: "#00f7ff" },
            { label: "Confirmed", value: confirmedBookings.length, color: "#25d366" },
            { label: "Pending", value: bookings.filter((b) => b.status === "pending").length, color: "#f59e0b" },
            { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, color: "#8a5cff" },
            { label: "Today's Bookings", value: todayBookings.length, color: "#00f7ff" },
            { label: "Today's Revenue", value: `₹${todayRevenue.toLocaleString("en-IN")}`, color: "#25d366" },
          ].map((s) => (
            <div key={s.label} style={{ borderRadius: 14, padding: "14px 16px", background: "rgba(255,255,255,0.04)", border: `1px solid ${s.color}22` }}>
              <div style={{ fontFamily: "Orbitron, sans-serif", fontSize: "1.3rem", fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: "0.78rem", color: "rgba(248,251,255,0.4)", marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* View toggle */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          {([["list", "📋 Bookings"], ["schedule", "📅 Schedule"], ["menu", "🍿 Menu"]] as const).map(([v, label]) => (
            <button key={v} onClick={() => setView(v)}
              style={{ padding: "7px 16px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.12)", background: view === v ? "rgba(0,247,255,0.15)" : "none", color: view === v ? "#00f7ff" : "rgba(248,251,255,0.5)", cursor: "pointer", fontFamily: "inherit", fontSize: "0.85rem" }}>
              {label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
          {["all", "today", "confirmed", "pending", "completed", "cancelled"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "6px 14px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.12)", background: filter === f ? "rgba(0,247,255,0.15)" : "none", color: filter === f ? "#00f7ff" : "rgba(248,251,255,0.5)", cursor: "pointer", fontFamily: "inherit", fontSize: "0.82rem", textTransform: "capitalize" }}>
              {f}
            </button>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input placeholder="🔍 Search name / phone" value={search} onChange={(e) => setSearch(e.target.value)}
              style={{ ...field, width: 200 }} />
            <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}
              style={{ ...field }} title="Filter by date" />
            {dateFilter && (
              <button onClick={() => setDateFilter("")} style={{ ...field, cursor: "pointer", color: "#ff2d95", borderColor: "rgba(255,45,149,0.3)" }}>✕ Clear date</button>
            )}
          </div>
        </div>

        {/* ── Schedule view ── */}
        {view === "schedule" && (
          <div style={{ marginBottom: 32, overflowX: "auto" }}>
            <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 800, fontSize: "0.78rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#00f7ff", marginBottom: 12 }}>
              Console Schedule — {scheduleDate}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: `80px repeat(${CONSOLES.length}, 1fr)`, gap: 4, minWidth: 540 }}>
              {/* Header row */}
              <div />
              {CONSOLES.map((c) => (
                <div key={c} style={{ textAlign: "center", fontFamily: "Orbitron, sans-serif", fontSize: "0.7rem", color: "#00f7ff", fontWeight: 700, padding: "6px 4px", borderRadius: 8, background: "rgba(0,247,255,0.08)" }}>{c}</div>
              ))}
              {/* Hour rows */}
              {HOURS.map((h) => (
                <>
                  <div key={`h${h}`} style={{ fontSize: "0.75rem", color: "rgba(248,251,255,0.4)", display: "flex", alignItems: "center", paddingRight: 8, fontWeight: 600 }}>{fmt24(h)}</div>
                  {CONSOLES.map((c) => {
                    const booking = scheduleBookings.find((b) => {
                      if (b.room !== c) return false;
                      const startH = parseInt(b.time_slot?.split(":")[0] ?? "-1");
                      return h >= startH && h < startH + (b.hours || 1);
                    });
                    return (
                      <div key={`${h}-${c}`} style={{
                        height: 36, borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)",
                        background: booking ? `${STATUS_COLOR[booking.status] ?? "#888"}22` : "rgba(255,255,255,0.03)",
                        display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
                        fontSize: "0.68rem", fontWeight: 700,
                        color: booking ? STATUS_COLOR[booking.status] : "transparent",
                      }}>
                        {booking ? booking.name.split(" ")[0] : ""}
                      </div>
                    );
                  })}
                </>
              ))}
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
              {Object.entries(STATUS_COLOR).map(([s, c]) => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.78rem", color: "rgba(248,251,255,0.5)" }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: c }} />
                  {s}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── List view ── */}
        {view === "list" && (
          loading ? (
            <div style={{ textAlign: "center", padding: 60, color: "rgba(248,251,255,0.3)" }}>Loading…</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: "rgba(248,251,255,0.3)" }}>No bookings found</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filtered.map((b) => (
                <div key={b.id} style={{ borderRadius: 16, padding: "18px 20px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <span style={{ fontWeight: 800, fontSize: "1.05rem" }}>{b.name}</span>
                        <span style={{ fontSize: "0.8rem", padding: "3px 10px", borderRadius: 999, background: `${STATUS_COLOR[b.status] ?? "#888"}22`, color: STATUS_COLOR[b.status] ?? "#888", fontWeight: 700 }}>
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

                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "Orbitron, sans-serif", fontSize: "1.3rem", fontWeight: 900, color: "#00f7ff", marginBottom: 10 }}>
                        ₹{b.total_amount}
                      </div>
                      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", flexWrap: "wrap" }}>
                        {b.status !== "confirmed" && (
                          <button onClick={() => updateStatus(b.id, "confirmed")}
                            style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #25d36644", background: "rgba(37,211,102,0.1)", color: "#25d366", cursor: "pointer", fontFamily: "inherit", fontSize: "0.78rem", fontWeight: 700 }}>
                            ✓ Confirm
                          </button>
                        )}
                        {b.status !== "completed" && (
                          <button onClick={() => updateStatus(b.id, "completed")}
                            style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #8a5cff44", background: "rgba(138,92,255,0.1)", color: "#8a5cff", cursor: "pointer", fontFamily: "inherit", fontSize: "0.78rem", fontWeight: 700 }}>
                            ✔ Done
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
                        <button onClick={() => deleteBooking(b.id, b.name)}
                          style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(255,45,149,0.3)", background: "rgba(255,45,149,0.08)", color: "#ff2d9588", cursor: "pointer", fontFamily: "inherit", fontSize: "0.78rem", fontWeight: 700 }}>
                          🗑
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* ── Menu Management view ── */}
        {view === "menu" && (
          <div>
            <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 800, fontSize: "0.78rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#00f7ff", marginBottom: 16 }}>
              Menu Items — toggle stock &amp; visibility
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {ALL_ITEMS.map((item) => {
                const oos = menuOverrides[item.id]?.out_of_stock ?? false;
                const hidden = menuOverrides[item.id]?.hidden ?? false;
                return (
                  <div key={item.id} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                    borderRadius: 14, padding: "14px 18px",
                    background: hidden ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    opacity: hidden ? 0.45 : 1,
                    flexWrap: "wrap",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {item.img && <img src={item.img} alt={item.name} style={{ width: 40, height: 40, objectFit: "contain", borderRadius: 8, background: "rgba(255,255,255,0.06)" }} />}
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.92rem" }}>{item.name}</div>
                        <div style={{ fontSize: "0.76rem", color: "rgba(248,251,255,0.4)" }}>{item.category} · {item.label}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => toggleMenuField(item.id, "out_of_stock")}
                        style={{
                          padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: "0.78rem", fontWeight: 700,
                          border: oos ? "1px solid #f59e0b88" : "1px solid rgba(255,255,255,0.12)",
                          background: oos ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.04)",
                          color: oos ? "#f59e0b" : "rgba(248,251,255,0.5)",
                        }}>
                        {oos ? "⚠ Out of Stock" : "✓ In Stock"}
                      </button>
                      <button onClick={() => toggleMenuField(item.id, "hidden")}
                        style={{
                          padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: "0.78rem", fontWeight: 700,
                          border: hidden ? "1px solid #ff2d9588" : "1px solid rgba(255,255,255,0.12)",
                          background: hidden ? "rgba(255,45,149,0.12)" : "rgba(255,255,255,0.04)",
                          color: hidden ? "#ff2d95" : "rgba(248,251,255,0.5)",
                        }}>
                        {hidden ? "👁 Hidden" : "👁 Visible"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
