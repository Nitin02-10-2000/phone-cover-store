"use client";

import React, { useState, useEffect } from "react";
import {
  getStudioPricing,
  saveStudioPricing,
  StudioPricingConfig,
  calculateCustomPrice,
} from "@/lib/studioStorage";

export default function PricingManagerView() {
  const [pricing, setPricing] = useState<StudioPricingConfig>({
    basePrice: 399,
    customPrintingPrice: 100,
    premiumCasePrice: 100,
    aiFeaturePrice: 149,
    additionalDesignCharges: 50,
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setPricing(getStudioPricing());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveStudioPricing(pricing);
    setPricing(updated);
    showToast("Pricing matrix updated successfully! Custom Studio is synced.");
  };

  // Live simulation previews
  const temperedQuote = calculateCustomPrice("tempered", true, true, pricing);
  const matteQuote = calculateCustomPrice("matte", false, false, pricing);
  const magsafeQuote = calculateCustomPrice("magsafe", true, false, pricing);

  return (
    <div style={{ animation: "fadeIn 0.2s ease-in-out" }}>
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            backgroundColor: "#111",
            color: "#fff",
            border: "1px solid var(--main-accent)",
            padding: "12px 20px",
            borderRadius: "8px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            zIndex: 9999,
            fontSize: "0.85rem",
            fontWeight: 700,
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: "28px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <div style={{ fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.15em", color: "var(--main-accent)", textTransform: "uppercase", marginBottom: "4px" }}>
            REVENUE ENGINE
          </div>
          <h2 style={{ fontSize: "2rem", fontWeight: 900, margin: "0 0 6px", color: "var(--foreground)" }}>
            Dynamic Pricing Management
          </h2>
          <p style={{ color: "var(--foreground-muted)", fontSize: "0.9rem", margin: 0 }}>
            Configure base chassis cost, UV DTF printing fees, premium armor surcharges, and AI add-ons.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "28px", alignItems: "start" }}>
        {/* Form Form */}
        <div
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--surface-border)",
            borderRadius: "14px",
            padding: "26px",
          }}
        >
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Base Case Price */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 800 }}>Base Case Price (₹)</label>
                <span style={{ fontSize: "0.8rem", color: "var(--main-accent)", fontWeight: 700 }}>
                  Standard blank chassis
                </span>
              </div>
              <input
                type="number"
                min="0"
                step="10"
                value={pricing.basePrice}
                onChange={(e) => setPricing({ ...pricing, basePrice: parseInt(e.target.value) || 0 })}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)", fontSize: "0.95rem", fontWeight: 700 }}
              />
            </div>

            {/* Custom Printing Price */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 800 }}>Custom Printing Price (₹)</label>
                <span style={{ fontSize: "0.8rem", color: "#22c55e", fontWeight: 700 }}>
                  High-res UV print layer
                </span>
              </div>
              <input
                type="number"
                min="0"
                step="10"
                value={pricing.customPrintingPrice}
                onChange={(e) => setPricing({ ...pricing, customPrintingPrice: parseInt(e.target.value) || 0 })}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)", fontSize: "0.95rem", fontWeight: 700 }}
              />
            </div>

            {/* Premium Case Price */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 800 }}>Premium Case Surcharge (₹)</label>
                <span style={{ fontSize: "0.8rem", color: "#38bdf8", fontWeight: 700 }}>
                  9H Glass / MagSafe finish
                </span>
              </div>
              <input
                type="number"
                min="0"
                step="10"
                value={pricing.premiumCasePrice}
                onChange={(e) => setPricing({ ...pricing, premiumCasePrice: parseInt(e.target.value) || 0 })}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)", fontSize: "0.95rem", fontWeight: 700 }}
              />
            </div>

            {/* AI Feature Price */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 800 }}>AI Generator / Upscaler Fee (₹)</label>
                <span style={{ fontSize: "0.8rem", color: "#a855f7", fontWeight: 700 }}>
                  AI Anime prompt & 4K remaster
                </span>
              </div>
              <input
                type="number"
                min="0"
                step="10"
                value={pricing.aiFeaturePrice}
                onChange={(e) => setPricing({ ...pricing, aiFeaturePrice: parseInt(e.target.value) || 0 })}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)", fontSize: "0.95rem", fontWeight: 700 }}
              />
            </div>

            {/* Additional Design Charges */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 800 }}>Additional Design / Sticker Charges (₹)</label>
                <span style={{ fontSize: "0.8rem", color: "#f59e0b", fontWeight: 700 }}>
                  Badge overlay & typography fee
                </span>
              </div>
              <input
                type="number"
                min="0"
                step="10"
                value={pricing.additionalDesignCharges}
                onChange={(e) => setPricing({ ...pricing, additionalDesignCharges: parseInt(e.target.value) || 0 })}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)", fontSize: "0.95rem", fontWeight: 700 }}
              />
            </div>

            <button
              type="submit"
              style={{
                marginTop: "10px",
                padding: "12px 20px",
                borderRadius: "8px",
                backgroundColor: "var(--main-accent)",
                color: "#ffffff",
                border: "none",
                fontSize: "0.9rem",
                fontWeight: 800,
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(230, 57, 70, 0.25)",
              }}
            >
              💾 Save & Sync Pricing
            </button>
          </form>
        </div>

        {/* Live Calculation Simulator */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--surface-border)",
              borderRadius: "14px",
              padding: "24px",
            }}
          >
            <div style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--foreground-muted)", marginBottom: "16px" }}>
              Customer Studio Price Simulators
            </div>

            {/* Quote 1: 9H Glass with text and sticker */}
            <div style={{ backgroundColor: "var(--surface-raised)", borderRadius: "10px", padding: "16px", marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontWeight: 800, fontSize: "0.9rem" }}>✨ 9H Glass + Call-sign + Sticker</span>
                <span style={{ fontSize: "1.2rem", fontWeight: 900, color: "var(--main-accent)" }}>
                  ₹{temperedQuote.total}
                </span>
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--foreground-muted)", display: "flex", flexDirection: "column", gap: "2px" }}>
                <span>Base Chassis: ₹{temperedQuote.base}</span>
                <span>Custom UV Print: ₹{temperedQuote.printing}</span>
                <span>9H Tempered Finish: ₹{temperedQuote.finishExtra}</span>
                <span>Call-sign & Hologram: ₹{temperedQuote.addons}</span>
              </div>
            </div>

            {/* Quote 2: Matte Slim clean */}
            <div style={{ backgroundColor: "var(--surface-raised)", borderRadius: "10px", padding: "16px", marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontWeight: 800, fontSize: "0.9rem" }}>🛡️ Matte Slim (Clean Artwork)</span>
                <span style={{ fontSize: "1.2rem", fontWeight: 900, color: "var(--foreground)" }}>
                  ₹{matteQuote.total}
                </span>
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--foreground-muted)", display: "flex", flexDirection: "column", gap: "2px" }}>
                <span>Base Chassis: ₹{matteQuote.base}</span>
                <span>Custom UV Print: ₹{matteQuote.printing}</span>
                <span>Matte Finish Surcharge: ₹0</span>
              </div>
            </div>

            {/* Quote 3: Ultra Impact MagSafe */}
            <div style={{ backgroundColor: "var(--surface-raised)", borderRadius: "10px", padding: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontWeight: 800, fontSize: "0.9rem" }}>⚡ Ultra Impact MagSafe + Sticker</span>
                <span style={{ fontSize: "1.2rem", fontWeight: 900, color: "#38bdf8" }}>
                  ₹{magsafeQuote.total}
                </span>
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--foreground-muted)", display: "flex", flexDirection: "column", gap: "2px" }}>
                <span>Base: ₹{magsafeQuote.base} • Print: ₹{magsafeQuote.printing} • MagSafe: ₹{magsafeQuote.finishExtra} • Add-on: ₹{magsafeQuote.addons}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
