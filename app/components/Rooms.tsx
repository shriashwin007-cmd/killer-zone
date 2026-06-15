const ROOMS = [
  { icon: "🏎️", name: "Forza Horizon Room", desc: "Best for racing nights, reels, and high-energy groups who want the most cinematic first impression.", color: "#00f7ff" },
  { icon: "🕷️", name: "Spider-Verse Room", desc: "Photo-friendly lighting, bold wall art, and a fun pick for birthdays, couples, and casual players.", color: "#8a5cff" },
  { icon: "🦇", name: "Gotham × Minecraft Room", desc: "A darker squad setup with character, strong contrast, and room for longer late-night sessions.", color: "#ff2d95" },
];

export default function Rooms() {
  return (
    <section id="rooms" style={{ padding: "80px 0", position: "relative", zIndex: 1 }}>
      <div className="wrap">
        {/* Head */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 800, fontSize: "0.78rem", letterSpacing: "0.26em", textTransform: "uppercase", color: "#00f7ff", marginBottom: 8 }}>The Rooms</div>
          <h2 style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 900, fontSize: "clamp(2rem,4vw,3.2rem)", lineHeight: 1.08 }}>
            Pick Your <span className="grad">Battle Arena</span>
          </h2>
          <p style={{ color: "rgba(248,251,255,0.65)", marginTop: 10, lineHeight: 1.65 }}>
            Racing, superhero, dark cinematic, or playful pixel energy — pick your vibe.
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {ROOMS.map((r) => (
            <article key={r.name} className="glass" style={{ borderRadius: 18, padding: "22px 20px", transition: "transform .25s, border-color .25s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)"; (e.currentTarget as HTMLElement).style.borderColor = `${r.color}44`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.borderColor = ""; }}
            >
              {/* Placeholder image area */}
              <div className="img-placeholder" style={{ borderRadius: 12, height: 140, marginBottom: 18, fontSize: "2rem" }}>
                {r.icon}
              </div>
              <h3 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "0.95rem", marginBottom: 10, color: r.color }}>{r.name}</h3>
              <p style={{ color: "rgba(248,251,255,0.65)", lineHeight: 1.65, fontSize: "0.88rem" }}>{r.desc}</p>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) { #rooms .wrap > div:last-child { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
