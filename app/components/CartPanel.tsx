"use client";
import { useCart } from "@/app/context/CartContext";
import { useToast } from "@/app/context/ToastContext";

export default function CartPanel() {
  const { cart, isOpen, closeCart, updateQty, removeItem, totalPrice } = useCart();
  const { show } = useToast();

  function checkout() {
    if (!cart.length) { show("Your cart is empty!"); return; }
    const lines = cart.map(i => `${i.quantity}x ${i.name} – ₹${i.price * i.quantity}`).join("\n");
    const msg = `Hi Killer Zone! I want to order:\n\n${lines}\n\nTotal: ₹${totalPrice}`;
    window.open(`https://wa.me/917358546431?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  }

  const qBtn: React.CSSProperties = { width: 28, height: 28, borderRadius: 8, border: "1px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.07)", color: "#f8fbff", fontWeight: 800, cursor: "pointer", fontFamily: "inherit", fontSize: "0.9rem" };

  return (
    <>
      {/* Overlay */}
      <div onClick={closeCart} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.62)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", zIndex: 89, opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? "auto" : "none", transition: "opacity .28s ease" }} />

      {/* Panel */}
      <div className="glass" style={{
        position: "fixed", right: 0, top: 0, bottom: 0, zIndex: 90,
        width: "min(420px,100vw)",
        display: "grid", gridTemplateRows: "auto 1fr auto",
        transform: isOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform .3s ease",
      }}>
        {/* Header */}
        <div style={{ padding: "18px 22px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "1.2rem", display: "flex", alignItems: "center", gap: 10 }}>🛒 Your Cart</h2>
          <button onClick={closeCart} style={{ width: 40, height: 40, borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)", color: "#f8fbff", fontSize: "1.4rem", cursor: "pointer" }}>×</button>
        </div>

        {/* Items */}
        <div style={{ padding: "16px 22px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
          {cart.length === 0 ? (
            <div style={{ padding: "48px 0", textAlign: "center", color: "rgba(248,251,255,0.35)" }}>
              <div style={{ fontSize: "3.5rem", marginBottom: 12, opacity: 0.28 }}>🎮</div>
              <p>Your cart is empty.<br />Add snacks or gear to get started!</p>
            </div>
          ) : cart.map((item) => (
            <div key={item.id} style={{ display: "flex", gap: 14, padding: 16, borderRadius: 16, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <span style={{ fontSize: "2rem", flexShrink: 0 }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{item.name}</div>
                <div style={{ fontFamily: "Orbitron, sans-serif", fontSize: "0.82rem", color: "#00f7ff", fontWeight: 700 }}>₹{item.price} each</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                  <button style={qBtn} onClick={() => updateQty(item.id, -1)}>−</button>
                  <span style={{ minWidth: 22, textAlign: "center", fontSize: "0.85rem", fontWeight: 700, color: "rgba(248,251,255,0.65)" }}>{item.quantity}</span>
                  <button style={qBtn} onClick={() => updateQty(item.id, 1)}>+</button>
                </div>
              </div>
              <button onClick={() => { removeItem(item.id); show("Item removed"); }} style={{ color: "#ff2d95", fontWeight: 700, fontSize: "0.82rem", padding: "4px 8px", borderRadius: 8, border: "none", background: "none", cursor: "pointer", alignSelf: "flex-start", fontFamily: "inherit" }}>Remove</button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: "18px 22px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span style={{ fontSize: "1.05rem", fontWeight: 700 }}>Total:</span>
            <span style={{ fontFamily: "Orbitron, sans-serif", fontSize: "1.5rem", fontWeight: 900, color: "#00f7ff" }}>₹{totalPrice}</span>
          </div>
          <button onClick={checkout} style={{ width: "100%", minHeight: 52, borderRadius: 14, border: "none", fontWeight: 900, fontSize: "1rem", color: "#021014", background: "linear-gradient(135deg,#00f7ff,#8a5cff)", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 12px 32px rgba(0,247,255,0.22)" }}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </>
  );
}
