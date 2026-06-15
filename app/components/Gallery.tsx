// All images replaced with Cloudinary-ready placeholders.
// To add images: replace the placeholder divs with <img src="YOUR_CLOUDINARY_URL" ... />

const TILES = [
  { label: "Forza Lounge",    icon: "🏎️", span: true  },
  { label: "Spider-Verse Bay",icon: "🕷️", span: false },
  { label: "Battle Stations", icon: "🖥️", span: false },
  { label: "Neon Details",    icon: "💡", span: false },
  { label: "Premium Display", icon: "📺", span: false },
];

export default function Gallery() {
  return (
    <section id="gallery" style={{ padding: "80px 0", position: "relative", zIndex: 1 }}>
      <div className="wrap">
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 800, fontSize: "0.78rem", letterSpacing: "0.26em", textTransform: "uppercase", color: "#00f7ff", marginBottom: 8 }}>Inside</div>
          <h2 style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 900, fontSize: "clamp(2rem,4vw,3.2rem)", lineHeight: 1.08 }}>
            Real Lounge <span className="grad">Visuals</span>
          </h2>
          <p style={{ color: "rgba(248,251,255,0.65)", marginTop: 10, lineHeight: 1.65 }}>
            Cloudinary images will load here. Placeholders shown until URLs are added.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gridAutoRows: "200px", gap: 12 }}>
          {TILES.map((t) => (
            <div key={t.label}
              className="img-placeholder glass"
              style={{
                borderRadius: 16,
                gridRow: t.span ? "span 2" : undefined,
                position: "relative",
                overflow: "hidden",
                flexDirection: "column",
              }}
            >
              <span style={{ fontSize: "2.8rem", marginBottom: 8 }}>{t.icon}</span>
              <span style={{ fontFamily: "Orbitron, sans-serif", fontSize: "0.7rem", letterSpacing: "0.1em" }}>{t.label}</span>

              {/* Label bar */}
              <div style={{
                position: "absolute", left: 10, right: 10, bottom: 10,
                padding: "8px 12px", borderRadius: 10,
                background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
                fontFamily: "Orbitron, sans-serif", fontSize: "0.72rem", letterSpacing: "0.08em", fontWeight: 800, textTransform: "uppercase",
                color: "#f8fbff",
              }}>{t.label}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          #gallery .wrap > div:last-child {
            grid-template-columns: repeat(2,1fr) !important;
          }
          #gallery .wrap > div:last-child > div:first-child {
            grid-column: span 2; grid-row: span 1 !important;
          }
        }
        @media (max-width: 520px) {
          #gallery .wrap > div:last-child { grid-template-columns: 1fr !important; }
          #gallery .wrap > div:last-child > div:first-child { grid-column: auto; }
        }
      `}</style>
    </section>
  );
}
