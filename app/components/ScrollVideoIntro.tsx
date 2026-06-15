"use client";
import { useEffect, useRef } from "react";

// Cloudinary: auto quality + limit to 1280px wide = faster decode = smoother scrub
const VIDEO_URL =
  "https://res.cloudinary.com/dxvui0xkz/video/upload/q_auto:good,w_1280,c_limit/v1781549761/Killer_Zone_logo_animation_202606151758_aiux2e.mp4";

export default function ScrollVideoIntro() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef     = useRef<HTMLVideoElement>(null);
  const overlayRef   = useRef<HTMLDivElement>(null);
  const hintRef      = useRef<HTMLDivElement>(null);
  const progress     = useRef(0);
  const ticking      = useRef(false);
  const rafId        = useRef<number | null>(null);

  useEffect(() => {
    const video     = videoRef.current;
    const container = containerRef.current;
    const overlay   = overlayRef.current;
    const hint      = hintRef.current;
    if (!video || !container || !overlay) return;

    video.pause();

    // ── called at most once per animation frame ──────────────────────────────
    const commit = () => {
      const p = progress.current;

      // Seek — fastSeek is less precise but way smoother (Firefox + some Chrome)
      if (video.readyState >= 2 && video.duration) {
        const t = p * video.duration;
        if (typeof (video as HTMLVideoElement & { fastSeek?: (t: number) => void }).fastSeek === "function") {
          (video as HTMLVideoElement & { fastSeek: (t: number) => void }).fastSeek(t);
        } else {
          video.currentTime = t;
        }
      }

      // Overlay blend (last 30%)
      const FADE = 0.7;
      const raw  = p > FADE ? (p - FADE) / (1 - FADE) : 0;
      const ease = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;
      overlay.style.opacity = String(ease);

      // Hint fades out quickly
      if (hint) hint.style.opacity = String(Math.max(0, 1 - p * 8));

      ticking.current = false;
    };

    const onScroll = () => {
      const rect      = container.getBoundingClientRect();
      const scrollable = container.offsetHeight - window.innerHeight;
      const scrolled  = Math.max(0, -rect.top);
      progress.current = Math.min(1, scrolled / scrollable);

      // Throttle to one rAF per scroll burst
      if (!ticking.current) {
        ticking.current = true;
        rafId.current = requestAnimationFrame(commit);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ height: "260vh", position: "relative" }}>
      {/* ── Sticky viewport ─────────────────────────────────────────────────── */}
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: "#000" }}>

        {/* Video — GPU-promoted layer for smooth compositing */}
        <video
          ref={videoRef}
          src={VIDEO_URL}
          muted
          playsInline
          preload="auto"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", display: "block",
            transform: "translateZ(0)",        // GPU layer
            willChange: "transform",           // hint to browser
          }}
        />

        {/* Scroll hint */}
        <div ref={hintRef} style={{
          position: "absolute", bottom: 44, left: "50%",
          transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          pointerEvents: "none",
          transition: "opacity 0.4s ease",
          animation: "kzFloat 2s ease-in-out infinite",
        }}>
          <span style={{
            fontFamily: "Rajdhani, sans-serif", fontWeight: 700,
            fontSize: "0.7rem", letterSpacing: "0.28em",
            textTransform: "uppercase", color: "rgba(0,247,255,0.55)",
          }}>Scroll to enter</span>
          <svg width="20" height="32" viewBox="0 0 20 32" fill="none">
            <rect x="1" y="1" width="18" height="26" rx="9" stroke="rgba(0,247,255,0.35)" strokeWidth="1.5"/>
            <circle cx="10" cy="9" r="2.5" fill="rgba(0,247,255,0.7)">
              <animate attributeName="cy" values="9;17;9" dur="1.6s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="1;0;1" dur="1.6s" repeatCount="indefinite"/>
            </circle>
            <polyline points="7,29 10,32 13,29" fill="none" stroke="rgba(0,247,255,0.35)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Blend overlay — transparent → site bg */}
        <div ref={overlayRef} style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(5,7,12,0) 0%, #05070c 65%)",
          opacity: 0,
          pointerEvents: "none",
        }}/>
      </div>

      <style>{`
        @keyframes kzFloat {
          0%, 100% { transform: translateX(-50%) translateY(0px); }
          50%       { transform: translateX(-50%) translateY(8px); }
        }
      `}</style>
    </div>
  );
}
