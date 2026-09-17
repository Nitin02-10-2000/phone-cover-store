"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  getStudioPhoneModels,
  getStudio3DModels,
  StudioPhoneModel,
  Studio3DModelConfig,
} from "@/lib/studioStorage";
import DynamicPhoneCase from "@/components/DynamicPhoneCase";

export default function StudioManagerView() {
  const [phoneModels, setPhoneModels] = useState<StudioPhoneModel[]>([]);
  const [models3d, setModels3d] = useState<Studio3DModelConfig[]>([]);

  // Selected State
  const [selectedModelId, setSelectedModelId] = useState<string>("");
  const [selectedCaseType, setSelectedCaseType] = useState<string>("9H Tempered Glass");
  const [selected3dModelId, setSelected3dModelId] = useState<string>("");

  // 3D & View Controls
  const [rotX, setRotX] = useState<number>(0);
  const [rotY, setRotY] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(100);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [materialPreview, setMaterialPreview] = useState<"glass" | "matte" | "glossy" | "transparent">("glass");

  // Material fine-tuning
  const [roughness, setRoughness] = useState<number>(0.12);
  const [metallic, setMetallic] = useState<number>(0.85);
  const [transparency, setTransparency] = useState<number>(0.1);
  const [lightingIntensity, setLightingIntensity] = useState<number>(1.2);

  // Overlay Toggles (off by default for clean photorealistic case preview)
  const [showPrintArea, setShowPrintArea] = useState<boolean>(false);
  const [showSafeArea, setShowSafeArea] = useState<boolean>(false);
  const [showBleedArea, setShowBleedArea] = useState<boolean>(false);
  const [showCutout, setShowCutout] = useState<boolean>(false);

  // Sample artwork for live preview (clean, flat, high-res vertical anime art)
  const [testArtworkUrl, setTestArtworkUrl] = useState<string>("/mockups/akira.jpg");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const models = getStudioPhoneModels();
    const threed = getStudio3DModels();
    setPhoneModels(models);
    setModels3d(threed);
    if (models.length > 0) {
      setSelectedModelId(models[0].id);
    }
    if (threed.length > 0) {
      setSelected3dModelId(threed[0].id);
    }
  }, []);

  const activePhone = phoneModels.find((p) => p.id === selectedModelId) || phoneModels[0];

  const handleReset = () => {
    setRotX(0);
    setRotY(0);
    setZoom(100);
    setIsFlipped(false);
    setRoughness(0.12);
    setMetallic(0.85);
    setTransparency(0.1);
    setLightingIntensity(1.2);
    showToast("3D Studio view reset to default angles.");
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleMaterialSelect = (mat: "glass" | "matte" | "glossy" | "transparent") => {
    setMaterialPreview(mat);
    if (mat === "glass") {
      setRoughness(0.08);
      setMetallic(0.9);
      setTransparency(0.05);
      setSelectedCaseType("9H Tempered Glass");
    } else if (mat === "matte") {
      setRoughness(0.7);
      setMetallic(0.15);
      setTransparency(0.0);
      setSelectedCaseType("Matte Slim");
    } else if (mat === "glossy") {
      setRoughness(0.2);
      setMetallic(0.65);
      setTransparency(0.02);
      setSelectedCaseType("Ultra Impact MagSafe");
    } else if (mat === "transparent") {
      setRoughness(0.05);
      setMetallic(0.1);
      setTransparency(0.85);
      setSelectedCaseType("Transparent Crystal TPU");
    }
  };

  return (
    <div style={{ animation: "fadeIn 0.2s ease-in-out" }}>
      {/* Toast */}
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
            STUDIO CONTROL MATRIX
          </div>
          <h2 style={{ fontSize: "2rem", fontWeight: 900, margin: "0 0 6px", color: "var(--foreground)" }}>
            Customization Studio Manager
          </h2>
          <p style={{ color: "var(--foreground-muted)", fontSize: "0.9rem", margin: 0 }}>
            Live 3D telemetry and interactive calibration for the customer-facing custom case lab.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleReset}
            style={{
              padding: "9px 16px",
              borderRadius: "8px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--surface-border)",
              color: "var(--foreground)",
              fontSize: "0.82rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            ↺ Reset View
          </button>
          <a
            href="/customize"
            target="_blank"
            style={{
              padding: "9px 16px",
              borderRadius: "8px",
              backgroundColor: "var(--main-accent)",
              border: "none",
              color: "#fff",
              fontSize: "0.82rem",
              fontWeight: 800,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>Live Customer Studio</span>
            <span>↗</span>
          </a>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: "28px", alignItems: "start" }}>
        {/* Left: Configuration & Selectors */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Target Model & Case Selector */}
          <div
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--surface-border)",
              borderRadius: "14px",
              padding: "20px",
            }}
          >
            <div style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--foreground-muted)", marginBottom: "14px" }}>
              1. Device & Chassis Selection
            </div>

            {/* Phone Model Select */}
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>
                Target Phone Model
              </label>
              <select
                value={selectedModelId}
                onChange={(e) => setSelectedModelId(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  backgroundColor: "var(--surface-raised)",
                  border: "1px solid var(--surface-border)",
                  color: "var(--foreground)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  outline: "none",
                }}
              >
                {phoneModels.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.brand} — {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Case Type Select */}
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>
                Active Case Type
              </label>
              <select
                value={selectedCaseType}
                onChange={(e) => setSelectedCaseType(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  backgroundColor: "var(--surface-raised)",
                  border: "1px solid var(--surface-border)",
                  color: "var(--foreground)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  outline: "none",
                }}
              >
                <option value="9H Tempered Glass">9H Tempered Glass Armor</option>
                <option value="Ultra Impact MagSafe">Ultra Impact MagSafe</option>
                <option value="Matte Slim">Matte Slim Shockproof</option>
                <option value="Transparent Crystal TPU">Transparent Crystal TPU</option>
              </select>
            </div>

            {/* 3D Model Asset Link */}
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>
                Linked 3D Asset Profile
              </label>
              <select
                value={selected3dModelId}
                onChange={(e) => setSelected3dModelId(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  backgroundColor: "var(--surface-raised)",
                  border: "1px solid var(--surface-border)",
                  color: "var(--foreground)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  outline: "none",
                }}
              >
                {models3d.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.materialType})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Material Shader Presets */}
          <div
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--surface-border)",
              borderRadius: "14px",
              padding: "20px",
            }}
          >
            <div style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--foreground-muted)", marginBottom: "12px" }}>
              2. Material Shader Preview
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", marginBottom: "16px" }}>
              {[
                { id: "glass", label: "✨ 9H Glass", desc: "Reflective sheen" },
                { id: "matte", label: "🛡️ Matte", desc: "Velvet anti-glare" },
                { id: "glossy", label: "⚡ Glossy", desc: "High specular" },
                { id: "transparent", label: "💎 Clear TPU", desc: "Translucent drop" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleMaterialSelect(m.id as any)}
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    textAlign: "left",
                    backgroundColor: materialPreview === m.id ? "rgba(230, 57, 70, 0.12)" : "var(--surface-raised)",
                    border: materialPreview === m.id ? "2px solid var(--main-accent)" : "1px solid var(--surface-border)",
                    cursor: "pointer",
                    color: "var(--foreground)",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: "0.85rem" }}>{m.label}</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--foreground-muted)", marginTop: "2px" }}>{m.desc}</div>
                </button>
              ))}
            </div>

            {/* Sliders */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px" }}>
                  <span>Roughness</span>
                  <span>{Math.round(roughness * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={roughness}
                  onChange={(e) => setRoughness(parseFloat(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--main-accent)" }}
                />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px" }}>
                  <span>Metallic / Specular</span>
                  <span>{Math.round(metallic * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={metallic}
                  onChange={(e) => setMetallic(parseFloat(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--main-accent)" }}
                />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px" }}>
                  <span>Transparency</span>
                  <span>{Math.round(transparency * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={transparency}
                  onChange={(e) => setTransparency(parseFloat(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--main-accent)" }}
                />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px" }}>
                  <span>Studio Key Lighting</span>
                  <span>{lightingIntensity.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.1"
                  value={lightingIntensity}
                  onChange={(e) => setLightingIntensity(parseFloat(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--main-accent)" }}
                />
              </div>
            </div>
          </div>

          {/* Guidelines Overlays Toggle */}
          <div
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--surface-border)",
              borderRadius: "14px",
              padding: "20px",
            }}
          >
            <div style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--foreground-muted)", marginBottom: "12px" }}>
              3. Visual Editor Guides
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600 }}>
                <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "12px", height: "12px", borderRadius: "2px", border: "2px solid #3b82f6" }} />
                  <span>Print Area Boundary ({activePhone?.canvasWidth || 800}x{activePhone?.canvasHeight || 1600}px)</span>
                </span>
                <input type="checkbox" checked={showPrintArea} onChange={(e) => setShowPrintArea(e.target.checked)} />
              </label>

              <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600 }}>
                <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "12px", height: "12px", borderRadius: "2px", border: "2px dashed #22c55e" }} />
                  <span>Safe Area Inset ({activePhone?.safeArea?.insetX || 24}px)</span>
                </span>
                <input type="checkbox" checked={showSafeArea} onChange={(e) => setShowSafeArea(e.target.checked)} />
              </label>

              <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600 }}>
                <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "12px", height: "12px", borderRadius: "2px", border: "2px dashed #ef4444" }} />
                  <span>Bleed Margin ({activePhone?.bleedArea?.bleedMm || 3}mm)</span>
                </span>
                <input type="checkbox" checked={showBleedArea} onChange={(e) => setShowBleedArea(e.target.checked)} />
              </label>

              <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600 }}>
                <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "12px", height: "12px", borderRadius: "2px", border: "2px solid #f59e0b" }} />
                  <span>Camera & Flash Cutouts</span>
                </span>
                <input type="checkbox" checked={showCutout} onChange={(e) => setShowCutout(e.target.checked)} />
              </label>
            </div>
          </div>
        </div>

        {/* Right: Live 3D Interactive Stage */}
        <div
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--surface-border)",
            borderRadius: "14px",
            padding: "28px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            minHeight: "700px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
          }}
        >
          {/* Top Quick Bar */}
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
              paddingBottom: "16px",
              borderBottom: "1px solid var(--surface-border)",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--foreground)" }}>
                {activePhone?.name || "Target Device"}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--foreground-muted)" }}>
                Format: <strong style={{ color: "var(--main-accent)" }}>{selectedCaseType}</strong> • Sensor Archetype:{" "}
                <code>{activePhone?.cameraType || "standard"}</code>
              </div>
            </div>

            {/* Front / Back Flip Button */}
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setIsFlipped(!isFlipped)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "6px",
                  backgroundColor: isFlipped ? "var(--main-accent)" : "var(--surface-raised)",
                  color: isFlipped ? "#fff" : "var(--foreground)",
                  border: "1px solid var(--surface-border)",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                🔄 {isFlipped ? "Viewing Front Screen" : "Viewing Back Cover"}
              </button>
            </div>
          </div>

          {/* Interactive 3D Case Display */}
          <div
            style={{
              flex: 1,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              perspective: "1200px",
              padding: "40px 0",
            }}
          >
            <div
              style={{
                transform: `scale(${zoom / 100}) rotateY(${rotY}deg) rotateX(${rotX}deg)`,
                transition: "transform 0.15s ease-out",
                transformStyle: "preserve-3d",
                position: "relative",
                filter: `drop-shadow(0 ${20 * lightingIntensity}px ${40 * lightingIntensity}px rgba(0,0,0,${0.3 * lightingIntensity}))`,
              }}
            >
              {isFlipped ? (
                /* Authentic Front Screen Display (Glass + Dynamic Island) */
                <div
                  style={{
                    width: 280,
                    height: 570,
                    borderRadius: "44px",
                    backgroundColor: "#050508",
                    border: "5px solid #27272a",
                    boxShadow: "0 25px 60px rgba(0,0,0,0.85), inset 0 0 0 2px rgba(255,255,255,0.08)",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "18px 20px 16px",
                    userSelect: "none",
                  }}
                >
                  {/* Dynamic Island Pill */}
                  <div
                    style={{
                      width: "88px",
                      height: "26px",
                      backgroundColor: "#000000",
                      borderRadius: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0 10px",
                      boxShadow: "0 0 3px rgba(255,255,255,0.15)",
                    }}
                  >
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: "radial-gradient(circle, #1e3a8a 0%, #000 80%)",
                        border: "1px solid #1e293b",
                      }}
                    />
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#18181b" }} />
                  </div>

                  {/* Lock Screen Time Display */}
                  <div style={{ textAlign: "center", color: "#ffffff", marginTop: "-40px" }}>
                    <div style={{ fontSize: "3.2rem", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1 }}>
                      09:41
                    </div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, marginTop: "8px", color: "rgba(255,255,255,0.7)" }}>
                      Thursday, September 17
                    </div>
                  </div>

                  {/* iOS Home Indicator Bar */}
                  <div
                    style={{
                      width: "120px",
                      height: "4px",
                      backgroundColor: "rgba(255,255,255,0.75)",
                      borderRadius: "3px",
                    }}
                  />
                </div>
              ) : (
                /* Dynamic Phone Case Core (Photorealistic 9H Glass Frame) */
                <DynamicPhoneCase
                  artworkUrl={testArtworkUrl}
                  phoneModel={activePhone?.name || "iPhone 16 Pro Max"}
                  caseType={selectedCaseType}
                  width={280}
                  height={570}
                  interactive={false}
                  showModelBadge={false}
                  useGlassMockupOverlay={true}
                  customOverlay={
                    <>
                      {/* Safe Area Guideline */}
                      {showSafeArea && (
                        <div
                          style={{
                            position: "absolute",
                            inset: `${activePhone?.safeArea?.insetY || 24}px ${activePhone?.safeArea?.insetX || 20}px`,
                            border: "2px dashed rgba(34, 197, 94, 0.8)",
                            borderRadius: "28px",
                            pointerEvents: "none",
                            zIndex: 30,
                          }}
                        >
                          <span style={{ position: "absolute", top: "6px", left: "10px", fontSize: "0.65rem", fontWeight: 800, color: "#22c55e", backgroundColor: "rgba(0,0,0,0.6)", padding: "1px 6px", borderRadius: "3px" }}>
                            SAFE AREA
                          </span>
                        </div>
                      )}

                      {/* Bleed Area Guideline */}
                      {showBleedArea && (
                        <div
                          style={{
                            position: "absolute",
                            inset: "-6px",
                            border: "2px dashed rgba(239, 68, 68, 0.8)",
                            borderRadius: "38px",
                            pointerEvents: "none",
                            zIndex: 25,
                          }}
                        >
                          <span style={{ position: "absolute", bottom: "4px", right: "12px", fontSize: "0.65rem", fontWeight: 800, color: "#ef4444", backgroundColor: "rgba(0,0,0,0.6)", padding: "1px 6px", borderRadius: "3px" }}>
                            +{activePhone?.bleedArea?.bleedMm || 3}mm BLEED
                          </span>
                        </div>
                      )}

                      {/* Camera Cutout Marker */}
                      {showCutout && activePhone?.cameraCutout && (
                        <div
                          style={{
                            position: "absolute",
                            top: `${activePhone.cameraCutout.y}px`,
                            left: `${activePhone.cameraCutout.x}px`,
                            width: `${activePhone.cameraCutout.width}px`,
                            height: `${activePhone.cameraCutout.height}px`,
                            borderRadius: `${activePhone.cameraCutout.radius}px`,
                            border: "2px solid rgba(245, 158, 11, 0.9)",
                            backgroundColor: "rgba(245, 158, 11, 0.15)",
                            pointerEvents: "none",
                            zIndex: 35,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <span style={{ fontSize: "0.6rem", fontWeight: 900, color: "#f59e0b" }}>CUTOUT</span>
                        </div>
                      )}

                      {/* Material Sheen Highlight Simulation */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            materialPreview === "glass"
                              ? "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.15) 100%)"
                              : materialPreview === "transparent"
                              ? "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.06) 70%)"
                              : "none",
                          pointerEvents: "none",
                          zIndex: 20,
                          opacity: 1 - roughness,
                          borderRadius: "40px",
                        }}
                      />
                    </>
                  }
                />
              )}
            </div>
          </div>

          {/* 3D Orbit Control Deck */}
          <div
            style={{
              width: "100%",
              backgroundColor: "var(--surface-raised)",
              border: "1px solid var(--surface-border)",
              borderRadius: "10px",
              padding: "16px 20px",
              marginTop: "20px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              alignItems: "center",
            }}
          >
            {/* Rotate Horizontal */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px" }}>
                <span>Rotate Horizontal (Y)</span>
                <span>{rotY}°</span>
              </div>
              <input
                type="range"
                min="-60"
                max="60"
                value={rotY}
                onChange={(e) => setRotY(parseInt(e.target.value))}
                style={{ width: "100%", accentColor: "var(--main-accent)" }}
              />
            </div>

            {/* Rotate Vertical */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px" }}>
                <span>Rotate Vertical (X)</span>
                <span>{rotX}°</span>
              </div>
              <input
                type="range"
                min="-30"
                max="30"
                value={rotX}
                onChange={(e) => setRotX(parseInt(e.target.value))}
                style={{ width: "100%", accentColor: "var(--main-accent)" }}
              />
            </div>

            {/* Zoom Slider */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px" }}>
                <span>Zoom Scale</span>
                <span>{zoom}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="140"
                value={zoom}
                onChange={(e) => setZoom(parseInt(e.target.value))}
                style={{ width: "100%", accentColor: "var(--main-accent)" }}
              />
            </div>

            {/* Preset Angles */}
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                onClick={() => {
                  setRotY(0);
                  setRotX(0);
                }}
                style={{
                  flex: 1,
                  padding: "8px 4px",
                  borderRadius: "6px",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--surface-border)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Front
              </button>
              <button
                onClick={() => {
                  setRotY(-35);
                  setRotX(10);
                }}
                style={{
                  flex: 1,
                  padding: "8px 4px",
                  borderRadius: "6px",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--surface-border)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Tilt Left
              </button>
              <button
                onClick={() => {
                  setRotY(35);
                  setRotX(10);
                }}
                style={{
                  flex: 1,
                  padding: "8px 4px",
                  borderRadius: "6px",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--surface-border)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Tilt Right
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
