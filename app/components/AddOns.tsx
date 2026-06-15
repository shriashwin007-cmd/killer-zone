"use client";
import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { useToast } from "@/app/context/ToastContext";

const ITEMS = [
  { id: "snack1", name: "Chips & Soda Combo",  price: 80,  icon: "🍿", label: "₹80",          desc: "Crunchy chips with your choice of cold drink. Perfect for long sessions." },
  { id: "snack2", name: "Pizza Slice",          price: 120, icon: "🍕", label: "₹120",         desc: "Hot and fresh pizza slice. Cheese, veggie, or pepperoni available." },
  { id: "drink1", name: "Energy Drink",         price: 60,  icon: "⚡", label: "₹60",          desc: "Boost your reflexes. Red Bull, Monster, or similar energy drinks." },
  { id: "gear1",  name: "Extra Controller",     price: 150, icon: "🎮", label: "₹150/session", desc: "Rent a premium DualSense for your squad session." },
  { id: "gear2",  name: "VR Headset",           price: 300, icon: "🥽", label: "₹300/session", desc: "PSVR2 available for compatible games. Fully immersive." },
  { id: "snack3", name: "Gamer Meal Box",       price: 250, icon: "🍔", label: "₹250",         desc: "Burger, fries, and drink. Fuel for marathon sessions." },
];

function Card({ item }: { item: typeof ITEMS[number] }) {
  const [qty, setQty] = useState(0);
  const { addToCart } = useCart();
  const { show } = useToast();

  return (
    <article className="glass" style={{ borderRadius: 18, padding: "20px 18px", display: "flex", flexDirection: "column", gap: 14, transition: "transform .25s, border-color .25s" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-5px)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,247,255,0.3)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.borderColor = ""; }}
    >
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <span style={{ fontSize: "2.4rem" }}>{item.icon}</span>
        <div>
          <h3 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "0.95rem", marginBottom: 4 }}>{item.name}</h3>
          <div style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 800, color: "#00f7ff", fontSize: "0.9rem" }}>{item.label}</div>
        </div>
      </div>
      <p style={{ color: "rgba(248,251,255,0.65)", fontSize: "0.88rem", lineHeight: 1.6, flex: 1 }}>{item.desc}</p>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        {/* Qty control */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "6px 10px", background: "rgba(255,255,255,0.04)" }}>
          <button disabled={qty === 0} onClick={() => setQty(q => Math.max(0, q - 1))}
            style={{ width: 28, height: 28, borderRadius: 8, border: "1px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.06)", color: "#f8fbff", fontWeight: 800, cursor: "pointer", opacity: qty === 0 ? 0.35 : 1, fontFamily: "inherit" }}>−</button>
          <span style={{ minWidth: 24, textAlign: "center", fontWeight: 700, color: "#00f7ff" }}>{qty}</span>
          <button onClick={() => setQty(q => q + 1)}
            style={{ width: 28, height: 28, borderRadius: 8, border: "1px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.06)", color: "#f8fbff", fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>+</button>
        </div>
        {/* Add to cart */}
        <button onClick={() => {
          if (qty === 0) { show("Select a quantity first"); return; }
          addToCart({ id: item.id, name: item.name, price: item.price, icon: item.icon }, qty);
          show(`${item.name} added to cart!`);
          setQty(0);
        }} style={{ flex: 1, minHeight: 40, borderRadius: 10, border: "none", color: "#021014", background: "linear-gradient(135deg,#00f7ff,#8a5cff)", fontWeight: 800, cursor: "pointer", fontSize: "0.84rem", fontFamily: "inherit" }}>
          Add to Cart
        </button>
      </div>
    </article>
  );
}

export default function AddOns() {
  return (
    <section id="add-ons" style={{ padding: "80px 0", position: "relative", zIndex: 1, background: "radial-gradient(circle at 30% 50%, rgba(0,247,255,0.06) 0%, transparent 55%)" }}>
      <div className="wrap">
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 800, fontSize: "0.78rem", letterSpacing: "0.26em", textTransform: "uppercase", color: "#00f7ff", marginBottom: 8 }}>Enhance Your Session</div>
          <h2 style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 900, fontSize: "clamp(2rem,4vw,3.2rem)", lineHeight: 1.08 }}>
            Gaming <span className="grad">Add-ons</span>
          </h2>
          <p style={{ color: "rgba(248,251,255,0.65)", marginTop: 10, lineHeight: 1.65 }}>
            Level up with snacks, drinks, and premium gaming gear — added to your booking automatically.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {ITEMS.map((item) => <Card key={item.id} item={item} />)}
        </div>
      </div>
      <style>{`
        @media (max-width: 860px) { #add-ons .wrap > div:last-child { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 560px) { #add-ons .wrap > div:last-child { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
