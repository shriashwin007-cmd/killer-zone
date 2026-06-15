"use client";
import { useEffect, useRef, useState } from "react";

/*
  Apple-style scroll sequence.
  Instead of seeking a <video> (which re-decodes every frame and stutters),
  we use Cloudinary to extract individual JPG frames, preload them ALL as
  decoded <img> objects, then just drawImage() the right frame on scroll.
  Swapping pre-decoded images is instant → true 60fps scrubbing, no glitch.
*/

const BASE      = "https://res.cloudinary.com/dxvui0xkz/video/upload";
const PUBLIC_ID = "v1781549761/Killer_Zone_logo_animation_202606151758_aiux2e";
const MP4_META  = `${BASE}/q_auto/${PUBLIC_ID}.mp4`; // only used to read duration

// One extracted frame at time t (seconds), width w
const frameUrl = (t: number, w: number) =>
  `${BASE}/so_${t.toFixed(2)},w_${w},c_limit,q_auto/${PUBLIC_ID}.jpg`;

const isMobileDevice = () =>
  typeof window !== "undefined" &&
  (window.matchMedia("(max-width: 768px)").matches ||
    window.matchMedia("(pointer: coarse)").matches);

export default function ScrollVideoIntro() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const overlayRef   = useRef<HTMLDivElement>(null);
  const hintRef      = useRef<HTMLDivElement>(null);

  const frames       = useRef<HTMLImageElement[]>([]);
  const currentFrame = useRef(-1);
  const ticking      = useRef(false);
  const [progress, setProgress] = useState(0); // preload progress 0..1

  useEffect(() => {
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    const overlay   = overlayRef.current;
    const hint      = hintRef.current;
    if (!canvas || !container || !overlay) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const mobile      = isMobileDevice();
    const FRAME_COUNT = mobile ? 48 : 72;   // more frames = finer, smoother scrub
    const FRAME_W     = mobile ? 720 : 1280;
    const multiplier  = mobile ? 3.2 : 4.5; // longer scroll = slower playback
    container.style.height = `${multiplier * 100}vh`;

    let cancelled = false;
    let loaded    = 0;

    // ── object-cover draw of a decoded image ────────────────────────────────
    const draw = (img: HTMLImageElement) => {
      const cw = canvas.offsetWidth, ch = canvas.offsetHeight;
      const vw = img.naturalWidth,   vh = img.naturalHeight;
      if (!vw || !ch) return;
      const vR = vw / vh, cR = cw / ch;
      let sx = 0, sy = 0, sw = vw, sh = vh;
      if (vR > cR) { sw = vh * cR; sx = (vw - sw) / 2; }
      else         { sh = vw / cR; sy = (vh - sh) / 2; }
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width  = Math.round(canvas.offsetWidth  * dpr);
      canvas.height = Math.round(canvas.offsetHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const f = frames.current[Math.max(0, currentFrame.current)];
      if (f && f.complete && f.naturalWidth) draw(f);
    };

    // ── render the frame matching scroll position ───────────────────────────
    const render = () => {
      const rect       = container.getBoundingClientRect();
      const scrollable = container.offsetHeight - window.innerHeight;
      const p          = Math.min(1, Math.max(0, -rect.top) / scrollable);

      const idx = Math.min(FRAME_COUNT - 1, Math.round(p * (FRAME_COUNT - 1)));
      if (idx !== currentFrame.current) {
        const img = frames.current[idx];
        if (img && img.complete && img.naturalWidth) {
          draw(img);
          currentFrame.current = idx;
        }
      }

      // blend to site background in the last stretch
      const FADE  = 0.8;
      const raw   = p > FADE ? (p - FADE) / (1 - FADE) : 0;
      const eased = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;
      overlay.style.opacity = String(eased);
      if (hint) hint.style.opacity = String(Math.max(0, 1 - p * 6));

      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(render);
      }
    };

    // ── build frame list (needs duration) then preload everything ───────────
    const buildFrames = (duration: number) => {
      const safeDur = Math.max(0.1, duration - 0.05);
      const imgs: HTMLImageElement[] = new Array(FRAME_COUNT);
      for (let i = 0; i < FRAME_COUNT; i++) {
        const t   = (i / (FRAME_COUNT - 1)) * safeDur;
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          loaded++;
          if (!cancelled) setProgress(loaded / FRAME_COUNT);
          if (i === 0) { resize(); draw(img); currentFrame.current = 0; }
        };
        // No crossOrigin: we only drawImage (never read pixels), so a tainted
        // canvas is fine and we avoid any CORS load failures.
        img.src = frameUrl(t, FRAME_W);
        imgs[i] = img;
      }
      frames.current = imgs;
    };

    const meta = document.createElement("video");
    meta.preload = "metadata";
    meta.muted   = true;
    meta.onloadedmetadata = () => { if (!cancelled) buildFrames(meta.duration || 5); };
    meta.onerror          = () => { if (!cancelled) buildFrames(5); }; // fallback
    meta.src = MP4_META;

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize);
    resize();

    return () => {
      cancelled = true;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ height: "260vh", position: "relative" }}>
      <div style={{
        position: "sticky", top: 0, height: "100svh",
        overflow: "hidden", background: "#000",
      }}>
        {/* canvas draws the current pre-decoded frame */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%", display: "block",
          }}
        />

        {/* preload progress bar (shows until frames are ready) */}
        {progress < 1 && (
          <div style={{
            position: "absolute", left: "50%", top: "50%",
            transform: "translate(-50%,-50%)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
            pointerEvents: "none",
          }}>
            <div style={{
              width: 160, height: 3, borderRadius: 999,
              background: "rgba(255,255,255,0.12)", overflow: "hidden",
            }}>
              <div style={{
                width: `${Math.round(progress * 100)}%`, height: "100%",
                background: "linear-gradient(90deg,#00f7ff,#8a5cff)",
                transition: "width .2s ease",
              }} />
            </div>
            <span style={{
              fontFamily: "Rajdhani, sans-serif", fontWeight: 700,
              fontSize: "0.68rem", letterSpacing: "0.26em",
              textTransform: "uppercase", color: "rgba(0,247,255,0.5)",
            }}>Loading</span>
          </div>
        )}

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
