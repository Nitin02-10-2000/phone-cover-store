"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cartContext";
import { useDevice } from "@/lib/deviceContext";
import { CATEGORIES } from "@/data/products";


export default function Navbar() {
  const { totalItems, setIsCartOpen, setIsSearchOpen, theme, toggleTheme, user, logout } = useCart();
  const { selectedModel, openDevicePicker } = useDevice();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setCategoryMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* 1. TOP PROMOTIONAL MARQUEE BANNER */}
      <div
        style={{
          backgroundColor: "#111111",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          color: "#ffffff",
          fontSize: "0.72rem",
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          padding: "7px 0",
        }}
        className="marquee-container"
      >
        <div className="marquee-content" style={{ animationDuration: "30s" }}>
          <span>🔥 BUY 2 PHONE CASES: 10% OFF</span>
          <span>•</span>
          <span>⚡ 3+ CASES: 15% OFF</span>
          <span>•</span>
          <span>🚀 FREE PAN-INDIA SHIPPING OVER ₹799</span>
          <span>•</span>
          <span>🛡️ 12FT MIL-STD DROP PROTECTION</span>
          <span>•</span>
          <span>🧲 MAGSAFE WIRELESS CHARGING READY</span>
          <span>•</span>
          <span>USE CODE: <span style={{ color: "var(--secondary-accent)", fontWeight: 800 }}>HACHIMAN</span> FOR EXTRA 10% OFF</span>
          <span>•</span>
          <span>🔥 BUY 2 PHONE CASES: 10% OFF</span>
          <span>•</span>
          <span>⚡ 3+ CASES: 15% OFF</span>
          <span>•</span>
          <span>🚀 FREE PAN-INDIA SHIPPING OVER ₹799</span>
          <span>•</span>
          <span>🛡️ 12FT MIL-STD DROP PROTECTION</span>
        </div>
      </div>

      {/* 2. MAIN STICKY HEADER */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backgroundColor: "var(--glass-bg)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--glass-border)",
          boxShadow: "var(--glass-shadow)",
        }}
      >
        <div className="container" style={{ padding: "0.75rem 1.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1.2rem",
            }}
          >
            {/* Brand Logo & Flame Icon */}
            <div style={{ display: "flex", alignItems: "center", gap: "2.2rem" }}>
              <Link
                href="/"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.65rem",
                  textDecoration: "none",
                }}
              >
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    backgroundColor: "var(--primary)",
                    border: "1.5px solid var(--main-accent)",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 15px rgba(124, 58, 237, 0.25)",
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--main-accent)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                  </svg>
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.45rem",
                      fontWeight: 900,
                      letterSpacing: "0.06em",
                      color: "var(--foreground)",
                      lineHeight: 1,
                    }}
                  >
                    HACHIMAN
                  </span>
                  <span
                    style={{
                      fontSize: "0.56rem",
                      fontWeight: 800,
                      letterSpacing: "0.22em",
                      color: "var(--main-accent)",
                      textTransform: "uppercase",
                      marginTop: "2px",
                    }}
                  >
                    PHONE ARMOR & CASES
                  </span>
                </div>
              </Link>

              {/* Desktop Nav Links (Visible on >= 1024px) */}
              <nav className="desktop-nav-links">
                {/* Shop All Cases */}
                <Link
                  href="/shop"
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--foreground)",
                    textDecoration: "none",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--main-accent)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--foreground)")}
                >
                  Phone Cases
                </Link>

                {/* Categories with Dropdown */}
                <div
                  ref={categoryRef}
                  className="nav-dropdown-container"
                  style={{ position: "relative" }}
                  onMouseEnter={() => setCategoryMenuOpen(true)}
                  onMouseLeave={() => setCategoryMenuOpen(false)}
                >
                  <Link
                    href="/categories"
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--foreground)",
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--main-accent)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--foreground)")}
                  >
                    <span>Categories</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </Link>

                  {/* Categories Mega Dropdown */}
                  <div className={`nav-dropdown-card mega-menu${categoryMenuOpen ? " is-open" : ""}`}>
                    <div
                      className="nav-dropdown-inner"
                      style={{
                        backgroundColor: "var(--surface)",
                        border: "1px solid var(--surface-border)",
                        borderRadius: "16px",
                        boxShadow: "0 30px 70px -15px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.08)",
                        padding: "1.25rem 1.5rem",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {/* Top Accent Gradient Border */}
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: "3px",
                          background: "linear-gradient(90deg, var(--main-accent) 0%, var(--secondary-accent) 50%, var(--main-accent) 100%)",
                        }}
                      />

                      {/* Header bar inside mega menu */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          paddingBottom: "0.85rem",
                          borderBottom: "1px solid var(--surface-border)",
                          marginBottom: "1.1rem",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontSize: "1.25rem" }}>🔥</span>
                          <div>
                            <span
                              style={{
                                fontSize: "0.65rem",
                                fontWeight: 900,
                                letterSpacing: "0.16em",
                                textTransform: "uppercase",
                                color: "var(--main-accent)",
                                display: "block",
                              }}
                            >
                              HACHIMAN ARMOR DIRECTORY
                            </span>
                            <h4
                              style={{
                                margin: 0,
                                fontSize: "1.05rem",
                                fontWeight: 800,
                                color: "var(--foreground)",
                                letterSpacing: "-0.01em",
                              }}
                            >
                              Explore All 20 Themes & Custom Studio
                            </h4>
                          </div>
                        </div>

                        <Link
                          href="/categories"
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 800,
                            color: "var(--main-accent-bright)",
                            textDecoration: "none",
                            padding: "6px 14px",
                            borderRadius: "8px",
                            backgroundColor: "rgba(124, 58, 237, 0.1)",
                            border: "1px solid rgba(124, 58, 237, 0.25)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "var(--main-accent)";
                            e.currentTarget.style.color = "#ffffff";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "rgba(124, 58, 237, 0.1)";
                            e.currentTarget.style.color = "var(--main-accent-bright)";
                          }}
                        >
                          <span>View Full Hub</span>
                          <span>→</span>
                        </Link>
                      </div>

                      {/* 3 Perfectly Balanced Columns Grid (8 rows per column) */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 1fr",
                          gap: "1.25rem",
                        }}
                      >
                        {/* Col 1: Popular & Franchises (8 items) */}
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <div
                            style={{
                              fontSize: "0.68rem",
                              fontWeight: 900,
                              letterSpacing: "0.14em",
                              textTransform: "uppercase",
                              color: "var(--main-accent)",
                              marginBottom: "10px",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              height: "20px",
                            }}
                          >
                            <span>🔥</span>
                            <span>POPULAR & FRANCHISES</span>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                            {CATEGORIES.filter((c) =>
                              ["anime", "gaming", "cars", "sports", "music", "y2k", "streetwear", "luxury"].includes(c.id)
                            ).map((cat) => (
                              <Link
                                key={cat.id}
                                href={`/shop?universe=${cat.id}`}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  padding: "6px 8px",
                                  borderRadius: "8px",
                                  textDecoration: "none",
                                  color: "var(--foreground)",
                                  transition: "all 0.15s ease",
                                  height: "38px",
                                  boxSizing: "border-box",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = "var(--surface-raised)";
                                  e.currentTarget.style.transform = "translateX(3px)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = "transparent";
                                  e.currentTarget.style.transform = "translateX(0)";
                                }}
                              >
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", overflow: "hidden" }}>
                                  <span
                                    style={{
                                      fontSize: "1.05rem",
                                      width: "28px",
                                      height: "28px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      backgroundColor: "var(--surface-raised)",
                                      borderRadius: "6px",
                                      flexShrink: 0,
                                    }}
                                  >
                                    {cat.icon}
                                  </span>
                                  <div style={{ overflow: "hidden" }}>
                                    <div style={{ fontSize: "0.8rem", fontWeight: 700, whiteSpace: "nowrap" }}>
                                      {cat.name}
                                    </div>
                                    <div
                                      style={{
                                        fontSize: "0.64rem",
                                        color: "var(--foreground-muted)",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: "155px",
                                      }}
                                    >
                                      {cat.subtags.slice(0, 3).join(", ")}
                                    </div>
                                  </div>
                                </div>
                                {cat.badge && (
                                  <span
                                    style={{
                                      fontSize: "0.58rem",
                                      fontWeight: 900,
                                      padding: "2px 6px",
                                      borderRadius: "4px",
                                      backgroundColor: `${cat.accentColor}22`,
                                      color: cat.accentColor,
                                      border: `1px solid ${cat.accentColor}44`,
                                      flexShrink: 0,
                                    }}
                                  >
                                    {cat.badge}
                                  </span>
                                )}
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Col 2: Aesthetics & Vibes (8 items) */}
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <div
                            style={{
                              fontSize: "0.68rem",
                              fontWeight: 900,
                              letterSpacing: "0.14em",
                              textTransform: "uppercase",
                              color: "var(--main-accent)",
                              marginBottom: "10px",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              height: "20px",
                            }}
                          >
                            <span>✨</span>
                            <span>AESTHETICS & ART</span>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                            {CATEGORIES.filter((c) =>
                              ["cute-kawaii", "aesthetic", "dark-gothic", "floral", "trending", "desi", "quotes", "abstract-art"].includes(c.id)
                            ).map((cat) => (
                              <Link
                                key={cat.id}
                                href={`/shop?universe=${cat.id}`}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  padding: "6px 8px",
                                  borderRadius: "8px",
                                  textDecoration: "none",
                                  color: "var(--foreground)",
                                  transition: "all 0.15s ease",
                                  height: "38px",
                                  boxSizing: "border-box",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = "var(--surface-raised)";
                                  e.currentTarget.style.transform = "translateX(3px)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = "transparent";
                                  e.currentTarget.style.transform = "translateX(0)";
                                }}
                              >
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", overflow: "hidden" }}>
                                  <span
                                    style={{
                                      fontSize: "1.05rem",
                                      width: "28px",
                                      height: "28px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      backgroundColor: "var(--surface-raised)",
                                      borderRadius: "6px",
                                      flexShrink: 0,
                                    }}
                                  >
                                    {cat.icon}
                                  </span>
                                  <div style={{ overflow: "hidden" }}>
                                    <div style={{ fontSize: "0.8rem", fontWeight: 700, whiteSpace: "nowrap" }}>
                                      {cat.name}
                                    </div>
                                    <div
                                      style={{
                                        fontSize: "0.64rem",
                                        color: "var(--foreground-muted)",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: "155px",
                                      }}
                                    >
                                      {cat.subtags.slice(0, 3).join(", ")}
                                    </div>
                                  </div>
                                </div>
                                {cat.badge && (
                                  <span
                                    style={{
                                      fontSize: "0.58rem",
                                      fontWeight: 900,
                                      padding: "2px 6px",
                                      borderRadius: "4px",
                                      backgroundColor: `${cat.accentColor}22`,
                                      color: cat.accentColor,
                                      border: `1px solid ${cat.accentColor}44`,
                                      flexShrink: 0,
                                    }}
                                  >
                                    {cat.badge}
                                  </span>
                                )}
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Col 3: Custom Studio & Armor Finishes (Exact 8 items matching row height!) */}
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <div
                            style={{
                              fontSize: "0.68rem",
                              fontWeight: 900,
                              letterSpacing: "0.14em",
                              textTransform: "uppercase",
                              color: "var(--secondary-accent)",
                              marginBottom: "10px",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              height: "20px",
                            }}
                          >
                            <span>⚡</span>
                            <span>CUSTOM STUDIO & ARMOR</span>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                            {/* 4 Customizer Editions */}
                            {[
                              { id: "couples", icon: "💕", name: "Couples Edition", tag: "Initials, matching covers", badge: "CUSTOM" },
                              { id: "pets", icon: "🐶", name: "Pet Portrait", tag: "Upload your dog/cat photo", badge: "CUSTOM" },
                              { id: "photo-custom", icon: "📸", name: "Photo Customizer", tag: "Personal photos & polaroids", badge: "CUSTOM" },
                              { id: "name-initials", icon: "✍️", name: "Name & Monogram", tag: "Custom name & typography", badge: "CUSTOM" },
                            ].map((item) => (
                              <Link
                                key={item.id}
                                href={`/customize?theme=${item.id}`}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  padding: "6px 8px",
                                  borderRadius: "8px",
                                  textDecoration: "none",
                                  color: "var(--foreground)",
                                  transition: "all 0.15s ease",
                                  height: "38px",
                                  boxSizing: "border-box",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = "rgba(236, 72, 153, 0.12)";
                                  e.currentTarget.style.transform = "translateX(3px)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = "transparent";
                                  e.currentTarget.style.transform = "translateX(0)";
                                }}
                              >
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", overflow: "hidden" }}>
                                  <span
                                    style={{
                                      fontSize: "1.05rem",
                                      width: "28px",
                                      height: "28px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      backgroundColor: "rgba(236, 72, 153, 0.14)",
                                      borderRadius: "6px",
                                      flexShrink: 0,
                                    }}
                                  >
                                    {item.icon}
                                  </span>
                                  <div style={{ overflow: "hidden" }}>
                                    <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--secondary-accent)", whiteSpace: "nowrap" }}>
                                      {item.name}
                                    </div>
                                    <div
                                      style={{
                                        fontSize: "0.64rem",
                                        color: "var(--foreground-muted)",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: "155px",
                                      }}
                                    >
                                      {item.tag}
                                    </div>
                                  </div>
                                </div>
                                <span
                                  style={{
                                    fontSize: "0.58rem",
                                    fontWeight: 900,
                                    padding: "2px 6px",
                                    borderRadius: "4px",
                                    backgroundColor: "rgba(236, 72, 153, 0.15)",
                                    color: "var(--secondary-accent)",
                                    border: "1px solid rgba(236, 72, 153, 0.3)",
                                    flexShrink: 0,
                                  }}
                                >
                                  {item.badge}
                                </span>
                              </Link>
                            ))}

                            {/* 4 Armor Finishes */}
                            {[
                              { icon: "🧲", name: "Ultra Impact MagSafe", tag: "12ft Drop Tested • N52 Magnets", badge: "12FT" },
                              { icon: "🛡️", name: "Tough Armor Dual-Layer", tag: "TPU + Rigid Polycarbonate", badge: "ARMOR" },
                              { icon: "💎", name: "9H Tempered Glass", tag: "High-Gloss Mirror Finish", badge: "GLASS" },
                              { icon: "⚡", name: "Matte Slim EDC", tag: "1.2mm Featherweight Profile", badge: "SLIM" },
                            ].map((finish) => (
                              <Link
                                key={finish.name}
                                href="/categories"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  padding: "6px 8px",
                                  borderRadius: "8px",
                                  textDecoration: "none",
                                  color: "var(--foreground)",
                                  transition: "all 0.15s ease",
                                  height: "38px",
                                  boxSizing: "border-box",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = "var(--surface-raised)";
                                  e.currentTarget.style.transform = "translateX(3px)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = "transparent";
                                  e.currentTarget.style.transform = "translateX(0)";
                                }}
                              >
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", overflow: "hidden" }}>
                                  <span
                                    style={{
                                      fontSize: "1.05rem",
                                      width: "28px",
                                      height: "28px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      backgroundColor: "var(--surface-raised)",
                                      borderRadius: "6px",
                                      flexShrink: 0,
                                    }}
                                  >
                                    {finish.icon}
                                  </span>
                                  <div style={{ overflow: "hidden" }}>
                                    <div style={{ fontSize: "0.8rem", fontWeight: 700, whiteSpace: "nowrap" }}>
                                      {finish.name}
                                    </div>
                                    <div
                                      style={{
                                        fontSize: "0.64rem",
                                        color: "var(--foreground-muted)",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: "155px",
                                      }}
                                    >
                                      {finish.tag}
                                    </div>
                                  </div>
                                </div>
                                <span
                                  style={{
                                    fontSize: "0.58rem",
                                    fontWeight: 900,
                                    padding: "2px 6px",
                                    borderRadius: "4px",
                                    backgroundColor: "rgba(124, 58, 237, 0.15)",
                                    color: "var(--main-accent)",
                                    border: "1px solid rgba(124, 58, 237, 0.3)",
                                    flexShrink: 0,
                                  }}
                                >
                                  {finish.badge}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Footer CTA in dropdown */}
                      <div
                        style={{
                          borderTop: "1px solid var(--surface-border)",
                          marginTop: "1.1rem",
                          paddingTop: "0.85rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ fontSize: "0.72rem", color: "var(--foreground-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
                          <span>🛡️</span>
                          <span>12ft Mil-Spec Drop Tested • 🧲 MagSafe Ready • 🚀 Free Shipping Pan-India over ₹799</span>
                        </span>
                        <Link
                          href="/shop"
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 800,
                            color: "var(--main-accent)",
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <span>Explore All Phone Cases</span>
                          <span>→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Custom Studio */}
                <Link
                  href="/customize"
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--secondary-accent)",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    backgroundColor: "rgba(236, 72, 153, 0.08)",
                    border: "1px solid rgba(236, 72, 153, 0.2)",
                  }}
                >
                  <span>⚡</span>
                  <span>Custom Studio</span>
                </Link>

                {/* Track Order */}
                <Link
                  href="/track-order"
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--foreground-muted)",
                    textDecoration: "none",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--main-accent)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--foreground-muted)")}
                >
                  Track Order
                </Link>

                {/* Checkout */}
                <Link
                  href="/checkout"
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--foreground-muted)",
                    textDecoration: "none",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--main-accent)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--foreground-muted)")}
                >
                  Checkout
                </Link>
              </nav>
            </div>

            {/* Right Action Suite */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--surface-border)",
                  borderRadius: "8px",
                  color: "var(--foreground)",
                  height: "38px",
                  padding: "0 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  cursor: "pointer",
                  fontFamily: "var(--font-heading)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--main-accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--surface-border)")}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <span className="search-text-label">Search</span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle Theme"
                style={{
                  background: "transparent",
                  border: "1px solid var(--surface-border)",
                  borderRadius: "8px",
                  color: "var(--foreground-muted)",
                  width: "38px",
                  height: "38px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--main-accent)";
                  e.currentTarget.style.color = "var(--main-accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--surface-border)";
                  e.currentTarget.style.color = "var(--foreground-muted)";
                }}
              >
                {theme === "dark" ? (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                ) : (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>

              {/* API Badge Link */}
              <Link
                href="/api"
                className="desktop-utility-links"
                style={{
                  height: "38px",
                  padding: "0 10px",
                  borderRadius: "8px",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  backgroundColor: "rgba(16, 185, 129, 0.06)",
                  color: "#059669",
                  fontFamily: "var(--font-heading)",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(16, 185, 129, 0.15)";
                  e.currentTarget.style.borderColor = "#059669";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(16, 185, 129, 0.06)";
                  e.currentTarget.style.borderColor = "rgba(16, 185, 129, 0.3)";
                }}
              >
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }} />
                <span>API</span>
              </Link>

              {/* Admin Badge Link */}
              <Link
                href="/admin"
                className="desktop-utility-links"
                style={{
                  height: "38px",
                  padding: "0 10px",
                  borderRadius: "8px",
                  border: "1px solid rgba(124, 58, 237, 0.35)",
                  backgroundColor: "rgba(124, 58, 237, 0.06)",
                  color: "var(--main-accent)",
                  fontFamily: "var(--font-heading)",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--main-accent)";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(124, 58, 237, 0.06)";
                  e.currentTarget.style.color = "var(--main-accent)";
                }}
              >
                <span>🛡️</span>
                <span>Admin</span>
              </Link>

              {/* Account / User Menu Dropdown */}
              <div
                ref={accountRef}
                className="nav-dropdown-container"
                style={{ position: "relative" }}
                onMouseEnter={() => setAccountMenuOpen(true)}
                onMouseLeave={() => setAccountMenuOpen(false)}
              >
                <Link
                  href={user ? "/account" : "/login"}
                  style={{
                    height: "38px",
                    padding: "0 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--surface-border)",
                    backgroundColor: "var(--surface)",
                    color: "var(--foreground)",
                    fontFamily: "var(--font-heading)",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--main-accent)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--surface-border)")}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>{user ? user.name.split(" ")[0] : "Account"}</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </Link>

                {/* Account Dropdown Menu */}
                <div className={`nav-dropdown-card align-right${accountMenuOpen ? " is-open" : ""}`}>
                  <div className="nav-dropdown-inner" style={{ minWidth: "240px" }}>
                    {user ? (
                      <>
                        <div style={{ padding: "6px 8px 10px", borderBottom: "1px solid var(--surface-border)", marginBottom: "6px" }}>
                          <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--foreground)" }}>{user.name}</div>
                          <div style={{ fontSize: "0.7rem", color: "var(--foreground-muted)" }}>{user.email}</div>
                          <span
                            style={{
                              display: "inline-block",
                              marginTop: "6px",
                              backgroundColor: "var(--surface-raised)",
                              color: "var(--main-accent)",
                              fontSize: "0.65rem",
                              fontWeight: 900,
                              padding: "2px 8px",
                              borderRadius: "999px",
                            }}
                          >
                            ⭐ {user.tier} Tier
                          </span>
                        </div>

                        <Link
                          href="/account"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px",
                            borderRadius: "6px",
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            textDecoration: "none",
                            color: "var(--foreground)",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--surface-raised)")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        >
                          <span>👤</span>
                          <span>My Profile & Orders</span>
                        </Link>

                        <Link
                          href="/saved-designs"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px",
                            borderRadius: "6px",
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            textDecoration: "none",
                            color: "var(--foreground)",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--surface-raised)")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        >
                          <span>💾</span>
                          <span>Saved Custom Cases</span>
                        </Link>

                        <Link
                          href="/track-order"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px",
                            borderRadius: "6px",
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            textDecoration: "none",
                            color: "var(--foreground)",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--surface-raised)")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        >
                          <span>📦</span>
                          <span>Track Active Order</span>
                        </Link>

                        <div style={{ borderTop: "1px solid var(--surface-border)", margin: "6px 0" }} />

                        <button
                          onClick={() => logout()}
                          style={{
                            width: "100%",
                            textAlign: "left",
                            background: "transparent",
                            border: "none",
                            padding: "8px",
                            borderRadius: "6px",
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            color: "#ef4444",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.08)")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        >
                          <span>🚪</span>
                          <span>Sign Out</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <div style={{ padding: "6px 8px 10px", borderBottom: "1px solid var(--surface-border)", marginBottom: "6px" }}>
                          <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--foreground)" }}>Welcome to Hachiman</div>
                          <div style={{ fontSize: "0.72rem", color: "var(--foreground-muted)" }}>Sign in to view orders & saved armor</div>
                        </div>

                        <Link
                          href="/login"
                          style={{
                            display: "block",
                            textAlign: "center",
                            backgroundColor: "var(--main-accent)",
                            color: "#ffffff",
                            padding: "8px",
                            borderRadius: "6px",
                            fontSize: "0.78rem",
                            fontWeight: 800,
                            textDecoration: "none",
                            marginBottom: "6px",
                          }}
                        >
                          🔐 Login / Sign In
                        </Link>

                        <Link
                          href="/login"
                          style={{
                            display: "block",
                            textAlign: "center",
                            border: "1px solid var(--surface-border)",
                            color: "var(--foreground)",
                            padding: "8px",
                            borderRadius: "6px",
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            textDecoration: "none",
                            marginBottom: "6px",
                          }}
                        >
                          Create Free Account
                        </Link>

                        <div style={{ borderTop: "1px solid var(--surface-border)", margin: "6px 0" }} />

                        <Link
                          href="/track-order"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "6px 8px",
                            borderRadius: "6px",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            textDecoration: "none",
                            color: "var(--foreground-muted)",
                          }}
                        >
                          <span>📦</span>
                          <span>Track Order (Guest Mode)</span>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Global Device Selector Pill Button */}
              <button
                onClick={() => openDevicePicker()}
                title={`Currently Selected Phone: ${selectedModel}. Click to change model.`}
                className="navbar-device-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--surface-border)",
                  borderRadius: "8px",
                  height: "38px",
                  padding: "0 10px",
                  color: "var(--foreground)",
                  cursor: "pointer",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--main-accent)";
                  e.currentTarget.style.backgroundColor = "var(--surface-raised)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--surface-border)";
                  e.currentTarget.style.backgroundColor = "var(--surface)";
                }}
              >
                <span style={{ fontSize: "0.95rem" }}>📱</span>
                <span style={{ maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {selectedModel}
                </span>
                <span style={{ fontSize: "0.65rem", color: "var(--foreground-muted)", marginLeft: "2px" }}>▾</span>
              </button>

              {/* Cart Drawer Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                aria-label="View Cart"
                style={{
                  backgroundColor: "var(--main-accent)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  height: "38px",
                  padding: "0 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  fontFamily: "var(--font-heading)",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  boxShadow: "0 4px 15px rgba(124, 58, 237, 0.3)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--main-accent-dark)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--main-accent)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                <span className="cart-text-label">Cart</span>
                <span
                  style={{
                    backgroundColor: "var(--secondary-accent)",
                    color: "#ffffff",
                    borderRadius: "999px",
                    padding: "2px 7px",
                    fontSize: "0.68rem",
                    fontWeight: 900,
                  }}
                >
                  {totalItems}
                </span>
              </button>

              {/* Mobile Hamburger Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Navigation Menu"
                className="mobile-menu-btn"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--surface-border)",
                  borderRadius: "8px",
                  color: "var(--foreground)",
                  width: "38px",
                  height: "38px",
                  cursor: "pointer",
                }}
              >
                {mobileMenuOpen ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* 3. MOBILE MENU EXPANDABLE DRAWER */}
          {mobileMenuOpen && (
            <div
              style={{
                marginTop: "1rem",
                padding: "1.25rem",
                backgroundColor: "var(--surface)",
                borderRadius: "14px",
                boxShadow: "0 15px 35px rgba(0,0,0,0.12)",
                border: "1px solid var(--surface-border)",
                display: "flex",
                flexDirection: "column",
                gap: "1.2rem",
              }}
            >
              {/* User Account Quick Card in Mobile */}
              <div
                style={{
                  padding: "0.85rem",
                  borderRadius: "10px",
                  backgroundColor: "var(--surface-raised)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "50%",
                      backgroundColor: "var(--main-accent)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                    }}
                  >
                    {user ? user.name.charAt(0) : "👤"}
                  </div>
                  <div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--foreground)" }}>
                      {user ? user.name : "Guest User"}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "var(--foreground-muted)" }}>
                      {user ? `${user.tier} Tier` : "Sign in for VIP discounts"}
                    </div>
                  </div>
                </div>

                <Link
                  href={user ? "/account" : "/login"}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    padding: "5px 10px",
                    borderRadius: "6px",
                    backgroundColor: "var(--main-accent)",
                    color: "#ffffff",
                    textDecoration: "none",
                  }}
                >
                  {user ? "Dashboard" : "Login"}
                </Link>
              </div>

              {/* Mobile Device Selector Card */}
              <div
                onClick={() => {
                  openDevicePicker();
                  setMobileMenuOpen(false);
                }}
                style={{
                  padding: "0.85rem 1rem",
                  borderRadius: "10px",
                  backgroundColor: "rgba(124, 58, 237, 0.1)",
                  border: "1px solid rgba(124, 58, 237, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "1.3rem" }}>📱</span>
                  <div>
                    <div style={{ fontSize: "0.65rem", fontWeight: 800, color: "var(--main-accent)", textTransform: "uppercase" }}>
                      Active Phone Model
                    </div>
                    <div style={{ fontSize: "0.92rem", fontWeight: 900, color: "var(--foreground)" }}>
                      {selectedModel}
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--main-accent)" }}>
                  Change →
                </span>
              </div>

              {/* Mobile Quick Action Buttons */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <Link
                  href="/track-order"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    padding: "9px",
                    borderRadius: "8px",
                    border: "1px solid var(--surface-border)",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    textDecoration: "none",
                    color: "var(--foreground)",
                  }}
                >
                  <span>📦</span>
                  <span>Track Order</span>
                </Link>

                <Link
                  href="/checkout"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    padding: "9px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(124, 58, 237, 0.1)",
                    border: "1px solid rgba(124, 58, 237, 0.3)",
                    fontSize: "0.78rem",
                    fontWeight: 800,
                    textDecoration: "none",
                    color: "var(--main-accent)",
                  }}
                >
                  <span>💳</span>
                  <span>Checkout</span>
                </Link>
              </div>

              {/* Nav List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <Link
                  href="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", color: "var(--foreground)", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span>📱</span>
                  <span>Phone Cases Catalog</span>
                </Link>

                <Link
                  href="/categories"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", color: "var(--foreground)", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span>📂</span>
                  <span>Case Categories & Finishes (20+)</span>
                </Link>

                {/* Mobile Quick Category Badges */}
                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                    overflowX: "auto",
                    paddingBottom: "6px",
                    WebkitOverflowScrolling: "touch",
                  }}
                >
                  {CATEGORIES.slice(1, 10).map((c) => (
                    <Link
                      key={c.id}
                      href={`/shop?universe=${c.id}`}
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        whiteSpace: "nowrap",
                        padding: "4px 8px",
                        borderRadius: "20px",
                        backgroundColor: "var(--surface-raised)",
                        border: "1px solid var(--surface-border)",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        color: "var(--foreground)",
                        textDecoration: "none",
                        flexShrink: 0,
                      }}
                    >
                      <span>{c.icon}</span>
                      <span>{c.name}</span>
                    </Link>
                  ))}
                </div>


                <Link
                  href="/customize"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ fontSize: "0.85rem", fontWeight: 800, textTransform: "uppercase", color: "var(--secondary-accent)", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span>⚡</span>
                  <span>Custom 3D Armor Studio</span>
                </Link>

                <Link
                  href="/saved-designs"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", color: "var(--foreground)", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span>💾</span>
                  <span>Saved Custom Designs</span>
                </Link>

                <div style={{ borderTop: "1px solid var(--surface-border)", margin: "4px 0" }} />

                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", color: "var(--foreground)", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span>👤</span>
                  <span>My Account & Orders</span>
                </Link>

                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ fontSize: "0.85rem", fontWeight: 800, textTransform: "uppercase", color: "var(--main-accent)", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span>🛡️</span>
                  <span>Admin Command Console</span>
                </Link>

                <Link
                  href="/api"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ fontSize: "0.85rem", fontWeight: 800, textTransform: "uppercase", color: "#059669", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span>⚡</span>
                  <span>Developer REST API Docs</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
