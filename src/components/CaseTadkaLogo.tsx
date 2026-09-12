"use client";

import React from "react";
import Image from "next/image";

interface CaseTadkaLogoProps {
  /** "full" shows emblem image + text lockup; "badge" shows large vertical badge; "compact" shows compact emblem + title */
  variant?: "full" | "badge" | "compact" | "icon-only";
  size?: "sm" | "md" | "lg";
  className?: string;
  showTagline?: boolean;
  textColor?: string;
}

export default function CaseTadkaLogo({
  variant = "full",
  size = "md",
  className = "",
  showTagline = true,
  textColor,
}: CaseTadkaLogoProps) {
  // Dimensions for the emblem icon
  const iconSizes = {
    sm: { width: 34, height: 42, text: "1.25rem", tag: "0.5rem" },
    md: { width: 40, height: 48, text: "1.45rem", tag: "0.55rem" },
    lg: { width: 56, height: 68, text: "1.85rem", tag: "0.65rem" },
  };

  const currentSize = iconSizes[size] || iconSizes.md;

  if (variant === "badge") {
    return (
      <div className={`case-tadka-badge ${className}`} style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            position: "relative",
            width: size === "lg" ? "140px" : size === "sm" ? "80px" : "105px",
            aspectRatio: "192 / 238",
            borderRadius: "14px",
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(238, 28, 37, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)",
            backgroundColor: "#0d0d10",
          }}
        >
          <Image
            src="/case-tadka-logo.png"
            alt="Case Tadka — Desi Vibes. Global Style."
            fill
            sizes="(max-width: 768px) 100px, 140px"
            style={{ objectFit: "contain" }}
            priority
          />
        </div>
      </div>
    );
  }

  if (variant === "icon-only") {
    return (
      <div
        className={`case-tadka-icon ${className}`}
        style={{
          position: "relative",
          width: `${currentSize.width}px`,
          height: `${currentSize.height}px`,
          borderRadius: "8px",
          overflow: "hidden",
          backgroundColor: "#0d0d10",
          border: "1px solid rgba(255, 42, 58, 0.3)",
          boxShadow: "0 4px 14px rgba(238, 28, 37, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Image
          src="/case-tadka-logo.png"
          alt="Case Tadka Logo Emblem"
          width={currentSize.width}
          height={currentSize.height}
          style={{ objectFit: "cover", objectPosition: "top center", transform: "scale(1.08)" }}
          priority
        />
      </div>
    );
  }

  return (
    <div
      className={`case-tadka-lockup ${className}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.65rem",
        textDecoration: "none",
        userSelect: "none",
      }}
    >
      {/* Visual Logo Emblem Tile */}
      <div
        style={{
          position: "relative",
          width: `${currentSize.width}px`,
          height: `${currentSize.height}px`,
          borderRadius: "8px",
          overflow: "hidden",
          backgroundColor: "#0d0d10",
          border: "1.5px solid #FF2A3A",
          boxShadow: "0 4px 16px rgba(255, 42, 58, 0.28)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Image
          src="/case-tadka-logo.png"
          alt="Case Tadka"
          width={currentSize.width}
          height={currentSize.height}
          style={{ objectFit: "cover", objectPosition: "top center", transform: "scale(1.08)" }}
          priority
        />
      </div>

      {/* Brand Typography */}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "baseline", lineHeight: 1 }}>
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: currentSize.text,
              fontWeight: 900,
              letterSpacing: "-0.01em",
              color: textColor || "var(--foreground)",
            }}
          >
            Case
          </span>
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: currentSize.text,
              fontWeight: 900,
              letterSpacing: "-0.01em",
              color: "#FF2A3A",
            }}
          >
            Tadka
          </span>
          <span
            style={{
              fontSize: `calc(${currentSize.text} * 0.65)`,
              marginLeft: "3px",
              display: "inline-block",
              transform: "rotate(-12deg)",
            }}
          >
            🌶️
          </span>
        </div>

        {showTagline && (
          <span
            style={{
              fontSize: currentSize.tag,
              fontWeight: 800,
              letterSpacing: "0.14em",
              color: "#FF2A3A",
              textTransform: "uppercase",
              marginTop: "2px",
              whiteSpace: "nowrap",
            }}
          >
            DESI VIBES. GLOBAL STYLE.
          </span>
        )}
      </div>
    </div>
  );
}
