"use client";
import { useState, useRef, useCallback } from "react";
import { useCart } from "@/app/context/CartContext";
import { useToast } from "@/app/context/ToastContext";

type Item = { id: string; name: string; price: number; icon: string; label: string; desc: string; img?: string };

const BEVERAGES: Item[] = [
  { id: "bev1",  name: "Tropicana Pomegranate", price: 60,  icon: "🍹", label: "₹60",  desc: "Tropicana Pomegranate Delight juice.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781540842/tropicana_pomegranate_delight_pkxqxj.jpg" },
  { id: "bev2",  name: "Tropicana Orange",      price: 60,  icon: "🍊", label: "₹60",  desc: "Tropicana Orange Delight juice.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781540841/tropicana_orange_delight_vlgv9k.jpg" },
  { id: "bev3",  name: "Tropicana Litchi",      price: 60,  icon: "🍈", label: "₹60",  desc: "Tropicana Litchi Delight juice.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781540840/tropicana_litchi_delight_cxkldh.jpg" },
  { id: "bev4",  name: "Thums Up",              price: 50,  icon: "🥤", label: "₹50",  desc: "Classic strong cola — Thums Up.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781540839/thums_up_cbez4j.jpg" },
  { id: "bev5",  name: "Sprite",                price: 50,  icon: "🥤", label: "₹50",  desc: "Refreshing lemon-lime Sprite.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781540838/sprite_fbku0t.jpg" },
  { id: "bev6",  name: "Slice Mango",           price: 55,  icon: "🥭", label: "₹55",  desc: "Slice Pure Mango Pleasure drink.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781540838/slice_pure_mango_pleasure_m98k3d.jpg" },
  { id: "bev7",  name: "Pepsi",                 price: 50,  icon: "🥤", label: "₹50",  desc: "Ice cold Pepsi cola.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781540837/pepsi_du4hgd.jpg" },
  { id: "bev8",  name: "Mountain Dew",          price: 50,  icon: "🍋", label: "₹50",  desc: "Mountain Dew — citrus rush.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781540836/mountain_dew_myfodi.jpg" },
  { id: "bev9",  name: "Monster Energy",        price: 120, icon: "⚡", label: "₹120", desc: "Monster Energy — boost your gameplay.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781540835/monster_energy_inhptz.jpg" },
  { id: "bev10", name: "Mirinda Red",           price: 50,  icon: "🥤", label: "₹50",  desc: "Mirinda fruity fizzy drink.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781540834/mirinda_2_jhvrte.jpg" },
  { id: "bev11", name: "Mirinda Orange",        price: 50,  icon: "🍊", label: "₹50",  desc: "Mirinda Orange fizzy drink.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781540833/mirinda_1_wb3wsn.jpg" },
  { id: "bev12", name: "Maaza Mango",           price: 55,  icon: "🥭", label: "₹55",  desc: "Maaza — the real mango drink.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781540833/maaza_qlb0cy.jpg" },
  { id: "bev13", name: "Minute Maid Orange",    price: 55,  icon: "🍊", label: "₹55",  desc: "Minute Maid Pulpy Orange juice.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781540832/minute_maid_pulpy_orange_yjgtxq.jpg" },
  { id: "bev14", name: "Coca-Cola",             price: 50,  icon: "🥤", label: "₹50",  desc: "The original Coca-Cola.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781540831/coca_cola_gd5nsn.jpg" },
  { id: "bev15", name: "Limca",                 price: 50,  icon: "🍋", label: "₹50",  desc: "Limca — lemony refreshing fizz.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781540832/limca_jps5rr.jpg" },
  { id: "bev16", name: "7UP",                   price: 50,  icon: "🍋", label: "₹50",  desc: "7UP — clear lemon-lime soda.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781540831/7up_swqxbt.jpg" },
];

const SNACKS: Item[] = [
  { id: "sn1",  name: "Lays Hot & Sweet Chilli", price: 30, icon: "🌶️", label: "₹30", desc: "Lays Hot & Sweet Chilli flavour crisps.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781541666/lays_hot_and_sweet_chilli_la7c19.jpg" },
  { id: "sn2",  name: "Lays Cream & Onion",      price: 30, icon: "🧅", label: "₹30", desc: "Lays Cream & Onion — a classic favourite.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781541664/lays_cream_and_onion_i26ekr.jpg" },
  { id: "sn3",  name: "Lays Chile Limon",        price: 30, icon: "🍋", label: "₹30", desc: "Lays Chile Limon — tangy and spicy.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781541662/lays_chile_limon_zga8yi.jpg" },
  { id: "sn4",  name: "Kurkure Puffcorn",        price: 30, icon: "🍿", label: "₹30", desc: "Kurkure Playz Puffcorn — light and crunchy.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781541661/kurkure_playz_puffcorn_plkiex.jpg" },
  { id: "sn5",  name: "Kurkure Masala Munch",    price: 30, icon: "🌶️", label: "₹30", desc: "Kurkure Masala Munch — bold Indian spices.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781541659/kurkure_masala_munch_bjtdae.jpg" },
  { id: "sn6",  name: "Doritos Sweet Chilli",    price: 50, icon: "🌶️", label: "₹50", desc: "Doritos Sweet Chilli — bold triangle chips.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781541652/doritos_sweet_chilli_wrlnmq.jpg" },
  { id: "sn7",  name: "Doritos Nacho Cheese",    price: 50, icon: "🧀", label: "₹50", desc: "Doritos Nacho Cheese — cheesy crunch.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781541651/doritos_nacho_cheese_on1jh6.jpg" },
  { id: "sn8",  name: "Bingo Chilli Style",      price: 30, icon: "🔥", label: "₹30", desc: "Bingo Original Style Chilli crisps.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781541650/bingo_original_style_chilli_knjeff.jpg" },
  { id: "sn9",  name: "Doritos Cool Ranch",      price: 50, icon: "🤠", label: "₹50", desc: "Doritos Cool Ranch — cool & creamy.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781541650/doritos_cool_ranch_ojwo5v.jpg" },
  { id: "sn10", name: "Bingo Cream & Onion",     price: 30, icon: "🧅", label: "₹30", desc: "Bingo Cream & Onion — smooth and crispy.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781541649/bingo_cream_and_onion_ox0rrx.jpg" },
];

