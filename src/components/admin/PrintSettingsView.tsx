"use client";

import React, { useState, useEffect } from "react";
import {
  getStudioPrintConfig,
  saveStudioPrintConfig,
  StudioPrintConfig,
} from "@/lib/studioStorage";

export default function PrintSettingsView() {
  const [config, setConfig] = useState<StudioPrintConfig>({
    dpi: 300,
    widthMm: 78,
    heightMm: 162,
    bleedMm: 3,
    exportFormat: "PNG",
    colorProfile: "CMYK (FOGRA39)",
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setConfig(getStudioPrintConfig());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveStudioPrintConfig(config);
    setConfig(updated);
    showToast("Production print profile updated successfully!");
  };

  // Calculated pixel dimensions at current DPI
  const mmToInches = 1 / 25.4;
  const totalWidthMm = config.widthMm + config.bleedMm * 2;
  const totalHeightMm = config.heightMm + config.bleedMm * 2;
  const calcPixelWidth = Math.round(totalWidthMm * mmToInches * config.dpi);
  const calcPixelHeight = Math.round(totalHeightMm * mmToInches * config.dpi);

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
            PRODUCTION SPECS
          </div>
          <h2 style={{ fontSize: "2rem", fontWeight: 900, margin: "0 0 6px", color: "var(--foreground)" }}>
            Print & Production Settings
          </h2>
          <p style={{ color: "var(--foreground-muted)", fontSize: "0.9rem", margin: 0 }}>
            Configure industrial UV DTF print output resolutions, ICC color spaces, and bleed offsets.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "28px", alignItems: "start" }}>
        {/* Form Card */}
        <div
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--surface-border)",
            borderRadius: "14px",
            padding: "26px",
          }}
        >
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* DPI */}
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 800, marginBottom: "6px" }}>
                Target Export DPI (Dots Per Inch)
              </label>
              <select
                value={config.dpi}
                onChange={(e) => setConfig({ ...config, dpi: parseInt(e.target.value) })}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)", fontSize: "0.9rem", fontWeight: 700 }}
              >
                <option value={150}>150 DPI (Fast Draft)</option>
                <option value={300}>300 DPI (Industrial UV DTF Standard - Recommended)</option>
                <option value={600}>600 DPI (Ultra Fine Micro-Print)</option>
              </select>
            </div>

            {/* Width & Height (mm) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 800, marginBottom: "6px" }}>
                  Standard Width (mm)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={config.widthMm}
                  onChange={(e) => setConfig({ ...config, widthMm: parseFloat(e.target.value) || 78 })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)", fontSize: "0.9rem", fontWeight: 700 }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 800, marginBottom: "6px" }}>
                  Standard Height (mm)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={config.heightMm}
                  onChange={(e) => setConfig({ ...config, heightMm: parseFloat(e.target.value) || 162 })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)", fontSize: "0.9rem", fontWeight: 700 }}
                />
              </div>
            </div>

            {/* Bleed Margin (mm) */}
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 800, marginBottom: "6px" }}>
                Bleed Margin (mm per side)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="10"
                value={config.bleedMm}
                onChange={(e) => setConfig({ ...config, bleedMm: parseFloat(e.target.value) || 3 })}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)", fontSize: "0.9rem", fontWeight: 700 }}
              />
            </div>

            {/* Export File Format */}
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 800, marginBottom: "6px" }}>
                Production File Export Format
              </label>
              <select
                value={config.exportFormat}
                onChange={(e) => setConfig({ ...config, exportFormat: e.target.value as any })}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)", fontSize: "0.9rem", fontWeight: 700 }}
              >
                <option value="PNG">PNG (Lossless Alpha 24-bit)</option>
                <option value="TIFF">TIFF (Uncompressed Print Master)</option>
                <option value="PDF">PDF (Vector + High-Res Embed)</option>
              </select>
            </div>

            {/* Color Profile */}
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 800, marginBottom: "6px" }}>
                ICC Color Profile
              </label>
              <select
                value={config.colorProfile}
                onChange={(e) => setConfig({ ...config, colorProfile: e.target.value as any })}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)", fontSize: "0.9rem", fontWeight: 700 }}
              >
                <option value="CMYK (FOGRA39)">CMYK (ISO Coated FOGRA39 for UV Armor Press)</option>
                <option value="sRGB">sRGB IEC61966-2.1 (Standard Digital)</option>
                <option value="Display P3">Display P3 (Wide Gamut)</option>
              </select>
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
              💾 Save Print Settings
            </button>
          </form>
        </div>

        {/* Calculated Production Metrics */}
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
              Calculated Output Resolution
            </div>

            <div style={{ backgroundColor: "var(--surface-raised)", borderRadius: "10px", padding: "16px", marginBottom: "14px" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--foreground-muted)", textTransform: "uppercase" }}>
                Raster Canvas Pixel Resolution
              </div>
              <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--foreground)", marginTop: "4px" }}>
                {calcPixelWidth} x {calcPixelHeight} px
              </div>
              <div style={{ fontSize: "0.78rem", color: "#22c55e", marginTop: "4px", fontWeight: 700 }}>
                Includes {config.bleedMm}mm bleed on all sides
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.82rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--surface-border)", paddingBottom: "6px" }}>
                <span style={{ color: "var(--foreground-muted)" }}>Total Physical Width:</span>
                <strong>{totalWidthMm} mm</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--surface-border)", paddingBottom: "6px" }}>
                <span style={{ color: "var(--foreground-muted)" }}>Total Physical Height:</span>
                <strong>{totalHeightMm} mm</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--surface-border)", paddingBottom: "6px" }}>
                <span style={{ color: "var(--foreground-muted)" }}>Export Color Space:</span>
                <strong>{config.colorProfile}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--foreground-muted)" }}>Raster Quality:</span>
                <strong style={{ color: "var(--main-accent)" }}>Ultra-Sharp (300 DPI)</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
