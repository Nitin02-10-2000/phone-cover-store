"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import CartDrawer from "@/components/CartDrawer";
import SearchModal from "@/components/SearchModal";
import { PRODUCTS, UNIVERSES, CASE_TYPES, PHONE_MODELS, BRAND_GROUPS } from "@/data/products";
import { useDevice } from "@/lib/deviceContext";
import { useAllProducts } from "@/lib/productsStorage";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialDevice = searchParams.get("device") || "";
  const { selectedModel: globalModel, setDeviceByModel } = useDevice();
  const { products } = useAllProducts();

  const [selectedUniverse, setSelectedUniverse] = useState("all");
  const [selectedCaseType, setSelectedCaseType] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedDevice, setSelectedDevice] = useState(() => initialDevice || globalModel);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Franchise or Theme match
      if (selectedUniverse !== "all") {
        const isMatch =
          product.franchise === selectedUniverse ||
          product.theme === selectedUniverse ||
          (selectedUniverse === "anime" && (!product.theme || product.theme === "anime"));
        if (!isMatch) return false;
      }
      // Case Type match
      if (selectedCaseType !== "all") {
        const hasType = product.formats.some(
          (f) => f.toLowerCase().includes(selectedCaseType.toLowerCase())
        );
        if (!hasType) return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesFranchise = product.franchise.toLowerCase().includes(query);
        const matchesTag = product.tag.toLowerCase().includes(query);
        if (!matchesName && !matchesFranchise && !matchesTag) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "featured") {
        if (a.isCustom && !b.isCustom) return -1;
        if (!a.isCustom && b.isCustom) return 1;
      }
      return 0; // featured
    });
  }, [products, selectedUniverse, selectedCaseType, sortBy, searchQuery]);

  return (
    <main style={{ flex: 1, paddingBottom: "5rem" }}>
      {/* Header Banner */}
      <section
        style={{
          backgroundColor: "var(--background)",
          borderBottom: "1px solid var(--surface-border)",
          padding: "2.5rem 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-50%",
            right: "5%",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,58,237,0.14) 0%, transparent 70%)",
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />

        <div className="container">
          {/* Breadcrumb */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.75rem",
              color: "var(--foreground-muted)",
              marginBottom: "0.75rem",
              fontFamily: "var(--font-heading)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            <a href="/" style={{ color: "var(--foreground-muted)", textDecoration: "none" }}>
              Home
            </a>
            <span>/</span>
            <span style={{ color: "var(--shinra-red)" }}>Phone Cases</span>
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 10px",
              borderRadius: "4px",
              backgroundColor: "rgba(230, 57, 70, 0.12)",
              color: "var(--shinra-red)",
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.1em",
              marginBottom: "8px",
            }}
          >
            <span>📱</span>
            <span>MAGSAFE COMPATIBLE • 12FT MIL-SPEC TESTED</span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.8rem, 4vw, 2.75rem)",
              fontWeight: 900,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: "0.5rem",
            }}
          >
            ANIME PHONE ARMOR CATALOG
          </h1>
          <p
            style={{
              color: "var(--foreground-muted)",
              fontSize: "0.95rem",
              maxWidth: "680px",
              lineHeight: 1.5,
            }}
          >
            Engineered dual-layer shock defense for Apple iPhone, Samsung Galaxy, OnePlus, Google Pixel, and Nothing Phone.
            {selectedDevice !== "all" && (
              <span style={{ color: "var(--foreground)", fontWeight: 700, marginLeft: "6px" }}>
                Currently viewing cases for: <span style={{ color: "var(--shinra-red)" }}>{selectedDevice}</span>
              </span>
            )}
          </p>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="container" style={{ marginTop: "2rem" }}>
        {/* Device Brand Quick Selector */}
        <div
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--surface-border)",
            borderRadius: "10px",
            padding: "1rem 1.25rem",
            marginBottom: "1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--main-accent)" }}>PHONE BRAND:</span>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {["all", ...BRAND_GROUPS.map((b) => b.brand)].map((brand) => (
                <button
                  key={brand}
                  onClick={() => {
                    setSelectedBrand(brand);
                    if (brand !== "all") {
                      const firstModel = BRAND_GROUPS.find((b) => b.brand === brand)?.models[0];
                      if (firstModel) {
                        setSelectedDevice(firstModel);
                        setDeviceByModel(firstModel);
                      }
                    }
                  }}
                  style={{
                    backgroundColor: selectedBrand === brand ? "var(--main-accent)" : "var(--background)",
                    color: selectedBrand === brand ? "#ffffff" : "var(--foreground-muted)",
                    border: selectedBrand === brand ? "1px solid var(--main-accent)" : "1px solid var(--surface-border)",
                    borderRadius: "6px",
                    padding: "5px 12px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {brand === "all" ? "All Brands" : brand}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--foreground-muted)" }}>Target Model:</span>
            <select
              value={selectedDevice}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedDevice(val);
                if (val !== "all") {
                  setDeviceByModel(val);
                }
              }}
              style={{
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                border: "1px solid var(--surface-border)",
                borderRadius: "6px",
                padding: "8px 14px",
                fontSize: "0.82rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <option value="all">Any Flagship Model</option>
              {(selectedBrand === "all"
                ? BRAND_GROUPS.flatMap((b) => b.models)
                : BRAND_GROUPS.find((b) => b.brand === selectedBrand)?.models || []
              ).map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search & Sort Bar */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
            backgroundColor: "var(--surface)",
            border: "1px solid var(--surface-border)",
            borderRadius: "8px",
            padding: "0.85rem 1.25rem",
          }}
        >
          {/* Search input */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              flex: "1 1 240px",
              backgroundColor: "var(--background)",
              border: "1px solid var(--surface-border)",
              borderRadius: "6px",
              padding: "0.4rem 0.8rem",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by anime, hero, or case edition..."
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "var(--foreground)",
                fontSize: "0.85rem",
                width: "100%",
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--foreground-muted)",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--foreground-muted)", fontWeight: 700 }}>
              SORT BY:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                border: "1px solid var(--surface-border)",
                borderRadius: "4px",
                padding: "6px 12px",
                fontSize: "0.8rem",
                fontWeight: 600,
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="featured">Featured Drops</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Case Type Protection Switcher */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div
            style={{
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--foreground-muted)",
              marginBottom: "0.6rem",
            }}
          >
            FILTER BY CASE FINISH:
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              onClick={() => setSelectedCaseType("all")}
              style={{
                backgroundColor: selectedCaseType === "all" ? "var(--shinra-red)" : "var(--surface)",
                color: selectedCaseType === "all" ? "#ffffff" : "var(--foreground-muted)",
                border: "1px solid var(--surface-border)",
                borderRadius: "4px",
                padding: "6px 14px",
                fontSize: "0.75rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              All Case Types ({PRODUCTS.length})
            </button>
            {CASE_TYPES.map((fmt) => {
              const isSelected = selectedCaseType === fmt.name;
              return (
                <button
                  key={fmt.id}
                  onClick={() => setSelectedCaseType(isSelected ? "all" : fmt.name)}
                  style={{
                    backgroundColor: isSelected ? "var(--shinra-red)" : "var(--surface)",
                    color: isSelected ? "#ffffff" : "var(--foreground-muted)",
                    border: "1px solid var(--surface-border)",
                    borderRadius: "4px",
                    padding: "6px 14px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {fmt.icon} {fmt.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Universe Chips */}
        <div style={{ marginBottom: "2rem" }}>
          <div
            style={{
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--foreground-muted)",
              marginBottom: "0.6rem",
            }}
          >
            FILTER BY CATEGORY & THEME:
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {UNIVERSES.map((u) => {
              const isSelected = selectedUniverse === u.id;
              return (
                <button
                  key={u.id}
                  onClick={() => setSelectedUniverse(u.id)}
                  style={{
                    backgroundColor: isSelected ? "var(--shinra-red)" : "var(--surface)",
                    color: isSelected ? "#ffffff" : "var(--foreground)",
                    border: isSelected ? "1px solid var(--shinra-red)" : "1px solid var(--surface-border)",
                    borderRadius: "6px",
                    padding: "6px 14px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    boxShadow: isSelected ? "0 4px 12px var(--shinra-red-glow)" : "none",
                  }}
                >
                  {u.icon && <span>{u.icon}</span>}
                  <span>{u.name}</span>
                  {u.badge && (
                    <span
                      style={{
                        fontSize: "0.6rem",
                        padding: "1px 5px",
                        borderRadius: "3px",
                        backgroundColor: isSelected ? "rgba(0,0,0,0.3)" : "rgba(229, 9, 20, 0.12)",
                        color: isSelected ? "#ffffff" : "var(--shinra-red)",
                        fontWeight: 800,
                      }}
                    >
                      {u.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards Grid */}
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

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "5rem 0",
              backgroundColor: "var(--surface)",
              borderRadius: "8px",
              border: "1px solid var(--surface-border)",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📱</div>
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.4rem",
                fontWeight: 900,
                marginBottom: "0.5rem",
              }}
            >
              NO PHONE CASES MATCH YOUR FILTERS
            </h3>
            <p style={{ color: "var(--foreground-muted)", marginBottom: "1.5rem" }}>
              Try broadening your universe or case finish selection.
            </p>
            <button
              onClick={() => {
                setSelectedUniverse("all");
                setSelectedCaseType("all");
                setSelectedBrand("all");
                setSearchQuery("");
              }}
              className="shinra-btn shinra-btn-primary"
            >
              RESET ALL FILTERS
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default function ShopPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <CartDrawer />
      <SearchModal />
      <Suspense fallback={<div style={{ minHeight: "60vh", padding: "100px 20px", textAlign: "center" }}>Loading Phone Case Catalog...</div>}>
        <ShopContent />
      </Suspense>
      <Footer />
    </div>
  );
}
