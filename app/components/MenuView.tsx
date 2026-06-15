"use client";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import CartPanel from "@/app/components/CartPanel";
import AddOnCard from "@/app/components/AddOnCard";
import { CATEGORIES, type CategoryKey } from "@/app/components/addonsData";

export default function MenuView({ category }: { category: CategoryKey }) {
  const cat = CATEGORIES[category];
  const { totalItems, openCart } = useCart();
  const other: CategoryKey = category === "beverages" ? "snacks" : "beverages";

  return (
    <main style={{ minHeight: "100svh", position: "relative", zIndex: 1 }}>
      {/* Top bar */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(5,7,12,0.8)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}>
        <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 64, gap: 12 }}>
          <Link href="/#add-ons" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", color: "rgba(248,251,255,0.75)", fontWeight: 700, fontSize: "0.9rem" }}>
            ← Back
          </Link>
          <div style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 900, fontSize: "0.95rem", letterSpacing: "0.06em" }}>
            {cat.icon} {cat.title}
          </div>
          <button onClick={openCart} aria-label="Cart" style={{
            position: "relative", width: 44, height: 44, borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)",
            color: "#f8fbff", fontSize: "1.2rem", cursor: "pointer", display: "grid", placeItems: "center",
          }}>
            🛒
            {totalItems > 0 && (
              <span style={{ position: "absolute", top: -4, right: -4, minWidth: 20, height: 20, borderRadius: 999, background: "#ff2d95", color: "#fff", fontSize: "0.68rem", fontWeight: 800, display: "grid", placeItems: "center", padding: "0 4px" }}>{totalItems}</span>
            )}
          </button>
        </div>
      </header>

      {/* Content */}
      <section style={{ padding: "40px 0 80px" }}>
        <div className="wrap">
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 900, fontSize: "clamp(2rem,5vw,3rem)", lineHeight: 1.05 }}>
              {cat.icon} <span className="grad">{cat.title}</span>
            </h1>
            <p style={{ color: "rgba(248,251,255,0.6)", marginTop: 8, lineHeight: 1.6 }}>{cat.blurb}</p>
          </div>

          <div className="menu-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {cat.items.map((item) => <AddOnCard key={item.id} item={item} large />)}
          </div>

          {/* Switch category */}
          <div style={{ marginTop: 32, textAlign: "center" }}>
            <Link href={`/menu/${other}`} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "12px 22px", borderRadius: 14, textDecoration: "none",
              border: "1px solid rgba(0,247,255,0.4)", background: "rgba(0,247,255,0.05)",
              color: "#00f7ff", fontWeight: 800, fontFamily: "Orbitron, sans-serif", fontSize: "0.85rem",
            }}>
              {CATEGORIES[other].icon} Browse {CATEGORIES[other].title} →
            </Link>
          </div>
        </div>
      </section>

      <CartPanel />

      <style>{`
        @media (max-width: 900px) { .menu-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 560px) { .menu-grid { grid-template-columns: repeat(2,1fr) !important; gap: 10px !important; } }
        @media (max-width: 360px) { .menu-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </main>
  );
}
