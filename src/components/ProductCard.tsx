"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/data/products";
import { useDevice } from "@/lib/deviceContext";
import DynamicPhoneCase from "@/components/DynamicPhoneCase";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { selectedModel } = useDevice();
  const [tiltSide, setTiltSide] = useState<"front" | "left">("front");

  const handleMouseEnter = () => {
    setTiltSide("left");
  };

  const handleMouseLeave = () => {
    setTiltSide("front");
  };

  const handleCardClick = () => {
    router.push(`/product/${product.id}`);
  };

  const displayPrice = product.price || 349;

  return (
    <div
      className="product-card"
      style={{
        borderRadius: "14px",
        backgroundColor: "#ffffff",
        border: "1px solid rgba(0, 0, 0, 0.08)",
        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.04)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Top Phone Case Showcase Container - Hover to Tilt 3D */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
        title="Hover to see 3D side profile"
        style={{
          position: "relative",
          width: "100%",
          padding: "36px 16px 28px",
          backgroundColor: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "visible",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <DynamicPhoneCase
          artworkUrl={product.image}
          phoneModel={selectedModel || "iPhone 16 Pro Max"}
          caseType="9H Tempered Glass Back"
          useGlassMockupOverlay={true}
          width={172}
          height={345}
          interactive={true}
          tiltSide={tiltSide}
          onTiltChange={(t) => setTiltSide(t === "right" ? "left" : t)}
          allowClickToTilt={true}
          showMagSafe={false}
          showModelBadge={false}
          artworkFit={product.artworkFit}
          artworkPosition={product.artworkPosition}
          artworkScale={product.artworkScale}
          artworkOffsetX={product.artworkOffsetX}
          artworkOffsetY={product.artworkOffsetY}
        />
      </div>

      {/* Info Container matching exact layout from reference screenshots */}
      <div
        onClick={handleCardClick}
        style={{
          padding: "0 1.25rem 1.35rem",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "space-between",
          backgroundColor: "#ffffff",
          cursor: "pointer",
        }}
      >
        <div>
          {/* Red Uppercase Label */}
          <div
            style={{
              fontSize: "0.74rem",
              fontWeight: 800,
              color: "#FF2A3A",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            CHOOSE YOUR MODEL INSIDE
          </div>

          {/* Feature Badge Pills: ✨ Glossy Hard & 🛡️ Scratch Proof */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "10px",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 600,
                color: "#374151",
                backgroundColor: "#ffffff",
                border: "1.5px solid #e5e7eb",
                padding: "3px 10px",
                borderRadius: "999px",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span style={{ color: "#f59e0b" }}>✨</span>
              <span>Glossy Hard</span>
            </span>
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 600,
                color: "#374151",
                backgroundColor: "#ffffff",
                border: "1.5px solid #e5e7eb",
                padding: "3px 10px",
                borderRadius: "999px",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span style={{ color: "#6b7280" }}>🛡️</span>
              <span>Scratch Proof</span>
            </span>
          </div>

          {/* Product Title */}
          <h3
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.05rem",
              fontWeight: 700,
              color: "#111827",
              marginBottom: "6px",
              lineHeight: 1.35,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
            }}
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Price Row: Rs. 349.00 in red */}
          <div
            style={{
              fontSize: "1.05rem",
              fontWeight: 800,
              color: "#FF2A3A",
              marginBottom: "6px",
              display: "flex",
              alignItems: "baseline",
              gap: "8px",
            }}
          >
            <span>Rs. {displayPrice}.00</span>
          </div>

          {/* Star Reviews Row: ★★★★★ 9 reviews */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.85rem",
            }}
          >
            <span style={{ color: "#f59e0b", letterSpacing: "1.5px", fontSize: "0.95rem" }}>
              ★★★★★
            </span>
            <span style={{ color: "#4b5563", fontWeight: 600 }}>
              {product.reviewsCount || 13} reviews
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
