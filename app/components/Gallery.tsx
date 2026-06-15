"use client";
import { useEffect, useRef } from "react";

type Tile = {
  label: string;
  span: boolean;
  factor: number;
  img?: string;
  icon?: string;
};

const TILES: Tile[] = [
  {
    label: "Gaming Lounge",
    img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781542714/gaming_lounge_setup_2_swhsrh.png",
    span: true,
    factor: 0.15,
  },
  {
    label: "PS5 Controllers",
    img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781542711/fortnite_and_joker_ps5_controllers_xc7gxl.png",
    span: false,
    factor: 0.12,
  },
  { label: "Battle Stations", icon: "🖥️", span: false, factor: 0.1 },
  { label: "Neon Details",    icon: "💡", span: false, factor: 0.13 },
  { label: "Premium Display", icon: "📺", span: false, factor: 0.11 },
];

function ParallaxTile({ t }: { t: Tile }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!t.img) return;
    const onScroll = () => {
      if (!wrapRef.current || !imgRef.current) return;
      const rect = wrapRef.current.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * t.factor;
      imgRef.current.style.transform = `translateY(${offset}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [t.img, t.factor]);

  if (t.img) {
    return (
      <div
        ref={wrapRef}
        style={{
          borderRadius: 16,
          gridRow: t.span ? "span 2" : undefined,
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <img
          ref={imgRef}
          src={t.img}
          alt={t.label}
          style={{
            position: "absolute",
            top: "-20%",
            left: 0,
            width: "100%",
            height: "140%",
            objectFit: "cover",
            willChange: "transform",
            transition: "transform 0.08s linear",
          }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, transparent 55%, rgba(2,7,20,0.78) 100%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", left: 10, right: 10, bottom: 10,
          padding: "8px 12px", borderRadius: 10,
          background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
          fontFamily: "Orbitron, sans-serif", fontSize: "0.72rem", letterSpacing: "0.08em",
          fontWeight: 800, textTransform: "uppercase", color: "#f8fbff",
        }}>{t.label}</div>
      </div>
    );
  }

  return (
    <div
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
      <div style={{
        position: "absolute", left: 10, right: 10, bottom: 10,
        padding: "8px 12px", borderRadius: 10,
        background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
        fontFamily: "Orbitron, sans-serif", fontSize: "0.72rem", letterSpacing: "0.08em",
        fontWeight: 800, textTransform: "uppercase", color: "#f8fbff",
      }}>{t.label}</div>
    </div>
  );
}

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
            Inside Killer Zone — the murals, the setups, and the vibes.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gridAutoRows: "200px", gap: 12 }}>
          {TILES.map((t) => <ParallaxTile key={t.label} t={t} />)}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          #gallery .wrap > div:last-child { grid-template-columns: repeat(2,1fr) !important; }
          #gallery .wrap > div:last-child > div:first-child { grid-column: span 2; grid-row: span 1 !important; }
        }
        @media (max-width: 520px) {
          #gallery .wrap > div:last-child { grid-template-columns: 1fr !important; }
          #gallery .wrap > div:last-child > div:first-child { grid-column: auto; }
        }
      `}</style>
    </section>
  );
}
