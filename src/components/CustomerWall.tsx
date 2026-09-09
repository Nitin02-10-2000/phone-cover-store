"use client";

import React from "react";
import { TESTIMONIALS } from "@/data/products";

export default function CustomerWall() {
  return (
    <section
      style={{
        padding: "4.5rem 0",
        backgroundColor: "var(--background)",
        borderBottom: "1px solid var(--surface-border)",
      }}
    >
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div className="shinra-badge" style={{ marginBottom: "0.85rem" }}>
            <span>COMMUNITY SHOWCASE</span>
          </div>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)",
              fontWeight: 900,
              color: "var(--foreground)",
              marginBottom: "0.5rem",
            }}
          >
            VERIFIED WALLS & SETUPS
          </h2>
          <p style={{ color: "var(--foreground-muted)", fontSize: "0.92rem" }}>
            Over 10,000+ anime sanctums transformed across India.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--surface-border)",
                borderRadius: "8px",
                padding: "1.75rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.03)",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    color: "#facc15",
                    fontSize: "0.9rem",
                    marginBottom: "1rem",
                  }}
                >
                  {"★".repeat(t.rating)}
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                      backgroundColor: "rgba(34, 197, 94, 0.1)",
                      color: "#22c55e",
                      padding: "2px 8px",
                      borderRadius: "3px",
                    }}
                  >
                    ✓ VERIFIED BUYER
                  </span>
                </div>

                <p
                  style={{
                    fontSize: "0.92rem",
                    color: "var(--foreground)",
                    lineHeight: 1.6,
                    fontStyle: "italic",
                    marginBottom: "1.5rem",
                  }}
                >
                  &ldquo;{t.text}&rdquo;
                </p>
              </div>

              <div
                style={{
                  borderTop: "1px solid var(--surface-border)",
                  paddingTop: "1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--foreground)" }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--foreground-muted)" }}>
                    {t.city}
                  </div>
                </div>

                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "var(--shinra-red)",
                    textTransform: "uppercase",
                  }}
                >
                  {t.product}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
