"use client";

import React, { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import UniverseBar from "@/components/UniverseBar";
import ProductCard from "@/components/ProductCard";
import FormatGrid from "@/components/FormatGrid";
import WhyCaseTadka from "@/components/WhyCaseTadka";
import CustomerWall from "@/components/CustomerWall";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SearchModal from "@/components/SearchModal";
import { CASE_ANATOMY, PHONE_MODELS } from "@/data/products";
import { useAllProducts } from "@/lib/productsStorage";
import Link from "next/link";

export default function Home() {
  const { products } = useAllProducts();
  const [selectedUniverse, setSelectedUniverse] = useState("all");
  const [activeCaseType, setActiveCaseType] = useState<string>("all");

  const filteredProducts = useMemo(() => {
    const list = products.filter((item) => {
      const matchUniverse =
        selectedUniverse === "all" ||
        item.franchise?.toLowerCase() === selectedUniverse.toLowerCase() ||
        item.theme?.toLowerCase() === selectedUniverse.toLowerCase() ||
        (selectedUniverse === "anime" && (!item.theme || item.theme === "anime"));
      const matchType =
        activeCaseType === "all" ||
        item.formats.some((f) => f.toLowerCase().includes(activeCaseType.toLowerCase()));
      return matchUniverse && matchType;
    });
    const customCases = list.filter((p) => p.isCustom);
    const standardCases = list.filter((p) => !p.isCustom);
    return [...customCases, ...standardCases];
  }, [products, selectedUniverse, activeCaseType]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Global Modals & Drawers */}
      <CartDrawer />
      <SearchModal />

      {/* Main Navbar */}
      <Navbar />

      <main style={{ flex: 1 }}>
        {/* Shinra Hero Phone Case Showcase */}
        <HeroBanner />

        {/* Quick Phone Brand Quick-Bar */}
        <div
          style={{
            backgroundColor: "var(--surface)",
            borderBottom: "1px solid var(--surface-border)",
            padding: "16px 0",
          }}
        >
          <div className="container">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", fontWeight: 800, color: "var(--shinra-red)", letterSpacing: "0.1em" }}>
                <span>⚡ POPULAR DEVICES:</span>
              </div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                {["iPhone 16 Pro Max", "iPhone 15 Pro", "Galaxy S24 Ultra", "OnePlus 12", "Pixel 9 Pro"].map((dev) => (
                  <Link
                    key={dev}
                    href={`/shop?device=${encodeURIComponent(dev)}`}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "20px",
                      backgroundColor: "var(--background)",
                      border: "1px solid var(--surface-border)",
                      color: "var(--foreground)",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      textDecoration: "none",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--shinra-red)";
                      e.currentTarget.style.backgroundColor = "var(--surface-raised)";
                      e.currentTarget.style.color = "var(--shinra-red)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--surface-border)";
                      e.currentTarget.style.backgroundColor = "var(--background)";
                      e.currentTarget.style.color = "var(--foreground)";
                    }}
                  >
                    📱 {dev}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Universe Franchise Selector */}
        <UniverseBar
          selectedUniverse={selectedUniverse}
          onSelectUniverse={setSelectedUniverse}
        />

        {/* Phone Case Catalog Section */}
        <section
          id="drops"
          style={{
            padding: "4rem 0",
            backgroundColor: "var(--background)",
            borderBottom: "1px solid var(--surface-border)",
          }}
        >
          <div className="container">
            {/* Section Header with Case Type Tabs */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "1.5rem",
                marginBottom: "2.5rem",
              }}
            >
              <div>
                <div className="shinra-badge shinra-badge-red" style={{ marginBottom: "0.5rem" }}>
                  <span>CASE TADKA • GOOD COVERS. BETTER VIBES. 🌶️</span>
                </div>
                <h2
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)",
                    fontWeight: 900,
                    color: "var(--foreground)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  FRESH TADKA DROPS & PHONE ARMOR
                </h2>
                <p style={{ color: "var(--foreground-muted)", fontSize: "0.9rem", marginTop: "4px" }}>
                  Showing {filteredProducts.length} battle-ready phone covers • MagSafe & 12ft Drop Tested
                </p>
              </div>

              {/* Case Type Filter Switcher */}
              <div
                style={{
                  display: "flex",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--surface-border)",
                  borderRadius: "6px",
                  padding: "4px",
                  gap: "4px",
                  flexWrap: "wrap",
                }}
              >
                {[
                  { id: "all", label: "ALL CASES" },
                  { id: "magsafe", label: "🧲 MAGSAFE ULTRA" },
                  { id: "tough", label: "🛡️ TOUGH DUAL-LAYER" },
                  { id: "glass", label: "💎 9H GLASS" },
                  { id: "slim", label: "⚡ SLIM MATTE" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveCaseType(t.id)}
                    style={{
                      backgroundColor: activeCaseType === t.id ? "var(--shinra-red)" : "transparent",
                      color: activeCaseType === t.id ? "#ffffff" : "var(--foreground-muted)",
                      border: "none",
                      borderRadius: "4px",
                      padding: "6px 14px",
                      fontFamily: "var(--font-heading)",
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "2rem",
              }}
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "4rem 0",
                  backgroundColor: "var(--surface)",
                  borderRadius: "8px",
                  border: "1px solid var(--surface-border)",
                }}
              >
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "0.5rem" }}>
                  No phone cases found matching this filter
                </h3>
                <p style={{ color: "var(--foreground-muted)", marginBottom: "1.5rem" }}>
                  Try resetting the case filter or view all anime drops.
                </p>
                <button
                  onClick={() => {
                    setSelectedUniverse("all");
                    setActiveCaseType("all");
                  }}
                  className="shinra-btn shinra-btn-primary"
                >
                  RESET FILTERS
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Case Anatomy & Military Drop Protection Tech */}
        <section
          style={{
            padding: "5rem 0",
            backgroundColor: "var(--background)",
            borderBottom: "1px solid var(--surface-border)",
            position: "relative",
          }}
        >
          <div className="container">
            <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 3.5rem" }}>
              <div className="shinra-badge" style={{ marginBottom: "0.85rem" }}>
                <span>MIL-STD 810G CERTIFIED</span>
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(1.8rem, 4vw, 2.75rem)",
                  fontWeight: 900,
                  color: "var(--foreground)",
                  marginBottom: "0.75rem",
                }}
              >
                ANATOMY OF CASE TADKA PHONE ARMOR
              </h2>
              <p style={{ fontSize: "0.95rem", color: "var(--foreground-muted)", lineHeight: 1.6 }}>
                Engineered from the ground up for extreme impact resistance. We merge vibrant art with precision dual-polymer chassis engineering. Desi vibes, global style.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "1.75rem",
              }}
            >
              {CASE_ANATOMY.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--surface-border)",
                    borderRadius: "12px",
                    padding: "2rem 1.5rem",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--shinra-red)";
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 15px 30px rgba(255, 42, 58, 0.12), 0 0 20px var(--shinra-red-glow)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--surface-border)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.03)";
                  }}
                >
                  <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{item.icon}</div>
                  <h3
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.15rem",
                      fontWeight: 800,
                      color: "var(--foreground)",
                      marginBottom: "0.6rem",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p style={{ fontSize: "0.88rem", color: "var(--foreground-muted)", lineHeight: 1.6, margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Case Finishes & Protection Tiers */}
        <FormatGrid />

        {/* Why Case Tadka & Standard Guarantees */}
        <WhyCaseTadka />

        {/* Customer Verified Setups & Reviews */}
        <CustomerWall />

        {/* FAQ Accordion */}
        <FaqSection />
      </main>

      {/* Mega Footer */}
      <Footer />
    </div>
  );
}
