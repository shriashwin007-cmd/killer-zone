"use client";
import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { useToast } from "@/app/context/ToastContext";

type Item = { id: string; name: string; price: number; icon: string; label: string; desc: string; img?: string };

const BEVERAGES: Item[] = [
  { id: "bev1",  name: "Tropicana Pomegranate", price: 60, icon: "🍹", label: "₹60", desc: "Tropicana Pomegranate Delight juice.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781540842/tropicana_pomegranate_delight_pkxqxj.jpg" },
  { id: "bev2",  name: "Tropicana Orange",      price: 60, icon: "🍊", label: "₹60", desc: "Tropicana Orange Delight juice.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781540841/tropicana_orange_delight_vlgv9k.jpg" },
  { id: "bev3",  name: "Tropicana Litchi",      price: 60, icon: "🍈", label: "₹60", desc: "Tropicana Litchi Delight juice.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781540840/tropicana_litchi_delight_cxkldh.jpg" },
  { id: "bev4",  name: "Thums Up",              price: 50, icon: "🥤", label: "₹50", desc: "Classic strong cola — Thums Up.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781540839/thums_up_cbez4j.jpg" },
  { id: "bev5",  name: "Sprite",                price: 50, icon: "🥤", label: "₹50", desc: "Refreshing lemon-lime Sprite.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781540838/sprite_fbku0t.jpg" },
  { id: "bev6",  name: "Slice Mango",           price: 55, icon: "🥭", label: "₹55", desc: "Slice Pure Mango Pleasure drink.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781540838/slice_pure_mango_pleasure_m98k3d.jpg" },
  { id: "bev7",  name: "Pepsi",                 price: 50, icon: "🥤", label: "₹50", desc: "Ice cold Pepsi cola.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781540837/pepsi_du4hgd.jpg" },
  { id: "bev8",  name: "Mountain Dew",          price: 50, icon: "🍋", label: "₹50", desc: "Mountain Dew — citrus rush.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781540836/mountain_dew_myfodi.jpg" },
  { id: "bev9",  name: "Monster Energy",        price: 120, icon: "⚡", label: "₹120", desc: "Monster Energy — boost your gameplay.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781540835/monster_energy_inhptz.jpg" },
  { id: "bev10", name: "Mirinda Red",           price: 50, icon: "🥤", label: "₹50", desc: "Mirinda fruity fizzy drink.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781540834/mirinda_2_jhvrte.jpg" },
  { id: "bev11", name: "Mirinda Orange",        price: 50, icon: "🍊", label: "₹50", desc: "Mirinda Orange fizzy drink.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781540833/mirinda_1_wb3wsn.jpg" },
  { id: "bev12", name: "Maaza Mango",           price: 55, icon: "🥭", label: "₹55", desc: "Maaza — the real mango drink.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781540833/maaza_qlb0cy.jpg" },
  { id: "bev13", name: "Minute Maid Orange",    price: 55, icon: "🍊", label: "₹55", desc: "Minute Maid Pulpy Orange juice.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781540832/minute_maid_pulpy_orange_yjgtxq.jpg" },
  { id: "bev14", name: "Coca-Cola",             price: 50, icon: "🥤", label: "₹50", desc: "The original Coca-Cola.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781540831/coca_cola_gd5nsn.jpg" },
  { id: "bev15", name: "Limca",                 price: 50, icon: "🍋", label: "₹50", desc: "Limca — lemony refreshing fizz.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781540832/limca_jps5rr.jpg" },
  { id: "bev16", name: "7UP",                   price: 50, icon: "🍋", label: "₹50", desc: "7UP — clear lemon-lime soda.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781540831/7up_swqxbt.jpg" },
];

const SNACKS: Item[] = [
  { id: "snack1", name: "Chips & Soda Combo",  price: 80,  icon: "🍿", label: "₹80",          desc: "Crunchy chips with a cold drink. Perfect for long sessions." },
  { id: "snack2", name: "Pizza Slice",          price: 120, icon: "🍕", label: "₹120",         desc: "Hot pizza slice — cheese, veggie, or pepperoni." },
  { id: "snack3", name: "Gamer Meal Box",       price: 250, icon: "🍔", label: "₹250",         desc: "Burger, fries, drink. Fuel for marathon sessions." },
];

const GEAR: Item[] = [
  { id: "gear1", name: "Extra Controller", price: 150, icon: "🎮", label: "₹150/session", desc: "Rent a premium DualSense for your squad." },
  { id: "gear2", name: "VR Headset",       price: 300, icon: "🥽", label: "₹300/session", desc: "PSVR2 for compatible games. Fully immersive." },
];

type Tab = "beverages" | "snacks" | "gear";

