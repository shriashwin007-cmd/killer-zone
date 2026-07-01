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

export default function AddOnCard({ item, large = false, outOfStock = false }: { item: Item; large?: boolean; outOfStock?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const [shaking, setShaking] = useState(false);
  const { cart, addToCart, removeItem } = useCart();
  const { show } = useToast();
  const { particles, burst } = useBurst();

  const cartItem = cart.find((c) => c.id === item.id);
  const inCart = !!cartItem;

  function handleImgClick(e: React.MouseEvent) {
    burst(e, item.icon);
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  }

  function handleAdd() {
    addToCart({ id: item.id, name: item.name, price: item.price, icon: item.icon }, 1);
    show(`${item.name} added! 🛒`);
  }

  function handleRemove() {
    removeItem(item.id);
    show(`${item.name} removed`);
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
        borderColor: inCart ? "rgba(0,247,255,0.5)" : hovered ? "rgba(0,247,255,0.4)" : "",
        boxShadow: inCart
          ? "0 0 0 1.5px rgba(0,247,255,0.35), 0 24px 60px rgba(0,247,255,0.14)"
          : hovered ? "0 24px 60px rgba(0,247,255,0.14)" : "",
        position: "relative",
      }}
    >
      <HoverParticles active={hovered} />

      {/* In-cart badge */}
      {inCart && (
        <div style={{
          position: "absolute", top: 10, right: 10, zIndex: 5,
          background: "#00f7ff", color: "#021014",
          fontFamily: "Orbitron, sans-serif", fontWeight: 900, fontSize: "0.68rem",
          borderRadius: 999, padding: "3px 9px", letterSpacing: "0.04em",
        }}>
          ×{cartItem!.quantity} in cart
        </div>
      )}

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
          {outOfStock ? (
            <div style={{
              flex: 1, minHeight: 44, borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.04)", color: "rgba(248,251,255,0.3)",
              fontWeight: 800, fontSize: "0.85rem", fontFamily: "inherit",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              Out of Stock
            </div>
          ) : inCart ? (
            <button
              onClick={handleRemove}
              title="Remove from cart"
              style={{
                flex: 1, minHeight: 44, borderRadius: 10, border: "1px solid rgba(255,45,149,0.35)",
                background: "rgba(255,45,149,0.1)", color: "#ff2d95",
                fontWeight: 800, cursor: "pointer", fontSize: "1.1rem", fontFamily: "inherit",
                transition: "background .2s, border-color .2s",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
              Remove
            </button>
          ) : (
            <button
              onClick={handleAdd}
              style={{
                flex: 1, minHeight: 44, borderRadius: 10, border: "none",
                color: "#021014", background: hovered ? "linear-gradient(135deg,#00f7ff,#ff2d95)" : "linear-gradient(135deg,#00f7ff,#8a5cff)",
                fontWeight: 800, cursor: "pointer", fontSize: "0.88rem", fontFamily: "inherit",
                transition: "background .3s",
              }}
            >
              + Add
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
