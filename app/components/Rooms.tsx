"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const ROOMS = [
  {
    name: "Forza Horizon Wall",
    desc: "The racing-themed corner — high-energy murals and the most cinematic backdrop for reels and squad photos.",
    color: "#00f7ff",
    img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781542712/forza_horizon_6_mural_wouom2.png",
  },
  {
    name: "Spider-Verse Wall",
    desc: "Photo-friendly lighting and bold wall art — a fun spot for birthdays, couples, and casual players.",
    color: "#8a5cff",
    img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781542716/joker_ps5_controller_jxdrof.png",
  },
  {
    name: "Gotham × Minecraft Wall",
    desc: "The darker side of the room — strong contrast and character for longer late-night sessions.",
    color: "#ff2d95",
    img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781542718/red_dead_redemption_mural_dj8ar8.png",
  },
];

function RoomCard({ r }: { r: typeof ROOMS[0] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-30px", "30px"]);

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
      <div ref={ref} style={{ height: 220, overflow: "hidden", position: "relative" }}>
        <motion.img
          src={r.img}
          alt={r.name}
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
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent 45%, rgba(2,7,20,0.65) 100%)` }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${r.color}0a 0%, transparent 60%)` }} />
      </div>

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
          Book a Console →
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
          <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 800, fontSize: "0.78rem", letterSpacing: "0.26em", textTransform: "uppercase", color: "#00f7ff", marginBottom: 8 }}>The Space</div>
          <h2 style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 900, fontSize: "clamp(2rem,4vw,3.2rem)", lineHeight: 1.08 }}>
            One Room. <span className="grad">Four Consoles.</span>
          </h2>
          <p style={{ color: "rgba(248,251,255,0.65)", marginTop: 10, lineHeight: 1.65 }}>
            Four PS5 consoles in one neon-lit room, wrapped in themed murals — racing, superhero, and dark cinematic vibes all around you.
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
