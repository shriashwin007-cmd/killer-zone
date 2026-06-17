"use client";

const CONSOLES = [
  { num: "01", label: "Console 1", color: "#00f7ff" },
  { num: "02", label: "Console 2", color: "#8a5cff" },
  { num: "03", label: "Console 3", color: "#ff2d95" },
  { num: "04", label: "Console 4", color: "#00f7ff" },
];

export default function Rooms() {
  return (
    <section id="rooms" style={{ padding: "80px 0", position: "relative", zIndex: 1 }}>
      <div className="wrap">

        <div style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 800, fontSize: "0.78rem", letterSpacing: "0.26em", textTransform: "uppercase", color: "#00f7ff", marginBottom: 8 }}>The Zone</div>
          <h2 style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 900, fontSize: "clamp(2rem,4vw,3.2rem)", lineHeight: 1.08 }}>
            1 Room. <span className="grad">4 Consoles.</span>
          </h2>
          <p style={{ color: "rgba(248,251,255,0.65)", marginTop: 10, lineHeight: 1.65, maxWidth: 520 }}>
            One premium gaming lounge with 4 PS5 consoles — play solo or bring your squad. Every console gets its own screen, controller, and full PS5 library access.
          </p>
        </div>

        {/* Console grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }} className="console-grid">
          {CONSOLES.map((c) => (
            <div key={c.num} className="glass" style={{
              borderRadius: 16, padding: "28px 20px",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
              border: `1px solid ${c.color}22`,
              background: `linear-gradient(135deg, ${c.color}08 0%, rgba(5,7,12,0.6) 100%)`,
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: `${c.color}18`,
                border: `2px solid ${c.color}44`,
                display: "grid", placeItems: "center",
                fontFamily: "Orbitron, sans-serif", fontWeight: 900,
                fontSize: "1rem", color: c.color,
              }}>{c.num}</div>
              <div style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 700, fontSize: "0.78rem", color: "#f8fbff", letterSpacing: "0.1em" }}>{c.label}</div>
              <div style={{ fontSize: "0.75rem", color: "rgba(248,251,255,0.45)", textAlign: "center", lineHeight: 1.5 }}>PS5 · 4K Display · Full Library</div>
            </div>
          ))}
        </div>

        {/* Features row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginTop: 14 }} className="features-grid">
          {[
            { icon: "🎮", title: "Solo Session", desc: "₹200/hr — your own console, your own pace." },
            { icon: "👥", title: "Group Session", desc: "₹150/person/hr — up to 4 players at once." },
            { icon: "🎂", title: "Birthday & Events", desc: "Book the whole zone for private parties." },
          ].map((f) => (
            <div key={f.title} className="glass" style={{ borderRadius: 16, padding: "24px 20px" }}>
              <div style={{ fontSize: "1.8rem", marginBottom: 10 }}>{f.icon}</div>
              <h3 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "0.88rem", color: "#f8fbff", marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: "rgba(248,251,255,0.55)", fontSize: "0.82rem", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 32, textAlign: "center" }}>
          <a href="#book" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            padding: "14px 36px", borderRadius: 14, textDecoration: "none",
            fontFamily: "Orbitron, sans-serif", fontWeight: 800, fontSize: "0.9rem",
            color: "#021014", background: "linear-gradient(135deg,#00f7ff,#8a5cff)",
            boxShadow: "0 12px 32px rgba(0,247,255,0.22)",
          }}>Book Your Console →</a>
        </div>

      </div>

      <style>{`
        @media (max-width: 860px) {
          .console-grid  { grid-template-columns: repeat(2,1fr) !important; }
          .features-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .console-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </section>
  );
}
