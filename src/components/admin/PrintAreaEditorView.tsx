"use client";

import React, { useState, useEffect } from "react";
import {
  getStudioPhoneModels,
  saveStudioPhoneModel,
  StudioPhoneModel,
} from "@/lib/studioStorage";

export default function PrintAreaEditorView() {
  const [phoneModels, setPhoneModels] = useState<StudioPhoneModel[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string>("");
  const [activeModel, setActiveModel] = useState<StudioPhoneModel | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const models = getStudioPhoneModels();
    setPhoneModels(models);
    if (models.length > 0) {
      setSelectedModelId(models[0].id);
      setActiveModel(models[0]);
    }
  }, []);

  const handleSelectModel = (id: string) => {
    setSelectedModelId(id);
    const target = phoneModels.find((m) => m.id === id);
    if (target) setActiveModel(target);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = () => {
    if (!activeModel) return;
    const updated = saveStudioPhoneModel(activeModel);
    setPhoneModels(updated);
    showToast(`Print & cutout coordinates saved for ${activeModel.name}!`);
  };

  if (!activeModel) {
    return <div style={{ padding: "40px" }}>Loading Print Area Editor...</div>;
  }

  // Display scaled factor for the canvas
  const displayScale = 0.28; // Scale down 800x1600 to 224x448
  const scaledW = activeModel.canvasWidth * displayScale;
  const scaledH = activeModel.canvasHeight * displayScale;

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
            PRECISION CALIBRATION
          </div>
          <h2 style={{ fontSize: "2rem", fontWeight: 900, margin: "0 0 6px", color: "var(--foreground)" }}>
            Print Area & Cutout Editor
          </h2>
          <p style={{ color: "var(--foreground-muted)", fontSize: "0.9rem", margin: 0 }}>
            Visually map printable boundary coordinates, safety zones, bleed margins, and precision camera holes for high-speed UV printing.
          </p>
        </div>

        <button
          onClick={handleSave}
          style={{
            padding: "10px 22px",
            borderRadius: "8px",
            backgroundColor: "var(--main-accent)",
            color: "#ffffff",
            border: "none",
            fontSize: "0.85rem",
            fontWeight: 800,
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(230, 57, 70, 0.25)",
          }}
        >
          💾 Save Calibration Coordinates
        </button>
      </div>

      {/* Model Selector Bar */}
      <div
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--surface-border)",
          borderRadius: "10px",
          padding: "14px 18px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
        }}
      >
        <label style={{ fontSize: "0.85rem", fontWeight: 800, whiteSpace: "nowrap" }}>
          Target Phone Model:
        </label>
        <select
          value={selectedModelId}
          onChange={(e) => handleSelectModel(e.target.value)}
          style={{
            flex: 1,
            padding: "8px 12px",
            borderRadius: "6px",
            backgroundColor: "var(--surface-raised)",
            border: "1px solid var(--surface-border)",
            color: "var(--foreground)",
            fontSize: "0.85rem",
            fontWeight: 700,
            outline: "none",
          }}
        >
          {phoneModels.map((m) => (
            <option key={m.id} value={m.id}>
              {m.brand} — {m.name} ({m.canvasWidth}x{m.canvasHeight} px)
            </option>
          ))}
        </select>
      </div>

      {/* Editor Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "28px", alignItems: "start" }}>
        {/* Visual Stage */}
        <div
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--surface-border)",
            borderRadius: "14px",
            padding: "36px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "640px",
            position: "relative",
          }}
        >
          {/* Visual Legend */}
          <div
            style={{
              position: "absolute",
              top: "16px",
              left: "16px",
              display: "flex",
              gap: "14px",
              fontSize: "0.72rem",
              fontWeight: 700,
              backgroundColor: "var(--surface-raised)",
              padding: "6px 14px",
              borderRadius: "20px",
              border: "1px solid var(--surface-border)",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#3b82f6" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#3b82f6" }} />
              Print Area
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#22c55e" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#22c55e" }} />
              Safe Area
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#ef4444" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#ef4444" }} />
              Bleed ({activeModel.bleedArea.bleedMm}mm)
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#f59e0b" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#f59e0b" }} />
              Camera Cutout
            </span>
          </div>

          {/* Phone Canvas Simulation Container */}
          <div
            style={{
              width: `${scaledW}px`,
              height: `${scaledH}px`,
              backgroundColor: "#111116",
              border: "3px solid #222",
              borderRadius: activeModel.corners === "sharp" ? "12px" : "38px",
              position: "relative",
              boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
              overflow: "hidden",
            }}
          >
            {/* Bleed Area Indicator (outer border ring) */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                border: "3px dashed rgba(239, 68, 68, 0.6)",
                borderRadius: activeModel.corners === "sharp" ? "10px" : "36px",
                pointerEvents: "none",
              }}
            />

            {/* Safe Area Zone */}
            <div
              style={{
                position: "absolute",
                top: `${(activeModel.safeArea?.insetY || 24) * displayScale}px`,
                bottom: `${(activeModel.safeArea?.insetY || 24) * displayScale}px`,
                left: `${(activeModel.safeArea?.insetX || 24) * displayScale}px`,
                right: `${(activeModel.safeArea?.insetX || 24) * displayScale}px`,
                border: "2px dashed rgba(34, 197, 94, 0.8)",
                borderRadius: activeModel.corners === "sharp" ? "6px" : "28px",
                pointerEvents: "none",
              }}
            />

            {/* Camera Cutout Box */}
            <div
              style={{
                position: "absolute",
                top: `${activeModel.cameraCutout.y * displayScale}px`,
                left: `${activeModel.cameraCutout.x * displayScale}px`,
                width: `${activeModel.cameraCutout.width * displayScale}px`,
                height: `${activeModel.cameraCutout.height * displayScale}px`,
                borderRadius: `${activeModel.cameraCutout.radius * displayScale}px`,
                backgroundColor: "rgba(245, 158, 11, 0.35)",
                border: "2px solid #f59e0b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#f59e0b",
                fontSize: "0.65rem",
                fontWeight: 900,
                boxShadow: "0 0 10px rgba(245, 158, 11, 0.4)",
              }}
            >
              LENS
            </div>

            {/* Flash Cutout Circle */}
            <div
              style={{
                position: "absolute",
                top: `${activeModel.flashCutout.y * displayScale}px`,
                left: `${activeModel.flashCutout.x * displayScale}px`,
                width: `${activeModel.flashCutout.radius * 2 * displayScale}px`,
                height: `${activeModel.flashCutout.radius * 2 * displayScale}px`,
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.4)",
                border: "2px solid #ffffff",
                boxShadow: "0 0 8px rgba(255, 255, 255, 0.8)",
              }}
              title="Flash LED"
            />

            {/* Watermark grid overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "radial-gradient(circle, rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
                backgroundSize: "16px 16px",
                pointerEvents: "none",
              }}
            />
          </div>

          <div style={{ marginTop: "20px", fontSize: "0.78rem", color: "var(--foreground-muted)" }}>
            Rendered at {Math.round(displayScale * 100)}% scale ({Math.round(scaledW)} x {Math.round(scaledH)} px on display)
          </div>
        </div>

        {/* Right: Numeric Coordinate Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Camera Cutout Coordinates */}
          <div
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--surface-border)",
              borderRadius: "12px",
              padding: "20px",
            }}
          >
            <div style={{ fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#f59e0b", marginBottom: "14px" }}>
              📷 Camera Cutout Coordinates
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px" }}>
                  <span>X Position</span>
                  <span>{activeModel.cameraCutout.x} px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={activeModel.cameraCutout.x}
                  onChange={(e) =>
                    setActiveModel({
                      ...activeModel,
                      cameraCutout: { ...activeModel.cameraCutout, x: parseInt(e.target.value) },
                    })
                  }
                  style={{ width: "100%", accentColor: "#f59e0b" }}
                />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px" }}>
                  <span>Y Position</span>
                  <span>{activeModel.cameraCutout.y} px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="300"
                  value={activeModel.cameraCutout.y}
                  onChange={(e) =>
                    setActiveModel({
                      ...activeModel,
                      cameraCutout: { ...activeModel.cameraCutout, y: parseInt(e.target.value) },
                    })
                  }
                  style={{ width: "100%", accentColor: "#f59e0b" }}
                />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px" }}>
                  <span>Cutout Width</span>
                  <span>{activeModel.cameraCutout.width} px</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="300"
                  value={activeModel.cameraCutout.width}
                  onChange={(e) =>
                    setActiveModel({
                      ...activeModel,
                      cameraCutout: { ...activeModel.cameraCutout, width: parseInt(e.target.value) },
                    })
                  }
                  style={{ width: "100%", accentColor: "#f59e0b" }}
                />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px" }}>
                  <span>Cutout Height</span>
                  <span>{activeModel.cameraCutout.height} px</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="300"
                  value={activeModel.cameraCutout.height}
                  onChange={(e) =>
                    setActiveModel({
                      ...activeModel,
                      cameraCutout: { ...activeModel.cameraCutout, height: parseInt(e.target.value) },
                    })
                  }
                  style={{ width: "100%", accentColor: "#f59e0b" }}
                />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px" }}>
                  <span>Corner Radius</span>
                  <span>{activeModel.cameraCutout.radius} px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="120"
                  value={activeModel.cameraCutout.radius}
                  onChange={(e) =>
                    setActiveModel({
                      ...activeModel,
                      cameraCutout: { ...activeModel.cameraCutout, radius: parseInt(e.target.value) },
                    })
                  }
                  style={{ width: "100%", accentColor: "#f59e0b" }}
                />
              </div>
            </div>
          </div>

          {/* Flash Coordinates */}
          <div
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--surface-border)",
              borderRadius: "12px",
              padding: "20px",
            }}
          >
            <div style={{ fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#38bdf8", marginBottom: "14px" }}>
              ⚡ Flash Module Coordinates
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px" }}>
                  <span>Flash X</span>
                  <span>{activeModel.flashCutout.x} px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="300"
                  value={activeModel.flashCutout.x}
                  onChange={(e) =>
                    setActiveModel({
                      ...activeModel,
                      flashCutout: { ...activeModel.flashCutout, x: parseInt(e.target.value) },
                    })
                  }
                  style={{ width: "100%", accentColor: "#38bdf8" }}
                />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px" }}>
                  <span>Flash Y</span>
                  <span>{activeModel.flashCutout.y} px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="300"
                  value={activeModel.flashCutout.y}
                  onChange={(e) =>
                    setActiveModel({
                      ...activeModel,
                      flashCutout: { ...activeModel.flashCutout, y: parseInt(e.target.value) },
                    })
                  }
                  style={{ width: "100%", accentColor: "#38bdf8" }}
                />
              </div>
            </div>
          </div>

          {/* Safe & Bleed Margins */}
          <div
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--surface-border)",
              borderRadius: "12px",
              padding: "20px",
            }}
          >
            <div style={{ fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#22c55e", marginBottom: "14px" }}>
              🛡️ Safe Zone & Bleed Margins
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px" }}>
                  <span>Safe Inset Margin</span>
                  <span>{activeModel.safeArea?.insetX || 24} px</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={activeModel.safeArea?.insetX || 24}
                  onChange={(e) => {
                    const v = parseInt(e.target.value);
                    setActiveModel({
                      ...activeModel,
                      safeArea: { insetX: v, insetY: v + 6 },
                    });
                  }}
                  style={{ width: "100%", accentColor: "#22c55e" }}
                />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px" }}>
                  <span>Production Bleed</span>
                  <span>{activeModel.bleedArea?.bleedMm || 3} mm</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={activeModel.bleedArea?.bleedMm || 3}
                  onChange={(e) =>
                    setActiveModel({
                      ...activeModel,
                      bleedArea: { bleedMm: parseInt(e.target.value) },
                    })
                  }
                  style={{ width: "100%", accentColor: "#ef4444" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
