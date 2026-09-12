import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "@/lib/cartContext";
import { DeviceProvider } from "@/lib/deviceContext";
import DevicePickerModal from "@/components/DevicePickerModal";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

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
  title: "Case Tadka — Good Covers. Better Vibes. | Desi Vibes. Global Style.",
  description:
    "Shop premium phone covers, custom 3D armor, and impact cases at Case Tadka. Good Covers, Better Vibes. 12ft drop protection, MagSafe ready, 9H tempered glass for iPhone, Samsung, OnePlus & Pixel. Desi Vibes. Global Style.",
  icons: {
    icon: "/case-tadka-logo.png",
    apple: "/case-tadka-logo.png",
  },
  keywords: [
    "case tadka",
    "case tadka phone covers",
    "good covers better vibes",
    "desi vibes global style",
    "anime phone cases",
    "custom phone cover",
    "magsafe phone cases",
    "phone cover store india",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${inter.variable} antialiased`}>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('casetadka_theme') || localStorage.getItem('hachiman_theme') || 'dark';
                document.documentElement.setAttribute('data-theme', theme);
              } catch (_) {}
            `,
          }}
        />
        <CartProvider>
          <DeviceProvider>
            {children}
            <DevicePickerModal />
          </DeviceProvider>
        </CartProvider>
      </body>
    </html>
  );
}