/* ── Particle burst on image click ── */
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
        id: counter.current++,
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
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

/* ── Hover floating particles ── */
function HoverParticles({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 2 }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${10 + i * 11}%`,
          bottom: 0,
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: i % 2 === 0 ? "#00f7ff" : "#ff2d95",
          boxShadow: `0 0 8px ${i % 2 === 0 ? "#00f7ff" : "#ff2d95"}`,
          animation: `floatUp ${0.9 + i * 0.18}s ease-out ${i * 0.08}s infinite`,
          opacity: 0,
        }} />
      ))}
    </div>
  );
}

/* ── Card ── */
function Card({ item }: { item: Item }) {
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
          height: 180, cursor: "pointer", position: "relative", overflow: "visible",
          background: "linear-gradient(135deg,rgba(0,247,255,0.06),rgba(138,92,255,0.1))",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}
      >
        {/* Burst particles */}
        {particles.map((p) => (
          <div key={p.id} style={{
            position: "absolute",
            left: p.x, top: p.y,
            fontSize: "1.3rem",
            pointerEvents: "none",
            zIndex: 10,
            animation: "none",
            transform: `translate(${p.vx * 0}px, ${p.vy * 0}px) rotate(${p.rotate}deg)`,
            animationFillMode: "forwards",
          }}>
            <div style={{
              animation: `burstFly 0.65s ease-out forwards`,
              ["--vx" as string]: `${p.vx}px`,
              ["--vy" as string]: `${p.vy}px`,
            }}>{p.emoji}</div>
          </div>
        ))}

        {item.img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.img}
            alt={item.name}
            style={{
              width: "100%", height: "100%", objectFit: "contain", padding: 12,
              animation: shaking ? "shake 0.45s ease" : "none",
              transition: "transform .3s ease",
              transform: hovered ? "scale(1.08)" : "scale(1)",
            }}
          />
        ) : (
          <span style={{ fontSize: "3.5rem", animation: shaking ? "shake 0.45s ease" : "none" }}>{item.icon}</span>
        )}

        {/* Glow ring on hover */}
        {hovered && (
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(circle at center, rgba(0,247,255,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
        )}

        {/* Click hint */}
        {hovered && (
          <div style={{
            position: "absolute", bottom: 8, right: 8,
            fontSize: "0.62rem", color: "rgba(0,247,255,0.7)",
            fontFamily: "Rajdhani, sans-serif", fontWeight: 700, letterSpacing: "0.1em",
            background: "rgba(0,0,0,0.5)", padding: "2px 7px", borderRadius: 999,
            pointerEvents: "none",
          }}>TAP ✨</div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "16px 16px 18px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        <div>
          <h3 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "0.85rem", marginBottom: 4, lineHeight: 1.3 }}>{item.name}</h3>
          <div style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 800, color: "#00f7ff", fontSize: "0.9rem" }}>{item.label}</div>
        </div>
        <p style={{ color: "rgba(248,251,255,0.6)", fontSize: "0.8rem", lineHeight: 1.55, flex: 1 }}>{item.desc}</p>

        {/* Controls */}
        <div className="addon-controls" style={{ display: "flex", gap: 8, alignItems: "center", marginTop: "auto" }}>
          <div className="addon-stepper" style={{ display: "flex", alignItems: "center", gap: 6, border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "5px 8px", background: "rgba(255,255,255,0.04)" }}>
            <button className="addon-step" disabled={qty === 0} onClick={() => setQty((q) => Math.max(0, q - 1))}
              style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid rgba(255,255,255,0.16)", background: "rgba(255,255,255,0.06)", color: "#f8fbff", fontWeight: 800, cursor: qty === 0 ? "not-allowed" : "pointer", opacity: qty === 0 ? 0.35 : 1, fontFamily: "inherit", fontSize: "0.9rem" }}>−</button>
            <span style={{ minWidth: 22, textAlign: "center", fontWeight: 700, color: "#00f7ff", fontSize: "0.9rem" }}>{qty}</span>
            <button className="addon-step" onClick={() => setQty((q) => q + 1)}
              style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid rgba(255,255,255,0.16)", background: "rgba(255,255,255,0.06)", color: "#f8fbff", fontWeight: 800, cursor: "pointer", fontFamily: "inherit", fontSize: "0.9rem" }}>+</button>
          </div>
          <button className="addon-add" onClick={() => {
            if (qty === 0) { show("Select a quantity first"); return; }
            addToCart({ id: item.id, name: item.name, price: item.price, icon: item.icon }, qty);
            show(`${item.name} added! 🛒`);
            setQty(0);
          }} style={{
            flex: 1, minHeight: 42, borderRadius: 10, border: "none",
            color: "#021014", background: hovered ? "linear-gradient(135deg,#00f7ff,#ff2d95)" : "linear-gradient(135deg,#00f7ff,#8a5cff)",
            fontWeight: 800, cursor: "pointer", fontSize: "0.82rem", fontFamily: "inherit",
            transition: "background .3s",
          }}>Add to Cart</button>
        </div>
      </div>
    </article>
  );
}

type Tab = "beverages" | "snacks";
const TAB_ITEMS: Record<Tab, Item[]> = { beverages: BEVERAGES, snacks: SNACKS };
const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "beverages", label: "Beverages", icon: "🥤" },
  { key: "snacks",    label: "Snacks",    icon: "🍿" },
];

export default function AddOns() {
  const [tab, setTab] = useState<Tab>("beverages");

  return (
    <section id="add-ons" style={{ padding: "80px 0", position: "relative", zIndex: 1, background: "radial-gradient(circle at 30% 50%, rgba(0,247,255,0.06) 0%, transparent 55%)" }}>
      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0)   scale(1);   opacity: 0.9; }
          100% { transform: translateY(-80px) scale(0); opacity: 0; }
        }
        @keyframes shake {
          0%,100% { transform: rotate(0deg)   scale(1.08); }
          20%     { transform: rotate(-8deg)  scale(1.14); }
          40%     { transform: rotate(8deg)   scale(1.14); }
          60%     { transform: rotate(-5deg)  scale(1.1); }
          80%     { transform: rotate(5deg)   scale(1.1); }
        }
        @keyframes burstFly {
          0%   { transform: translate(0, 0)          scale(1)   opacity(1); opacity: 1; }
          100% { transform: translate(var(--vx), var(--vy)) scale(0)   opacity(0); opacity: 0; }
        }
        @media (max-width: 1000px) { #add-ons .addon-grid { grid-template-columns: repeat(3,1fr) !important; } }
        @media (max-width: 720px)  { #add-ons .addon-grid { grid-template-columns: repeat(2,1fr) !important; gap: 10px !important; } }
        /* Phones: keep a 2-up shop grid (denser, app-like) instead of 1 huge card */
        @media (max-width: 600px) {
          #add-ons .addon-img      { height: 130px !important; }
          #add-ons .addon-img img  { padding: 8px !important; }
          #add-ons .addon-grid article > div:last-child { padding: 12px 12px 14px !important; gap: 8px !important; }
          #add-ons .addon-add      { font-size: 0.78rem !important; min-height: 44px !important; }
          #add-ons .addon-step     { width: 30px !important; height: 30px !important; }
        }
        @media (max-width: 360px) {
          #add-ons .addon-grid { grid-template-columns: 1fr !important; }
          #add-ons .addon-img  { height: 160px !important; }
        }
      `}</style>

      <div className="wrap">
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 800, fontSize: "0.78rem", letterSpacing: "0.26em", textTransform: "uppercase", color: "#00f7ff", marginBottom: 8 }}>Enhance Your Session</div>
          <h2 style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 900, fontSize: "clamp(2rem,4vw,3.2rem)", lineHeight: 1.08 }}>
            Gaming <span className="grad">Add-ons</span>
          </h2>
          <p style={{ color: "rgba(248,251,255,0.65)", marginTop: 10, lineHeight: 1.65 }}>
            Order beverages and snacks — tap a product image to see it come alive! 🎉
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              minHeight: 42, padding: "0 20px", borderRadius: 999,
              border: tab === t.key ? "1px solid rgba(0,247,255,0.6)" : "1px solid rgba(255,255,255,0.12)",
              background: tab === t.key ? "rgba(0,247,255,0.12)" : "rgba(255,255,255,0.04)",
              color: tab === t.key ? "#00f7ff" : "rgba(248,251,255,0.55)",
              fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", fontFamily: "inherit", transition: "all .2s",
            }}>
              {t.icon} {t.label}
              <span style={{ background: tab === t.key ? "#00f7ff" : "rgba(255,255,255,0.12)", color: tab === t.key ? "#021014" : "rgba(248,251,255,0.55)", borderRadius: 999, fontSize: "0.7rem", fontWeight: 800, padding: "2px 7px", transition: "all .2s" }}>
                {TAB_ITEMS[t.key].length}
              </span>
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="addon-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
          {TAB_ITEMS[tab].map((item) => <Card key={item.id} item={item} />)}
        </div>
      </div>
    </section>
  );
}
