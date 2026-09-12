"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { PRODUCTS, PHONE_MODELS } from "@/data/products";
import { useCart } from "@/lib/cartContext";
import { useDevice } from "@/lib/deviceContext";

export default function HeroBanner() {
  const { addToCart } = useCart();
  const { selectedModel: globalModel, setDevice } = useDevice();
  const [activeCardIndex, setActiveCardIndex] = useState(0); // Active front phone case
  const [selectedBrandIndex, setSelectedBrandIndex] = useState(0);
  const [selectedModel, setSelectedModel] = useState(() => globalModel || PHONE_MODELS[0].models[0]);
  const [isPaused, setIsPaused] = useState(false);

  const showcaseProducts = [
    { product: PRODUCTS[0] }, // Cover 1: Cyber Anime
    { product: PRODUCTS[1] }, // Cover 2: Streetwear Anime Boy
    { product: PRODUCTS[2] }, // Cover 3: Miya Moonlight Archer
    { product: PRODUCTS[3] }, // Cover 4: Dark Ninja Crimson Eye
  ];

  // Auto-cycle through covers every 3.5 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveCardIndex((prev) => (prev + 1) % showcaseProducts.length);
    }, 3500);

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

          {/* Right Showcase: 3D Phone Cases Fan Stack with Auto-Rotation */}
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            style={{
              position: "relative",
              minHeight: "490px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              userSelect: "none",
            }}
          >
            {/* 3D Stage Container */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "450px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                perspective: "1300px",
                transformStyle: "preserve-3d",
              }}
            >
              {showcaseProducts.map((item, index) => {
                const total = showcaseProducts.length;
                let diff = (index - activeCardIndex + total) % total;
                if (diff > total / 2) {
                  diff -= total; // values: [-1, 0, 1, 2]
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

                if (isCenter) {
                  translateX = 0;
                  translateY = -28;
                  translateZ = 60;
                  rotateY = -3;
                  rotateZ = -1;
                  scale = 1.06;
                  zIndex = 50;
                  opacity = 1;
                } else if (diff === 1) {
                  translateX = 100;
                  translateY = -2;
                  translateZ = 15;
                  rotateY = -18;
                  rotateZ = 10;
                  scale = 0.94;
                  zIndex = 35;
                  opacity = 0.92;
                } else if (diff === -1) {
                  translateX = -100;
                  translateY = -2;
                  translateZ = 15;
                  rotateY = 18;
                  rotateZ = -10;
                  scale = 0.94;
                  zIndex = 35;
                  opacity = 0.92;
                } else {
                  // diff === 2
                  translateX = 175;
                  translateY = 14;
                  translateZ = -35;
                  rotateY = -25;
                  rotateZ = 18;
                  scale = 0.86;
                  zIndex = 20;
                  opacity = 0.8;
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
                      width: isCenter ? "228px" : "194px",
                      height: isCenter ? "410px" : "350px",
                      borderRadius: "38px",
                      backgroundColor: "#0d0d10",
                      border: isCenter ? "3px solid var(--main-accent)" : "2px solid rgba(255, 255, 255, 0.2)",
                      boxShadow: isCenter
                        ? "0 35px 70px -10px rgba(0, 0, 0, 0.95), 0 15px 30px rgba(0,0,0,0.8), 0 0 35px var(--hachiman-purple-glow), inset 0 0 0 1.5px rgba(255,255,255,0.2)"
                        : "0 25px 50px -10px rgba(0, 0, 0, 0.85), inset 0 0 0 1px rgba(255,255,255,0.12)",
                      transform: `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
                      zIndex,
                      opacity,
                      transition: "all 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* Realistic Physical Side Buttons (Modeled on phone case edge) */}
                    {/* Right: Power / Lock Button */}
                    <div
                      style={{
                        position: "absolute",
                        right: "-4px",
                        top: isCenter ? "115px" : "95px",
                        width: "4px",
                        height: isCenter ? "46px" : "38px",
                        backgroundColor: "#3f3f46",
                        borderRadius: "0 3px 3px 0",
                        boxShadow: "1px 0 3px rgba(0,0,0,0.6)",
                        pointerEvents: "none",
                        zIndex: 1,
                      }}
                    />

                    {/* Left: Action Button */}
                    <div
                      style={{
                        position: "absolute",
                        left: "-4px",
                        top: isCenter ? "75px" : "62px",
                        width: "4px",
                        height: isCenter ? "22px" : "18px",
                        backgroundColor: "#3f3f46",
                        borderRadius: "3px 0 0 3px",
                        boxShadow: "-1px 0 3px rgba(0,0,0,0.6)",
                        pointerEvents: "none",
                        zIndex: 1,
                      }}
                    />

                    {/* Left: Volume Up Button */}
                    <div
                      style={{
                        position: "absolute",
                        left: "-4px",
                        top: isCenter ? "112px" : "92px",
                        width: "4px",
                        height: isCenter ? "36px" : "30px",
                        backgroundColor: "#3f3f46",
                        borderRadius: "3px 0 0 3px",
                        boxShadow: "-1px 0 3px rgba(0,0,0,0.6)",
                        pointerEvents: "none",
                        zIndex: 1,
                      }}
                    />

                    {/* Left: Volume Down Button */}
                    <div
                      style={{
                        position: "absolute",
                        left: "-4px",
                        top: isCenter ? "156px" : "130px",
                        width: "4px",
                        height: isCenter ? "36px" : "30px",
                        backgroundColor: "#3f3f46",
                        borderRadius: "3px 0 0 3px",
                        boxShadow: "-1px 0 3px rgba(0,0,0,0.6)",
                        pointerEvents: "none",
                        zIndex: 1,
                      }}
                    />

                    {/* Outer Bumper Frame & Inner Bevel Shadow */}
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        borderRadius: "34px",
                        overflow: "hidden",
                        backgroundColor: "#111114",
                      }}
                    >
                      {/* High Resolution Case Artwork */}
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        sizes="(max-width: 768px) 194px, 228px"
                        style={{ objectFit: "cover" }}
                        priority={isCenter}
                      />

                      {/* Specular Liquid Glass Sheen & Reflection Glint */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(130deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.12) 22%, transparent 44%, rgba(255,255,255,0.03) 68%, rgba(255,255,255,0.18) 100%)",
                          pointerEvents: "none",
                          zIndex: 4,
                          borderRadius: "34px",
                        }}
                      />

                      {/* Protective Raised Lip & Inner Bezel Shadow */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          boxShadow: "inset 0 0 0 2px rgba(18, 18, 22, 0.9), inset 0 0 10px rgba(0, 0, 0, 0.7)",
                          borderRadius: "34px",
                          pointerEvents: "none",
                          zIndex: 5,
                        }}
                      />

                      {/* Ultra-Realistic Flagship Pro Camera Plateau Island */}
                      <div
                        style={{
                          position: "absolute",
                          top: isCenter ? "14px" : "12px",
                          left: isCenter ? "14px" : "12px",
                          width: isCenter ? "72px" : "62px",
                          height: isCenter ? "76px" : "66px",
                          borderRadius: "22px",
                          background: "linear-gradient(145deg, rgba(24, 24, 28, 0.96), rgba(10, 10, 12, 0.98))",
                          border: "1.5px solid rgba(255, 255, 255, 0.22)",
                          boxShadow: "0 8px 18px rgba(0, 0, 0, 0.65), inset 0 1px 1.5px rgba(255, 255, 255, 0.35)",
                          zIndex: 6,
                        }}
                      >
                        {/* Lens 1 (Top-Left Main Camera) */}
                        <div
                          style={{
                            position: "absolute",
                            top: isCenter ? "9px" : "8px",
                            left: isCenter ? "9px" : "8px",
                            width: isCenter ? "23px" : "20px",
                            height: isCenter ? "23px" : "20px",
                            borderRadius: "50%",
                            border: "2px solid #52525b",
                            background: "radial-gradient(circle at 35% 35%, #1e3a8a 0%, #030712 75%)",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.8), inset 0 1px 1.5px rgba(255,255,255,0.4)",
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              top: "3px",
                              left: "3px",
                              width: "4px",
                              height: "4px",
                              borderRadius: "50%",
                              backgroundColor: "#ffffff",
                              opacity: 0.85,
                            }}
                          />
                        </div>

                        {/* Lens 2 (Bottom-Left Ultra-Wide Camera) */}
                        <div
                          style={{
                            position: "absolute",
                            bottom: isCenter ? "9px" : "8px",
                            left: isCenter ? "9px" : "8px",
                            width: isCenter ? "23px" : "20px",
                            height: isCenter ? "23px" : "20px",
                            borderRadius: "50%",
                            border: "2px solid #52525b",
                            background: "radial-gradient(circle at 35% 35%, #1e3a8a 0%, #030712 75%)",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.8), inset 0 1px 1.5px rgba(255,255,255,0.4)",
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              top: "3px",
                              left: "3px",
                              width: "4px",
                              height: "4px",
                              borderRadius: "50%",
                              backgroundColor: "#ffffff",
                              opacity: 0.85,
                            }}
                          />
                        </div>

                        {/* Lens 3 (Center-Right Telephoto Periscope Camera) */}
                        <div
                          style={{
                            position: "absolute",
                            top: isCenter ? "26px" : "23px",
                            right: isCenter ? "9px" : "8px",
                            width: isCenter ? "23px" : "20px",
                            height: isCenter ? "23px" : "20px",
                            borderRadius: "50%",
                            border: "2px solid #52525b",
                            background: "radial-gradient(circle at 35% 35%, #1e3a8a 0%, #030712 75%)",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.8), inset 0 1px 1.5px rgba(255,255,255,0.4)",
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              top: "3px",
                              left: "3px",
                              width: "4px",
                              height: "4px",
                              borderRadius: "50%",
                              backgroundColor: "#ffffff",
                              opacity: 0.85,
                            }}
                          />
                        </div>

                        {/* Quad-LED True Tone Flash (Top-Right) */}
                        <div
                          style={{
                            position: "absolute",
                            top: isCenter ? "11px" : "9px",
                            right: isCenter ? "14px" : "12px",
                            width: isCenter ? "11px" : "9px",
                            height: isCenter ? "11px" : "9px",
                            borderRadius: "50%",
                            background: "radial-gradient(circle, #fef08a 25%, #d97706 80%, #78350f 100%)",
                            border: "1px solid rgba(0,0,0,0.6)",
                            boxShadow: "0 0 6px rgba(254, 240, 138, 0.4)",
                          }}
                        />

                        {/* LiDAR Scanner Sensor (Bottom-Right) */}
                        <div
                          style={{
                            position: "absolute",
                            bottom: isCenter ? "12px" : "10px",
                            right: isCenter ? "14px" : "12px",
                            width: isCenter ? "10px" : "8px",
                            height: isCenter ? "10px" : "8px",
                            borderRadius: "50%",
                            background: "radial-gradient(circle, #09090b 60%, #27272a 100%)",
                            border: "1px solid #3f3f46",
                          }}
                        />

                        {/* Audio Microphone Hole */}
                        <div
                          style={{
                            position: "absolute",
                            top: isCenter ? "37px" : "32px",
                            right: isCenter ? "36px" : "31px",
                            width: "3px",
                            height: "3px",
                            borderRadius: "50%",
                            backgroundColor: "#09090b",
                          }}
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
                            width: "96px",
                            height: "96px",
                            borderRadius: "50%",
                            border: "2px solid rgba(255, 255, 255, 0.45)",
                            boxShadow: "0 0 14px rgba(255,255,255,0.2), inset 0 0 8px rgba(255,255,255,0.12)",
                            pointerEvents: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: 0.7,
                            zIndex: 4,
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
                marginTop: "18px",
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
                      backgroundColor: isActive ? "var(--main-accent)" : "rgba(124, 58, 237, 0.25)",
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
