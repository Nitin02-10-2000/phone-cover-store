"use client";

import React from "react";

export default function WhyHachiman() {
  const perks = [
    {
      icon: "🛡️",
      title: "Quality Guaranteed",
      desc: "OEKO-TEX certified inks on heavy 300 GSM gallery art board or military-spec shock armor.",
    },
    {
      icon: "📦",
      title: "Packed with Armor",
      desc: "Protective rigid carton tubes and shockproof multi-layer corner guards for zero transit bends.",
    },
    {
      icon: "⚡",
      title: "Rapid Pan-India Shipping",
      desc: "Handcrafted made-to-order in 24-48 hrs. Delivered within 3-7 business days across India.",
    },
    {
      icon: "🔄",
      title: "Zero-Risk Free Replacement",
      desc: "Damage in courier? Send a quick photo within 7 days and we dispatch a fresh unit immediately.",
    },
  ];

  return (
    <section
      id="why-hachiman"
      style={{
        padding: "4rem 0",
        backgroundColor: "var(--background)",
        borderBottom: "1px solid var(--surface-border)",
      }}
    >
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div className="hachiman-badge" style={{ marginBottom: "0.85rem" }}>
            <span>THE HACHIMAN STANDARD</span>
          </div>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)",
              fontWeight: 900,
              color: "var(--foreground)",
            }}
          >
            WHY CHOOSE HACHIMAN ARMOR?
          </h2>
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
                borderRadius: "8px",
                padding: "1.75rem",
                transition: "all 0.25s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--main-accent)";
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--surface-border)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{p.icon}</div>
              <h3
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.1rem",
                  fontWeight: 800,
                  color: "var(--foreground)",
                  marginBottom: "0.5rem",
                }}
              >
                {p.title}
              </h3>
              <p
                style={{
                  fontSize: "0.88rem",
                  color: "var(--foreground-muted)",
                  lineHeight: 1.5,
                }}
              >
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
