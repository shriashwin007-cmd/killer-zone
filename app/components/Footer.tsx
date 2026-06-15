export default function Footer() {
  return (
    <footer style={{ position: "relative", zIndex: 1, padding: "48px 0 calc(48px + env(safe-area-inset-bottom,0px))", borderTop: "1px solid rgba(255,255,255,0.08)", color: "rgba(248,251,255,0.42)" }}>
      <div className="wrap" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <b style={{ color: "#f8fbff", fontFamily: "Orbitron, sans-serif", letterSpacing: "0.08em" }}>KILLER ZONE</b>
          <br />Press start. Enter the zone.
        </div>
        <div>© {new Date().getFullYear()} Killer Zone Luxury Gaming Lounge · Chennai</div>
      </div>
    </footer>
  );
}
