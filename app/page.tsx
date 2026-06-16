"use client";
import { useState } from "react";
import Navbar       from "@/app/components/Navbar";
import Hero         from "@/app/components/Hero";
import Rooms        from "@/app/components/Rooms";
import AddOns       from "@/app/components/AddOns";
import Gallery      from "@/app/components/Gallery";
import Pricing      from "@/app/components/Pricing";
import Booking      from "@/app/components/Booking";
import Location     from "@/app/components/Location";
import Footer       from "@/app/components/Footer";
import CartPanel    from "@/app/components/CartPanel";
import ChatWidget   from "@/app/components/ChatWidget";
import FloatActions from "@/app/components/FloatActions";
import KillerZoneIntro from "@/app/components/KillerZoneIntro";

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);
  const open  = () => setChatOpen(true);
  const close = () => setChatOpen(false);

  return (
    <>
      <Navbar onChatOpen={open} />
      <main style={{ position: "relative", zIndex: 1 }}>
        <KillerZoneIntro />
        <Hero     onChatOpen={open} />
        <Rooms />
        <AddOns />
        <Gallery />
        <Pricing />
        <Booking />
        <Location />
      </main>
      <Footer />
      <CartPanel />
      <ChatWidget isOpen={chatOpen} onClose={close} />
      <FloatActions onChatOpen={open} />
    </>
  );
}
