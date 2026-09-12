"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { PRODUCTS } from "@/data/products";
import { useCart } from "@/lib/cartContext";

export default function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, addToCart } = useCart();
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.franchise.toLowerCase().includes(q) ||
        p.tag.toLowerCase().includes(q) ||
        (p.theme && p.theme.toLowerCase().includes(q))
    );
  }, [query]);

  if (!isSearchOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 110,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "5vh 1rem 1rem",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={() => setIsSearchOpen(false)}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      />

      {/* Modal Card */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "640px",
          backgroundColor: "var(--surface)",
          border: "1px solid var(--surface-border)",
          borderRadius: "12px",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.15), 0 0 30px var(--shinra-red-glow)",
          overflow: "hidden",
          zIndex: 10,
        }}
      >
        {/* Input Bar */}
        <div
          style={{
            padding: "1rem 1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            borderBottom: "1px solid var(--surface-border)",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--shinra-red)" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

          <input
            type="text"
            placeholder="Search characters, series (e.g. Gojo, Luffy, Berserk)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            style={{
              flex: 1,
              backgroundColor: "transparent",
              border: "none",
              color: "var(--foreground)",
              fontSize: "1rem",
              fontFamily: "var(--font-heading)",
              outline: "none",
            }}
          />

          {query && (
            <button
              onClick={() => setQuery("")}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--foreground-muted)",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              ✕
            </button>
          )}

          <button
            onClick={() => setIsSearchOpen(false)}
            style={{
              background: "var(--surface-raised)",
              border: "1px solid var(--surface-border)",
              color: "var(--foreground-muted)",
              borderRadius: "4px",
              padding: "4px 8px",
              fontSize: "0.72rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            ESC
          </button>
        </div>

        {/* Quick Tag Suggestions */}
        <div
          style={{
            padding: "0.75rem 1.25rem",
            backgroundColor: "var(--background)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
            borderBottom: "1px solid var(--surface-border)",
          }}
        >
          <span style={{ fontSize: "0.72rem", color: "var(--foreground-muted)", fontWeight: 700 }}>
            POPULAR:
          </span>
          {["One Piece", "Porsche", "Gaming", "Y2K", "Luxury", "Gojo", "Demon Slayer", "Naruto"].map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--surface-border)",
                borderRadius: "4px",
                color: "var(--foreground)",
                padding: "2px 8px",
                fontSize: "0.72rem",
                cursor: "pointer",
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results Container */}
        <div style={{ maxHeight: "380px", overflowY: "auto", padding: "1rem" }}>
          {query.trim() === "" ? (
            <div style={{ textAlign: "center", padding: "2rem 0", color: "var(--foreground-muted)", fontSize: "0.85rem" }}>
              Type to search 40+ collector prints & phone cases.
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem 0", color: "var(--foreground-muted)", fontSize: "0.85rem" }}>
              No matching drops found for &quot;{query}&quot;. Try &quot;One Piece&quot; or &quot;Gojo&quot;.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.5rem 0.75rem",
                    backgroundColor: "var(--surface)",
                    borderRadius: "6px",
                    border: "1px solid var(--surface-border)",
                    gap: "12px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        position: "relative",
                        width: "48px",
                        height: "64px",
                        borderRadius: "4px",
                        overflow: "hidden",
                        backgroundColor: "#000000",
                        flexShrink: 0,
                      }}
                    >
                      <Image src={p.image} alt={p.name} fill sizes="48px" style={{ objectFit: "cover" }} />
                    </div>
                    <div>
                      <h4
                        style={{
                          fontSize: "0.88rem",
                          fontWeight: 700,
                          color: "var(--foreground)",
                          lineHeight: 1.3,
                        }}
                      >
                        {p.name}
                      </h4>
                      <div
                        style={{
                          fontSize: "0.7rem",
                          color: "var(--shinra-red)",
                          fontWeight: 700,
                          textTransform: "uppercase",
                        }}
                      >
                        {p.franchise} • ₹{p.price}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(p);
                      setIsSearchOpen(false);
                    }}
                    className="shinra-btn shinra-btn-primary"
                    style={{ fontSize: "0.72rem", padding: "6px 12px", borderRadius: "4px", flexShrink: 0 }}
                  >
                    ADD TO CART
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
