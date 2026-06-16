export default function Location() {
  return (
    <section id="location" style={{ padding: "80px 0", position: "relative", zIndex: 1 }}>
      <div className="wrap" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>

        <div className="glass" style={{ borderRadius: 22, padding: 28 }}>
          <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 800, fontSize: "0.78rem", letterSpacing: "0.26em", textTransform: "uppercase", color: "#00f7ff", marginBottom: 8 }}>Find Us</div>
          <h2 style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 900, fontSize: "clamp(1.8rem,3.5vw,2.8rem)", lineHeight: 1.08, marginBottom: 24 }}>
            Killer Zone Chennai
          </h2>
          {[
            { label: "Phone",   content: <a href="tel:919444409996" style={{ color: "rgba(248,251,255,0.65)", textDecoration: "none" }}>+91 94444 09996</a> },
            { label: "Hours",   content: <span style={{ color: "rgba(248,251,255,0.65)" }}>Open Daily · 11:00 AM – 12:00 AM</span> },
            { label: "Address", content: <span style={{ color: "rgba(248,251,255,0.65)" }}>G-55, First Main Road, Anna Nagar East, Chennai, Tamil Nadu</span> },
          ].map((r) => (
            <div key={r.label} style={{ padding: "14px 0", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <small style={{ display: "block", fontFamily: "Rajdhani, sans-serif", fontWeight: 800, fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#00f7ff", marginBottom: 4 }}>{r.label}</small>
              {r.content}
            </div>
          ))}
          <a href="https://maps.google.com/?q=Killer+Zone+G-55+First+Main+Road+Anna+Nagar+East+Chennai" target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 20, minHeight: 44, padding: "0 20px", borderRadius: 12, border: "1px solid rgba(0,247,255,0.44)", background: "rgba(0,247,255,0.04)", color: "#00f7ff", fontWeight: 800, textDecoration: "none" }}>
            🗺️ Get Directions
          </a>
        </div>

        <iframe
          className="glass"
          style={{ minHeight: 380, width: "100%", border: 0, borderRadius: 22, filter: "grayscale(.55) invert(.88) brightness(.72) hue-rotate(170deg)" }}
          title="Killer Zone location"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src="https://maps.google.com/maps?q=G-55%2C%20First%20Main%20Road%2C%20Anna%20Nagar%20East%2C%20Chennai&t=&z=15&ie=UTF8&iwloc=&output=embed"
        />
      </div>
      <style>{`
        @media (max-width: 760px) { #location .wrap { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
