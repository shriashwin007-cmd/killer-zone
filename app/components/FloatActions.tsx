"use client";

export default function FloatActions({ onChatOpen }: { onChatOpen: () => void }) {
  return (
    <div style={{ position: "fixed", right: 16, bottom: 20, zIndex: 60, display: "flex", flexDirection: "column", gap: 10 }}>
      <button onClick={onChatOpen} style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
        minHeight: 50, minWidth: 150, padding: "0 18px", borderRadius: 16, border: "1px solid rgba(0,247,255,0.44)",
        background: "linear-gradient(135deg,#00f7ff,#dffcff)", color: "#001418",
        fontWeight: 800, fontSize: "0.9rem", cursor: "pointer", fontFamily: "inherit",
        boxShadow: "0 16px 44px rgba(0,0,0,0.3)",
      }}>🤖 AI Chat</button>

      <a href="https://wa.me/919444409996?text=Hi%20Killer%20Zone!%20I%20want%20to%20book%20a%20gaming%20session." target="_blank" rel="noreferrer" style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
        minHeight: 50, minWidth: 150, padding: "0 18px", borderRadius: 16,
        background: "#25d366", color: "#03120a",
        fontWeight: 800, fontSize: "0.9rem", textDecoration: "none",
        boxShadow: "0 16px 40px rgba(37,211,102,0.22)",
      }}>💬 WhatsApp</a>

      <style>{`
        @media (max-width: 520px) {
          div[style*="position: fixed"][style*="right: 16px"][style*="bottom: 20px"] {
            left: 10px !important; right: 10px !important;
            flex-direction: row !important;
          }
          div[style*="position: fixed"][style*="right: 16px"][style*="bottom: 20px"] > * {
            flex: 1; min-width: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
