"use client";
import Link from "next/link";
import { CATEGORIES } from "@/app/components/addonsData";

const TILES = [CATEGORIES.beverages, CATEGORIES.snacks];

export default function AddOns() {
  return (
    <section id="add-ons" style={{ padding: "80px 0", position: "relative", zIndex: 1, background: "radial-gradient(circle at 30% 50%, rgba(0,247,255,0.06) 0%, transparent 55%)" }}>
      <div className="wrap">
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 800, fontSize: "0.78rem", letterSpacing: "0.26em", textTransform: "uppercase", color: "#00f7ff", marginBottom: 8 }}>Enhance Your Session</div>
          <h2 style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 900, fontSize: "clamp(2rem,4vw,3.2rem)", lineHeight: 1.08 }}>
            Gaming <span className="grad">Add-ons</span>
          </h2>
          <p style={{ color: "rgba(248,251,255,0.65)", marginTop: 10, lineHeight: 1.65 }}>
            Pick a category to browse the full menu and add items to your cart.
          </p>
        </div>

        {/* Two category tiles */}
        <div className="addon-cats" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {TILES.map((cat) => (
            <Link
              key={cat.key}
              href={`/menu/${cat.key}`}
              className="glass addon-cat"
              style={{
                display: "block", borderRadius: 22, overflow: "hidden",
                textDecoration: "none", color: "inherit", position: "relative",
                transition: "transform .25s, box-shadow .25s, border-color .25s",
              }}
            >
              {/* Preview strip — first 3 product images */}
              <div style={{ display: "flex", height: 150, background: "linear-gradient(135deg,rgba(0,247,255,0.06),rgba(138,92,255,0.1))" }}>
                {cat.items.slice(0, 3).map((it) => (
                  <div key={it.id} style={{ flex: 1, display: "grid", placeItems: "center", borderRight: "1px solid rgba(255,255,255,0.05)" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.img} alt={it.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 14 }} />
                  </div>
                ))}
              </div>

              {/* Caption */}
              <div style={{ padding: "18px 20px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <h3 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "1.15rem", marginBottom: 4 }}>
                    {cat.icon} {cat.title}
                  </h3>
                  <p style={{ color: "rgba(248,251,255,0.55)", fontSize: "0.82rem", lineHeight: 1.5 }}>{cat.blurb}</p>
                </div>
                <span style={{
                  flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "8px 14px", borderRadius: 999, fontWeight: 800, fontSize: "0.8rem",
                  fontFamily: "Orbitron, sans-serif", color: "#021014",
                  background: "linear-gradient(135deg,#00f7ff,#8a5cff)",
                }}>
                  {cat.items.length} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .addon-cat:hover { transform: translateY(-6px); box-shadow: 0 24px 60px rgba(0,247,255,0.16); border-color: rgba(0,247,255,0.4) !important; }
        @media (max-width: 600px) {
          #add-ons .addon-cats { grid-template-columns: 1fr !important; gap: 12px !important; }
        }
        @media (hover: none) { .addon-cat:hover { transform: none; } }
      `}</style>
    </section>
  );
}
