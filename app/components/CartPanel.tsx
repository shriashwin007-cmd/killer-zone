"use client";
import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { useToast } from "@/app/context/ToastContext";

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

export default function CartPanel() {
  const { cart, isOpen, closeCart, updateQty, removeItem, totalPrice } = useCart();
  const { show } = useToast();
  const [paying, setPaying] = useState(false);

  function whatsappCheckout() {
    if (!cart.length) { show("Your cart is empty!"); return; }
    const lines = cart.map((i) => `${i.quantity}x ${i.name} – ₹${i.price * i.quantity}`).join("\n");
    const msg = `Hi Killer Zone! I want to order:\n\n${lines}\n\nTotal: ₹${totalPrice}`;
    window.open(`https://wa.me/919444409996?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  }

  async function handlePayment() {
    if (!cart.length) { show("Your cart is empty!"); return; }

    const RZP_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!RZP_KEY) {
      whatsappCheckout();
      return;
    }

    setPaying(true);
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Send only item ids + quantities — the server computes the price
          cart: cart.map((i) => ({ id: i.id, quantity: i.quantity })),
          description: "Killer Zone Add-ons Order",
        }),
      });

      if (!res.ok) {
        show("Payment unavailable — redirecting to WhatsApp");
        whatsappCheckout();
        return;
      }

      const { orderId, amount } = await res.json();
      await loadScript("https://checkout.razorpay.com/v1/checkout.js");

      const options = {
        key: RZP_KEY,
        amount, // authoritative paise amount from server
        currency: "INR",
        name: "Killer Zone",
        description: "Add-ons & Snacks",
        order_id: orderId,
        theme: { color: "#00f7ff" },
        handler: (response: { razorpay_payment_id: string }) => {
          show(`✅ Paid! Ref: ${response.razorpay_payment_id.slice(-8).toUpperCase()}`);
          cart.forEach((item) => removeItem(item.id));
          closeCart();
          const msg = `Hi! I just paid for:\n${cart.map((i) => `${i.quantity}x ${i.name}`).join(", ")}\nPayment ID: ${response.razorpay_payment_id}`;
          window.open(`https://wa.me/919444409996?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", () => show("Payment failed. Try again or WhatsApp us!"));
      rzp.open();
    } catch {
      show("Something went wrong — redirecting to WhatsApp");
      whatsappCheckout();
    } finally {
      setPaying(false);
    }
  }

  const qBtn: React.CSSProperties = {
    width: 28, height: 28, borderRadius: 8, border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.07)", color: "#f8fbff", fontWeight: 800,
    cursor: "pointer", fontFamily: "inherit", fontSize: "0.9rem",
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeCart}
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.62)",
          backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)",
          zIndex: 89, opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity .28s ease",
        }}
      />

      {/* Panel */}
      <div
        className="glass"
        style={{
          position: "fixed", right: 0, top: 0, bottom: 0, zIndex: 90,
          width: "min(420px,100vw)",
          display: "grid", gridTemplateRows: "auto 1fr auto",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform .3s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 22px", borderBottom: "1px solid rgba(255,255,255,0.1)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}
        >
          <h2 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "1.2rem", display: "flex", alignItems: "center", gap: 10 }}>
            🛒 Your Cart
          </h2>
          <button
            onClick={closeCart}
            style={{ width: 40, height: 40, borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)", color: "#f8fbff", fontSize: "1.4rem", cursor: "pointer" }}
          >
            ×
          </button>
        </div>

        {/* Items */}
        <div style={{ padding: "16px 22px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
          {cart.length === 0 ? (
            <div style={{ padding: "48px 0", textAlign: "center", color: "rgba(248,251,255,0.35)" }}>
              <div style={{ fontSize: "3.5rem", marginBottom: 12, opacity: 0.28 }}>🎮</div>
              <p>Your cart is empty.<br />Add snacks or gear to get started!</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex", gap: 14, padding: 16, borderRadius: 16,
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span style={{ fontSize: "2rem", flexShrink: 0 }}>{item.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>{item.name}</div>
                  <div style={{ fontFamily: "Orbitron, sans-serif", fontSize: "0.82rem", color: "#00f7ff", fontWeight: 700 }}>
                    ₹{item.price} each
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                    <button style={qBtn} onClick={() => updateQty(item.id, -1)}>−</button>
                    <span style={{ minWidth: 22, textAlign: "center", fontSize: "0.85rem", fontWeight: 700, color: "rgba(248,251,255,0.65)" }}>
                      {item.quantity}
                    </span>
                    <button style={qBtn} onClick={() => updateQty(item.id, 1)}>+</button>
                  </div>
                </div>
                <button
                  onClick={() => { removeItem(item.id); show("Item removed"); }}
                  style={{ color: "#ff2d95", fontWeight: 700, fontSize: "0.82rem", padding: "4px 8px", borderRadius: 8, border: "none", background: "none", cursor: "pointer", alignSelf: "flex-start", fontFamily: "inherit" }}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "18px 22px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span style={{ fontSize: "1.05rem", fontWeight: 700 }}>Total:</span>
            <span style={{ fontFamily: "Orbitron, sans-serif", fontSize: "1.5rem", fontWeight: 900, color: "#00f7ff" }}>
              ₹{totalPrice}
            </span>
          </div>

          {/* Pay online button */}
          <button
            onClick={handlePayment}
            disabled={paying || cart.length === 0}
            style={{
              width: "100%", minHeight: 52, borderRadius: 14, border: "none",
              fontWeight: 900, fontSize: "1rem", color: "#021014",
              background: paying ? "rgba(0,247,255,0.4)" : "linear-gradient(135deg,#00f7ff,#8a5cff)",
              cursor: paying || cart.length === 0 ? "not-allowed" : "pointer",
              fontFamily: "inherit", boxShadow: "0 12px 32px rgba(0,247,255,0.22)",
              marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            {paying ? "Opening payment..." : "💳 Pay Now"}
          </button>

          {/* WhatsApp fallback */}
          <button
            onClick={whatsappCheckout}
            style={{
              width: "100%", minHeight: 44, borderRadius: 14,
              border: "1px solid rgba(37,211,102,0.4)", background: "rgba(37,211,102,0.08)",
              color: "#25d366", fontWeight: 700, fontSize: "0.9rem",
              cursor: "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            💬 Order via WhatsApp instead
          </button>
        </div>
      </div>
    </>
  );
}
