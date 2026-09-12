"use client";

import React, { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SearchModal from "@/components/SearchModal";
import ProductCard from "@/components/ProductCard";
import { PRODUCTS, PHONE_MODELS, CASE_TYPES, CASE_ANATOMY } from "@/data/products";
import { useCart } from "@/lib/cartContext";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { addToCart } = useCart();

  const product = PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];

  const [selectedCaseType, setSelectedCaseType] = useState(CASE_TYPES[0].name);
  const [selectedBrand, setSelectedBrand] = useState("Apple iPhone");
  const [selectedModel, setSelectedModel] = useState("iPhone 16 Pro Max");
  const [lensProtectorAddon, setLensProtectorAddon] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"specs" | "compatibility" | "reviews">("specs");

  // Dynamic price calculation
  const caseTypeObj = CASE_TYPES.find(
    (c) => c.name.toLowerCase() === selectedCaseType.toLowerCase()
  ) || CASE_TYPES[0];

  const basePrice = caseTypeObj.basePrice;
  const unitPrice = (basePrice + (lensProtectorAddon ? 149 : 0)) * quantity;
  const singleUnitPrice = basePrice + (lensProtectorAddon ? 149 : 0);
  const originalPrice = Math.round(singleUnitPrice * 1.85) * quantity;

  const handleAddToCart = () => {
    addToCart(
      {
        ...product,
        name: `${product.name} — ${selectedCaseType}${lensProtectorAddon ? " (+ Lens Guard)" : ""}`,
        price: singleUnitPrice,
      },
      selectedCaseType,
      selectedModel
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <CartDrawer />
      <SearchModal />

      <main style={{ flex: 1, paddingBottom: "6rem" }}>
        {/* Breadcrumb Bar */}
        <div
          style={{
            backgroundColor: "var(--surface)",
            borderBottom: "1px solid var(--surface-border)",
            padding: "1.25rem 0",
          }}
        >
          <div
            className="container"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              fontSize: "0.8rem",
              color: "var(--foreground-muted)",
              fontFamily: "var(--font-heading)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            <Link href="/" style={{ color: "var(--foreground-muted)", textDecoration: "none" }}>
              Home
            </Link>
            <span>/</span>
            <Link href="/shop" style={{ color: "var(--foreground-muted)", textDecoration: "none" }}>
              Phone Cases
            </Link>
            <span>/</span>
            <span style={{ color: "var(--shinra-red)", fontWeight: 700 }}>{product.name}</span>
          </div>
        </div>

        {/* Main Product Details Section */}
        <section className="container" style={{ marginTop: "3.5rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
              gap: "4.5rem",
              alignItems: "start",
            }}
          >
            {/* Left Column: Phone Case Showcase Mockup */}
            <div style={{ position: "sticky", top: "110px" }}>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  minHeight: "560px",
                  backgroundColor: "var(--background)",
                  borderRadius: "20px",
                  overflow: "hidden",
                  border: "1px solid var(--surface-border)",
                  boxShadow: "0 15px 40px rgba(0,0,0,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "48px 32px",
                }}
              >
                {/* 3D Phone Case Frame Silhouette */}
                <div
                  style={{
                    position: "relative",
                    width: "260px",
                    height: "470px",
                    borderRadius: "40px",
                    backgroundColor: "#18181b",
                    border: "4.5px solid #27272a",
                    boxShadow: "0 25px 60px rgba(0,0,0,0.95), inset 0 0 0 1.5px rgba(255,255,255,0.18)",
                    overflow: "hidden",
                    transition: "transform 0.3s ease",
                  }}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="260px"
                    style={{ objectFit: "cover" }}
                    priority
                  />

                  {/* Glassmorphism / Transparent Case Effect */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.0) 100%)",
                      boxShadow: "inset 0 0 25px rgba(255,255,255,0.15)",
                      pointerEvents: "none",
                      zIndex: 2,
                    }}
                  />

                  {/* Camera Bump Cutout */}
                  <div
                    style={{
                      position: "absolute",
                      top: "16px",
                      left: "16px",
                      width: "68px",
                      height: "74px",
                      borderRadius: "16px",
                      backgroundColor: "rgba(10, 10, 12, 0.95)",
                      border: lensProtectorAddon ? "2px solid #22c55e" : "1.5px solid rgba(255, 255, 255, 0.25)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "space-around",
                      padding: "6px",
                      zIndex: 3,
                      boxShadow: "0 6px 16px rgba(0,0,0,0.7)",
                    }}
                  >
                    <div style={{ display: "flex", width: "100%", justifyContent: "space-around" }}>
                      <div style={{ width: "15px", height: "15px", borderRadius: "50%", background: "radial-gradient(circle, #2563eb, #000)", border: "1px solid #444" }} />
                      <div style={{ width: "15px", height: "15px", borderRadius: "50%", background: "radial-gradient(circle, #2563eb, #000)", border: "1px solid #444" }} />
                    </div>
                    <div style={{ display: "flex", width: "100%", justifyContent: "space-around", alignItems: "center" }}>
                      <div style={{ width: "15px", height: "15px", borderRadius: "50%", background: "radial-gradient(circle, #2563eb, #000)", border: "1px solid #444" }} />
                      <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#fbbf24" }} />
                    </div>
                  </div>

                  {/* MagSafe Ring Highlight when Ultra MagSafe active */}
                  {selectedCaseType.toLowerCase().includes("magsafe") && (
                    <div
                      style={{
                        position: "absolute",
                        top: "44%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        border: "3px solid rgba(255, 255, 255, 0.85)",
                        boxShadow: "0 0 12px rgba(255,255,255,0.4), inset 0 0 12px rgba(255,255,255,0.4)",
                        pointerEvents: "none",
                        zIndex: 4,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "6px",
                          height: "26px",
                          backgroundColor: "rgba(255, 255, 255, 0.85)",
                          position: "absolute",
                          bottom: "-34px",
                          borderRadius: "3px",
                          boxShadow: "0 0 8px rgba(255,255,255,0.4)",
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Drop Rating Pill */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "20px",
                    left: "20px",
                    zIndex: 10,
                    backgroundColor: "rgba(0,0,0,0.85)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "#ffffff",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    padding: "6px 14px",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  <span style={{ color: "#22c55e", fontSize: "0.9rem" }}>🛡️</span>
                  <span>12FT MIL-SPEC DROP CERTIFIED</span>
                </div>
              </div>

              {/* Quality Guarantee Mini Badges */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "1rem",
                  marginTop: "1.75rem",
                }}
              >
                <div
                  style={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--surface-border)",
                    borderRadius: "10px",
                    padding: "1.1rem 0.85rem",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "1.35rem", marginBottom: "4px" }}>🛡️</div>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" }}>
                    Lifetime Print Guarantee
                  </div>
                </div>
                <div
                  style={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--surface-border)",
                    borderRadius: "10px",
                    padding: "1.1rem 0.85rem",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "1.35rem", marginBottom: "4px" }}>🧲</div>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" }}>
                    Strong MagSafe Array
                  </div>
                </div>
                <div
                  style={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--surface-border)",
                    borderRadius: "10px",
                    padding: "1.1rem 0.85rem",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "1.35rem", marginBottom: "4px" }}>🚀</div>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" }}>
                    24h Bluedart Air
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Options & Checkout Configuration */}
            <div>
              {/* Franchise & Tag */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.6rem" }}>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    letterSpacing: "0.15em",
                    color: "var(--shinra-red)",
                    textTransform: "uppercase",
                  }}
                >
                  {product.franchise.replace("-", " ")} ANIME ARMOR
                </span>
                <span style={{ color: "var(--surface-border)" }}>•</span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "var(--foreground-muted)",
                    textTransform: "uppercase",
                  }}
                >
                  {product.tag}
                </span>
              </div>

              {/* Title */}
              <h1
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)",
                  fontWeight: 900,
                  letterSpacing: "0.02em",
                  lineHeight: 1.25,
                  marginBottom: "1rem",
                }}
              >
                {product.name}
              </h1>

              {/* Rating and Reviews count */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  marginBottom: "1.25rem",
                  fontSize: "0.88rem",
                }}
              >
                <span style={{ color: "#fbbf24", letterSpacing: "2px" }}>★★★★★</span>
                <span style={{ fontWeight: 800 }}>{product.rating}</span>
                <span style={{ color: "var(--foreground-muted)" }}>({product.reviewsCount} verified drop test reviews)</span>
              </div>

              {/* Core Armor Features & Compatibility Badges */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginBottom: "1.75rem",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "7px 13px",
                    borderRadius: "8px",
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--surface-border)",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "var(--foreground)",
                  }}
                >
                  <span style={{ fontSize: "1.05rem" }}>🧲</span>
                  <span>N52 MagSafe Fast-Charging Ready</span>
                </div>

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "7px 13px",
                    borderRadius: "8px",
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--surface-border)",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "var(--foreground)",
                  }}
                >
                  <span style={{ fontSize: "1.05rem" }}>🛡️</span>
                  <span>12ft Military-Grade Dual-Layer Armor</span>
                </div>

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "7px 13px",
                    borderRadius: "8px",
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--surface-border)",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "var(--foreground)",
                  }}
                >
                  <span style={{ fontSize: "1.05rem" }}>📱</span>
                  <span>60+ Flagship Phone Models Compatible</span>
                </div>

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "7px 13px",
                    borderRadius: "8px",
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--surface-border)",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "var(--foreground)",
                  }}
                >
                  <span style={{ fontSize: "1.05rem" }}>✨</span>
                  <span>Anti-Yellowing 9H UV Shield</span>
                </div>
              </div>

              {/* Pricing Section Box */}
              <div
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--surface-border)",
                  borderRadius: "12px",
                  padding: "1.5rem 1.75rem",
                  marginBottom: "2.25rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "1rem" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "2.3rem",
                        fontWeight: 900,
                        color: "#ffffff",
                      }}
                    >
                      ₹{unitPrice}
                    </span>
                    <span
                      style={{
                        fontSize: "1.1rem",
                        color: "var(--foreground-muted)",
                        textDecoration: "line-through",
                      }}
                    >
                      ₹{originalPrice}
                    </span>
                    <span
                      style={{
                        backgroundColor: "rgba(229, 9, 20, 0.15)",
                        color: "var(--shinra-red)",
                        fontSize: "0.78rem",
                        fontWeight: 800,
                        padding: "4px 10px",
                        borderRadius: "6px",
                      }}
                    >
                      SAVE {Math.round(((originalPrice - unitPrice) / originalPrice) * 100)}%
                    </span>
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--foreground-muted)", marginTop: "6px" }}>
                    GST included. Free pan-India air shipping on orders over ₹799.
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "#22c55e",
                    backgroundColor: "rgba(34, 197, 94, 0.1)",
                    padding: "6px 12px",
                    borderRadius: "6px",
                  }}
                >
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#22c55e" }} />
                  <span>Molded & Ready for UV Print</span>
                </div>
              </div>

              {/* Step 1: Device Brand & Model Selector */}
              <div style={{ marginBottom: "2.25rem" }}>
                <div
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "0.85rem",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>1. SELECT YOUR PHONE DEVICE:</span>
                  <span style={{ color: "var(--shinra-red)" }}>{selectedModel}</span>
                </div>

                {/* Brand tabs */}
                <div style={{ display: "flex", gap: "0.6rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                  {PHONE_MODELS.map((b) => (
                    <button
                      key={b.brand}
                      type="button"
                      onClick={() => {
                        setSelectedBrand(b.brand);
                        setSelectedModel(b.models[0]);
                      }}
                      style={{
                        backgroundColor: selectedBrand === b.brand ? "var(--shinra-red)" : "var(--surface)",
                        color: selectedBrand === b.brand ? "#ffffff" : "var(--foreground)",
                        border: selectedBrand === b.brand ? "1px solid var(--shinra-red)" : "1px solid var(--surface-border)",
                        borderRadius: "8px",
                        padding: "8px 18px",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {b.brand}
                    </button>
                  ))}
                </div>

                {/* Model dropdown */}
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  style={{
                    width: "100%",
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--surface-border)",
                    color: "var(--foreground)",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  {PHONE_MODELS.find((b) => b.brand === selectedBrand)?.models.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2: Case Protection Finish Selector */}
              <div style={{ marginBottom: "2.25rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.82rem",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "0.85rem",
                  }}
                >
                  <span>2. SELECT CASE FINISH & DEFENSE TIER:</span>
                  <span style={{ color: "var(--shinra-red)" }}>{selectedCaseType}</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.75rem" }}>
                  {CASE_TYPES.map((f) => {
                    const isSelected = selectedCaseType.toLowerCase() === f.name.toLowerCase();
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setSelectedCaseType(f.name)}
                        style={{
                          backgroundColor: isSelected ? "var(--surface-raised)" : "var(--surface)",
                          border: isSelected ? "2px solid var(--shinra-red)" : "1px solid var(--surface-border)",
                          borderRadius: "10px",
                          padding: "14px 16px",
                          textAlign: "left",
                          cursor: "pointer",
                          color: "var(--foreground)",
                          transition: "all 0.2s",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: "1.4rem" }}>{f.icon}</span>
                          <span style={{ fontSize: "0.8rem", fontWeight: 800, color: isSelected ? "var(--shinra-red-bright)" : "var(--foreground-muted)" }}>
                            ₹{f.basePrice}
                          </span>
                        </div>
                        <div style={{ fontWeight: 800, fontSize: "0.85rem", marginTop: "8px", color: "var(--foreground)" }}>
                          {f.name}
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "var(--foreground-muted)", marginTop: "4px", lineHeight: 1.4 }}>
                          {f.specs}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Optional Lens Protector Add-on */}
              <div
                onClick={() => setLensProtectorAddon(!lensProtectorAddon)}
                style={{
                  backgroundColor: lensProtectorAddon ? "rgba(34, 197, 94, 0.08)" : "var(--surface)",
                  border: lensProtectorAddon ? "1.5px solid #22c55e" : "1px solid var(--surface-border)",
                  borderRadius: "10px",
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "2.25rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <input
                    type="checkbox"
                    checked={lensProtectorAddon}
                    onChange={() => {}} // handled by div
                    style={{ accentColor: "#22c55e", width: "18px", height: "18px", cursor: "pointer" }}
                  />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "0.92rem", color: "var(--foreground)" }}>
                      Add 9H Sapphire Camera Lens Guard (+₹149)
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--foreground-muted)", marginTop: "2px" }}>
                      Precision cut crystal lens caps. Anti-scratch and zero glare on photos.
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#22c55e" }}>
                  {lensProtectorAddon ? "ADDED ✓" : "+ ₹149"}
                </span>
              </div>

              {/* Buy More Save More Alert */}
              <div
                style={{
                  backgroundColor: "rgba(230, 57, 70, 0.08)",
                  border: "1px dashed rgba(230, 57, 70, 0.4)",
                  borderRadius: "10px",
                  padding: "16px 20px",
                  marginBottom: "2.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                }}
              >
                <span style={{ fontSize: "1.6rem" }}>🔥</span>
                <div style={{ fontSize: "0.85rem", color: "#ededed", lineHeight: 1.5 }}>
                  <strong style={{ color: "var(--shinra-red)" }}>BUY 2 CASES GET 10% OFF!</strong> Mix & match any phone model or anime drop. Auto-applied at checkout.
                </div>
              </div>

              {/* Quantity and CTA Buttons Row */}
              <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", marginBottom: "2rem" }}>
                {/* Quantity */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--surface-border)",
                    borderRadius: "8px",
                    overflow: "hidden",
                    height: "52px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      color: "#ffffff",
                      width: "44px",
                      height: "100%",
                      cursor: "pointer",
                      fontSize: "1.2rem",
                      fontWeight: 700,
                    }}
                  >
                    -
                  </button>
                  <span style={{ width: "44px", textAlign: "center", fontWeight: 800, fontSize: "1rem" }}>
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      color: "#ffffff",
                      width: "44px",
                      height: "100%",
                      cursor: "pointer",
                      fontSize: "1.2rem",
                      fontWeight: 700,
                    }}
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className="shinra-btn shinra-btn-primary"
                  style={{
                    flex: "1 1 220px",
                    padding: "0 2rem",
                    height: "52px",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                  }}
                >
                  ADD CASE TO CART
                </button>

                {/* Buy Now */}
                <button
                  onClick={handleBuyNow}
                  style={{
                    flex: "1 1 160px",
                    height: "52px",
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    fontWeight: 800,
                    fontSize: "0.9rem",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  INSTANT BUY NOW
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Tabbed Specs, Anatomy & Reviews Section */}
        <section className="container" style={{ marginTop: "6rem" }}>
          <div style={{ display: "flex", gap: "14px", borderBottom: "1px solid var(--surface-border)", marginBottom: "2.5rem", flexWrap: "wrap" }}>
            {[
              { id: "specs", label: "CASE ANATOMY & SPECS" },
              { id: "compatibility", label: "DEVICE COMPATIBILITY" },
              { id: "reviews", label: `VERIFIED DROP REVIEWS (${product.reviewsCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: "16px 24px",
                  background: "none",
                  border: "none",
                  borderBottom: activeTab === tab.id ? "2px solid var(--shinra-red)" : "2px solid transparent",
                  color: activeTab === tab.id ? "#ffffff" : "var(--foreground-muted)",
                  fontWeight: activeTab === tab.id ? 800 : 600,
                  fontSize: "0.9rem",
                  letterSpacing: "0.06em",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "specs" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
              {CASE_ANATOMY.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--surface-border)",
                    borderRadius: "12px",
                    padding: "2rem 1.75rem",
                  }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{item.icon}</div>
                  <h4 style={{ fontWeight: 800, color: "var(--foreground)", fontSize: "1.1rem", marginBottom: "0.5rem" }}>{item.title}</h4>
                  <p style={{ color: "var(--foreground-muted)", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "compatibility" && (
            <div
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--surface-border)",
                borderRadius: "14px",
                padding: "2.75rem 2.5rem",
              }}
            >
              <h3 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: "1rem" }}>
                Precision Molded for 25+ Flagship Smartphones
              </h3>
              <p style={{ color: "var(--foreground-muted)", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "2rem", maxWidth: "750px" }}>
                Each phone case is precision CNC-molded to match your phone’s exact camera bump curvature, mic pinholes, stereo speakers, and tactile button feedback.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "2rem" }}>
                {PHONE_MODELS.map((brand) => (
                  <div key={brand.brand}>
                    <h4 style={{ color: "var(--shinra-red)", fontWeight: 800, fontSize: "0.95rem", marginBottom: "10px" }}>
                      {brand.brand}
                    </h4>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                      {brand.models.map((m) => (
                        <li key={m} style={{ fontSize: "0.85rem", color: "var(--foreground)" }}>
                          ✓ {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {[
                { name: "Siddharth K.", date: "2 days ago", device: "iPhone 16 Pro Max", text: "Survived a drop from gym locker height directly on concrete tile. Zero damage to the camera lens or back glass. The MagSafe grip is incredible!" },
                { name: "Pooja R.", date: "1 week ago", device: "Samsung S24 Ultra", text: "The 9H tempered glass Sukuna case is stunning. Print is razor sharp and the S-Pen cutout is perfectly aligned. Definitely buying another one." },
                { name: "Nikhil T.", date: "2 weeks ago", device: "OnePlus 12", text: "Matte sides provide 10x better grip than the slippery naked phone. Luffy Gear 5 colors haven't faded at all." },
              ].map((rev, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--surface-border)",
                    borderRadius: "12px",
                    padding: "1.75rem 2rem",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <div style={{ fontWeight: 800, color: "var(--foreground)", fontSize: "0.95rem" }}>
                      {rev.name} <span style={{ color: "var(--foreground-muted)", fontWeight: 500, fontSize: "0.82rem" }}>• {rev.device}</span>
                    </div>
                    <span style={{ fontSize: "0.78rem", color: "var(--foreground-muted)" }}>{rev.date}</span>
                  </div>
                  <div style={{ color: "#fbbf24", marginBottom: "8px", fontSize: "0.9rem" }}>★★★★★</div>
                  <p style={{ color: "var(--foreground-muted)", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>
                    {rev.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Related Drops */}
        <section className="container" style={{ marginTop: "6.5rem" }}>
          <div style={{ marginBottom: "2.5rem" }}>
            <span
              style={{
                color: "var(--shinra-red)",
                fontFamily: "var(--font-heading)",
                fontSize: "0.78rem",
                fontWeight: 800,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              MORE FROM ARCHIVE
            </span>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.9rem",
                fontWeight: 900,
                marginTop: "0.4rem",
              }}
            >
              YOU MAY ALSO LIKE
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "2.25rem",
            }}
          >
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
