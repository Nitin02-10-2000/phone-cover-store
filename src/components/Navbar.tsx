"use client";

import React, { useState } from "react";
import { useCart } from "@/lib/cartContext";

export default function Navbar() {
  const { totalItems, setIsCartOpen, setIsSearchOpen, theme, toggleTheme } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top Ticker / Marquee */}
      <div
        style={{
          backgroundColor: "var(--primary)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          color: "#ffffff",
          fontSize: "0.72rem",
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          padding: "7px 0",
        }}
        className="marquee-container"
      >
        <div className="marquee-content">
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

      {/* Main Sticky Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backgroundColor: "rgba(250, 249, 246, 0.94)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid var(--surface-border)",
        }}
      >
        <div className="container" style={{ padding: "0.9rem 1.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1.5rem",
            }}
          >
            {/* Brand Logo & Nav */}
            <div style={{ display: "flex", alignItems: "center", gap: "3rem" }}>
              <a
                href="/"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.65rem",
                  textDecoration: "none",
                }}
              >
                {/* Shinra Flame Icon */}
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
                      fontSize: "1.55rem",
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
                      fontSize: "0.58rem",
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
              </a>

              {/* Desktop Nav Links */}
              <nav
                style={{
                  display: "none",
                  gap: "1.75rem",
                  alignItems: "center",
                }}
                className="desktop-nav"
              >
                <style jsx>{`
                  @media (min-width: 900px) {
                    .desktop-nav {
                      display: flex !important;
                    }
                  }
                `}</style>
                <a
                  href="/shop"
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--foreground-muted)",
                    transition: "color 0.2s",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--main-accent)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--foreground-muted)")}
                >
                  Phone Cases
                </a>
                <a
                  href="/categories"
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--foreground-muted)",
                    transition: "color 0.2s",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--main-accent)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--foreground-muted)")}
                >
                  Case Finishes
                </a>
                <a
                  href="/customize"
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 800,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--secondary-accent)",
                    transition: "color 0.2s",
                    textDecoration: "none",
                  }}
                >
                  ⚡ Custom Studio
                </a>
                <a
                  href="/track-order"
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--foreground-muted)",
                    transition: "color 0.2s",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--main-accent)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--foreground-muted)")}
                >
                  Track Order
                </a>
                <a
                  href="/account"
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--foreground-muted)",
                    transition: "color 0.2s",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--main-accent)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--foreground-muted)")}
                >
                  Account
                </a>
                <a
                  href="/admin"
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--main-accent)",
                    padding: "5px 10px",
                    border: "1.5px solid rgba(124, 58, 237, 0.3)",
                    borderRadius: "6px",
                    transition: "all 0.2s",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--main-accent)";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "var(--main-accent)";
                  }}
                >
                  Admin Ops
                </a>
              </nav>
            </div>


            {/* Action Buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle Theme"
                style={{
                  background: "transparent",
                  border: "1px solid var(--surface-border)",
                  borderRadius: "6px",
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
                  e.currentTarget.style.borderColor = "var(--shinra-red)";
                  e.currentTarget.style.color = "var(--shinra-red)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--surface-border)";
                  e.currentTarget.style.color = "var(--foreground-muted)";
                }}
              >
                {theme === "dark" ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>

              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--surface-border)",
                  borderRadius: "6px",
                  color: "var(--foreground)",
                  height: "38px",
                  padding: "0 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  fontFamily: "var(--font-heading)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--shinra-red)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--surface-border)")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <span className="search-text">Search</span>
                <style jsx>{`
                  @media (max-width: 600px) {
                    .search-text {
                      display: none;
                    }
                  }
                `}</style>
              </button>

              {/* Cart Drawer Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                style={{
                  backgroundColor: "var(--main-accent)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  height: "40px",
                  padding: "0 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  fontFamily: "var(--font-heading)",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                <span className="cart-text">Cart</span>
                <style jsx>{`
                  @media (max-width: 480px) {
                    .cart-text {
                      display: none;
                    }
                  }
                `}</style>
                <span
                  style={{
                    backgroundColor: "var(--secondary-accent)",
                    color: "#ffffff",
                    borderRadius: "999px",
                    padding: "2px 8px",
                    fontSize: "0.7rem",
                    fontWeight: 900,
                  }}
                >
                  {totalItems}
                </span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Mobile Menu"
                style={{
                  background: "#ffffff",
                  border: "1px solid var(--surface-border)",
                  borderRadius: "8px",
                  color: "var(--foreground)",
                  width: "40px",
                  height: "40px",
                  display: "none",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                className="mobile-burger"
              >
                <style jsx>{`
                  @media (max-width: 899px) {
                    .mobile-burger {
                      display: flex !important;
                    }
                  }
                `}</style>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Dropdown */}
          {mobileMenuOpen && (
            <div
              style={{
                marginTop: "1rem",
                padding: "1.25rem",
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                border: "1px solid var(--surface-border)",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <a
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--foreground)", textDecoration: "none" }}
              >
                Phone Cases Catalog
              </a>
              <a
                href="/categories"
                onClick={() => setMobileMenuOpen(false)}
                style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--foreground)", textDecoration: "none" }}
              >
                Case Finishes & Defense Tiers
              </a>
              <a
                href="/customize"
                onClick={() => setMobileMenuOpen(false)}
                style={{ fontSize: "0.85rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--secondary-accent)", textDecoration: "none" }}
              >
                ⚡ Custom 3D Armor Studio
              </a>
              <a
                href="/track-order"
                onClick={() => setMobileMenuOpen(false)}
                style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--foreground)", textDecoration: "none" }}
              >
                Track Order
              </a>
              <a
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--foreground)", textDecoration: "none" }}
              >
                My Account
              </a>
              <a
                href="/saved-designs"
                onClick={() => setMobileMenuOpen(false)}
                style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--foreground)", textDecoration: "none" }}
              >
                Saved Custom Cases
              </a>
              <a
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                style={{ fontSize: "0.85rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--main-accent)", textDecoration: "none" }}
              >
                Admin Command
              </a>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
