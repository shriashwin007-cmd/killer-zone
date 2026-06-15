import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/app/context/CartContext";
import { ToastProvider } from "@/app/context/ToastContext";

export const metadata: Metadata = {
  title: "Killer Zone – Luxury Gaming Lounge in Chennai",
  description:
    "A cinematic PS5 lounge in Chennai with themed rooms, neon ambience, snacks, and easy booking.",
};

export const viewport: Viewport = {
  themeColor: "#05070c",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600;700;800;900&family=Rajdhani:wght@500;600;700&family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ToastProvider>
          <CartProvider>{children}</CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
