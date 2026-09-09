"use client";

import React, { useState } from "react";
import { FAQS } from "@/data/products";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      style={{
        padding: "4.5rem 0",
        backgroundColor: "var(--background)",
        borderBottom: "1px solid var(--surface-border)",
      }}
    >
      <div className="container" style={{ maxWidth: "850px" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div className="shinra-badge" style={{ marginBottom: "0.85rem" }}>
            <span>GOT QUESTIONS?</span>
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
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p style={{ color: "var(--foreground-muted)", fontSize: "0.92rem" }}>
            Everything you need to know about our prints, cases, packaging, and delivery.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: "var(--surface)",
                  border: isOpen
                    ? "1px solid var(--shinra-red)"
                    : "1px solid var(--surface-border)",
                  borderRadius: "8px",
                  overflow: "hidden",
                  transition: "all 0.2s",
                }}
              >
                <button
                  onClick={() => toggle(idx)}
                  style={{
                    width: "100%",
                    padding: "1.25rem 1.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem",
                    backgroundColor: "transparent",
                    border: "none",
                    color: "var(--foreground)",
                    textAlign: "left",
                    cursor: "pointer",
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                  }}
                >
                  <span>{faq.q}</span>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      backgroundColor: isOpen ? "var(--shinra-red)" : "var(--surface-raised)",
                      color: isOpen ? "#ffffff" : "var(--foreground-muted)",
                      fontSize: "0.85rem",
                      fontWeight: 800,
                      transform: isOpen ? "rotate(180deg)" : "rotate(0)",
                      transition: "transform 0.25s",
                      flexShrink: 0,
                    }}
                  >
                    ▼
                  </span>
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: "0 1.5rem 1.25rem",
                      color: "var(--foreground-muted)",
                      fontSize: "0.92rem",
                      lineHeight: 1.6,
                      borderTop: "1px solid var(--surface-border)",
                      marginTop: "4px",
                      paddingTop: "0.75rem",
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
