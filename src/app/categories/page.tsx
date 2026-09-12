"use client";

import React, { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SearchModal from "@/components/SearchModal";
import { CASE_TYPES, CATEGORIES } from "@/data/products";
import Link from "next/link";

export default function CategoriesPage() {
  const [activeFilter, setActiveFilter] = useState<"all" | "franchises" | "aesthetics" | "custom">("all");

  const filterTabs = [
    { id: "all", label: "All 20 Categories", icon: "🔥" },
    { id: "franchises", label: "Pop Culture & Franchises", icon: "🎮" },
    { id: "aesthetics", label: "Aesthetics & Art", icon: "✨" },
    { id: "custom", label: "Personalized Customizer", icon: "⚡" },
  ];

  const displayedCategories = useMemo(() => {
    // Exclude 'all' entry from the grid since it's just the catalog link
    const validCategories = CATEGORIES.filter((c) => c.id !== "all");

    if (activeFilter === "franchises") {
      return validCategories.filter((c) =>
        ["anime", "gaming", "cars", "sports", "music", "y2k", "streetwear", "luxury"].includes(c.id)
      );
    }
    if (activeFilter === "aesthetics") {
      return validCategories.filter((c) =>
        ["aesthetic", "dark-gothic", "cute-kawaii", "floral", "quotes", "abstract-art", "trending", "desi"].includes(c.id)
      );
    }
    if (activeFilter === "custom") {
      return validCategories.filter((c) => c.isCustom);
    }
    return validCategories;
  }, [activeFilter]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <CartDrawer />
      <SearchModal />

      <main style={{ flex: 1, paddingBottom: "5rem" }}>
        {/* Header Hero */}
        <section
          style={{
            backgroundColor: "var(--background)",
            borderBottom: "1px solid var(--surface-border)",
            padding: "3.5rem 0 3rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div className="container">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.75rem",
                color: "var(--foreground-muted)",
                marginBottom: "0.85rem",
                fontFamily: "var(--font-heading)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              <Link href="/" style={{ color: "var(--foreground-muted)", textDecoration: "none" }}>
                Home
              </Link>
              <span>/</span>
              <span style={{ color: "var(--main-accent)" }}>Case Categories Hub</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.5rem" }}>
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 900,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--main-accent)",
                  backgroundColor: "rgba(124, 58, 237, 0.1)",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  border: "1px solid rgba(124, 58, 237, 0.25)",
                }}
              >
                20 OFFICIAL THEMES & FINISHES
              </span>
            </div>

            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
                fontWeight: 900,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                marginBottom: "0.85rem",
              }}
            >
              PHONE CASE CATEGORIES & ARMOR DIRECTORY
            </h1>
            <p
              style={{
                color: "var(--foreground-muted)",
                fontSize: "1.05rem",
                maxWidth: "720px",
                lineHeight: 1.6,
              }}
            >
              From Anime & Esports Gaming to Supercars, Y2K liquid chrome, Cute Kawaii, Luxury 24K gold, and customizable photo & pet cases — engineered with real 12ft drop protection for iPhone, Samsung, OnePlus & Pixel.
            </p>
          </div>
        </section>

        {/* Section 1: Browse All 20 Themes */}
        <section className="container" style={{ marginTop: "3.5rem" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "1.2rem",
              marginBottom: "2rem",
            }}
          >
            <div>
              <span
                style={{
                  color: "var(--main-accent)",
                  fontFamily: "var(--font-heading)",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                CURATED ARCHIVE
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                  fontWeight: 800,
                  marginTop: "0.3rem",
                }}
              >
                CHOOSE YOUR STYLE & THEME
              </h2>
            </div>

            {/* Filter Pills */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              {filterTabs.map((tab) => {
                const isActive = activeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id as any)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 16px",
                      borderRadius: "999px",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      backgroundColor: isActive ? "var(--main-accent)" : "var(--surface)",
                      color: isActive ? "#ffffff" : "var(--foreground)",
                      border: isActive ? "1px solid var(--main-accent)" : "1px solid var(--surface-border)",
                      boxShadow: isActive ? "0 4px 14px rgba(124, 58, 237, 0.35)" : "none",
                    }}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 20 Categories Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {displayedCategories.map((cat) => {
              const targetUrl = cat.isCustom ? `/customize?theme=${cat.id}` : `/shop?universe=${cat.id}`;
              return (
                <div
                  key={cat.id}
                  style={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--surface-border)",
                    borderRadius: "14px",
                    padding: "1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "all 0.25s ease",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  className="category-card"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = cat.accentColor;
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = `0 12px 30px rgba(0,0,0,0.15), 0 0 20px ${cat.accentColor}25`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--surface-border)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Accent corner ambient light */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: "90px",
                      height: "90px",
                      background: `radial-gradient(circle at top right, ${cat.accentColor}25, transparent 70%)`,
                      pointerEvents: "none",
                    }}
                  />

                  <div>
                    {/* Header: Icon + Badge + Drops Count */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "1rem",
                      }}
                    >
                      <div
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "12px",
                          backgroundColor: "var(--surface-raised)",
                          border: `1.5px solid ${cat.accentColor}44`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.75rem",
                          boxShadow: `0 4px 15px ${cat.accentColor}18`,
                        }}
                      >
                        {cat.icon}
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        {cat.badge && (
                          <span
                            style={{
                              fontSize: "0.68rem",
                              fontWeight: 900,
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                              padding: "3px 8px",
                              borderRadius: "4px",
                              backgroundColor: `${cat.accentColor}22`,
                              color: cat.accentColor,
                              border: `1px solid ${cat.accentColor}55`,
                            }}
                          >
                            {cat.badge}
                          </span>
                        )}
                        <span
                          style={{
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            color: "var(--foreground-muted)",
                            backgroundColor: "var(--surface-raised)",
                            padding: "3px 7px",
                            borderRadius: "4px",
                          }}
                        >
                          {cat.count}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "1.3rem",
                        fontWeight: 900,
                        marginBottom: "0.4rem",
                        color: "var(--foreground)",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      {cat.name}
                    </h3>

                    {/* Tagline */}
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--foreground-muted)",
                        lineHeight: 1.5,
                        marginBottom: "1rem",
                        minHeight: "42px",
                      }}
                    >
                      {cat.tagline}
                    </p>

                    {/* Subtags pills */}
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "6px",
                        marginBottom: "1.4rem",
                      }}
                    >
                      {cat.subtags.map((sub, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: "4px",
                            backgroundColor: "var(--surface-raised)",
                            color: "var(--foreground)",
                            border: "1px solid var(--surface-border)",
                          }}
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA button */}
                  <Link
                    href={targetUrl}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.75rem 1rem",
                      borderRadius: "8px",
                      backgroundColor: cat.isCustom ? "var(--secondary-accent)" : "var(--surface-raised)",
                      border: cat.isCustom ? "1px solid var(--secondary-accent)" : `1px solid ${cat.accentColor}55`,
                      color: cat.isCustom ? "#ffffff" : "var(--foreground)",
                      fontSize: "0.8rem",
                      fontWeight: 800,
                      textDecoration: "none",
                      transition: "all 0.2s ease",
                      boxShadow: cat.isCustom ? "0 4px 14px rgba(236, 72, 153, 0.25)" : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!cat.isCustom) {
                        e.currentTarget.style.backgroundColor = cat.accentColor;
                        e.currentTarget.style.color = "#ffffff";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!cat.isCustom) {
                        e.currentTarget.style.backgroundColor = "var(--surface-raised)";
                        e.currentTarget.style.color = "var(--foreground)";
                      }
                    }}
                  >
                    <span>{cat.isCustom ? "LAUNCH CUSTOM STUDIO" : `EXPLORE ${cat.name.toUpperCase()}`}</span>
                    <span>→</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 2: Armor & Defense Levels */}
        <section className="container" style={{ marginTop: "5rem" }}>
          <div style={{ marginBottom: "2rem" }}>
            <span
              style={{
                color: "var(--main-accent)",
                fontFamily: "var(--font-heading)",
                fontSize: "0.75rem",
                fontWeight: 800,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              MIL-SPEC PROTECTION
            </span>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                fontWeight: 800,
                marginTop: "0.3rem",
              }}
            >
              PHONE CASE FINISHES & DROP DEFENSE
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.75rem",
            }}
          >
            {CASE_TYPES.map((f) => (
              <div
                key={f.id}
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--surface-border)",
                  borderRadius: "12px",
                  padding: "1.75rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
                className="category-card"
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "1rem",
                    }}
                  >
                    <span style={{ fontSize: "2.4rem" }}>{f.icon}</span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        color: "var(--main-accent)",
                        backgroundColor: "rgba(124, 58, 237, 0.12)",
                        padding: "4px 10px",
                        borderRadius: "4px",
                        border: "1px solid rgba(124, 58, 237, 0.25)",
                      }}
                    >
                      {f.priceText}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.25rem",
                      fontWeight: 800,
                      marginBottom: "0.5rem",
                    }}
                  >
                    {f.name}
                  </h3>

                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--main-accent)",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      marginBottom: "0.85rem",
                    }}
                  >
                    {f.specs}
                  </div>

                  <p
                    style={{
                      fontSize: "0.88rem",
                      color: "var(--foreground-muted)",
                      lineHeight: 1.6,
                      marginBottom: "1.5rem",
                    }}
                  >
                    {f.description}
                  </p>
                </div>

                <Link
                  href={`/shop?format=${encodeURIComponent(f.name)}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.85rem 1rem",
                    backgroundColor: "var(--surface-raised)",
                    border: "1px solid var(--surface-border)",
                    borderRadius: "6px",
                    color: "var(--foreground)",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--main-accent)";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--surface-raised)";
                    e.currentTarget.style.color = "var(--foreground)";
                  }}
                >
                  <span>BROWSE {f.name.toUpperCase()}</span>
                  <span>→</span>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
