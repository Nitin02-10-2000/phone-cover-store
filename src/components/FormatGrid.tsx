"use client";

import React from "react";
import { FORMATS } from "@/data/products";

export default function FormatGrid() {
  return (
    <section
      id="formats"
      style={{
        padding: "4.5rem 0",
        backgroundColor: "var(--background)",
        borderBottom: "1px solid var(--surface-border)",
        position: "relative",
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 3rem" }}>
          <div className="shinra-badge shinra-badge-red" style={{ marginBottom: "1rem" }}>
            <span>CASE TADKA ARMOR TIERS</span>
          </div>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.8rem, 4vw, 2.75rem)",
              fontWeight: 900,
              color: "var(--foreground)",
              marginBottom: "0.75rem",
              letterSpacing: "-0.02em",
            }}
          >
            CHOOSE YOUR CASE FORMAT
          </h2>
          <p
            style={{
              fontSize: "0.95rem",
              color: "var(--foreground-muted)",
              lineHeight: 1.6,
            }}
          >
            Good covers, better vibes. Pick the exact phone armor chassis engineered for your everyday carry and style.
          </p>
        </div>

        {/* Formats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {FORMATS.map((fmt) => (
            <div
              key={fmt.id}
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--surface-border)",
                borderRadius: "12px",
                padding: "1.75rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                position: "relative",
                overflow: "hidden",
              }}
              className="format-box"
            >
              <style jsx>{`
                .format-box:hover {
                  border-color: var(--main-accent);
                  transform: translateY(-4px);
                  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1), 0 0 20px var(--tadka-red-glow);
                }
              `}</style>

              {/* Top Row: Icon & Price */}
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "1rem",
                  }}
                >
                  <span style={{ fontSize: "2rem" }}>{fmt.icon}</span>
                  <span
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "0.85rem",
                      fontWeight: 800,
                      color: "var(--main-accent)",
                      backgroundColor: "var(--accent-glow)",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      border: "1px solid rgba(255, 42, 58, 0.2)",
                    }}
                  >
                    {fmt.priceText}
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.3rem",
                    fontWeight: 800,
                    color: "var(--foreground)",
                    marginBottom: "0.4rem",
                  }}
                >
                  {fmt.name}
                </h3>

                <div
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: "var(--main-accent)",
                    textTransform: "uppercase",
                    marginBottom: "0.85rem",
                  }}
                >
                  {fmt.specs}
                </div>

                <p
                  style={{
                    fontSize: "0.88rem",
                    color: "var(--foreground-muted)",
                    lineHeight: 1.5,
                    marginBottom: "1.5rem",
                  }}
                >
                  {fmt.description}
                </p>
              </div>

              <a
                href="#drops"
                className="shinra-btn shinra-btn-ghost"
                style={{
                  fontSize: "0.75rem",
                  padding: "0.6rem 1rem",
                  width: "100%",
                }}
              >
                <span>EXPLORE {fmt.name.toUpperCase()}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
