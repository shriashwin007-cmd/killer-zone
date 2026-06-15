const ROWS = [
  { icon: "⏱️", title: "Per Hour",    sub: "Solo or duo sessions",    value: "Ask us" },
  { icon: "👥", title: "Group Offer", sub: "Best for 3+ players",     value: "Special" },
  { icon: "🌙", title: "Night Deal",  sub: "Late sessions and squads", value: "Ask us" },
];

export default function Pricing() {
  return (
    <section id="pricing" style={{ padding: "80px 0", position: "relative", zIndex: 1 }}>
      <div className="wrap" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 800, fontSize: "0.78rem", letterSpacing: "0.26em", textTransform: "uppercase", color: "#00f7ff", marginBottom: 8 }}>Pricing</div>
          <h2 style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 900, fontSize: "clamp(2rem,4vw,3.2rem)", lineHeight: 1.08 }}>
            Premium Gaming, <span className="grad">Fair Rates</span>
          </h2>
          <p style={{ color: "rgba(248,251,255,0.65)", marginTop: 14, lineHeight: 1.7, fontSize: "clamp(.95rem,1.5vw,1.1rem)" }}>
            Pricing is enquiry-based — staff quote based on room, duration, and group size. WhatsApp us for a quick answer.
          </p>
        </div>

        <div className="glass" style={{ borderRadius: 22, padding: 24 }}>
          {ROWS.map((r, i) => (
            <div key={r.title} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 14, alignItems: "center", padding: "14px 0", borderBottom: i < ROWS.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
              <span style={{ fontSize: "1.4rem" }}>{r.icon}</span>
              <div>
                <b style={{ display: "block", fontWeight: 700 }}>{r.title}</b>
                <small style={{ color: "rgba(248,251,255,0.42)" }}>{r.sub}</small>
              </div>
              <strong style={{ fontFamily: "Orbitron, sans-serif", color: "#00f7ff", fontSize: "0.9rem" }}>{r.value}</strong>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 760px) { #pricing .wrap { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
