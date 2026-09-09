import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cartContext";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "HACHIMAN — Best Anime Phone Cases & Armor in India | Premium Streetwear & Tech",
  description:
    "Shop premium anime phone cases, military drop protection armor, and wall art in India. MagSafe, 9H tempered glass, tough dual-layer cases for iPhone, Samsung & OnePlus. Pan-India shipping.",
  keywords: [
    "anime phone cases",
    "hachiman phone cases",
    "anime posters",
    "magsafe anime cases",
    "one piece phone cases",
    "jujutsu kaisen phone cases",
    "berserk phone case",
    "india anime merch",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.variable} ${inter.variable} antialiased`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
