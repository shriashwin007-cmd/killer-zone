const ROWS = [
  {
    icon: "🎮",
    title: "Solo Session",
    sub: "1 person · 1 dedicated console",
    value: "₹200 / hr",
    color: "#00f7ff",
  },
  {
    icon: "👥",
    title: "Group Session",
    sub: "2+ people · shared console",
    value: "₹150 / person / hr",
    color: "#8a5cff",
  },
  {
    icon: "🌙",
    title: "Night Deal",
    sub: "Late sessions after 10 PM",
    value: "Ask us",
    color: "#ff2d95",
  },
];

const EXAMPLES = [
  { label: "2 friends, 1 hr", calc: "2 × ₹150", total: "₹300" },
  { label: "4 friends, 2 hrs", calc: "4 × ₹150 × 2", total: "₹1,200" },
  { label: "Solo, 3 hrs", calc: "₹200 × 3", total: "₹600" },
];

export default function Pricing() {
  return (
    <section id="pricing" style={{ padding: "80px 0", position: "relative", zIndex: 1 }}>
      <div className="wrap" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, alignItems: "start" }}>

        {/* Left */}
        <div>
          <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 800, fontSize: "0.78rem", letterSpacing: "0.26em", textTransform: "uppercase", color: "#00f7ff", marginBottom: 8 }}>Pricing</div>
          <h2 style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 900, fontSize: "clamp(2rem,4vw,3.2rem)", lineHeight: 1.08 }}>
            Premium Gaming, <span className="grad">Fair Rates</span>
          </h2>
          <p style={{ color: "rgba(248,251,255,0.65)", marginTop: 14, lineHeight: 1.7, fontSize: "clamp(.95rem,1.5vw,1.1rem)" }}>
            Solo gamers get a dedicated console at ₹200/hr. Groups of 2 or more share one console at ₹150 per person per hour — great value for squad sessions.
          </p>

          {/* Quick examples */}
          <div style={{ marginTop: 24, borderRadius: 16, padding: 18, background: "rgba(138,92,255,0.07)", border: "1px solid rgba(138,92,255,0.2)" }}>
            <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 800, fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#8a5cff", marginBottom: 12 }}>Quick examples</div>
            {EXAMPLES.map((ex) => (
              <div key={ex.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div>
                  <span style={{ fontSize: "0.88rem", color: "#f8fbff", fontWeight: 600 }}>{ex.label}</span>
                  <span style={{ fontSize: "0.76rem", color: "rgba(248,251,255,0.4)", marginLeft: 8 }}>{ex.calc}</span>
                </div>
                <strong style={{ fontFamily: "Orbitron, sans-serif", fontSize: "0.9rem", color: "#00f7ff" }}>{ex.total}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="glass" style={{ borderRadius: 22, padding: 24 }}>
          {ROWS.map((r, i) => (
            <div
              key={r.title}
              style={{
                display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 14, alignItems: "center",
                padding: "18px 0",
                borderBottom: i < ROWS.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12, display: "grid", placeItems: "center",
                fontSize: "1.4rem", background: `${r.color}14`, border: `1px solid ${r.color}22`,
              }}>
                {r.icon}
              </div>
              <div>
                <b style={{ display: "block", fontWeight: 700, marginBottom: 3 }}>{r.title}</b>
                <small style={{ color: "rgba(248,251,255,0.42)", fontSize: "0.78rem" }}>{r.sub}</small>
              </div>
              <strong style={{ fontFamily: "Orbitron, sans-serif", color: r.color, fontSize: "0.85rem", textAlign: "right" }}>
                {r.value}
              </strong>
            </div>
          ))}

          <a
            href="#book"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              marginTop: 20, minHeight: 48, borderRadius: 14, textDecoration: "none",
              fontWeight: 800, fontSize: "0.95rem", color: "#021014",
              background: "linear-gradient(135deg,#00f7ff,#8a5cff)",
              boxShadow: "0 12px 32px rgba(0,247,255,0.2)",
            }}
          >
            🎮 Book a Session
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 760px) { #pricing .wrap { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
