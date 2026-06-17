"use client";
import { useEffect, useState } from "react";
import ScrollVideoIntro from "@/app/components/ScrollVideoIntro";

export default function Intro() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null; // avoid SSR/client mismatch
  return <ScrollVideoIntro />;
}
