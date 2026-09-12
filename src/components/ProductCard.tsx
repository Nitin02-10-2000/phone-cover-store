"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const [selectedFormat, setSelectedFormat] = useState(product.formats[0] || "Ultra Impact MagSafe");
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Format price adjustments
  const formatMultiplier: Record<string, number> = {
    "Ultra Impact MagSafe": 1.25,
    "Tough Armor Dual-Layer": 1.0,
    "9H Tempered Glass Back": 1.15,
    "Matte Slim EDC": 0.85,
    "Cyber Clear Hologram": 0.95,
  };

  const currentPrice = Math.round(product.price * (formatMultiplier[selectedFormat] || 1));
  const currentOriginalPrice = Math.round(
    product.originalPrice * (formatMultiplier[selectedFormat] || 1)
  );
  const discountPercent = Math.round(
    ((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100
  );

  const handleCardClick = () => {
    router.push(`/product/${product.id}`);
  };

  return (
    <div
      className="product-card"
      onClick={handleCardClick}
      style={{
        borderRadius: "14px",
        backgroundColor: "var(--surface)",
        border: "1px solid var(--surface-border)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        cursor: "pointer",
      }}
    >
      {/* Top Phone Case Showcase Container - Full Click Target to Product Detail Page */}
      <div
        onClick={handleCardClick}
        style={{
          position: "relative",
          width: "100%",
          padding: "36px 20px 30px",
          backgroundColor: "#ffffff",
          borderBottom: "1px solid var(--surface-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "visible",
          cursor: "pointer",
        }}
      >
        {/* Slanted Tag Badge */}
        {product.tag && (
          <div
            style={{
              position: "absolute",
              top: "14px",
              left: "14px",
              zIndex: 15,
              pointerEvents: "none",
            }}
          >
            <div className="shinra-badge shinra-badge-red" style={{ fontSize: "0.68rem" }}>
              <span>{product.tag}</span>
            </div>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          aria-label="Wishlist"
          style={{
            position: "absolute",
            top: "14px",
            right: "14px",
            zIndex: 15,
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            backgroundColor: "rgba(0, 0, 0, 0.65)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            backdropFilter: "blur(4px)",
            transition: "all 0.2s",
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill={isWishlisted ? "var(--shinra-red)" : "none"}
            stroke={isWishlisted ? "var(--shinra-red)" : "#ffffff"}
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Realistic iPhone Pro Max Phone Case Mockup Silhouette with 3D Hover */}
        <div
          style={{
            position: "relative",
            width: "172px",
            height: "350px",
            perspective: "850px",
            cursor: "pointer",
          }}
        >
          {/* Dynamic Cast Shadow Beneath Phone */}
          <div
            className="case-shadow-base"
            style={{
              position: "absolute",
              inset: "8px",
              borderRadius: "36px",
              background: "rgba(0, 0, 0, 0.45)",
              filter: "blur(12px)",
              transform: "translateY(12px) scale(0.92)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

          {/* 3D Rotatable Phone Entity */}
          <div
            className="case-silhouette"
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              transformStyle: "preserve-3d",
              zIndex: 1,
            }}
          >
            {/* Real iPhone Exterior Physical Buttons (Protruding from frame) */}
            {/* Left Action Button */}
            <div style={{ position: "absolute", left: "-3.5px", top: "72px", width: "4px", height: "16px", backgroundColor: "#27272a", borderRadius: "2px 0 0 2px", zIndex: 1 }} />
            {/* Left Volume Up */}
            <div style={{ position: "absolute", left: "-3.5px", top: "100px", width: "4px", height: "30px", backgroundColor: "#27272a", borderRadius: "2px 0 0 2px", zIndex: 1 }} />
            {/* Left Volume Down */}
            <div style={{ position: "absolute", left: "-3.5px", top: "140px", width: "4px", height: "30px", backgroundColor: "#27272a", borderRadius: "2px 0 0 2px", zIndex: 1 }} />
            {/* Right Power / Side Button */}
            <div style={{ position: "absolute", right: "-3.5px", top: "98px", width: "4px", height: "42px", backgroundColor: "#27272a", borderRadius: "0 2px 2px 0", zIndex: 1 }} />

            {/* Back / 3D Extrusion Slices for Solid Gapless Depth */}
            <div style={{ position: "absolute", inset: 0, borderRadius: "36px", backgroundColor: "#121214", border: "2px solid #27272a", transform: "translateZ(-20px)", boxShadow: "-12px 12px 28px rgba(0,0,0,0.55)" }} />
            <div style={{ position: "absolute", inset: 0, borderRadius: "36px", backgroundColor: "#161618", transform: "translateZ(-16px)" }} />
            <div style={{ position: "absolute", inset: 0, borderRadius: "36px", backgroundColor: "#18181b", transform: "translateZ(-12px)" }} />
            <div style={{ position: "absolute", inset: 0, borderRadius: "36px", backgroundColor: "#1c1c20", transform: "translateZ(-8px)" }} />
            <div style={{ position: "absolute", inset: 0, borderRadius: "36px", backgroundColor: "#202024", transform: "translateZ(-4px)" }} />

            {/* 3D Right Bumper Face (Revealed dramatically when turned -46deg to the side) */}
            <div
              className="case-side-face"
              style={{
                position: "absolute",
                top: "26px",
                bottom: "26px",
                right: "0px",
                width: "22px",
                backgroundColor: "#18181b",
                backgroundImage: "linear-gradient(to right, #2c2c31 0%, #1c1c1f 40%, #0d0d0f 100%)",
                transform: "rotateY(-90deg)",
                transformOrigin: "right center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                borderTop: "1px solid #3f3f46",
                borderBottom: "1px solid #3f3f46",
                boxShadow: "inset 2px 0 6px rgba(255,255,255,0.22)",
                zIndex: 2,
              }}
            >
              {/* iPhone Power Button on the bumper */}
              <div
                style={{
                  marginTop: "52px",
                  width: "14px",
                  height: "46px",
                  backgroundColor: "#3f3f46",
                  borderRadius: "3px",
                  border: "1px solid #71717a",
                  boxShadow: "0 0 4px rgba(0,0,0,0.9)",
                }}
              />
              {/* Antenna line */}
              <div style={{ marginTop: "18px", width: "100%", height: "2px", backgroundColor: "#09090b" }} />
              {/* Ribbed grip texture */}
              <div style={{ marginTop: "auto", marginBottom: "40px", display: "flex", flexDirection: "column", gap: "4px", width: "14px" }}>
                <div style={{ height: "2px", backgroundColor: "#27272a", borderRadius: "1px" }} />
                <div style={{ height: "2px", backgroundColor: "#27272a", borderRadius: "1px" }} />
                <div style={{ height: "2px", backgroundColor: "#27272a", borderRadius: "1px" }} />
                <div style={{ height: "2px", backgroundColor: "#27272a", borderRadius: "1px" }} />
                <div style={{ height: "2px", backgroundColor: "#27272a", borderRadius: "1px" }} />
              </div>
            </div>

            {/* Front Face: The Authentic iPhone 15/16 Pro Max Case */}
            <div
              className="case-front"
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "36px",
                backgroundColor: "#121214",
                border: "3px solid #1c1c1e",
                overflow: "hidden",
                transform: "translateZ(0px)",
                transformStyle: "preserve-3d",
                transition: "border-color 0.4s ease, box-shadow 0.4s ease",
                boxShadow: "0 10px 30px rgba(0,0,0,0.22), inset 0 0 0 1px rgba(255,255,255,0.12)",
              }}
            >
              {/* Case Artwork Image */}
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="172px"
                style={{ objectFit: "cover", pointerEvents: "none" }}
              />

              {/* Tempered Glass High-Gloss Diagonal Reflection Streak (like in user screenshot) */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(124deg, transparent 0%, transparent 34%, rgba(255,255,255,0.02) 40%, rgba(255,255,255,0.26) 48%, rgba(255,255,255,0.06) 55%, transparent 68%)",
                  pointerEvents: "none",
                  zIndex: 4,
                }}
              />

              {/* Outer Case Protective Bumper Inner Shadow */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "33px",
                  boxShadow: "inset 0 0 10px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.2)",
                  pointerEvents: "none",
                  zIndex: 3,
                }}
              />

              {/* Authentic iPhone 15/16 Pro Max Camera Island Module */}
              <div
                style={{
                  position: "absolute",
                  top: "13px",
                  left: "13px",
                  width: "66px",
                  height: "72px",
                  borderRadius: "19px",
                  backgroundColor: "rgba(18, 18, 22, 0.94)",
                  backdropFilter: "blur(8px)",
                  border: "2px solid rgba(255, 255, 255, 0.22)",
                  boxShadow: "2px 4px 12px rgba(0, 0, 0, 0.65), inset 0 1px 2px rgba(255, 255, 255, 0.3)",
                  zIndex: 6,
                  pointerEvents: "none",
                  transform: "translateZ(5px)",
                }}
              >
                {/* Lens 1: Top-Left (Large Triple-Lens with Titanium Concentric Rings) */}
                <div
                  style={{
                    position: "absolute",
                    top: "7px",
                    left: "7px",
                    width: "25px",
                    height: "25px",
                    borderRadius: "50%",
                    background: "conic-gradient(from 45deg, #71717a, #e4e4e7, #52525b, #a1a1aa, #3f3f46, #e4e4e7, #71717a)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
                  }}
                >
                  <div
                    style={{
                      width: "21px",
                      height: "21px",
                      borderRadius: "50%",
                      background: "#09090b",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid #27272a",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        background: "radial-gradient(circle at 35% 35%, #1e3a8a 0%, #030712 75%)",
                        boxShadow: "inset 0 0 3px rgba(56, 189, 248, 0.5)",
                      }}
                    >
                      {/* Specular Glint */}
                      <div
                        style={{
                          position: "absolute",
                          top: "3px",
                          left: "4px",
                          width: "3.5px",
                          height: "3.5px",
                          borderRadius: "50%",
                          backgroundColor: "#ffffff",
                          opacity: 0.9,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Lens 2: Bottom-Left */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "7px",
                    left: "7px",
                    width: "25px",
                    height: "25px",
                    borderRadius: "50%",
                    background: "conic-gradient(from 45deg, #71717a, #e4e4e7, #52525b, #a1a1aa, #3f3f46, #e4e4e7, #71717a)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
                  }}
                >
                  <div
                    style={{
                      width: "21px",
                      height: "21px",
                      borderRadius: "50%",
                      background: "#09090b",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid #27272a",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        background: "radial-gradient(circle at 35% 35%, #1e3a8a 0%, #030712 75%)",
                        boxShadow: "inset 0 0 3px rgba(56, 189, 248, 0.5)",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: "3px",
                          left: "4px",
                          width: "3.5px",
                          height: "3.5px",
                          borderRadius: "50%",
                          backgroundColor: "#ffffff",
                          opacity: 0.9,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Lens 3: Right-Center */}
                <div
                  style={{
                    position: "absolute",
                    top: "23.5px",
                    right: "6.5px",
                    width: "25px",
                    height: "25px",
                    borderRadius: "50%",
                    background: "conic-gradient(from 45deg, #71717a, #e4e4e7, #52525b, #a1a1aa, #3f3f46, #e4e4e7, #71717a)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
                  }}
                >
                  <div
                    style={{
                      width: "21px",
                      height: "21px",
                      borderRadius: "50%",
                      background: "#09090b",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid #27272a",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        background: "radial-gradient(circle at 35% 35%, #1e3a8a 0%, #030712 75%)",
                        boxShadow: "inset 0 0 3px rgba(56, 189, 248, 0.5)",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: "3px",
                          left: "4px",
                          width: "3.5px",
                          height: "3.5px",
                          borderRadius: "50%",
                          backgroundColor: "#ffffff",
                          opacity: 0.9,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* True Tone Amber Flash */}
                <div
                  style={{
                    position: "absolute",
                    top: "8.5px",
                    right: "13px",
                    width: "11px",
                    height: "11px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, #fffbeb 20%, #fbbf24 65%, #b45309 100%)",
                    border: "1px solid rgba(255, 255, 255, 0.35)",
                    boxShadow: "0 0 3px rgba(251, 191, 36, 0.5)",
                  }}
                />

                {/* LiDAR Sensor */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "9px",
                    right: "14px",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "#050507",
                    border: "1px solid #27272a",
                    boxShadow: "inset 0 0 2px #000000",
                  }}
                />

                {/* Mic hole */}
                <div
                  style={{
                    position: "absolute",
                    top: "35px",
                    right: "2.5px",
                    width: "2.5px",
                    height: "2.5px",
                    borderRadius: "50%",
                    backgroundColor: "#000000",
                  }}
                />
              </div>


              {/* Corner Shock Bumper Air-Cushions */}
              <div style={{ position: "absolute", top: "5px", right: "5px", width: "9px", height: "9px", borderRadius: "50%", background: "rgba(255,255,255,0.12)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: "5px", left: "5px", width: "9px", height: "9px", borderRadius: "50%", background: "rgba(255,255,255,0.12)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: "5px", right: "5px", width: "9px", height: "9px", borderRadius: "50%", background: "rgba(255,255,255,0.12)", pointerEvents: "none" }} />
            </div>
          </div>
        </div>

        {/* Drop Protection badge */}
        <div
          style={{
            position: "absolute",
            bottom: "12px",
            right: "12px",
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(4px)",
            padding: "4px 10px",
            borderRadius: "6px",
            fontSize: "0.7rem",
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            gap: "5px",
            color: "#ffffff",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          <span style={{ color: "#22c55e" }}>🛡️</span>
          <span>{product.dropProtection || "12ft Drop Tested"}</span>
        </div>
      </div>

      {/* Info Container */}
      <div style={{ padding: "1.2rem 1.25rem 1.1rem", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
        <div>
          {/* Tagline: CHOOSE YOUR MODEL INSIDE (Matching user screenshot) */}
          <div style={{ marginBottom: "6px" }}>
            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: 900,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--shinra-red)",
              }}
            >
              CHOOSE YOUR MODEL INSIDE
            </span>
          </div>

          {/* Feature Badge Pills: ✨ Glossy Hard & 🛡️ Scratch Proof */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: 700,
                color: "var(--foreground)",
                backgroundColor: "var(--accent-glow)",
                border: "1px solid var(--surface-border)",
                padding: "2px 8px",
                borderRadius: "999px",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span>✨</span>
              <span>Glossy Hard</span>
            </span>
            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: 700,
                color: "var(--foreground)",
                backgroundColor: "var(--accent-glow)",
                border: "1px solid var(--surface-border)",
                padding: "2px 8px",
                borderRadius: "999px",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span>🛡️</span>
              <span>Scratch Proof</span>
            </span>
          </div>

          {/* Product Title */}
          <Link
            href={`/product/${product.id}`}
            style={{ textDecoration: "none" }}
          >
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.08rem",
                fontWeight: 800,
                color: "var(--foreground)",
                marginBottom: "0.5rem",
                lineHeight: 1.35,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                cursor: "pointer",
              }}
              title={product.name}
            >
              {product.name}
            </h3>
          </Link>

          {/* Story / Description snippet */}
          <p
            style={{
              fontSize: "0.78rem",
              color: "var(--foreground-muted)",
              lineHeight: 1.45,
              marginBottom: "1rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {product.description}
          </p>
        </div>

        <div>
          {/* Price Row */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "10px",
              marginBottom: "0.75rem",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.35rem",
                fontWeight: 900,
                color: "var(--foreground)",
              }}
            >
              ₹{currentPrice}
            </span>
            <span
              style={{
                fontSize: "0.88rem",
                fontWeight: 500,
                textDecoration: "line-through",
                color: "var(--foreground-muted)",
              }}
            >
              ₹{currentOriginalPrice}
            </span>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 800,
                color: "#22c55e",
                backgroundColor: "rgba(34, 197, 94, 0.12)",
                padding: "3px 7px",
                borderRadius: "4px",
              }}
            >
              {discountPercent}% OFF
            </span>
          </div>

          {/* Card Footer: Shipping & Interactive CTA prompt */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "0.75rem",
              borderTop: "1px solid var(--surface-border)",
              fontSize: "0.72rem",
              color: "var(--foreground-muted)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <span>🚚</span>
              <span>Free Pan-India Delivery</span>
            </div>
            <div
              style={{
                color: "var(--shinra-red)",
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                gap: "3px",
              }}
            >
              <span>Customize</span>
              <span>→</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
