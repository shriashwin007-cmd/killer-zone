"use client";
import { useState } from "react";
import { useCart } from "@/app/context/CartContext";

const NAV_LINKS = [
  { href: "#rooms", label: "Rooms" },
  { href: "#add-ons", label: "Add-ons" },
  { href: "#gallery", label: "Gallery" },
  { href: "#pricing", label: "Pricing" },
  { href: "#location", label: "Location" },
];

export default function Navbar({ onChatOpen }: { onChatOpen: () => void }) {
  const [open, setOpen] = useState(false);
  const { totalItems, openCart } = useCart();

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      background: "rgba(5,7,12,0.75)",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
    }}>
      <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 70, gap: 16 }}>

        {/* Brand */}
        <a href="#home" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <img
            src="https://res.cloudinary.com/dxvui0xkz/image/upload/v1781594936/killer_zone_logo_q1woon.jpg"
            alt="Killer Zone"
            style={{
              height: 48, width: "auto",
              borderRadius: 10,
              mixBlendMode: "screen",
              filter: "drop-shadow(0 0 10px rgba(0,247,255,0.35))",
              objectFit: "contain",
            }}
          />
          <div>
            <div style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 900, fontSize: "1rem", letterSpacing: "0.1em", color: "#f8fbff" }}>
              KILLER ZONE
            </div>
            <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "0.6rem", letterSpacing: "0.28em", color: "#00f7ff", textTransform: "uppercase" }}>
              Chennai Gaming Lounge
            </div>
          </div>
        </a>

        {/* Desktop nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: 24 }} className="desktop-nav">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} style={{ color: "rgba(248,251,255,0.65)", textDecoration: "none", fontWeight: 700, fontSize: "0.88rem", transition: "color .2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#00f7ff")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(248,251,255,0.65)")}
            >{l.label}</a>
          ))}
          <a href="#book" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            minHeight: 42, padding: "0 20px", borderRadius: 12, border: "none",
            fontWeight: 800, fontSize: "0.88rem", textDecoration: "none",
            color: "#021014", background: "linear-gradient(135deg, #00f7ff, #8a5cff)",
            boxShadow: "0 12px 32px rgba(0,247,255,0.22)", cursor: "pointer",
          }}>Book Now</a>
        </nav>

        {/* Right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Cart */}
          <button onClick={openCart} aria-label="Cart" style={{
            position: "relative", width: 44, height: 44, borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)",
            color: "#f8fbff", fontSize: "1.2rem", cursor: "pointer", display: "grid", placeItems: "center",
          }}>
            🛒
            {totalItems > 0 && (
              <span style={{
                position: "absolute", top: -4, right: -4,
                minWidth: 20, height: 20, borderRadius: 999,
                background: "#ff2d95", color: "#fff",
                fontSize: "0.68rem", fontWeight: 800, display: "grid", placeItems: "center", padding: "0 4px",
              }}>{totalItems}</span>
            )}
          </button>

          {/* Hamburger */}
          <button
            className="hamburger"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            style={{
              width: 44, height: 44, borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)",
              color: "#f8fbff", fontSize: "1.2rem", cursor: "pointer", display: "none", placeItems: "center",
            }}
          >{open ? "✕" : "☰"}</button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ padding: "0 16px 16px", display: "grid", gap: 8 }}>
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} style={{
              display: "flex", alignItems: "center", minHeight: 46, padding: "0 16px",
              borderRadius: 12, background: "rgba(255,255,255,0.055)",
              color: "rgba(248,251,255,0.65)", fontWeight: 700, textDecoration: "none",
            }}>{l.label}</a>
          ))}
          <a href="#book" onClick={() => setOpen(false)} style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            minHeight: 46, borderRadius: 12, fontWeight: 800,
            color: "#021014", background: "linear-gradient(135deg, #00f7ff, #8a5cff)",
            textDecoration: "none",
          }}>Book Now</a>
          <button onClick={() => { setOpen(false); onChatOpen(); }} style={{
            display: "flex", alignItems: "center", minHeight: 46, padding: "0 16px",
            borderRadius: 12, background: "rgba(0,247,255,0.08)",
            border: "1px solid rgba(0,247,255,0.28)", color: "#00f7ff",
            fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
          }}>🤖 AI Chat</button>
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: grid !important; }
        }
        @media (max-width: 600px) {
          header .wrap { min-height: 60px !important; }
          /* Smaller logo on phones */
          header .wrap > a:first-child img { height: 38px !important; }
          /* Tighten brand title */
          header .wrap > a:first-child > div > div:first-child { font-size: 0.92rem !important; }
        }
        @media (max-width: 380px) {
          /* Hide the small subtitle on very narrow phones to avoid wrapping */
          header .wrap > a:first-child > div > div:last-child { display: none !important; }
        }
      `}</style>
    </header>
  );
}
