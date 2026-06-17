"use client";
import { useEffect, useState } from "react";
import ScrollVideoIntro from "@/app/components/ScrollVideoIntro";

/*
  The PlayStation scroll-video intro is DESKTOP ONLY.
  On phones it's skipped entirely (no heavy video, no scroll-scrub) — mobile
  users go straight to the hero. Renders nothing on first paint to avoid an
  SSR/client mismatch, then mounts the video only on desktop.
*/
export default function Intro() {
  const [mode, setMode] = useState<"loading" | "desktop" | "mobile">("loading");

  useEffect(() => {
    const mobile =
      window.matchMedia("(max-width: 768px)").matches ||
      window.matchMedia("(pointer: coarse)").matches;
    setMode(mobile ? "mobile" : "desktop");
  }, []);

  if (mode !== "desktop") return null; // mobile + first paint → nothing
  return <ScrollVideoIntro />;
}
