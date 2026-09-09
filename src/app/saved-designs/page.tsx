"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/lib/cartContext";
import { PRODUCTS } from "@/data/products";

export default function SavedDesignsPage() {
  const { savedDesigns, deleteDesign, addToCart } = useCart();

  const handleAddToCart = (design: (typeof savedDesigns)[0]) => {
    // Find or fallback product
    const targetFormat = design.productType === "phone_case" ? "Tough Case" : "Paper";
    const baseProduct = PRODUCTS.find((p) => p.formats?.includes(targetFormat)) || PRODUCTS[0];
    addToCart(
      {
        ...baseProduct,
        name: design.title,
        price: design.price,
        image: design.previewUrl,
      },
      targetFormat,
      design.phoneModel,
      undefined,
      design.previewUrl
    );
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--background)", padding: "100px 20px 80px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "24px" }}>
          <Link href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Home</Link>
          <span>/</span>
          <Link href="/account" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Account</Link>
          <span>/</span>
          <span style={{ color: "var(--shinra-red)", fontWeight: 600 }}>Saved Designs</span>
        </div>

        {/* Header Hero */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            marginBottom: "36px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <span style={{ color: "var(--shinra-red)", fontSize: "1.2rem" }}>🎨</span>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.15em", color: "var(--shinra-red)", textTransform: "uppercase" }}>
                STUDIO ARCHIVE
              </span>
            </div>
            <h1 style={{ fontSize: "2.2rem", fontWeight: 800, letterSpacing: "-0.5px", margin: 0 }}>
              Saved Custom Designs
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: "8px", margin: 0 }}>
              Your personalized tough phone armor and custom anime prints ready for checkout.
            </p>
          </div>

          <Link
            href="/customize"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              borderRadius: "8px",
              backgroundColor: "var(--shinra-red)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.9rem",
              textDecoration: "none",
              boxShadow: "0 0 20px rgba(230, 57, 70, 0.4)",
              transition: "transform 0.2s ease",
            }}
          >
            <span>+</span> Launch Design Studio
          </Link>
        </div>

        {/* Designs Grid */}
        {savedDesigns.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              background: "var(--surface)",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div style={{ fontSize: "3.5rem", marginBottom: "16px" }}>⚡</div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "8px" }}>No custom creations saved yet</h2>
            <p style={{ color: "var(--text-muted)", maxWidth: "450px", margin: "0 auto 24px", lineHeight: 1.6 }}>
              Jump into our real-time 3D Phone Case & Wall Art Customizer. Upload high-res manga panels, tweak scales, and stamp cyber kanji!
            </p>
            <Link
              href="/customize"
              style={{
                display: "inline-block",
                padding: "14px 32px",
                borderRadius: "8px",
                backgroundColor: "var(--shinra-red)",
                color: "#fff",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Start Customizing
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "24px",
            }}
          >
            {savedDesigns.map((design) => (
              <div
                key={design.id}
                style={{
                  backgroundColor: "var(--surface)",
                  borderRadius: "14px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                {/* Visual Preview */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "300px",
                    backgroundColor: "var(--background)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    padding: "20px",
                  }}
                >
                  {design.productType === "phone_case" ? (
                    /* Phone Case Frame Preview */
                    <div
                      style={{
                        width: "140px",
                        height: "260px",
                        borderRadius: "28px",
                        backgroundColor: "#18181b",
                        border: "3px solid #27272a",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.7), inset 0 0 0 2px rgba(255,255,255,0.1)",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={design.previewUrl}
                        alt={design.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      {/* Camera bump simulation */}
                      <div
                        style={{
                          position: "absolute",
                          top: "10px",
                          left: "10px",
                          width: "42px",
                          height: "46px",
                          borderRadius: "10px",
                          backgroundColor: "rgba(0,0,0,0.85)",
                          border: "1px solid rgba(255,255,255,0.15)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "space-around",
                          padding: "4px",
                        }}
                      >
                        <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#111", border: "1px solid #444" }} />
                        <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#111", border: "1px solid #444" }} />
                      </div>
                    </div>
                  ) : (
                    /* Poster Frame Preview */
                    <div
                      style={{
                        width: "180px",
                        height: "250px",
                        borderRadius: "4px",
                        overflow: "hidden",
                        border: "6px solid #1c1c20",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.7)",
                      }}
                    >
                      <img
                        src={design.previewUrl}
                        alt={design.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                  )}

                  {/* Type Badge */}
                  <span
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      backgroundColor: "rgba(0, 0, 0, 0.75)",
                      backdropFilter: "blur(4px)",
                      color: "var(--foreground)",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      textTransform: "uppercase",
                    }}
                  >
                    {design.productType === "phone_case" ? "Armor Case" : "Art Print"}
                  </span>
                </div>

                {/* Details */}
                <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: "0 0 6px" }}>{design.title}</h3>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "flex", gap: "10px", alignItems: "center" }}>
                      {design.phoneModel && <span>Model: <strong style={{ color: "var(--foreground)" }}>{design.phoneModel}</strong></span>}
                      <span>Created: {design.createdAt}</span>
                    </div>
                  </div>

                  <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                      <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Unit Price</span>
                      <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--foreground)" }}>₹{design.price}</span>
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        onClick={() => handleAddToCart(design)}
                        style={{
                          flex: 1,
                          padding: "10px",
                          borderRadius: "8px",
                          backgroundColor: "var(--shinra-red)",
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: "0.85rem",
                          border: "none",
                          cursor: "pointer",
                          transition: "opacity 0.2s ease",
                        }}
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => deleteDesign(design.id)}
                        title="Delete saved design"
                        style={{
                          padding: "10px 14px",
                          borderRadius: "8px",
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          color: "var(--text-muted)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          cursor: "pointer",
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
