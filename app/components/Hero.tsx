"use client";

const STATS = [
  { value: "PS5", label: "4K displays" },
  { value: "4 Rooms", label: "Themed bays" },
  { value: "Snacks", label: "Served inside" },
  { value: "5.0 ★", label: "Rated lounge" },
];

export default function Hero({ onChatOpen }: { onChatOpen: () => void }) {
  return (
    <section id="home" style={{ minHeight: "100svh", display: "grid", alignItems: "center", paddingTop: "calc(90px + env(safe-area-inset-top, 0px))", paddingBottom: 56, position: "relative", zIndex: 1 }}>
      <div className="wrap" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(2rem,5vw,4rem)", alignItems: "center" }}>

        {/* Left */}
        <div>
          {/* Pill */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, border: "1px solid rgba(0,247,255,0.3)", background: "rgba(0,247,255,0.07)", marginBottom: 18 }}>
            <span className="pulse-dot" />
            <span style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "0.76rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#00f7ff" }}>
              Chennai Gaming Lounge · Open till midnight
            </span>
          </div>

          {/* Heading */}
          <h1 style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 900, fontSize: "clamp(3rem,7vw,5.6rem)", lineHeight: 0.96, marginBottom: 18 }}>
            Enter the{" "}
            <span className="grad">Killer Zone</span>
          </h1>

          {/* Copy */}
          <p style={{ color: "rgba(248,251,255,0.65)", fontSize: "clamp(1rem,1.6vw,1.14rem)", lineHeight: 1.72, maxWidth: 560, marginBottom: 28 }}>
            A cinematic PS5 lounge built for squad nights, birthdays, dates, and serious gaming sessions. Choose a themed room, settle into the neon, and press start.
          </p>

          {/* CTA row */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 32 }}>
            <a href="#book" style={{ display: "inline-flex", alignItems: "center", gap: 8, minHeight: 48, padding: "0 22px", borderRadius: 14, fontWeight: 800, textDecoration: "none", color: "#021014", background: "linear-gradient(135deg,#00f7ff,#8a5cff)", boxShadow: "0 16px 44px rgba(0,247,255,0.24)" }}>
              🎮 Reserve a Slot
            </a>
            <button onClick={onChatOpen} style={{ display: "inline-flex", alignItems: "center", gap: 8, minHeight: 48, padding: "0 22px", borderRadius: 14, fontWeight: 800, border: "1px solid rgba(0,247,255,0.44)", background: "rgba(0,247,255,0.04)", color: "#00f7ff", cursor: "pointer", fontFamily: "inherit" }}>
              🤖 Ask KZ Assist
            </button>
            <a href="https://wa.me/917358546431?text=Hi%20Killer%20Zone!%20I%20want%20to%20book." target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, minHeight: 48, padding: "0 22px", borderRadius: 14, fontWeight: 800, textDecoration: "none", color: "#03120a", background: "#25d366", boxShadow: "0 14px 40px rgba(37,211,102,0.22)" }}>
              💬 WhatsApp
            </a>
          </div>

          {/* Stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {STATS.map((s) => (
              <div key={s.value} className="glass" style={{ borderRadius: 14, padding: "14px 12px" }}>
                <strong style={{ display: "block", fontFamily: "Orbitron, sans-serif", fontSize: "0.95rem", color: "#00f7ff" }}>{s.value}</strong>
                <span style={{ fontSize: "0.74rem", color: "rgba(248,251,255,0.42)" }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right – placeholder for Cloudinary hero image */}
        <div className="glass img-placeholder" style={{ borderRadius: 24, minHeight: 500, flexDirection: "column", gap: 12 }}>
          <span style={{ fontSize: "3rem" }}>🎮</span>
          <span>Hero image coming soon</span>
          <span style={{ fontSize: "0.7rem", opacity: 0.5 }}>Replace with Cloudinary URL</span>
        </div>
      </div>

      {/* Responsive stacking */}
      <style>{`
        @media (max-width: 860px) {
          #home .wrap { grid-template-columns: 1fr !important; }
          #home .wrap > div:last-child { order: -1; min-height: 280px !important; }
        }
        @media (max-width: 520px) {
          #home .wrap > div:first-child > div:last-child { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </section>
  );
}
