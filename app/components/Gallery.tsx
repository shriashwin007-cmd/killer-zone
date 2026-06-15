"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const IMAGES = [
  {
    src: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781542714/gaming_lounge_setup_2_swhsrh.png",
    label: "The Lounge",
    span: true,
  },
  {
    src: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781542711/fortnite_and_joker_ps5_controllers_xc7gxl.png",
    label: "Premium Controllers",
    span: false,
  },
  {
    src: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781542712/forza_horizon_6_mural_wouom2.png",
    label: "Forza Mural",
    span: false,
  },
  {
    src: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781542716/joker_ps5_controller_jxdrof.png",
    label: "Joker × PS5",
    span: false,
  },
  {
    src: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781542718/red_dead_redemption_mural_dj8ar8.png",
    label: "Red Dead Mural",
    span: false,
  },
];

function GalleryTile({ tile }: { tile: typeof IMAGES[0] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-30px", "30px"]);

  return (
    <div
      ref={ref}
      style={{
        borderRadius: 16,
        gridRow: tile.span ? "span 2" : undefined,
        position: "relative",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <motion.img
        src={tile.src}
        alt={tile.label}
        style={{
          y,
          position: "absolute",
          top: -40,
          left: 0,
          width: "100%",
          height: "calc(100% + 80px)",
          objectFit: "cover",
          willChange: "transform",
        }}
      />
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, transparent 55%, rgba(2,7,20,0.8) 100%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", left: 10, right: 10, bottom: 10,
        padding: "8px 12px", borderRadius: 10,
        background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
        fontFamily: "Orbitron, sans-serif", fontSize: "0.72rem", letterSpacing: "0.08em",
        fontWeight: 800, textTransform: "uppercase", color: "#f8fbff",
      }}>{tile.label}</div>
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
          {IMAGES.map((img) => <GalleryTile key={img.label} tile={img} />)}
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
