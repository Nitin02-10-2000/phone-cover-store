"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product, PHONE_MODELS } from "@/data/products";
import { useCart } from "@/lib/cartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [selectedFormat, setSelectedFormat] = useState(product.formats[0] || "Ultra Impact MagSafe");
  const [selectedModel, setSelectedModel] = useState("iPhone 16 Pro Max");
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

  return (
    <div
      className="product-card"
      style={{
        borderRadius: "14px",
        backgroundColor: "var(--surface)",
        border: "1px solid var(--surface-border)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Top Phone Case Showcase Container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          padding: "32px 20px 26px",
          backgroundColor: "#07070a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
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
        <Link
          href={`/product/${product.id}`}
          style={{
            position: "relative",
            width: "172px",
            height: "305px",
            borderRadius: "34px",
            backgroundColor: "#18181b",
            border: "3.5px solid #27272a",
            boxShadow: "0 18px 40px rgba(0,0,0,0.85), inset 0 0 0 1px rgba(255,255,255,0.12)",
            overflow: "hidden",
            display: "block",
            textDecoration: "none",
            transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          className="case-silhouette"
        >
          <style jsx>{`
            .product-card:hover .case-silhouette {
              transform: scale(1.04) translateY(-4px);
              box-shadow: 0 22px 50px rgba(0,0,0,0.95), 0 0 25px var(--shinra-red-glow);
              border-color: var(--shinra-red);
            }
          `}</style>

          {/* Graphic Art */}
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="172px"
            style={{ objectFit: "cover" }}
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
                border: "1.5px dashed rgba(255, 255, 255, 0.35)",
                pointerEvents: "none",
              }}
            />
          )}

          {/* Corner Shock Bumper Details */}
          <div style={{ position: "absolute", top: "4px", right: "4px", width: "10px", height: "10px", borderRadius: "50%", background: "rgba(255,255,255,0.15)" }} />
          <div style={{ position: "absolute", bottom: "4px", left: "4px", width: "10px", height: "10px", borderRadius: "50%", background: "rgba(255,255,255,0.15)" }} />
          <div style={{ position: "absolute", bottom: "4px", right: "4px", width: "10px", height: "10px", borderRadius: "50%", background: "rgba(255,255,255,0.15)" }} />
        </Link>

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
          }}
        >
          <span style={{ color: "#22c55e" }}>🛡️</span>
          <span>{product.dropProtection || "12ft Drop Tested"}</span>
        </div>
      </div>

      {/* Info Container */}
      <div style={{ padding: "1.4rem 1.35rem 1.35rem", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
        <div>
          {/* Franchise tag */}
          <div
            style={{
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--shinra-red)",
              marginBottom: "6px",
            }}
          >
            {product.franchise.replace("-", " ")}
          </div>

          {/* Product Title */}
          <Link
            href={`/product/${product.id}`}
            style={{ textDecoration: "none" }}
          >
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.1rem",
                fontWeight: 800,
                color: "var(--foreground)",
                marginBottom: "0.75rem",
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
          </Link>

          {/* Device Model Dropdown */}
          <div style={{ marginBottom: "0.9rem" }}>
            <div style={{ fontSize: "0.72rem", color: "var(--foreground-muted)", marginBottom: "5px", fontWeight: 700 }}>
              COMPATIBLE DEVICE:
            </div>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                backgroundColor: "#0d0d10",
                border: "1px solid var(--surface-border)",
                color: "#ffffff",
                fontSize: "0.82rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <optgroup label="Apple iPhone">
                {PHONE_MODELS[0].models.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Samsung Galaxy">
                {PHONE_MODELS[1].models.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </optgroup>
              <optgroup label="OnePlus">
                {PHONE_MODELS[2].models.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Google Pixel">
                {PHONE_MODELS[3].models.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Case Type Selector Pills */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
              marginBottom: "1rem",
            }}
          >
            {product.formats.map((fmt) => {
              const isSelected = selectedFormat === fmt;
              return (
                <button
                  key={fmt}
                  onClick={() => setSelectedFormat(fmt)}
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    border: isSelected
                      ? "1px solid var(--shinra-red)"
                      : "1px solid var(--surface-border)",
                    backgroundColor: isSelected ? "var(--shinra-red-glow)" : "var(--surface-raised)",
                    color: isSelected ? "var(--shinra-red-bright)" : "var(--foreground-muted)",
                    transition: "all 0.15s",
                  }}
                >
                  {fmt}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          {/* Price Row */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "10px",
              marginBottom: "1rem",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.35rem",
                fontWeight: 900,
                color: "#ffffff",
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
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                padding: "3px 7px",
                borderRadius: "4px",
              }}
            >
              {discountPercent}% OFF
            </span>
          </div>

          {/* Add Case to Cart Button */}
          <button
            onClick={() => addToCart(product, selectedFormat, selectedModel)}
            className="shinra-btn shinra-btn-primary"
            style={{
              width: "100%",
              padding: "0.85rem 1.25rem",
              fontSize: "0.82rem",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span>ADD CASE TO CART</span>
          </button>
        </div>
      </div>
    </div>
  );
}
