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
          padding: "32px 20px 26px",
          backgroundColor: "#ffffff",
          borderBottom: "1px solid var(--surface-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
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

        {/* Realistic Phone Case Mockup Silhouette */}
        <div
          style={{
            position: "relative",
            width: "172px",
            height: "305px",
            borderRadius: "34px",
            backgroundColor: "#18181b",
            border: "3.5px solid #27272a",
            boxShadow: "0 18px 40px rgba(0,0,0,0.22), 0 4px 12px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(0,0,0,0.08)",
            overflow: "hidden",
            display: "block",
            transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            cursor: "pointer",
          }}
          className="case-silhouette"
        >
          <style jsx>{`
            .product-card:hover .case-silhouette {
              transform: scale(1.04) translateY(-4px);
              box-shadow: 0 24px 50px rgba(0,0,0,0.28), 0 0 25px var(--shinra-red-glow);
              border-color: var(--shinra-red);
            }
          `}</style>

          {/* Graphic Art */}
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="172px"
            style={{ objectFit: "cover", pointerEvents: "none" }}
          />

          {/* Glassmorphism / Transparent Case Effect */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.0) 100%)",
              boxShadow: "inset 0 0 15px rgba(255,255,255,0.15)",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />

          {/* Camera Module Bump */}
          <div
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              width: "50px",
              height: "54px",
              borderRadius: "13px",
              backgroundColor: "rgba(12, 12, 14, 0.95)",
              border: "1.5px solid rgba(255, 255, 255, 0.2)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-around",
              padding: "4px",
              zIndex: 3,
              pointerEvents: "none",
            }}
          >
            <div style={{ display: "flex", width: "100%", justifyContent: "space-around" }}>
              <div style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#111", border: "1px solid #444" }} />
              <div style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#111", border: "1px solid #444" }} />
            </div>
            <div style={{ display: "flex", width: "100%", justifyContent: "space-around", alignItems: "center" }}>
              <div style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#111", border: "1px solid #444" }} />
              <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#fbbf24" }} />
            </div>
          </div>

          {/* MagSafe Ring Visual Indicator */}
          {selectedFormat === "Ultra Impact MagSafe" && (
            <div
              style={{
                position: "absolute",
                top: "42%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "74px",
                height: "74px",
                borderRadius: "50%",
                border: "2px solid rgba(255, 255, 255, 0.85)",
                boxShadow: "0 0 8px rgba(255,255,255,0.4), inset 0 0 8px rgba(255,255,255,0.4)",
                pointerEvents: "none",
                zIndex: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "4px",
                  height: "16px",
                  backgroundColor: "rgba(255, 255, 255, 0.85)",
                  position: "absolute",
                  bottom: "-22px",
                  borderRadius: "2px",
                  boxShadow: "0 0 5px rgba(255,255,255,0.4)",
                }}
              />
            </div>
          )}

          {/* Corner Shock Bumper Details */}
          <div style={{ position: "absolute", top: "4px", right: "4px", width: "10px", height: "10px", borderRadius: "50%", background: "rgba(255,255,255,0.15)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "4px", left: "4px", width: "10px", height: "10px", borderRadius: "50%", background: "rgba(255,255,255,0.15)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "4px", right: "4px", width: "10px", height: "10px", borderRadius: "50%", background: "rgba(255,255,255,0.15)", pointerEvents: "none" }} />
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
      <div style={{ padding: "1.35rem 1.35rem 1.2rem", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
        <div>
          {/* Top Row: Franchise Badge & Reviews */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 900,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--shinra-red)",
                backgroundColor: "rgba(229, 9, 20, 0.1)",
                padding: "3px 8px",
                borderRadius: "4px",
              }}
            >
              {product.franchise.replace("-", " ")}
            </span>

            {/* Stars & Reviews */}
            <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.74rem" }}>
              <span style={{ color: "#fbbf24", fontSize: "0.75rem" }}>★</span>
              <span style={{ fontWeight: 800, color: "var(--foreground)" }}>{product.rating || 4.9}</span>
              <span style={{ color: "var(--foreground-muted)", fontSize: "0.68rem" }}>({product.reviewsCount || 350}+)</span>
            </div>
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
