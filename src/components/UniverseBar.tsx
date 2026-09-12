"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { UNIVERSES } from "@/data/products";

interface UniverseBarProps {
  selectedUniverse: string;
  onSelectUniverse: (id: string) => void;
}

export default function UniverseBar({
  selectedUniverse,
  onSelectUniverse,
}: UniverseBarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 8);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 8);
    }
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    checkScroll();
    const handleResize = () => checkScroll();

    window.addEventListener("resize", handleResize);
    el.addEventListener("scroll", checkScroll, { passive: true });

    // Initial check after paint
    const timer = setTimeout(checkScroll, 150);

    return () => {
      window.removeEventListener("resize", handleResize);
      el.removeEventListener("scroll", checkScroll);
      clearTimeout(timer);
    };
  }, [checkScroll]);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollDistance = Math.max(scrollContainerRef.current.clientWidth * 0.6, 280);
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollDistance : scrollDistance,
        behavior: "smooth",
      });
    }
  };

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
              Curated Themes & Custom Editions
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
              EXPLORE BY CATEGORY
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
            Anime • Gaming • Cars • Aesthetic • Custom
          </span>
        </div>

        {/* Category Chips Carousel / Horizontal Scroll with Left & Right Arrows */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: "0.65rem",
          }}
        >
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={() => handleScroll("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll categories left"
            style={{
              flexShrink: 0,
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "var(--surface)",
              border: canScrollLeft
                ? "1px solid var(--surface-border)"
                : "1px solid rgba(255, 255, 255, 0.05)",
              color: canScrollLeft ? "var(--foreground)" : "var(--foreground-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: canScrollLeft ? "pointer" : "default",
              opacity: canScrollLeft ? 1 : 0.3,
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: canScrollLeft
                ? "0 4px 12px rgba(0, 0, 0, 0.25)"
                : "none",
              pointerEvents: canScrollLeft ? "auto" : "none",
              transform: "translateY(-4px)",
            }}
            onMouseEnter={(e) => {
              if (canScrollLeft) {
                e.currentTarget.style.borderColor = "var(--shinra-red)";
                e.currentTarget.style.backgroundColor = "var(--surface-raised)";
                e.currentTarget.style.color = "var(--shinra-red-bright)";
                e.currentTarget.style.boxShadow = "0 0 16px var(--shinra-red-glow)";
                e.currentTarget.style.transform = "translateY(-4px) scale(1.08)";
              }
            }}
            onMouseLeave={(e) => {
              if (canScrollLeft) {
                e.currentTarget.style.borderColor = "var(--surface-border)";
                e.currentTarget.style.backgroundColor = "var(--surface)";
                e.currentTarget.style.color = "var(--foreground)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.25)";
                e.currentTarget.style.transform = "translateY(-4px) scale(1)";
              }
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Chips Scrollable Area */}
          <div
            ref={scrollContainerRef}
            style={{
              display: "flex",
              gap: "0.75rem",
              overflowX: "auto",
              paddingBottom: "0.85rem",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              scrollBehavior: "smooth",
              flex: 1,
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
                    borderRadius: "8px",
                    padding: "10px 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    fontFamily: "var(--font-heading)",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
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
                  {universe.icon && <span style={{ fontSize: "1.05rem" }}>{universe.icon}</span>}
                  <span>{universe.name}</span>
                  {universe.badge && (
                    <span
                      style={{
                        fontSize: "0.62rem",
                        fontWeight: 800,
                        letterSpacing: "0.08em",
                        backgroundColor: isSelected ? "rgba(0,0,0,0.3)" : "rgba(229, 9, 20, 0.12)",
                        color: isSelected ? "#ffffff" : "var(--shinra-red)",
                        padding: "2px 6px",
                        borderRadius: "4px",
                      }}
                    >
                      {universe.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={() => handleScroll("right")}
            disabled={!canScrollRight}
            aria-label="Scroll categories right"
            style={{
              flexShrink: 0,
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "var(--surface)",
              border: canScrollRight
                ? "1px solid var(--surface-border)"
                : "1px solid rgba(255, 255, 255, 0.05)",
              color: canScrollRight ? "var(--foreground)" : "var(--foreground-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: canScrollRight ? "pointer" : "default",
              opacity: canScrollRight ? 1 : 0.3,
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: canScrollRight
                ? "0 4px 12px rgba(0, 0, 0, 0.25)"
                : "none",
              pointerEvents: canScrollRight ? "auto" : "none",
              transform: "translateY(-4px)",
            }}
            onMouseEnter={(e) => {
              if (canScrollRight) {
                e.currentTarget.style.borderColor = "var(--shinra-red)";
                e.currentTarget.style.backgroundColor = "var(--surface-raised)";
                e.currentTarget.style.color = "var(--shinra-red-bright)";
                e.currentTarget.style.boxShadow = "0 0 16px var(--shinra-red-glow)";
                e.currentTarget.style.transform = "translateY(-4px) scale(1.08)";
              }
            }}
            onMouseLeave={(e) => {
              if (canScrollRight) {
                e.currentTarget.style.borderColor = "var(--surface-border)";
                e.currentTarget.style.backgroundColor = "var(--surface)";
                e.currentTarget.style.color = "var(--foreground)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.25)";
                e.currentTarget.style.transform = "translateY(-4px) scale(1)";
              }
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
