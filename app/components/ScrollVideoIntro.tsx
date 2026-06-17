"use client";
import { useEffect, useRef, useState } from "react";

/*
  Apple-style scroll sequence.
  - Cloudinary extracts each frame as a JPG; we preload them all (warm cache).
  - A single <img> with CSS `object-fit: cover` displays the current frame —
    the browser handles coverage natively, so it ALWAYS fills the screen on
    every device with zero math.
  - A continuous rAF loop EASES the shown frame toward the scroll target, so
    motion stays silky even when mobile momentum-scroll fires events sparsely.
*/

const BASE      = "https://res.cloudinary.com/dxvui0xkz/video/upload";
const PUBLIC_ID = "v1781715132/Killer_Zone_Hero_video_pc_igxi2n";
const MP4_META  = `${BASE}/q_auto/${PUBLIC_ID}.mp4`;

const frameUrl = (t: number, w: number) =>
  `${BASE}/so_${t.toFixed(2)},w_${w},c_limit,q_auto/${PUBLIC_ID}.jpg`;

const isMobileDevice = () =>
  typeof window !== "undefined" &&
  (window.matchMedia("(max-width: 768px)").matches ||
    window.matchMedia("(pointer: coarse)").matches);

export default function ScrollVideoIntro() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef       = useRef<HTMLImageElement>(null);
  const overlayRef   = useRef<HTMLDivElement>(null);
  const hintRef      = useRef<HTMLDivElement>(null);

  const srcs          = useRef<string[]>([]);
  const ready         = useRef<boolean[]>([]);
  const shownFrame    = useRef(-1);
  const displayed     = useRef(0);
  const targetFrame   = useRef(0);
  const targetProgress= useRef(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const imgEl     = imgRef.current;
    const overlay   = overlayRef.current;
    const hint      = hintRef.current;
    if (!container || !imgEl || !overlay) return;

    const mobile      = isMobileDevice();
    const FRAME_COUNT = mobile ? 56 : 84;
    const FRAME_W     = mobile ? 768 : 1280;
    const multiplier  = mobile ? 5.0 : 5.5;   // longer scroll = slower
    const ease        = mobile ? 0.1 : 0.14;  // lower = silkier glide
    container.style.height = `${multiplier * 100}vh`;

    let cancelled = false;
    let loaded    = 0;

    // show a frame (cached → instant, no flash)
    const show = (idx: number) => {
      if (idx === shownFrame.current) return;
      if (!ready.current[idx]) return;
      imgEl.src = srcs.current[idx];
      shownFrame.current = idx;
    };

    const onScroll = () => {
      const rect       = container.getBoundingClientRect();
      const scrollable = container.offsetHeight - window.innerHeight;
      const p          = Math.min(1, Math.max(0, -rect.top) / Math.max(1, scrollable));
      targetProgress.current = p;
      targetFrame.current    = p * (FRAME_COUNT - 1);
    };

    const loop = () => {
      if (cancelled) return;

      const d = targetFrame.current - displayed.current;
      displayed.current += d * ease;
      if (Math.abs(d) < 0.001) displayed.current = targetFrame.current;

      show(Math.round(displayed.current));

      const p     = targetProgress.current;
      const FADE  = 0.82;
      const raw   = p > FADE ? (p - FADE) / (1 - FADE) : 0;
      const eased = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;
      overlay.style.opacity = String(eased);
      if (hint) hint.style.opacity = String(Math.max(0, 1 - p * 6));

      requestAnimationFrame(loop);
    };

    const buildFrames = (duration: number) => {
      const safeDur = Math.max(0.1, duration - 0.05);
      srcs.current  = new Array(FRAME_COUNT);
      ready.current = new Array(FRAME_COUNT).fill(false);
      for (let i = 0; i < FRAME_COUNT; i++) {
        const t   = (i / (FRAME_COUNT - 1)) * safeDur;
        const url = frameUrl(t, FRAME_W);
        srcs.current[i] = url;
        const pre = new Image();
        pre.decoding = "async";
        pre.onload = () => {
          ready.current[i] = true;
          loaded++;
          if (!cancelled) setProgress(loaded / FRAME_COUNT);
          if (i === 0) { imgEl.src = url; shownFrame.current = 0; }
        };
        pre.src = url;
      }
    };

    const meta = document.createElement("video");
    meta.preload = "metadata";
    meta.muted   = true;
    meta.onloadedmetadata = () => { if (!cancelled) buildFrames(meta.duration || 5); };
    meta.onerror          = () => { if (!cancelled) buildFrames(5); };
    meta.src = MP4_META;

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    requestAnimationFrame(loop);

    return () => {
      cancelled = true;
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ height: "300vh", position: "relative" }}>
      <div style={{
        position: "sticky", top: 0, height: "100svh",
        overflow: "hidden", background: "#000",
      }}>
        {/* current frame — native object-fit cover guarantees full coverage */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          alt=""
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", display: "block",
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
