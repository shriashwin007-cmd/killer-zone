"use client";
import { useState, useRef, useCallback } from "react";
import { useCart } from "@/app/context/CartContext";
import { useToast } from "@/app/context/ToastContext";
import type { Item } from "@/app/components/addonsData";

/* ── Particle burst on image tap ── */
interface Particle { id: number; x: number; y: number; vx: number; vy: number; emoji: string; rotate: number }
const BURST_EMOJIS = ["✨", "⭐", "💥", "🎉", "🔥", "💫"];

function useBurst() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const counter = useRef(0);
  const burst = useCallback((e: React.MouseEvent, icon: string) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const count = 10;
    const newParticles: Particle[] = Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const speed = 55 + Math.random() * 60;
      return {
        id: counter.current++, x, y,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        emoji: i % 3 === 0 ? icon : BURST_EMOJIS[Math.floor(Math.random() * BURST_EMOJIS.length)],
        rotate: Math.random() * 360,
      };
    });
    setParticles((p) => [...p, ...newParticles]);
    setTimeout(() => {
      setParticles((p) => p.filter((pt) => !newParticles.find((np) => np.id === pt.id)));
    }, 700);
  }, []);
  return { particles, burst };
}

function HoverParticles({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 2 }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute", left: `${10 + i * 11}%`, bottom: 0,
          width: 5, height: 5, borderRadius: "50%",
          background: i % 2 === 0 ? "#00f7ff" : "#ff2d95",
          boxShadow: `0 0 8px ${i % 2 === 0 ? "#00f7ff" : "#ff2d95"}`,
          animation: `floatUp ${0.9 + i * 0.18}s ease-out ${i * 0.08}s infinite`, opacity: 0,
        }} />
      ))}
    </div>
  );
}

export default function AddOnCard({ item, large = false }: { item: Item; large?: boolean }) {
  const [qty, setQty] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [shaking, setShaking] = useState(false);
  const { addToCart } = useCart();
  const { show } = useToast();
  const { particles, burst } = useBurst();

  function handleImgClick(e: React.MouseEvent) {
    burst(e, item.icon);
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  }

  return (
    <article
      className="glass"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 18, overflow: "hidden", display: "flex", flexDirection: "column",
        transition: "transform .28s, border-color .28s, box-shadow .28s",
        transform: hovered ? "translateY(-7px)" : "",
        borderColor: hovered ? "rgba(0,247,255,0.4)" : "",
        boxShadow: hovered ? "0 24px 60px rgba(0,247,255,0.14)" : "",
        position: "relative",
      }}
    >
      <HoverParticles active={hovered} />

      {/* Image area */}
      <div
        className="addon-img"
        onClick={handleImgClick}
        style={{
          height: large ? 260 : 180, cursor: "pointer", position: "relative", overflow: "visible",
          background: "linear-gradient(135deg,rgba(0,247,255,0.06),rgba(138,92,255,0.1))",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}
      >
        {particles.map((p) => (
          <div key={p.id} style={{ position: "absolute", left: p.x, top: p.y, fontSize: "1.3rem", pointerEvents: "none", zIndex: 10 }}>
            <div style={{ animation: `burstFly 0.65s ease-out forwards`, ["--vx" as string]: `${p.vx}px`, ["--vy" as string]: `${p.vy}px` }}>{p.emoji}</div>
          </div>
        ))}

        {item.img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.img}
            alt={item.name}
            style={{
              width: "100%", height: "100%", objectFit: "contain", padding: large ? 18 : 12,
              animation: shaking ? "shake 0.45s ease" : "none",
              transition: "transform .3s ease",
              transform: hovered ? "scale(1.08)" : "scale(1)",
            }}
          />
        ) : (
          <span style={{ fontSize: large ? "5rem" : "3.5rem", animation: shaking ? "shake 0.45s ease" : "none" }}>{item.icon}</span>
        )}

        {hovered && (
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at center, rgba(0,247,255,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        )}
      </div>

      {/* Body */}
      <div style={{ padding: large ? "20px 20px 22px" : "16px 16px 18px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        <div>
          <h3 style={{ fontFamily: "Orbitron, sans-serif", fontSize: large ? "1.05rem" : "0.85rem", marginBottom: 4, lineHeight: 1.3 }}>{item.name}</h3>
          <div style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 800, color: "#00f7ff", fontSize: large ? "1.1rem" : "0.9rem" }}>{item.label}</div>
        </div>
        <p style={{ color: "rgba(248,251,255,0.6)", fontSize: large ? "0.9rem" : "0.8rem", lineHeight: 1.55, flex: 1 }}>{item.desc}</p>

        <div className="addon-controls" style={{ display: "flex", gap: 8, alignItems: "center", marginTop: "auto" }}>
          <div className="addon-stepper" style={{ display: "flex", alignItems: "center", gap: 6, border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "5px 8px", background: "rgba(255,255,255,0.04)" }}>
            <button className="addon-step" disabled={qty === 0} onClick={() => setQty((q) => Math.max(0, q - 1))}
              style={{ width: 30, height: 30, borderRadius: 7, border: "1px solid rgba(255,255,255,0.16)", background: "rgba(255,255,255,0.06)", color: "#f8fbff", fontWeight: 800, cursor: qty === 0 ? "not-allowed" : "pointer", opacity: qty === 0 ? 0.35 : 1, fontFamily: "inherit", fontSize: "0.95rem" }}>−</button>
            <span style={{ minWidth: 22, textAlign: "center", fontWeight: 700, color: "#00f7ff", fontSize: "0.95rem" }}>{qty}</span>
            <button className="addon-step" onClick={() => setQty((q) => q + 1)}
              style={{ width: 30, height: 30, borderRadius: 7, border: "1px solid rgba(255,255,255,0.16)", background: "rgba(255,255,255,0.06)", color: "#f8fbff", fontWeight: 800, cursor: "pointer", fontFamily: "inherit", fontSize: "0.95rem" }}>+</button>
          </div>
          <button className="addon-add" onClick={() => {
            if (qty === 0) { show("Select a quantity first"); return; }
            addToCart({ id: item.id, name: item.name, price: item.price, icon: item.icon }, qty);
            show(`${item.name} added! 🛒`);
            setQty(0);
          }} style={{
            flex: 1, minHeight: 44, borderRadius: 10, border: "none",
            color: "#021014", background: hovered ? "linear-gradient(135deg,#00f7ff,#ff2d95)" : "linear-gradient(135deg,#00f7ff,#8a5cff)",
            fontWeight: 800, cursor: "pointer", fontSize: "0.85rem", fontFamily: "inherit", transition: "background .3s",
          }}>Add to Cart</button>
        </div>
      </div>
    </article>
  );
}
