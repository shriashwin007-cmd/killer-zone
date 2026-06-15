"use client";
import { useEffect, useRef } from "react";

const VIDEO_URL =
  "https://res.cloudinary.com/dxvui0xkz/video/upload/v1781549761/Killer_Zone_logo_animation_202606151758_aiux2e.mp4";

export default function ScrollVideoIntro() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const targetTime = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    const overlay = overlayRef.current;
    if (!video || !container || !overlay) return;

    // Keep video paused — we control playback via currentTime
    video.pause();

    const onScroll = () => {
      const rect = container.getBoundingClientRect();
      const scrollable = container.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const progress = Math.min(1, scrolled / scrollable);

      // Target video time
      if (video.duration) {
        targetTime.current = progress * video.duration;
      }

      // Fade-to-site in final 30% of scroll
      const FADE_START = 0.7;
      const fadeT = progress > FADE_START ? (progress - FADE_START) / (1 - FADE_START) : 0;
      const eased = fadeT < 0.5 ? 2 * fadeT * fadeT : 1 - Math.pow(-2 * fadeT + 2, 2) / 2;
      overlay.style.opacity = String(eased);
    };

    // rAF loop for buttery currentTime scrubbing
    const tick = () => {
      if (video.readyState >= 2) {
        const diff = targetTime.current - video.currentTime;
        if (Math.abs(diff) > 0.01) {
          video.currentTime += diff * 0.18; // lerp toward target
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ height: "280vh", position: "relative" }}>
      <div style={{
        position: "sticky", top: 0, height: "100vh",
        overflow: "hidden", background: "#000",
      }}>
        {/* The video — fills viewport */}
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
          }}
        />

        {/* Scroll hint — fades out as you scroll */}
        <div style={{
          position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          animation: "kzPulse 2s ease-in-out infinite",
          pointerEvents: "none",
        }}>
          <span style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(0,247,255,0.6)" }}>
            Scroll to enter
          </span>
          <svg width="18" height="28" viewBox="0 0 18 28" fill="none">
            <rect x="1" y="1" width="16" height="22" rx="8" stroke="rgba(0,247,255,0.4)" strokeWidth="1.5" />
            <rect x="7.5" y="5" width="3" height="6" rx="1.5" fill="rgba(0,247,255,0.7)">
              <animate attributeName="y" values="5;11;5" dur="1.6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0.2;1" dur="1.6s" repeatCount="indefinite" />
            </rect>
            <path d="M6 26l3 3 3-3" stroke="rgba(0,247,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Blend overlay — fades to site background at end of scroll */}
        <div ref={overlayRef} style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, transparent 0%, #05070c 60%)",
          opacity: 0,
          pointerEvents: "none",
          transition: "opacity 0.05s linear",
        }} />
      </div>

      <style>{`
        @keyframes kzPulse {
          0%, 100% { opacity: 0.9; transform: translateX(-50%) translateY(0); }
          50%       { opacity: 0.4; transform: translateX(-50%) translateY(6px); }
        }
      `}</style>
    </div>
  );
}
