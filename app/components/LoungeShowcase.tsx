"use client";
import { ContainerScroll } from "@/app/components/ui/container-scroll-animation";

export default function LoungeShowcase() {
  return (
    <section id="lounge" style={{ position: "relative", zIndex: 1, overflow: "hidden" }}>
      <ContainerScroll
        titleComponent={
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 800, fontSize: "0.78rem", letterSpacing: "0.26em", textTransform: "uppercase", color: "#00f7ff", marginBottom: 10 }}>
              Step Inside
            </div>
            <h2 style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 900, fontSize: "clamp(1.8rem,5vw,3.4rem)", lineHeight: 1.05, color: "#f8fbff" }}>
              The <span className="grad">Killer Zone</span> Lounge
            </h2>
            <p style={{ color: "rgba(248,251,255,0.6)", marginTop: 12, lineHeight: 1.6, fontSize: "clamp(0.9rem,1.4vw,1.05rem)" }}>
              Neon-lit bays, premium PS5 setups, and a vibe built for the squad.
            </p>
          </div>
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://res.cloudinary.com/dxvui0xkz/image/upload/v1781542712/gaming_lounge_setup_1_kigpow.png"
          alt="Killer Zone gaming lounge"
          className="mx-auto h-full w-full rounded-2xl object-cover object-center"
          draggable={false}
        />
      </ContainerScroll>
    </section>
  );
}
