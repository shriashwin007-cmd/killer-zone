"use client";
import { useEffect, useRef, useState } from "react";

/*
  Apple-style scroll sequence.
  - Cloudinary extracts each frame as a JPG; we preload them all as decoded
    <img> objects, then drawImage() the right frame → instant, no video decode.
  - A continuous rAF loop EASES the displayed frame toward the scroll target,
    so motion stays buttery even when mobile momentum-scroll fires events
    sparsely (this is what fixes the "1fps / choppy" feel on phones).
*/

const BASE      = "https://res.cloudinary.com/dxvui0xkz/video/upload";
const PUBLIC_ID = "v1781549761/Killer_Zone_logo_animation_202606151758_aiux2e";
const MP4_META  = `${BASE}/q_auto/${PUBLIC_ID}.mp4`;

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

  const frames        = useRef<HTMLImageElement[]>([]);
  const drawnFrame    = useRef(-1);   // last frame actually painted
  const displayed     = useRef(0);    // eased frame position (float)
  const targetFrame   = useRef(0);    // scroll-driven target (float)
  const targetProgress= useRef(0);    // 0..1 scroll progress (for overlay)
  const frameCount    = useRef(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    const overlay   = overlayRef.current;
    const hint      = hintRef.current;
    if (!canvas || !container || !overlay) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const mobile      = isMobileDevice();
    const FRAME_COUNT = mobile ? 56 : 84;    // more frames = finer steps
    const FRAME_W     = mobile ? 768 : 1280;
    const multiplier  = mobile ? 5.0 : 5.5;  // longer scroll = slower, gentler
    const ease        = mobile ? 0.1 : 0.14; // lower = slower, silkier glide
    frameCount.current = FRAME_COUNT;
    container.style.height = `${multiplier * 100}vh`;

    let cancelled = false;
    let loaded    = 0;
    let cw = 0, ch = 0; // CSS pixel size of canvas

    // ── object-cover draw of a decoded image ────────────────────────────────
    const draw = (img: HTMLImageElement) => {
      const vw = img.naturalWidth, vh = img.naturalHeight;
      if (!vw || !cw || !ch) return;
      const vR = vw / vh, cR = cw / ch;
      let sx = 0, sy = 0, sw = vw, sh = vh;
      if (vR > cR) { sw = vh * cR; sx = (vw - sw) / 2; }
      else         { sh = vw / cR; sy = (vh - sh) / 2; }
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
    };

    const redrawCurrent = () => {
      const f = frames.current[Math.max(0, drawnFrame.current)];
      if (f && f.complete && f.naturalWidth) draw(f);
    };

    // ── size the canvas to its real box (fixes "not covered" on mobile) ─────
    const resize = () => {
      cw = canvas.offsetWidth;
      ch = canvas.offsetHeight;
      if (!cw || !ch) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width  = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      redrawCurrent();
    };

    // ── scroll → target ─────────────────────────────────────────────────────
    const onScroll = () => {
      const rect       = container.getBoundingClientRect();
      const scrollable = container.offsetHeight - window.innerHeight;
      const p          = Math.min(1, Math.max(0, -rect.top) / Math.max(1, scrollable));
      targetProgress.current = p;
      targetFrame.current    = p * (FRAME_COUNT - 1);
    };

    // ── continuous easing loop (always runs while mounted) ──────────────────
    const loop = () => {
      if (cancelled) return;

      // ease displayed frame toward target
      const d = targetFrame.current - displayed.current;
      displayed.current += d * ease;
      if (Math.abs(d) < 0.001) displayed.current = targetFrame.current;

      const idx = Math.round(displayed.current);
      if (idx !== drawnFrame.current) {
        const img = frames.current[idx];
        if (img && img.complete && img.naturalWidth) {
          draw(img);
          drawnFrame.current = idx;
        }
      }

      // overlay blend in the last stretch (driven by raw scroll progress)
      const p = targetProgress.current;
      const FADE  = 0.82;
      const raw   = p > FADE ? (p - FADE) / (1 - FADE) : 0;
      const eased = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;
      overlay.style.opacity = String(eased);
      if (hint) hint.style.opacity = String(Math.max(0, 1 - p * 6));

      requestAnimationFrame(loop);
    };

    // ── build + preload frames ──────────────────────────────────────────────
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
          if (i === 0) { drawnFrame.current = -1; redrawCurrent(); drawnFrame.current = 0; }
        };
        img.src = frameUrl(t, FRAME_W);
        imgs[i] = img;
      }
      frames.current = imgs;
    };

    const meta = document.createElement("video");
    meta.preload = "metadata";
    meta.muted   = true;
    meta.onloadedmetadata = () => { if (!cancelled) buildFrames(meta.duration || 5); };
    meta.onerror          = () => { if (!cancelled) buildFrames(5); };
    meta.src = MP4_META;

    // Robust sizing: ResizeObserver catches late layout / font / svh settle,
    // orientationchange catches phone rotation.
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("orientationchange", resize);
    resize();
    onScroll();
    requestAnimationFrame(loop);

    return () => {
      cancelled = true;
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("orientationchange", resize);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ height: "300vh", position: "relative" }}>
      <div style={{
        position: "sticky", top: 0, height: "100svh",
        overflow: "hidden", background: "#000",
      }}>
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%", display: "block",
          }}
        />

        {/* preload progress */}
        {progress < 1 && (
          <div style={{
            position: "absolute", left: "50%", top: "50%",
            transform: "translate(-50%,-50%)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
            pointerEvents: "none",
          }}>
            <div style={{ width: 160, height: 3, borderRadius: 999, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
              <div style={{ width: `${Math.round(progress * 100)}%`, height: "100%", background: "linear-gradient(90deg,#00f7ff,#8a5cff)", transition: "width .2s ease" }} />
            </div>
            <span style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "0.68rem", letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(0,247,255,0.5)" }}>Loading</span>
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
          <span style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(0,247,255,0.55)" }}>Scroll to enter</span>
          <svg width="20" height="32" viewBox="0 0 20 32" fill="none">
            <rect x="1" y="1" width="18" height="26" rx="9" stroke="rgba(0,247,255,0.35)" strokeWidth="1.5"/>
            <circle cx="10" cy="9" r="2.5" fill="rgba(0,247,255,0.7)">
              <animate attributeName="cy" values="9;17;9" dur="1.6s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="1;0;1" dur="1.6s" repeatCount="indefinite"/>
            </circle>
            <polyline points="7,29 10,32 13,29" fill="none" stroke="rgba(0,247,255,0.35)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
