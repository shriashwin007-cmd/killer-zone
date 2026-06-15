"use client";
import { useEffect, useRef } from "react";

const VIDEO_URL =
  "https://res.cloudinary.com/dxvui0xkz/video/upload/q_auto:good,w_1280,c_limit/v1781549761/Killer_Zone_logo_animation_202606151758_aiux2e.mp4";

// How many screen-heights the user scrolls to watch the full video
const SCROLL_MULTIPLIER = 3;

export default function ScrollVideoIntro() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const videoRef     = useRef<HTMLVideoElement>(null);
  const overlayRef   = useRef<HTMLDivElement>(null);
  const hintRef      = useRef<HTMLDivElement>(null);

  const targetTime   = useRef(0);
  const isSeeking    = useRef(false);
  const nextTime     = useRef<number | null>(null);
  const ticking      = useRef(false);
  const rafId        = useRef<number | null>(null);

  useEffect(() => {
    const video     = videoRef.current;
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    const overlay   = overlayRef.current;
    const hint      = hintRef.current;
    if (!video || !canvas || !container || !overlay) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    video.pause();

    // ── resize canvas to device pixels ──────────────────────────────────────
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
      drawFrame();
    };

    // ── object-cover draw ────────────────────────────────────────────────────
    const drawFrame = () => {
      if (!video.videoWidth) return;
      const vw = video.videoWidth, vh = video.videoHeight;
      const cw = canvas.offsetWidth,  ch = canvas.offsetHeight;
      const vRatio = vw / vh, cRatio = cw / ch;
      let sx = 0, sy = 0, sw = vw, sh = vh;
      if (vRatio > cRatio) { sw = vh * cRatio; sx = (vw - sw) / 2; }
      else                 { sh = vw / cRatio; sy = (vh - sh) / 2; }
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(video, sx, sy, sw, sh, 0, 0, cw, ch);
    };

    // ── seek queue — one seek in flight at a time ────────────────────────────
    const flushSeek = (t: number) => {
      isSeeking.current = true;
      video.currentTime = t;
    };

    const seekTo = (t: number) => {
      if (isSeeking.current) { nextTime.current = t; return; }
      flushSeek(t);
    };

    const onSeeked = () => {
      drawFrame();
      isSeeking.current = false;
      if (nextTime.current !== null) {
        const t = nextTime.current;
        nextTime.current = null;
        flushSeek(t);
      }
    };

    // ── scroll → progress ────────────────────────────────────────────────────
    const commit = () => {
      seekTo(targetTime.current);

      // overlay blend in last 30%
      const p     = container.offsetHeight > window.innerHeight
        ? Math.min(1, Math.max(0, -container.getBoundingClientRect().top) / (container.offsetHeight - window.innerHeight))
        : 0;
      const FADE  = 0.72;
      const raw   = p > FADE ? (p - FADE) / (1 - FADE) : 0;
      const eased = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;
      overlay.style.opacity = String(eased);
      if (hint) hint.style.opacity = String(Math.max(0, 1 - p * 6));

      ticking.current = false;
    };

    const onScroll = () => {
      const rect       = container.getBoundingClientRect();
      const scrollable = container.offsetHeight - window.innerHeight;
      const p          = Math.min(1, Math.max(0, -rect.top) / scrollable);
      if (video.duration) targetTime.current = p * video.duration;

      if (!ticking.current) {
        ticking.current = true;
        rafId.current = requestAnimationFrame(commit);
      }
    };

    video.addEventListener("seeked",       onSeeked);
    video.addEventListener("loadeddata",   () => { resize(); drawFrame(); });
    window.addEventListener("scroll",      onScroll, { passive: true });
    window.addEventListener("resize",      resize);

    // draw first frame immediately if already loaded
    if (video.readyState >= 2) { resize(); drawFrame(); }

    return () => {
      video.removeEventListener("seeked",     onSeeked);
      window.removeEventListener("scroll",    onScroll);
      window.removeEventListener("resize",    resize);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ height: `${SCROLL_MULTIPLIER * 100}vh`, position: "relative" }}
    >
      <div style={{
        position: "sticky", top: 0, height: "100vh",
        overflow: "hidden", background: "#000",
      }}>
        {/* hidden video — only used as decode source */}
        <video
          ref={videoRef}
          src={VIDEO_URL}
          muted playsInline preload="auto"
          style={{ display: "none" }}
        />

        {/* canvas renders every confirmed frame — no tearing */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%", display: "block",
          }}
        />

        {/* scroll hint */}
        <div ref={hintRef} style={{
          position: "absolute", bottom: 44, left: "50%",
          transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          pointerEvents: "none",
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
            <polyline points="7,29 10,32 13,29" fill="none"
              stroke="rgba(0,247,255,0.35)" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* blend overlay */}
        <div ref={overlayRef} style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(5,7,12,0) 0%, #05070c 70%)",
          opacity: 0, pointerEvents: "none",
        }}/>
      </div>

      <style>{`
        @keyframes kzFloat {
          0%,100% { transform: translateX(-50%) translateY(0);   }
          50%      { transform: translateX(-50%) translateY(8px); }
        }
      `}</style>
    </div>
  );
}
