"use client";

import React from "react";

export default function WhyCaseTadka() {
  const perks = [
    {
      icon: "🛡️",
      badge: "MIL-STD 810G",
      title: "12FT Shockproof Drop Armor",
      desc: "Dual-layer polymer chassis with interior air-pocket shock absorption and 1.8mm raised camera lip for extreme drop defense.",
    },
    {
      icon: "🌶️",
      badge: "LIFETIME PRINT",
      title: "Spicy High-Definition UV Print",
      desc: "Industrial UV-cured digital inks bonded beneath a scratch-proof hard coat. Vivid colors that never fade, chip, or peel.",
    },
    {
      icon: "⚡",
      badge: "EXPRESS DISPATCH",
      title: "Rapid Pan-India Shipping",
      desc: "Precision printed and hand-inspected in 24-48 hrs. Delivered within 2-4 business days via Bluedart Air & Delhivery.",
    },
    {
      icon: "🔄",
      badge: "RISK-FREE",
      title: "Zero-Hassle Free Replacement",
      desc: "Courier damage or fit imperfection? Drop us a quick photo on WhatsApp and we dispatch a fresh case right away.",
    },
  ];

  return (
    <section
      id="why-casetadka"
      style={{
        padding: "4.5rem 0",
        backgroundColor: "var(--background)",
        borderBottom: "1px solid var(--surface-border)",
        position: "relative",
      }}
    >
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div className="shinra-badge shinra-badge-red" style={{ marginBottom: "0.85rem" }}>
            <span>THE CASE TADKA PROMISE</span>
          </div>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
              fontWeight: 900,
              color: "var(--foreground)",
              letterSpacing: "-0.02em",
            }}
          >
            GOOD COVERS. BETTER VIBES.
          </h2>
          <p
            style={{
              color: "var(--foreground-muted)",
              fontSize: "0.95rem",
              maxWidth: "600px",
              margin: "0.6rem auto 0",
              lineHeight: 1.6,
            }}
          >
            — DESI VIBES. GLOBAL STYLE. —
            <br />
            Engineered with high-tensile shock absorption, MagSafe N52 magnets, and tactile button responsiveness.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {perks.map((p, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--surface-border)",
                borderRadius: "12px",
                padding: "1.85rem",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--main-accent)";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 28px rgba(0, 0, 0, 0.1), 0 0 24px var(--tadka-red-glow)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--surface-border)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <span style={{ fontSize: "2.2rem" }}>{p.icon}</span>
                  <span
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                      color: "var(--main-accent)",
                      backgroundColor: "var(--accent-glow)",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      border: "1px solid rgba(255, 42, 58, 0.2)",
                    }}
                  >
                    {p.badge}
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.15rem",
                    fontWeight: 800,
                    color: "var(--foreground)",
                    marginBottom: "0.6rem",
                  }}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.88rem",
                    color: "var(--foreground-muted)",
                    lineHeight: 1.55,
                    margin: 0,
                  }}
                >
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
