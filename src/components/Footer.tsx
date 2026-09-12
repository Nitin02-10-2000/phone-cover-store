"use client";

import React, { useState } from "react";
import CaseTadkaLogo from "@/components/CaseTadkaLogo";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <footer
      style={{
        backgroundColor: "#111111",
        borderTop: "1px solid #222226",
        color: "#ffffff",
        padding: "4.5rem 0 2rem",
      }}
    >
      <div className="container">
        {/* Newsletter Callout */}
        <div
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--surface-border)",
            borderRadius: "8px",
            padding: "2.5rem 2rem",
            marginBottom: "4rem",
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "2rem",
            alignItems: "center",
          }}
          className="newsletter-box"
        >
          <style jsx>{`
            @media (min-width: 860px) {
              .newsletter-box {
                grid-template-columns: 1.2fr 1fr !important;
              }
            }
          `}</style>

          <div>
            <div className="shinra-badge" style={{ marginBottom: "0.5rem" }}>
              <span>JOIN THE TADKA FAM</span>
            </div>
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                fontWeight: 900,
                color: "var(--foreground)",
                marginBottom: "0.5rem",
              }}
            >
              LEVEL UP YOUR GEAR.
            </h3>
            <p style={{ color: "var(--foreground-muted)", fontSize: "0.9rem" }}>
              Get secret drop releases, exclusive collector discounts & 10% off your first order.
            </p>
          </div>

          <div>
            {subscribed ? (
              <div
                style={{
                  backgroundColor: "rgba(34, 197, 94, 0.15)",
                  border: "1px solid #22c55e",
                  color: "#22c55e",
                  padding: "12px 16px",
                  borderRadius: "6px",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                }}
              >
                🎉 Welcome to Case Tadka! Use code <span style={{ color: "#FF2A3A", fontWeight: 900 }}>TADKA10</span> for 10% off.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: "flex", gap: "8px" }}>
                <input
                  type="email"
                  required
                  placeholder="ENTER YOUR EMAIL..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    flex: 1,
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--surface-border)",
                    borderRadius: "4px",
                    padding: "10px 14px",
                    color: "var(--foreground)",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                  }}
                />
                <button
                  type="submit"
                  className="shinra-btn shinra-btn-primary"
                  style={{ fontSize: "0.78rem", padding: "0 18px", borderRadius: "4px" }}
                >
                  CLAIM 10%
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Links Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "2.5rem",
            marginBottom: "3.5rem",
          }}
        >
          {/* Brand Info */}
          <div style={{ maxWidth: "280px" }}>
            <div style={{ marginBottom: "1.2rem" }}>
              <CaseTadkaLogo variant="full" size="md" textColor="#ffffff" />
            </div>
            <p style={{ color: "#9ca3af", fontSize: "0.85rem", lineHeight: 1.6, marginBottom: "1rem" }}>
              India&apos;s home for vibrant, high-protection phone armor and custom cases. Desi Vibes. Global Style.
            </p>
            <div style={{ fontSize: "0.78rem", color: "#FF2A3A", fontWeight: 800 }}>
              support@casetadka.com • Pan-India Fast Track
            </div>
          </div>

          {/* Popular Universes & Shop */}
          <div>
            <h4
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "0.9rem",
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: "0.1em",
                marginBottom: "1.2rem",
              }}
            >
              EXPLORE CATALOG
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.85rem" }}>
              <li>
                <a href="/shop" style={{ color: "var(--foreground-muted)", textDecoration: "none" }}>
                  All Anime Prints & Gear
                </a>
              </li>
              <li>
                <a href="/categories" style={{ color: "var(--foreground-muted)", textDecoration: "none" }}>
                  Shop by Categories & Finishes
                </a>
              </li>
              <li>
                <a href="/customize" style={{ color: "var(--shinra-red)", fontWeight: 700, textDecoration: "none" }}>
                  ⚡ Custom 3D Armor Studio
                </a>
              </li>
              <li>
                <a href="/saved-designs" style={{ color: "var(--foreground-muted)", textDecoration: "none" }}>
                  Saved Custom Designs
                </a>
              </li>
            </ul>
          </div>

          {/* Formats & Order Flow */}
          <div>
            <h4
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "0.9rem",
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: "0.1em",
                marginBottom: "1.2rem",
              }}
            >
              SHOPPING & BAG
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.85rem" }}>
              <li>
                <a href="/cart" style={{ color: "var(--foreground-muted)", textDecoration: "none" }}>
                  Shopping Bag & Tier Savings
                </a>
              </li>
              <li>
                <a href="/checkout" style={{ color: "var(--foreground-muted)", textDecoration: "none" }}>
                  Pan-India Instant Checkout
                </a>
              </li>
              <li>
                <a href="/categories" style={{ color: "var(--foreground-muted)", textDecoration: "none" }}>
                  Museum Acrylics & Metal
                </a>
              </li>
              <li>
                <a href="/shop?format=Tough+Case" style={{ color: "var(--foreground-muted)", textDecoration: "none" }}>
                  iPhone & Samsung MagSafe Cases
                </a>
              </li>
            </ul>
          </div>

          {/* Trust, Account & Command */}
          <div>
            <h4
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "0.9rem",
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: "0.1em",
                marginBottom: "1.2rem",
              }}
            >
              COLLECTOR HUB
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.85rem" }}>
              <li>
                <a href="/track-order" style={{ color: "var(--foreground-muted)", textDecoration: "none" }}>
                  Live Telemetry Order Tracker
                </a>
              </li>
              <li>
                <a href="/account" style={{ color: "var(--foreground-muted)", textDecoration: "none" }}>
                  Hunter Account & Orders
                </a>
              </li>
              <li>
                <a href="/login" style={{ color: "var(--foreground-muted)", textDecoration: "none" }}>
                  Operative Sign In
                </a>
              </li>
              <li>
                <a href="/admin" style={{ color: "var(--foreground-muted)", textDecoration: "none", opacity: 0.7 }}>
                  Hachiman Ops Terminal (Admin)
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Payments & Copyright */}
        <div
          style={{
            borderTop: "1px solid var(--surface-border)",
            paddingTop: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            fontSize: "0.75rem",
            color: "var(--foreground-muted)",
          }}
        >
          <div>
            © {new Date().getFullYear()} CASE TADKA. All Rights Reserved. Desi Vibes. Global Style.
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700 }}>
            <span style={{ color: "#9ca3af" }}>ACCEPTED:</span>
            <span style={{ backgroundColor: "#1e1e24", border: "1px solid #2d2d35", padding: "2px 8px", borderRadius: "3px", color: "#ffffff" }}>
              UPI (GPay / PhonePe)
            </span>
            <span style={{ backgroundColor: "#1e1e24", border: "1px solid #2d2d35", padding: "2px 8px", borderRadius: "3px", color: "#ffffff" }}>
              Cards
            </span>
            <span style={{ backgroundColor: "#1e1e24", border: "1px solid #2d2d35", padding: "2px 8px", borderRadius: "3px", color: "#ffffff" }}>
              NetBanking
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
