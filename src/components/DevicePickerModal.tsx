"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ALL_PHONE_MODELS, BRAND_GROUPS, PhoneModelItem } from "@/data/phoneModels";
import { useDevice } from "@/lib/deviceContext";

export default function DevicePickerModal() {
  const { selectedModel, setDevice, isDevicePickerOpen, setIsDevicePickerOpen } = useDevice();
  const [activeBrand, setActiveBrand] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDevicePickerOpen) {
        setIsDevicePickerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDevicePickerOpen, setIsDevicePickerOpen]);

  // Prevent scroll when open
  useEffect(() => {
    if (isDevicePickerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isDevicePickerOpen]);

  const filteredModels = useMemo(() => {
    return ALL_PHONE_MODELS.filter((phone) => {
      if (activeBrand !== "All" && phone.brand !== activeBrand) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = phone.name.toLowerCase().includes(query);
        const matchesBrand = phone.brand.toLowerCase().includes(query);
        return matchesName || matchesBrand;
      }
      return true;
    });
  }, [activeBrand, searchQuery]);

  if (!isDevicePickerOpen) return null;

  const handleSelectModel = (item: PhoneModelItem) => {
    setDevice(item.brand, item.name);
    setIsDevicePickerOpen(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        animation: "fadeIn 0.2s ease-out",
      }}
      onClick={() => setIsDevicePickerOpen(false)}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "760px",
          maxHeight: "85vh",
          backgroundColor: "var(--surface)",
          border: "1px solid var(--surface-border)",
          borderRadius: "20px",
          boxShadow: "0 30px 80px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.1)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.5rem 1.75rem",
            borderBottom: "1px solid var(--surface-border)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          {/* Top accent line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              background: "linear-gradient(90deg, var(--main-accent) 0%, var(--secondary-accent) 50%, var(--main-accent) 100%)",
            }}
          />

          <div>
            <div
              style={{
                fontSize: "0.68rem",
                fontWeight: 900,
                letterSpacing: "0.18em",
                color: "var(--main-accent)",
                textTransform: "uppercase",
                marginBottom: "4px",
              }}
            >
              DEVICE ADAPTATION ENGINE
            </div>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.45rem",
                fontWeight: 900,
                color: "var(--foreground)",
                margin: 0,
              }}
            >
              Select Your Phone Device
            </h2>
            <p
              style={{
                fontSize: "0.82rem",
                color: "var(--foreground-muted)",
                margin: "4px 0 0",
              }}
            >
              The entire store will dynamically mold to your exact camera layout and dimensions.
            </p>
          </div>

          <button
            onClick={() => setIsDevicePickerOpen(false)}
            aria-label="Close"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "var(--surface-raised)",
              border: "1px solid var(--surface-border)",
              color: "var(--foreground-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "1.1rem",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#ffffff";
              e.currentTarget.style.backgroundColor = "rgba(229, 9, 20, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--foreground-muted)";
              e.currentTarget.style.backgroundColor = "var(--surface-raised)";
            }}
          >
            ✕
          </button>
        </div>

        {/* Search Bar & Brand Chips */}
        <div style={{ padding: "1.25rem 1.75rem 0.75rem", borderBottom: "1px solid var(--surface-border)" }}>
          {/* Search Box */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              backgroundColor: "var(--background)",
              border: "1px solid var(--surface-border)",
              borderRadius: "10px",
              padding: "10px 14px",
              marginBottom: "1rem",
            }}
          >
            <span style={{ fontSize: "1.1rem", opacity: 0.7 }}>🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search phone (e.g. S24 Ultra, Pixel 9, iPhone 16, OnePlus 12)..."
              autoFocus
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "var(--foreground)",
                fontSize: "0.9rem",
                width: "100%",
                fontFamily: "inherit",
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--foreground-muted)",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Brand Scroll Tabs */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              overflowX: "auto",
              paddingBottom: "8px",
              scrollbarWidth: "none",
            }}
          >
            <button
              onClick={() => setActiveBrand("All")}
              style={{
                backgroundColor: activeBrand === "All" ? "var(--main-accent)" : "var(--surface-raised)",
                color: activeBrand === "All" ? "#ffffff" : "var(--foreground-muted)",
                border: activeBrand === "All" ? "1px solid var(--main-accent)" : "1px solid var(--surface-border)",
                borderRadius: "8px",
                padding: "6px 14px",
                fontSize: "0.78rem",
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s",
              }}
            >
              All Brands ({ALL_PHONE_MODELS.length})
            </button>
            {BRAND_GROUPS.map((b) => (
              <button
                key={b.brand}
                onClick={() => setActiveBrand(b.brand)}
                style={{
                  backgroundColor: activeBrand === b.brand ? "var(--main-accent)" : "var(--surface-raised)",
                  color: activeBrand === b.brand ? "#ffffff" : "var(--foreground-muted)",
                  border: activeBrand === b.brand ? "1px solid var(--main-accent)" : "1px solid var(--surface-border)",
                  borderRadius: "8px",
                  padding: "6px 14px",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.15s",
                }}
              >
                <span>{b.icon}</span>
                <span>{b.brand}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Model Results List */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "1.25rem 1.75rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
            gap: "10px",
            maxHeight: "50vh",
          }}
        >
          {filteredModels.map((item) => {
            const isCurrent = selectedModel === item.name;
            return (
              <div
                key={item.id}
                onClick={() => handleSelectModel(item)}
                style={{
                  backgroundColor: isCurrent ? "rgba(255, 42, 58, 0.15)" : "var(--surface-raised)",
                  border: isCurrent ? "2px solid var(--main-accent)" : "1px solid var(--surface-border)",
                  borderRadius: "12px",
                  padding: "12px 14px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  if (!isCurrent) {
                    e.currentTarget.style.borderColor = "var(--main-accent)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCurrent) {
                    e.currentTarget.style.borderColor = "var(--surface-border)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span
                      style={{
                        fontSize: "0.68rem",
                        fontWeight: 800,
                        color: isCurrent ? "var(--main-accent)" : "var(--foreground-muted)",
                        textTransform: "uppercase",
                      }}
                    >
                      {item.brand}
                    </span>
                    {item.popular && (
                      <span
                        style={{
                          fontSize: "0.6rem",
                          fontWeight: 800,
                          backgroundColor: "rgba(229, 9, 20, 0.15)",
                          color: "var(--shinra-red)",
                          padding: "1px 6px",
                          borderRadius: "4px",
                        }}
                      >
                        POPULAR
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "0.95rem",
                      fontWeight: 800,
                      color: "var(--foreground)",
                      lineHeight: 1.3,
                    }}
                  >
                    {item.name}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "12px",
                    paddingTop: "8px",
                    borderTop: "1px solid var(--surface-border)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.68rem",
                      color: "var(--foreground-muted)",
                    }}
                  >
                    {item.hasMagSafe ? "🧲 MagSafe Ready" : "🛡️ Dual Armor"}
                  </span>

                  {isCurrent ? (
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 900,
                        color: "var(--main-accent)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <span>ACTIVE</span>
                      <span>✓</span>
                    </span>
                  ) : (
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        color: "var(--foreground-muted)",
                      }}
                    >
                      Select →
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {filteredModels.length === 0 && (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "3rem 1rem",
                color: "var(--foreground-muted)",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📱</div>
              <div style={{ fontWeight: 800, fontSize: "1rem", color: "var(--foreground)", marginBottom: "4px" }}>
                No phone model found matching &quot;{searchQuery}&quot;
              </div>
              <p style={{ fontSize: "0.85rem", maxWidth: "400px", margin: "0 auto" }}>
                We support 100+ precision molds. Try searching by series like &quot;S24&quot;, &quot;Pixel&quot;, or &quot;Nord&quot;.
              </p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div
          style={{
            padding: "1rem 1.75rem",
            backgroundColor: "var(--background)",
            borderTop: "1px solid var(--surface-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.78rem",
            color: "var(--foreground-muted)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#22c55e" }}>✓</span>
            <span>All 100+ molds feature 1.8mm raised camera bezel & MIL-SPEC drop certification.</span>
          </div>
          <span style={{ fontWeight: 700, color: "var(--foreground)" }}>
            Current: <span style={{ color: "var(--main-accent)" }}>{selectedModel}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
