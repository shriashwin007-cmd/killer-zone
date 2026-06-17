"use client";
import { useEffect, useState } from "react";
import ScrollVideoIntro from "@/app/components/ScrollVideoIntro";

/*
  Scroll-video intro for BOTH desktop and mobile — ScrollVideoIntro picks the
  right per-device video internally. We just wait until after mount (client
  only) to render it, avoiding an SSR/client mismatch and the wrong-device
  video flashing before the media query resolves.
*/
export default function Intro() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  return <ScrollVideoIntro />;
}
