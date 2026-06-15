"use client";
import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

interface Ctx { show: (msg: string) => void; }
const ToastContext = createContext<Ctx | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState("");
  const [visible, setVisible] = useState(false);
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((m: string) => {
    if (timer) clearTimeout(timer);
    setMsg(m);
    setVisible(true);
    setTimer(setTimeout(() => setVisible(false), 2200));
  }, [timer]);

  useEffect(() => () => { if (timer) clearTimeout(timer); }, [timer]);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div
        aria-live="polite"
        style={{
          position: "fixed",
          left: "50%",
          bottom: "24px",
          zIndex: 200,
          transform: `translateX(-50%) translateY(${visible ? "0" : "16px"})`,
          opacity: visible ? 1 : 0,
          transition: "opacity .2s ease, transform .2s ease",
          pointerEvents: "none",
          padding: "10px 18px",
          borderRadius: "999px",
          background: "rgba(5,7,12,0.9)",
          border: "1px solid rgba(255,255,255,0.12)",
          color: "#f8fbff",
          fontSize: "0.88rem",
          fontWeight: 600,
          whiteSpace: "nowrap",
        }}
      >
        {msg}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast outside ToastProvider");
  return ctx;
}
