"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product, PRODUCTS, PHONE_MODELS } from "@/data/products";
import { useAllProducts } from "@/lib/productsStorage";
import { useCart } from "@/lib/cartContext";
import { useDevice } from "@/lib/deviceContext";

const getMockupOverlayForModel = (modelName?: string) => {
  if (!modelName) return "/mockups/glass_case_iphone_pro.png";
  const lower = modelName.toLowerCase();
  if (lower.includes("ultra")) return "/mockups/glass_case_samsung_ultra.png";
  if (lower.includes("oneplus")) return "/mockups/glass_case_oneplus.png";
  if (lower.includes("iphone 16") && !lower.includes("pro")) return "/mockups/glass_case_iphone_16.png";
  if (lower.includes("iphone 15") || lower.includes("iphone 14") || lower.includes("iphone 13")) {
    return "/mockups/glass_case_iphone_dual.png";
  }
  return "/mockups/glass_case_iphone_pro.png";
};

export default function HeroBanner() {
  const { addToCart } = useCart();
  const { selectedModel: globalModel, setDevice } = useDevice();
  const { products, isCustom } = useAllProducts();
  const [activeCardIndex, setActiveCardIndex] = useState(0); // Active front phone case
  const [selectedBrandIndex, setSelectedBrandIndex] = useState(0);
  const [selectedModel, setSelectedModel] = useState(() => globalModel || PHONE_MODELS[0].models[0]);
  const [isPaused, setIsPaused] = useState(false);
  const [heroFeaturedId, setHeroFeaturedId] = useState<string | null>(null);


  const currentMockupOverlay = getMockupOverlayForModel(selectedModel);

  // Sync featured hero cover ID from storage & events
  useEffect(() => {
    if (typeof window !== "undefined") {
      setHeroFeaturedId(localStorage.getItem("casetadka_hero_featured_id"));

      const handleUpdate = () => {
        setHeroFeaturedId(localStorage.getItem("casetadka_hero_featured_id"));
      };
      window.addEventListener("casetadka_products_changed", handleUpdate);
      window.addEventListener("storage", handleUpdate);
      return () => {
        window.removeEventListener("casetadka_products_changed", handleUpdate);
        window.removeEventListener("storage", handleUpdate);
      };
    }
  }, []);

  const showcaseProducts = React.useMemo(() => {
    const isCustomCase = (p: Product) =>
      Boolean(p.isCustom) || isCustom(p.id) || (p.id.startsWith("case-") && p.id !== "case-tadka-signature-edition");

    const customList = products.filter(isCustomCase);
    const catalogList = products.filter((p) => !isCustomCase(p));
    let ordered = [...customList, ...catalogList];

    // If heroFeaturedId is set, place that product at index 0 (front-and-center)
    if (heroFeaturedId) {
      const match = ordered.find((p) => p.id === heroFeaturedId);
      if (match) {
        ordered = [match, ...ordered.filter((p) => p.id !== heroFeaturedId)];
      }
    }

    // Strictly only 4 covers visible in hero showcase
    const list = ordered.slice(0, 4);
    return list.length > 0 ? list.map((p) => ({ product: p })) : PRODUCTS.slice(0, 4).map((p) => ({ product: p }));
  }, [products, isCustom, heroFeaturedId]);

  // Keep active index in bounds if list changes
  useEffect(() => {
    if (activeCardIndex >= showcaseProducts.length) {
      setActiveCardIndex(0);
    }
  }, [showcaseProducts.length, activeCardIndex]);



  // Auto-cycle through covers every 4 seconds when not paused
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveCardIndex((prev) => (prev + 1) % showcaseProducts.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, showcaseProducts.length]);

  return (
    <section
      style={{
        position: "relative",
        minHeight: "92vh",
        backgroundColor: "var(--background)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        padding: "3.5rem 0 3rem",
        borderBottom: "1px solid var(--surface-border)",
      }}
    >
      {/* Fiery Spicy Red & Golden Saffron Spice Glows */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "650px",
          height: "650px",
          backgroundColor: "rgba(255, 42, 58, 0.16)",
          borderRadius: "50%",
          filter: "blur(140px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          left: "-10%",
          width: "500px",
          height: "500px",
          backgroundColor: "rgba(255, 159, 28, 0.14)",
          borderRadius: "50%",
          filter: "blur(120px)",
          pointerEvents: "none",
        }}
      />

      {/* Cyberpunk grid lines backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255, 42, 58, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 42, 58, 0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 10 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "4rem",
            alignItems: "center",
          }}
          className="hero-grid"
        >
          <style jsx>{`
            @media (min-width: 980px) {
              .hero-grid {
                grid-template-columns: 1.15fr 0.85fr !important;
              }
            }
          `}</style>

          {/* Left Hero Content */}
          <div>
            {/* Limited Time Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 18px",
                backgroundColor: "rgba(255, 42, 58, 0.1)",
                border: "1px solid rgba(255, 42, 58, 0.3)",
                borderRadius: "20px",
                marginBottom: "1.5rem",
              }}
            >
              <span style={{ fontSize: "0.9rem" }}>🌶️</span>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  letterSpacing: "0.15em",
                  color: "var(--main-accent)",
                  textTransform: "uppercase",
                }}
              >
                CASE TADKA • 12FT DROP PROTECTION • MAGSAFE READY
              </span>
            </div>

            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)",
                fontWeight: 900,
                lineHeight: 0.95,
                color: "var(--foreground)",
                letterSpacing: "-0.03em",
                marginBottom: "1.25rem",
                textTransform: "uppercase",
              }}
            >
              GOOD COVERS.
              <br />
              <span
                style={{
                  color: "var(--main-accent)",
                  textShadow: "0 0 35px rgba(255, 42, 58, 0.35)",
                }}
              >
                BETTER VIBES.
              </span>
            </h1>

            <p
              style={{
                fontSize: "clamp(0.95rem, 1.8vw, 1.18rem)",
                fontWeight: 600,
                letterSpacing: "0.02em",
                color: "var(--foreground-muted)",
                marginBottom: "2rem",
                maxWidth: "600px",
                lineHeight: 1.6,
              }}
            >
              Desi vibes, global style. Dual-layer shock dissipation, 1.8mm raised camera protection, and N52 MagSafe magnets. Tested for 12ft concrete drops with zero cracking.
            </p>

            {/* Interactive "Find Your Device" Fast-Finder */}
            <div
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--surface-border)",
                borderRadius: "14px",
                padding: "20px 24px",
                marginBottom: "2.25rem",
                boxShadow: "0 15px 35px rgba(255, 42, 58, 0.08)",
              }}
            >
              <div
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  color: "var(--main-accent)",
                  textTransform: "uppercase",
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>📱</span>
                <span>SELECT YOUR PHONE MODEL TO VIEW COMPATIBLE CASES:</span>
              </div>

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                {/* Brand select */}
                <select
                  value={selectedBrandIndex}
                  onChange={(e) => {
                    const idx = Number(e.target.value);
                    setSelectedBrandIndex(idx);
                    const newModel = PHONE_MODELS[idx].models[0];
                    setSelectedModel(newModel);
                    setDevice(PHONE_MODELS[idx].brand, newModel);
                  }}
                  style={{
                    flex: "1 1 150px",
                    padding: "12px 16px",
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--surface-border)",
                    borderRadius: "8px",
                    color: "var(--foreground)",
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {PHONE_MODELS.map((b, idx) => (
                    <option key={b.brand} value={idx}>
                      {b.brand}
                    </option>
                  ))}
                </select>

                {/* Model select */}
                <select
                  value={selectedModel}
                  onChange={(e) => {
                    const newModel = e.target.value;
                    setSelectedModel(newModel);
                    setDevice(PHONE_MODELS[selectedBrandIndex].brand, newModel);
                  }}
                  style={{
                    flex: "1 1 220px",
                    padding: "12px 16px",
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--surface-border)",
                    borderRadius: "8px",
                    color: "var(--foreground)",
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {PHONE_MODELS[selectedBrandIndex].models.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>

                {/* Go CTA */}
                <Link
                  href={`/shop?device=${encodeURIComponent(selectedModel)}`}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "var(--main-accent)",
                    color: "#ffffff",
                    fontSize: "0.88rem",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    borderRadius: "8px",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow: "0 4px 15px rgba(255, 42, 58, 0.35)",
                  }}
                >
                  <span>BROWSE CASES</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* Tier Pills Box */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "0.85rem",
                marginBottom: "2.25rem",
              }}
            >
              <div
                style={{
                  border: "1px solid var(--surface-border)",
                  backgroundColor: "var(--surface)",
                  padding: "8px 16px",
                  fontSize: "0.82rem",
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                  color: "var(--foreground)",
                  borderRadius: "6px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                }}
              >
                2 CASES: <span style={{ color: "var(--secondary-accent)" }}>10% OFF</span>
              </div>
              <div
                style={{
                  border: "1px solid var(--surface-border)",
                  backgroundColor: "var(--surface)",
                  padding: "8px 16px",
                  fontSize: "0.82rem",
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                  color: "var(--foreground)",
                  borderRadius: "6px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                }}
              >
                3+ CASES: <span style={{ color: "var(--secondary-accent)" }}>15% OFF</span>
              </div>
              <div
                style={{
                  border: "1px solid var(--surface-border)",
                  backgroundColor: "var(--surface)",
                  padding: "8px 16px",
                  fontSize: "0.82rem",
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                  color: "var(--foreground)",
                  borderRadius: "6px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                }}
              >
                5+ CASES: <span style={{ color: "var(--secondary-accent)" }}>20% OFF</span>
              </div>
            </div>

            {/* CTAs */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1.25rem",
              }}
            >
              <a href="#drops" className="shinra-btn shinra-btn-primary">
                <span>EXPLORE ALL CASES</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </a>

              <Link href="/customize" className="shinra-btn shinra-btn-dark">
                <span>⚡ CUSTOM 3D ARMOR STUDIO</span>
              </Link>
            </div>

            <p
              style={{
                fontSize: "0.78rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--foreground-muted)",
              }}
            >
              ⚡ Fast Bluedart Air Delivery pan-India • Free shipping on orders over ₹799
            </p>
          </div>

          {/* Right Showcase: 3D Phone Cases Fan Stack with Auto-Rotation */}
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            style={{
              position: "relative",
              minHeight: "480px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              userSelect: "none",
              overflow: "visible",
              width: "100%",
              maxWidth: "100%",
              paddingTop: "0px",
            }}
          >
            {/* 3D Stage Container */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "430px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                perspective: "1300px",
                transformStyle: "preserve-3d",
                overflow: "visible",
              }}
            >
              {showcaseProducts.map((item, index) => {
                const total = showcaseProducts.length;
                let diff = (index - activeCardIndex + total) % total;
                if (diff > total / 2) {
                  diff -= total;
                }

                const isCenter = diff === 0;

                let translateX = 0;
                let translateY = 0;
                let translateZ = 0;
                let rotateY = 0;
                let rotateZ = 0;
                let scale = 1;
                let zIndex = 10;
                let opacity = 1;
                let pointerEvents: "auto" | "none" = "auto";

                if (isCenter) {
                  translateX = 0;
                  translateY = -8;
                  translateZ = 70;
                  rotateY = -3;
                  rotateZ = -1;
                  scale = 1.04;
                  zIndex = 50;
                  opacity = 1;
                } else if (diff === 1) {
                  translateX = 110;
                  translateY = -2;
                  translateZ = 20;
                  rotateY = -18;
                  rotateZ = 10;
                  scale = 0.94;
                  zIndex = 35;
                  opacity = 0.92;
                } else if (diff === -1) {
                  translateX = -110;
                  translateY = -2;
                  translateZ = 20;
                  rotateY = 18;
                  rotateZ = -10;
                  scale = 0.94;
                  zIndex = 35;
                  opacity = 0.92;
                } else if (diff === 2) {
                  translateX = 185;
                  translateY = 12;
                  translateZ = -30;
                  rotateY = -26;
                  rotateZ = 18;
                  scale = 0.85;
                  zIndex = 20;
                  opacity = 0.75;
                } else if (diff === -2) {
                  translateX = -185;
                  translateY = 12;
                  translateZ = -30;
                  rotateY = 26;
                  rotateZ = -18;
                  scale = 0.85;
                  zIndex = 20;
                  opacity = 0.75;
                } else {
                  // Far background items
                  translateX = diff > 0 ? 220 : -220;
                  translateY = 20;
                  translateZ = -80;
                  rotateY = diff > 0 ? -35 : 35;
                  rotateZ = diff > 0 ? 22 : -22;
                  scale = 0.75;
                  zIndex = 5;
                  opacity = 0;
                  pointerEvents = "none";
                }

                return (
                  <div
                    key={item.product.id}
                    onClick={() => {
                      setActiveCardIndex(index);
                    }}
                    title={`Click to bring ${item.product.name} to front`}
                    style={{
                      position: "absolute",
                      width: isCenter ? "206px" : "176px",
                      height: isCenter ? "422px" : "360px",
                      filter: isCenter
                        ? "drop-shadow(0 28px 55px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 35px var(--tadka-red-glow))"
                        : "drop-shadow(0 18px 38px rgba(0, 0, 0, 0.85))",
                      transform: `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
                      zIndex,
                      opacity,
                      transition: "all 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      pointerEvents,
                    }}
                  >
                    {/* Inner Recessed Artwork Print Bed - strictly inset inside the bumper so edges never extend out */}
                    <div
                      style={{
                        position: "absolute",
                        top: "2.2%",
                        bottom: "3.2%",
                        left: "4.2%",
                        right: "4.2%",
                        borderRadius: isCenter ? "38px" : "32px",
                        overflow: "hidden",
                        background: "radial-gradient(ellipse at center, #1c1d26 0%, #0b0c10 100%)",
                        zIndex: 2,
                      }}
                    >
                      {/* High Resolution Case Artwork */}
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        sizes="(max-width: 768px) 194px, 228px"
                        style={{
                          objectFit: item.product.artworkFit || "cover",
                          objectPosition: item.product.artworkPosition || "center",
                          transform: `scale(${Math.max(1.02, item.product.artworkScale || 1)})`,
                        }}
                        priority={isCenter}
                      />

                      {/* Specular Liquid Glass Sheen & Reflection Glint */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(130deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.08) 22%, transparent 44%, rgba(255,255,255,0.02) 68%, rgba(255,255,255,0.14) 100%)",
                          pointerEvents: "none",
                          zIndex: 4,
                        }}
                      />

                      {/* Subtle Inward Edge Shade to blend under the bumper rim */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          boxShadow: `
                            inset 0 3px 6px rgba(0, 0, 0, 0.9),
                            inset 0 -3px 6px rgba(0, 0, 0, 0.8),
                            inset 3px 0 6px rgba(0, 0, 0, 0.8),
                            inset -3px 0 6px rgba(0, 0, 0, 0.8)
                          `,
                          pointerEvents: "none",
                          zIndex: 5,
                        }}
                      />
                    </div>

                    {/* Authentic Photorealistic Glass Case Frame & Camera Module Overlay (On Top of Artwork) */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        zIndex: 10,
                        pointerEvents: "none",
                      }}
                    >
                      <Image
                        src={currentMockupOverlay}
                        alt="Photorealistic Glass Case Frame"
                        fill
                        sizes="(max-width: 768px) 194px, 228px"
                        style={{ objectFit: "fill" }}
                        priority={isCenter}
                      />
                    </div>

                    {/* MagSafe Magnetic Array Visual on Active Phone Case */}
                    {isCenter && (
                      <div
                        style={{
                          position: "absolute",
                          top: "43%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          width: "92px",
                          height: "92px",
                          borderRadius: "50%",
                          border: "2px solid rgba(255, 255, 255, 0.45)",
                          boxShadow: "0 0 14px rgba(255,255,255,0.2), inset 0 0 8px rgba(255,255,255,0.12)",
                          pointerEvents: "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: 0.65,
                          zIndex: 12,
                        }}
                      >
                        {/* Magnetic Alignment Bar */}
                        <div
                          style={{
                            width: "5px",
                            height: "22px",
                            backgroundColor: "rgba(255, 255, 255, 0.55)",
                            position: "absolute",
                            bottom: "-27px",
                            borderRadius: "3px",
                            boxShadow: "0 0 8px rgba(255,255,255,0.3)",
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Carousel Navigation Indicator Dots */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginTop: "16px",
                zIndex: 10,
              }}
            >
              {showcaseProducts.map((_, dotIdx) => {
                const isActive = dotIdx === activeCardIndex;
                return (
                  <button
                    key={dotIdx}
                    onClick={() => setActiveCardIndex(dotIdx)}
                    aria-label={`Show cover ${dotIdx + 1}`}
                    style={{
                      width: isActive ? "24px" : "8px",
                      height: "8px",
                      borderRadius: "999px",
                      backgroundColor: isActive ? "var(--main-accent)" : "rgba(255, 42, 58, 0.25)",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                      boxShadow: isActive ? "0 0 10px var(--main-accent)" : "none",
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
