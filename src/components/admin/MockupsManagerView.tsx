"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  MockupConfig,
  getMockupModels,
  saveMockupModels,
  DEFAULT_MOCKUP_MODELS,
} from "@/lib/mockupData";
import PSDMockupCanvas from "@/components/studio/PSDMockupCanvas";

export default function MockupsManagerView() {
  const [models, setModels] = useState<MockupConfig[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>("iphone-16-pro-max");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [previewWithArtwork, setPreviewWithArtwork] = useState<boolean>(true);
  const [testArtworkUrl, setTestArtworkUrl] = useState<string>("/mockups/akira.jpg");

  // Visual drag/resize mode
  const [activeBox, setActiveBox] = useState<"printable" | "camera">("printable");
  const stageRef = useRef<HTMLDivElement>(null);
  const isDraggingBox = useRef(false);
  const isResizingBox = useRef(false);
  const dragOrigin = useRef({ mouseX: 0, mouseY: 0, boxX: 0, boxY: 0, boxW: 0, boxH: 0 });

  useEffect(() => {
    const loaded = getMockupModels();
    setModels(loaded);
    if (loaded.length > 0) {
      setSelectedSlug(loaded[0].slug);
    }
  }, []);

  const activeModel = models.find((m) => m.slug === selectedSlug) || models[0] || DEFAULT_MOCKUP_MODELS[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const updateActiveModel = (updates: Partial<MockupConfig>) => {
    const updatedList = models.map((m) =>
      m.slug === activeModel.slug ? { ...m, ...updates } : m
    );
    setModels(updatedList);
  };

  const handleSaveAll = async () => {
    saveMockupModels(models);
    try {
      await fetch("/api/mockups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: activeModel }),
      });
    } catch (e) {
      console.warn("API sync fallback:", e);
    }
    showToast(`✓ Mockup calibration saved for ${activeModel.name}!`);
  };

  const handleResetToDefaults = () => {
    saveMockupModels(DEFAULT_MOCKUP_MODELS);
    setModels(DEFAULT_MOCKUP_MODELS);
    showToast("Reset all models to default PSD specifications.");
  };

  const handleAddNewModel = () => {
    const newSlug = `phone-model-${Date.now()}`;
    const newModel: MockupConfig = {
      id: `m-${Date.now()}`,
      name: "New Phone Model",
      brand: "Apple",
      slug: newSlug,
      active: true,
      archetype: "iphone-triple",
      templateUrl: "/mockups/templates/iphone_16_pro_max.png",
      canvasWidth: 1058,
      canvasHeight: 1255,
      printableX: 350,
      printableY: 250,
      printableWidth: 359,
      printableHeight: 756,
      printableRadius: 40,
      cameraX: 362,
      cameraY: 262,
      cameraWidth: 140,
      cameraHeight: 150,
      cameraRadius: 36,
      printWidthMm: 77.0,
      printHeightMm: 160.0,
      dpi: 300,
      caseTypes: ["9H Tempered Glass", "Ultra Impact MagSafe", "Matte Slim"],
    };
    const updated = [...models, newModel];
    setModels(updated);
    setSelectedSlug(newSlug);
    saveMockupModels(updated);
    showToast("Added new phone model configuration.");
  };

  const handleDeleteModel = (slug: string) => {
    if (models.length <= 1) {
      showToast("Cannot delete the last phone model.");
      return;
    }
    const updated = models.filter((m) => m.slug !== slug);
    setModels(updated);
    setSelectedSlug(updated[0].slug);
    saveMockupModels(updated);
    showToast("Phone model deleted.");
  };

  // Calibration Stage display scale
  const stageScale = 0.42;
  const stageW = activeModel.canvasWidth * stageScale;
  const stageH = activeModel.canvasHeight * stageScale;

  // Box positions on screen
  const isPrintable = activeBox === "printable";
  const boxX = (isPrintable ? activeModel.printableX : activeModel.cameraX) * stageScale;
  const boxY = (isPrintable ? activeModel.printableY : activeModel.cameraY) * stageScale;
  const boxW = (isPrintable ? activeModel.printableWidth : activeModel.cameraWidth) * stageScale;
  const boxH = (isPrintable ? activeModel.printableHeight : activeModel.cameraHeight) * stageScale;
  const boxColor = isPrintable ? "#22c55e" : "#ef4444";

  // Visual drag/move handle
  const handleStartMove = (e: React.MouseEvent) => {
    isDraggingBox.current = true;
    dragOrigin.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      boxX: isPrintable ? activeModel.printableX : activeModel.cameraX,
      boxY: isPrintable ? activeModel.printableY : activeModel.cameraY,
      boxW: isPrintable ? activeModel.printableWidth : activeModel.cameraWidth,
      boxH: isPrintable ? activeModel.printableHeight : activeModel.cameraHeight,
    };
    e.preventDefault();
    e.stopPropagation();
  };

  // Visual resize handle
  const handleStartResize = (e: React.MouseEvent) => {
    isResizingBox.current = true;
    dragOrigin.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      boxX: isPrintable ? activeModel.printableX : activeModel.cameraX,
      boxY: isPrintable ? activeModel.printableY : activeModel.cameraY,
      boxW: isPrintable ? activeModel.printableWidth : activeModel.cameraWidth,
      boxH: isPrintable ? activeModel.printableHeight : activeModel.cameraHeight,
    };
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDraggingBox.current) {
        const dx = (e.clientX - dragOrigin.current.mouseX) / stageScale;
        const dy = (e.clientY - dragOrigin.current.mouseY) / stageScale;
        const newX = Math.round(dragOrigin.current.boxX + dx);
        const newY = Math.round(dragOrigin.current.boxY + dy);
        if (isPrintable) {
          updateActiveModel({ printableX: newX, printableY: newY });
        } else {
          updateActiveModel({ cameraX: newX, cameraY: newY });
        }
      } else if (isResizingBox.current) {
        const dx = (e.clientX - dragOrigin.current.mouseX) / stageScale;
        const dy = (e.clientY - dragOrigin.current.mouseY) / stageScale;
        const newW = Math.max(20, Math.round(dragOrigin.current.boxW + dx));
        const newH = Math.max(20, Math.round(dragOrigin.current.boxH + dy));
        if (isPrintable) {
          updateActiveModel({ printableWidth: newW, printableHeight: newH });
        } else {
          updateActiveModel({ cameraWidth: newW, cameraHeight: newH });
        }
      }
    };

    const onMouseUp = () => {
      isDraggingBox.current = false;
      isResizingBox.current = false;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [stageScale, isPrintable, activeModel]);

  return (
    <div style={{ animation: "fadeIn 0.2s ease-in-out" }}>
      {/* Toast Alert */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            backgroundColor: "#111115",
            color: "#fff",
            border: "1px solid var(--main-accent)",
            padding: "12px 24px",
            borderRadius: "10px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
            zIndex: 9999,
            fontSize: "0.85rem",
            fontWeight: 800,
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Header Deck */}
      <div
        style={{
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 800,
              letterSpacing: "0.15em",
              color: "var(--main-accent)",
              textTransform: "uppercase",
              marginBottom: "4px",
            }}
          >
            REAL PSD MOCKUP ENGINE
          </div>
          <h2 style={{ fontSize: "1.9rem", fontWeight: 900, margin: "0 0 6px", color: "var(--foreground)" }}>
            Visual Phone Mockup Manager
          </h2>
          <p style={{ color: "var(--foreground-muted)", fontSize: "0.88rem", margin: 0 }}>
            Visually position printable case slots, camera cutouts, and physical manufacturing specs.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleAddNewModel}
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
            + Add Model
          </button>
          <button
            onClick={handleResetToDefaults}
            style={{
              padding: "9px 16px",
              borderRadius: "8px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--surface-border)",
              color: "var(--foreground-muted)",
              fontSize: "0.82rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            ↺ Defaults
          </button>
          <button
            onClick={handleSaveAll}
            style={{
              padding: "9px 20px",
              borderRadius: "8px",
              backgroundColor: "var(--main-accent)",
              border: "none",
              color: "#fff",
              fontSize: "0.82rem",
              fontWeight: 800,
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(220, 38, 38, 0.35)",
            }}
          >
            💾 Save Calibration
          </button>
        </div>
      </div>

      {/* Main Grid: Left Selectors, Center Stage, Right Coordinates */}
      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr 340px", gap: "24px", alignItems: "start" }}>
        {/* Left Column: Phone Model Switcher */}
        <div
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--surface-border)",
            borderRadius: "14px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            maxHeight: "800px",
            overflowY: "auto",
          }}
        >
          <div style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", color: "var(--foreground-muted)", marginBottom: "8px" }}>
            Installed Phone Models ({models.length})
          </div>

          {models.map((m) => {
            const isSelected = m.slug === selectedSlug;
            return (
              <div
                key={m.slug}
                onClick={() => setSelectedSlug(m.slug)}
                style={{
                  padding: "10px 12px",
                  borderRadius: "8px",
                  backgroundColor: isSelected ? "var(--surface-raised)" : "transparent",
                  border: isSelected ? "1px solid var(--main-accent)" : "1px solid transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "all 0.15s ease",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 800, color: isSelected ? "var(--main-accent)" : "var(--foreground)" }}>
                    {m.name}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--foreground-muted)" }}>
                    {m.brand} • {m.printableWidth}x{m.printableHeight}px
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={m.active}
                  onChange={(e) => {
                    e.stopPropagation();
                    const updated = models.map((mod) =>
                      mod.slug === m.slug ? { ...mod, active: e.target.checked } : mod
                    );
                    setModels(updated);
                    saveMockupModels(updated);
                  }}
                  title="Toggle active status"
                />
              </div>
            );
          })}
        </div>

        {/* Center Column: Interactive Visual Mockup Stage */}
        <div
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--surface-border)",
            borderRadius: "14px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Stage Controls */}
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
              paddingBottom: "12px",
              borderBottom: "1px solid var(--surface-border)",
            }}
          >
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setActiveBox("printable")}
                style={{
                  padding: "6px 14px",
                  borderRadius: "6px",
                  backgroundColor: activeBox === "printable" ? "#22c55e" : "var(--surface-raised)",
                  color: activeBox === "printable" ? "#000" : "var(--foreground)",
                  border: "none",
                  fontSize: "0.78rem",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                🟩 Calibrate Printable Slot
              </button>
              <button
                onClick={() => setActiveBox("camera")}
                style={{
                  padding: "6px 14px",
                  borderRadius: "6px",
                  backgroundColor: activeBox === "camera" ? "#ef4444" : "var(--surface-raised)",
                  color: "#fff",
                  border: "none",
                  fontSize: "0.78rem",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                🟥 Calibrate Camera Cutout
              </button>
            </div>

            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={previewWithArtwork}
                onChange={(e) => setPreviewWithArtwork(e.target.checked)}
              />
              <span>Live Artwork Preview</span>
            </label>
          </div>

          {/* Visual Stage Container */}
          <div
            ref={stageRef}
            style={{
              position: "relative",
              width: `${stageW}px`,
              height: `${stageH}px`,
              backgroundColor: "#111115",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 15px 40px rgba(0,0,0,0.6)",
              userSelect: "none",
            }}
          >
            {/* 1. Underlying Artwork Slot */}
            {previewWithArtwork && (
              <div
                style={{
                  position: "absolute",
                  left: `${activeModel.printableX * stageScale}px`,
                  top: `${activeModel.printableY * stageScale}px`,
                  width: `${activeModel.printableWidth * stageScale}px`,
                  height: `${activeModel.printableHeight * stageScale}px`,
                  borderRadius: `${activeModel.printableRadius * stageScale}px`,
                  overflow: "hidden",
                  zIndex: 5,
                }}
              >
                <Image
                  src={testArtworkUrl}
                  alt="Sample"
                  fill
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
              </div>
            )}

            {/* 2. PSD Mockup Template Overlay */}
            <div style={{ position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none" }}>
              <Image
                src={activeModel.templateUrl}
                alt={activeModel.name}
                fill
                style={{ objectFit: "contain" }}
                priority
                unoptimized
              />
            </div>

            {/* 3. Interactive Draggable & Resizable Active Bounding Box */}
            <div
              onMouseDown={handleStartMove}
              style={{
                position: "absolute",
                left: `${boxX}px`,
                top: `${boxY}px`,
                width: `${boxW}px`,
                height: `${boxH}px`,
                border: `2px solid ${boxColor}`,
                backgroundColor: `${boxColor}22`,
                borderRadius: isPrintable
                  ? `${activeModel.printableRadius * stageScale}px`
                  : `${activeModel.cameraRadius * stageScale}px`,
                zIndex: 30,
                cursor: "move",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontSize: "0.62rem",
                  fontWeight: 900,
                  color: "#fff",
                  backgroundColor: "rgba(0,0,0,0.75)",
                  padding: "2px 6px",
                  borderRadius: "3px",
                  pointerEvents: "none",
                }}
              >
                {isPrintable ? "PRINTABLE SLOT" : "CAMERA CUTOUT"}
              </span>

              {/* Bottom-Right Resize Handle */}
              <div
                onMouseDown={handleStartResize}
                style={{
                  position: "absolute",
                  right: "-5px",
                  bottom: "-5px",
                  width: "12px",
                  height: "12px",
                  backgroundColor: boxColor,
                  border: "2px solid #fff",
                  borderRadius: "2px",
                  cursor: "nwse-resize",
                  zIndex: 35,
                }}
              />
            </div>
          </div>

          <div style={{ marginTop: "12px", fontSize: "0.74rem", color: "var(--foreground-muted)" }}>
            💡 Drag the highlighted box to reposition. Drag the small square handle at bottom-right to resize.
          </div>
        </div>

        {/* Right Column: Coordinate Telemetry & Print Specs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Printable Area Specs */}
          <div
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--surface-border)",
              borderRadius: "14px",
              padding: "16px",
            }}
          >
            <div style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", color: "#22c55e", marginBottom: "12px" }}>
              Printable Area Slot (px)
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
              <div>
                <label style={{ fontSize: "0.72rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                  X Coordinate
                </label>
                <input
                  type="number"
                  value={activeModel.printableX}
                  onChange={(e) => updateActiveModel({ printableX: parseInt(e.target.value) || 0 })}
                  style={{ width: "100%", padding: "6px 8px", borderRadius: "6px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)", fontSize: "0.85rem", fontWeight: 700 }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.72rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                  Y Coordinate
                </label>
                <input
                  type="number"
                  value={activeModel.printableY}
                  onChange={(e) => updateActiveModel({ printableY: parseInt(e.target.value) || 0 })}
                  style={{ width: "100%", padding: "6px 8px", borderRadius: "6px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)", fontSize: "0.85rem", fontWeight: 700 }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
              <div>
                <label style={{ fontSize: "0.72rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                  Width
                </label>
                <input
                  type="number"
                  value={activeModel.printableWidth}
                  onChange={(e) => updateActiveModel({ printableWidth: parseInt(e.target.value) || 0 })}
                  style={{ width: "100%", padding: "6px 8px", borderRadius: "6px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)", fontSize: "0.85rem", fontWeight: 700 }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.72rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                  Height
                </label>
                <input
                  type="number"
                  value={activeModel.printableHeight}
                  onChange={(e) => updateActiveModel({ printableHeight: parseInt(e.target.value) || 0 })}
                  style={{ width: "100%", padding: "6px 8px", borderRadius: "6px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)", fontSize: "0.85rem", fontWeight: 700 }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: "0.72rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                Corner Radius
              </label>
              <input
                type="number"
                value={activeModel.printableRadius}
                onChange={(e) => updateActiveModel({ printableRadius: parseInt(e.target.value) || 0 })}
                style={{ width: "100%", padding: "6px 8px", borderRadius: "6px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)", fontSize: "0.85rem", fontWeight: 700 }}
              />
            </div>
          </div>

          {/* Camera Cutout Specs */}
          <div
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--surface-border)",
              borderRadius: "14px",
              padding: "16px",
            }}
          >
            <div style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", color: "#ef4444", marginBottom: "12px" }}>
              Camera Cutout Bounds (px)
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
              <div>
                <label style={{ fontSize: "0.72rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                  X
                </label>
                <input
                  type="number"
                  value={activeModel.cameraX}
                  onChange={(e) => updateActiveModel({ cameraX: parseInt(e.target.value) || 0 })}
                  style={{ width: "100%", padding: "6px 8px", borderRadius: "6px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)", fontSize: "0.85rem", fontWeight: 700 }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.72rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                  Y
                </label>
                <input
                  type="number"
                  value={activeModel.cameraY}
                  onChange={(e) => updateActiveModel({ cameraY: parseInt(e.target.value) || 0 })}
                  style={{ width: "100%", padding: "6px 8px", borderRadius: "6px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)", fontSize: "0.85rem", fontWeight: 700 }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <label style={{ fontSize: "0.72rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                  Width
                </label>
                <input
                  type="number"
                  value={activeModel.cameraWidth}
                  onChange={(e) => updateActiveModel({ cameraWidth: parseInt(e.target.value) || 0 })}
                  style={{ width: "100%", padding: "6px 8px", borderRadius: "6px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)", fontSize: "0.85rem", fontWeight: 700 }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.72rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                  Height
                </label>
                <input
                  type="number"
                  value={activeModel.cameraHeight}
                  onChange={(e) => updateActiveModel({ cameraHeight: parseInt(e.target.value) || 0 })}
                  style={{ width: "100%", padding: "6px 8px", borderRadius: "6px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)", fontSize: "0.85rem", fontWeight: 700 }}
                />
              </div>
            </div>
          </div>

          {/* Manufacturing Dimensions */}
          <div
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--surface-border)",
              borderRadius: "14px",
              padding: "16px",
            }}
          >
            <div style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", color: "var(--main-accent)", marginBottom: "12px" }}>
              Physical Print Specs (Millimeters)
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <label style={{ fontSize: "0.72rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                  Width (mm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={activeModel.printWidthMm}
                  onChange={(e) => updateActiveModel({ printWidthMm: parseFloat(e.target.value) || 70 })}
                  style={{ width: "100%", padding: "6px 8px", borderRadius: "6px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)", fontSize: "0.85rem", fontWeight: 700 }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.72rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                  Height (mm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={activeModel.printHeightMm}
                  onChange={(e) => updateActiveModel({ printHeightMm: parseFloat(e.target.value) || 150 })}
                  style={{ width: "100%", padding: "6px 8px", borderRadius: "6px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)", fontSize: "0.85rem", fontWeight: 700 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
