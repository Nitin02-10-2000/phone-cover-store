"use client";

import React from "react";
import { UNIVERSES } from "@/data/products";

interface UniverseBarProps {
  selectedUniverse: string;
  onSelectUniverse: (id: string) => void;
}

export default function UniverseBar({
  selectedUniverse,
  onSelectUniverse,
}: UniverseBarProps) {
  return (
    <section
      id="universes"
      style={{
        padding: "3rem 0 2rem",
        backgroundColor: "var(--background)",
        borderBottom: "1px solid var(--surface-border)",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "0.2em",
                color: "var(--shinra-red)",
                textTransform: "uppercase",
                marginBottom: "4px",
              }}
            >
              Curated Series Collections
            </div>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                fontWeight: 900,
                color: "var(--foreground)",
                letterSpacing: "-0.02em",
              }}
            >
              CHOOSE YOUR UNIVERSE
            </h2>
          </div>

          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "var(--foreground-muted)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Filter Drops By Anime World
          </span>
        </div>

        {/* Universe Chips Carousel / Horizontal Scroll */}
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            overflowX: "auto",
            paddingBottom: "0.75rem",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {UNIVERSES.map((universe) => {
            const isSelected = selectedUniverse === universe.id;
            return (
              <button
                key={universe.id}
                onClick={() => onSelectUniverse(universe.id)}
                style={{
                  flexShrink: 0,
                  backgroundColor: isSelected ? "var(--shinra-red)" : "var(--surface)",
                  color: isSelected ? "#ffffff" : "var(--foreground)",
                  border: isSelected
                    ? "1px solid var(--shinra-red-bright)"
                    : "1px solid var(--surface-border)",
                  borderRadius: "6px",
                  padding: "10px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                  fontFamily: "var(--font-heading)",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  transition: "all 0.25s",
                  boxShadow: isSelected ? "0 4px 15px var(--shinra-red-glow)" : "none",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = "var(--shinra-red)";
                    e.currentTarget.style.backgroundColor = "var(--surface-raised)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = "var(--surface-border)";
                    e.currentTarget.style.backgroundColor = "var(--surface)";
                  }
                }}
              >
                <span>{universe.name}</span>
                {universe.badge && (
                  <span
                    style={{
                      fontSize: "0.65rem",
                      fontWeight: 800,
                      letterSpacing: "0.1em",
                      backgroundColor: isSelected ? "var(--primary)" : "var(--surface-raised)",
                      color: isSelected ? "#ffffff" : "var(--main-accent)",
                      padding: "2px 6px",
                      borderRadius: "3px",
                    }}
                  >
                    {universe.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