function Card({ item }: { item: Item }) {
  const [qty, setQty] = useState(0);
  const { addToCart } = useCart();
  const { show } = useToast();

  return (
    <article
      className="glass"
      style={{ borderRadius: 18, overflow: "hidden", display: "flex", flexDirection: "column", transition: "transform .25s, border-color .25s" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-5px)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,247,255,0.35)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.borderColor = ""; }}
    >
      {/* Image or placeholder */}
      <div style={{ height: 180, background: "linear-gradient(135deg,rgba(0,247,255,0.08),rgba(138,92,255,0.12))", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
        {item.img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.img} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: "12px" }} />
        ) : (
          <span style={{ fontSize: "3.5rem" }}>{item.icon}</span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "16px 16px 18px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        <div>
          <h3 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "0.88rem", marginBottom: 4, lineHeight: 1.3 }}>{item.name}</h3>
          <div style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 800, color: "#00f7ff", fontSize: "0.9rem" }}>{item.label}</div>
        </div>
        <p style={{ color: "rgba(248,251,255,0.6)", fontSize: "0.82rem", lineHeight: 1.55, flex: 1 }}>{item.desc}</p>

        {/* Controls */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "5px 8px", background: "rgba(255,255,255,0.04)" }}>
            <button disabled={qty === 0} onClick={() => setQty(q => Math.max(0, q - 1))}
              style={{ width: 26, height: 26, borderRadius: 7, border: "1px solid rgba(255,255,255,0.16)", background: "rgba(255,255,255,0.06)", color: "#f8fbff", fontWeight: 800, cursor: "pointer", opacity: qty === 0 ? 0.35 : 1, fontFamily: "inherit", fontSize: "0.9rem" }}>−</button>
            <span style={{ minWidth: 22, textAlign: "center", fontWeight: 700, color: "#00f7ff", fontSize: "0.9rem" }}>{qty}</span>
            <button onClick={() => setQty(q => q + 1)}
              style={{ width: 26, height: 26, borderRadius: 7, border: "1px solid rgba(255,255,255,0.16)", background: "rgba(255,255,255,0.06)", color: "#f8fbff", fontWeight: 800, cursor: "pointer", fontFamily: "inherit", fontSize: "0.9rem" }}>+</button>
          </div>
          <button onClick={() => {
            if (qty === 0) { show("Select a quantity first"); return; }
            addToCart({ id: item.id, name: item.name, price: item.price, icon: item.icon }, qty);
            show(`${item.name} added to cart!`);
            setQty(0);
          }} style={{ flex: 1, minHeight: 38, borderRadius: 10, border: "none", color: "#021014", background: "linear-gradient(135deg,#00f7ff,#8a5cff)", fontWeight: 800, cursor: "pointer", fontSize: "0.8rem", fontFamily: "inherit" }}>
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}

const TAB_ITEMS: Record<Tab, Item[]> = { beverages: BEVERAGES, snacks: SNACKS, gear: GEAR };
const TAB_LABELS: { key: Tab; label: string; icon: string }[] = [
  { key: "beverages", label: "Beverages", icon: "🥤" },
  { key: "snacks",    label: "Snacks",    icon: "🍿" },
  { key: "gear",      label: "Gaming Gear", icon: "🎮" },
];

export default function AddOns() {
  const [tab, setTab] = useState<Tab>("beverages");

  return (
    <section id="add-ons" style={{ padding: "80px 0", position: "relative", zIndex: 1, background: "radial-gradient(circle at 30% 50%, rgba(0,247,255,0.06) 0%, transparent 55%)" }}>
      <div className="wrap">
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 800, fontSize: "0.78rem", letterSpacing: "0.26em", textTransform: "uppercase", color: "#00f7ff", marginBottom: 8 }}>Enhance Your Session</div>
          <h2 style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 900, fontSize: "clamp(2rem,4vw,3.2rem)", lineHeight: 1.08 }}>
            Gaming <span className="grad">Add-ons</span>
          </h2>
          <p style={{ color: "rgba(248,251,255,0.65)", marginTop: 10, lineHeight: 1.65 }}>
            Order beverages, snacks, and gaming gear — included in your booking message.
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
          {TAB_LABELS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              minHeight: 42, padding: "0 20px", borderRadius: 999,
              border: tab === t.key ? "1px solid rgba(0,247,255,0.6)" : "1px solid rgba(255,255,255,0.12)",
              background: tab === t.key ? "rgba(0,247,255,0.12)" : "rgba(255,255,255,0.04)",
              color: tab === t.key ? "#00f7ff" : "rgba(248,251,255,0.55)",
              fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", fontFamily: "inherit",
              transition: "all .2s",
            }}>
              {t.icon} {t.label}
              {tab === t.key && (
                <span style={{ marginLeft: 4, background: "#00f7ff", color: "#021014", borderRadius: 999, fontSize: "0.7rem", fontWeight: 800, padding: "2px 7px" }}>
                  {TAB_ITEMS[t.key].length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {TAB_ITEMS[tab].map((item) => <Card key={item.id} item={item} />)}
        </div>
      </div>

      <style>{`
        @media (max-width: 1000px) { #add-ons .wrap > div:last-child { grid-template-columns: repeat(3,1fr) !important; } }
        @media (max-width: 720px)  { #add-ons .wrap > div:last-child { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 480px)  { #add-ons .wrap > div:last-child { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
