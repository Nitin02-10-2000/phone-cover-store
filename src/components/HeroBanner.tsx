"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PRODUCTS, PHONE_MODELS } from "@/data/products";
import { useCart } from "@/lib/cartContext";

export default function HeroBanner() {
  const { addToCart } = useCart();
  const [activeCardIndex, setActiveCardIndex] = useState(2); // Center phone case
  const [selectedBrandIndex, setSelectedBrandIndex] = useState(0);
  const [selectedModel, setSelectedModel] = useState(PHONE_MODELS[0].models[0]);

  const showcaseProducts = [
    {
      product: PRODUCTS[0], // Guts
      rotation: -24,
      translateX: -130,
      zIndex: 10,
    },
    {
      product: PRODUCTS[3], // Sukuna
      rotation: -12,
      translateX: -65,
      zIndex: 20,
    },
    {
      product: PRODUCTS[1], // Luffy Gear 5
      rotation: 0,
      translateX: 0,
      zIndex: 30,
    },
    {
      product: PRODUCTS[2], // Gojo
      rotation: 12,
      translateX: 65,
      zIndex: 20,
    },
    {
      product: PRODUCTS[4], // Sung Jin-Woo
      rotation: 24,
      translateX: 130,
      zIndex: 10,
    },
  ];

  return (
    <section
      style={{
        position: "relative",
        minHeight: "92vh",
        backgroundColor: "var(--background)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        padding: "5.5rem 0 4.5rem",
        borderBottom: "1px solid var(--surface-border)",
      }}
    >
      {/* Electric Purple & Hot Pink Mesh Glows */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "650px",
          height: "650px",
          backgroundColor: "rgba(124, 58, 237, 0.14)",
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
          backgroundColor: "rgba(236, 72, 153, 0.12)",
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
            "linear-gradient(rgba(124, 58, 237, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(124, 58, 237, 0.04) 1px, transparent 1px)",
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
                backgroundColor: "rgba(124, 58, 237, 0.1)",
                border: "1px solid rgba(124, 58, 237, 0.3)",
                borderRadius: "20px",
                marginBottom: "1.5rem",
              }}
            >
              <span style={{ fontSize: "0.9rem" }}>🛡️</span>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  letterSpacing: "0.15em",
                  color: "var(--main-accent)",
                  textTransform: "uppercase",
                }}
              >
                12FT MIL-SPEC DROP PROTECTION • MAGSAFE READY
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
              ENGINEERED
              <br />
              <span
                style={{
                  color: "var(--main-accent)",
                  textShadow: "0 0 35px rgba(124, 58, 237, 0.3)",
                }}
              >
                ANIME PHONE ARMOR.
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
              Dual-layer shock dissipation, 1.8mm raised camera protection, and N52 MagSafe magnets. Tested for 12ft concrete drops with zero cracking.
            </p>

            {/* Interactive "Find Your Device" Fast-Finder */}
            <div
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--surface-border)",
                borderRadius: "14px",
                padding: "20px 24px",
                marginBottom: "2.25rem",
                boxShadow: "0 15px 35px rgba(124, 58, 237, 0.08)",
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
                    setSelectedModel(PHONE_MODELS[idx].models[0]);
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
                  onChange={(e) => setSelectedModel(e.target.value)}
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
                    boxShadow: "0 4px 15px rgba(124, 58, 237, 0.35)",
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

          {/* Right Showcase: 3D Phone Cases Fan Stack */}
          <div
            style={{
              position: "relative",
              height: "470px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              userSelect: "none",
            }}
          >
            {showcaseProducts.map((item, index) => {
              const isCenter = index === activeCardIndex;
              return (
                <div
                  key={item.product.id}
                  onClick={() => {
                    setActiveCardIndex(index);
                    addToCart(item.product, "Ultra Impact MagSafe", selectedModel);
                  }}
                  title={`Click to inspect ${item.product.name}`}
                  style={{
                    position: "absolute",
                    width: isCenter ? "220px" : "180px",
                    height: isCenter ? "400px" : "330px",
                    borderRadius: "34px",
                    backgroundColor: "#121214",
                    border: isCenter ? "3.5px solid var(--shinra-red)" : "3px solid #27272a",
                    boxShadow: isCenter
                      ? "0 30px 60px rgba(0, 0, 0, 0.95), 0 0 35px var(--shinra-red-glow)"
                      : "0 20px 40px rgba(0, 0, 0, 0.8)",
                    transform: `translateX(${item.translateX}px) rotate(${item.rotation}deg) translateY(${
                      isCenter ? "-24px" : "0"
                    })`,
                    zIndex: isCenter ? 40 : item.zIndex,
                    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    cursor: "pointer",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Outer Bumper Frame Simulation */}
                  <div style={{ position: "relative", width: "100%", height: "100%" }}>
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      sizes="(max-width: 768px) 180px, 220px"
                      style={{ objectFit: "cover" }}
                      priority={isCenter}
                    />

                    {/* Camera Island Cutout simulation */}
                    <div
                      style={{
                        position: "absolute",
                        top: "14px",
                        left: "14px",
                        width: isCenter ? "56px" : "46px",
                        height: isCenter ? "60px" : "50px",
                        borderRadius: "14px",
                        backgroundColor: "rgba(10, 10, 12, 0.92)",
                        border: "1.5px solid rgba(255, 255, 255, 0.25)",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.6)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "space-around",
                        padding: "4px",
                        zIndex: 2,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                          justifyContent: "space-around",
                        }}
                      >
                        <div
                          style={{
                            width: "12px",
                            height: "12px",
                            borderRadius: "50%",
                            background: "radial-gradient(circle, #2563eb, #000)",
                            border: "1px solid #444",
                          }}
                        />
                        <div
                          style={{
                            width: "12px",
                            height: "12px",
                            borderRadius: "50%",
                            background: "radial-gradient(circle, #2563eb, #000)",
                            border: "1px solid #444",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                          justifyContent: "space-around",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "12px",
                            height: "12px",
                            borderRadius: "50%",
                            background: "radial-gradient(circle, #2563eb, #000)",
                            border: "1px solid #444",
                          }}
                        />
                        <div
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: "#fbbf24",
                          }}
                        />
                      </div>
                    </div>

                    {/* MagSafe Ring Visual Accent on Center Phone Case */}
                    {isCenter && (
                      <div
                        style={{
                          position: "absolute",
                          top: "42%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          width: "90px",
                          height: "90px",
                          borderRadius: "50%",
                          border: "2px dashed rgba(255, 255, 255, 0.4)",
                          pointerEvents: "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: 0.65,
                        }}
                      >
                        <div
                          style={{
                            width: "6px",
                            height: "22px",
                            backgroundColor: "rgba(255, 255, 255, 0.5)",
                            position: "absolute",
                            bottom: "-26px",
                            borderRadius: "3px",
                          }}
                        />
                      </div>
                    )}

                    {/* Quick Add Overlay on active center card */}
                    {isCenter && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          insetInline: 0,
                          background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 70%, transparent 100%)",
                          padding: "20px 12px 14px",
                          textAlign: "center",
                          zIndex: 3,
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.72rem",
                            fontWeight: 800,
                            letterSpacing: "0.08em",
                            color: "#ffffff",
                            textTransform: "uppercase",
                            display: "block",
                            marginBottom: "2px",
                          }}
                        >
                          {item.product.name}
                        </span>
                        <span style={{ fontSize: "0.65rem", color: "#a1a1aa", display: "block", marginBottom: "6px" }}>
                          for {selectedModel}
                        </span>
                        <span
                          style={{
                            backgroundColor: "var(--shinra-red)",
                            color: "#ffffff",
                            fontSize: "0.68rem",
                            fontWeight: 800,
                            padding: "4px 10px",
                            borderRadius: "4px",
                            letterSpacing: "0.1em",
                            display: "inline-block",
                          }}
                        >
                          + QUICK ADD CASE ₹{item.product.price}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
