"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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

        {/* Dynamic Phone Case Mockup Silhouette tailored to selected device */}
        <div style={{ position: "relative", width: "172px", height: "350px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <DynamicPhoneCase
            artworkUrl={product.image}
            phoneModel={selectedModel}
            caseType={selectedFormat}
            width={172}
            height={345}
            interactive={true}
          />
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
          {/* Dynamic Model Fit Pill */}
          <div style={{ marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                fontSize: "0.65rem",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#22c55e",
                backgroundColor: "rgba(34, 197, 94, 0.12)",
                padding: "2px 7px",
                borderRadius: "4px",
                border: "1px solid rgba(34, 197, 94, 0.25)",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span>✓</span>
              <span>Fit for {selectedModel}</span>
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
                color: "var(--main-accent)",
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                gap: "3px",
              }}
            >
              <span>View Case</span>
              <span>→</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
