"use client";
import { useEffect, useRef } from "react";

const ROOMS = [
  {
    name: "Forza Horizon Room",
    desc: "Best for racing nights, reels, and high-energy groups who want the most cinematic first impression.",
    color: "#00f7ff",
    img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781542712/forza_horizon_6_mural_wouom2.png",
  },
  {
    name: "Spider-Verse Room",
    desc: "Photo-friendly lighting, bold wall art, and a fun pick for birthdays, couples, and casual players.",
    color: "#8a5cff",
    img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781542716/joker_ps5_controller_jxdrof.png",
  },
  {
    name: "Gotham × Minecraft Room",
    desc: "A darker squad setup with character, strong contrast, and room for longer late-night sessions.",
    color: "#ff2d95",
    img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781542718/red_dead_redemption_mural_dj8ar8.png",
  },
];

function RoomCard({ r }: { r: typeof ROOMS[0] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (!wrapRef.current || !imgRef.current) return;
      const rect = wrapRef.current.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * 0.12;
      imgRef.current.style.transform = `translateY(${offset}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <article
      className="glass"
      style={{ borderRadius: 18, overflow: "hidden", transition: "transform .25s, box-shadow .25s" }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(-6px)";
        el.style.boxShadow = `0 20px 60px ${r.color}33`;
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "";
        el.style.boxShadow = "";
      }}
    >
      {/* Parallax image */}
      <div ref={wrapRef} style={{ height: 220, overflow: "hidden", position: "relative" }}>
        <img
          ref={imgRef}
          src={r.img}
          alt={r.name}
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
          background: `linear-gradient(180deg, transparent 45%, rgba(2,7,20,0.65) 100%)`,
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(135deg, ${r.color}0a 0%, transparent 60%)`,
        }} />
      </div>

      {/* Text */}
      <div style={{ padding: "20px 20px 24px" }}>
        <h3 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "0.95rem", marginBottom: 10, color: r.color }}>{r.name}</h3>
        <p style={{ color: "rgba(248,251,255,0.65)", lineHeight: 1.65, fontSize: "0.88rem", marginBottom: 16 }}>{r.desc}</p>
        <a
          href="#book"
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "8px 16px", borderRadius: 10, textDecoration: "none",
            fontSize: "0.78rem", fontWeight: 700, fontFamily: "Orbitron, sans-serif",
            border: `1px solid ${r.color}44`, color: r.color, background: `${r.color}0d`,
          }}
        >
          Book This Room →
        </a>
      </div>
    </article>
  );
}

export default function Rooms() {
  return (
    <section id="rooms" style={{ padding: "80px 0", position: "relative", zIndex: 1 }}>
      <div className="wrap">
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 800, fontSize: "0.78rem", letterSpacing: "0.26em", textTransform: "uppercase", color: "#00f7ff", marginBottom: 8 }}>The Rooms</div>
          <h2 style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 900, fontSize: "clamp(2rem,4vw,3.2rem)", lineHeight: 1.08 }}>
            Pick Your <span className="grad">Battle Arena</span>
          </h2>
          <p style={{ color: "rgba(248,251,255,0.65)", marginTop: 10, lineHeight: 1.65 }}>
            Racing, superhero, dark cinematic, or playful pixel energy — pick your vibe.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {ROOMS.map((r) => <RoomCard key={r.name} r={r} />)}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) { #rooms .wrap > div:last-child { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
