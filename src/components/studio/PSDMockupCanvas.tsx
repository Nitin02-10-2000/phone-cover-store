"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { MockupConfig } from "@/lib/mockupData";

export interface CustomTextItem {
  id: string;
  text: string;
  font: string;
  size: number;
  color: string;
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  rotation?: number;
}

export interface CustomStickerItem {
  id: string;
  name: string;
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  scale?: number;
}

export interface ArtworkTransform {
  x: number; // px offset
  y: number; // px offset
  scale: number; // e.g. 1 = 100%
  rotation: number; // degrees
}

interface PSDMockupCanvasProps {
  mockup: MockupConfig;
  artworkUrl?: string;
  transform: ArtworkTransform;
  onTransformChange?: (newTransform: ArtworkTransform) => void;
  customTexts?: CustomTextItem[];
  customStickers?: CustomStickerItem[];
  filterStyle?: string;
  caseType?: string;
  interactive?: boolean;
  showGuidelines?: boolean;
  displayScale?: number; // scale down for UI viewport (e.g. 0.45)
  className?: string;
  style?: React.CSSProperties;
}

export default function PSDMockupCanvas({
  mockup,
  artworkUrl,
  transform,
  onTransformChange,
  customTexts = [],
  customStickers = [],
  filterStyle = "none",
  caseType = "9H Tempered Glass",
  interactive = true,
  showGuidelines = false,
  displayScale = 0.72,
  className = "",
  style = {},
}: PSDMockupCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const initialTransform = useRef(transform);

  // Scaled dimensions for UI display
  const scaledWidth = mockup.canvasWidth * displayScale;
  const scaledHeight = mockup.canvasHeight * displayScale;

  // Printable Slot scaled coordinates
  const slotLeft = mockup.printableX * displayScale;
  const slotTop = mockup.printableY * displayScale;
  const slotWidth = mockup.printableWidth * displayScale;
  const slotHeight = mockup.printableHeight * displayScale;
  const slotRadius = mockup.printableRadius * displayScale;

  // Camera Cutout scaled coordinates
  const camLeft = mockup.cameraX * displayScale;
  const camTop = mockup.cameraY * displayScale;
  const camWidth = mockup.cameraWidth * displayScale;
  const camHeight = mockup.cameraHeight * displayScale;
  const camRadius = mockup.cameraRadius * displayScale;

  // ── Drag Artwork Inside Case Slot ──────────────────────────────────────────
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!interactive) return;
      setIsDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY };
      initialTransform.current = { ...transform };
      e.preventDefault();
    },
    [interactive, transform]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !onTransformChange) return;
      const dx = (e.clientX - dragStart.current.x) / displayScale;
      const dy = (e.clientY - dragStart.current.y) / displayScale;

      onTransformChange({
        ...initialTransform.current,
        x: Math.round(initialTransform.current.x + dx),
        y: Math.round(initialTransform.current.y + dy),
      });
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, displayScale, onTransformChange]);

  // Wheel to zoom
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!interactive || !onTransformChange) return;
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 0.05 : -0.05;
      const newScale = Math.max(0.2, Math.min(4.0, transform.scale + zoomFactor));
      onTransformChange({
        ...transform,
        scale: Number(newScale.toFixed(2)),
      });
    },
    [interactive, onTransformChange, transform]
  );

  const isGlass = caseType.toLowerCase().includes("glass");
  const isMatte = caseType.toLowerCase().includes("matte");

  return (
    <div
      ref={containerRef}
      className={`psd-mockup-canvas ${className}`}
      onWheel={handleWheel}
      style={{
        position: "relative",
        width: `${scaledWidth}px`,
        height: `${scaledHeight}px`,
        userSelect: "none",
        overflow: "visible",
        ...style,
      }}
    >
      {/* ══════════════════════════════════════════════════════════════════════
          LAYER 0: SOFT DIFFUSE DROP SHADOW BENEATH PHONE CASE
          Matches product card shadows from the store.
          ══════════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          left: `${slotLeft + 4}px`,
          top: `${slotTop + 4}px`,
          width: `${slotWidth - 8}px`,
          height: `${slotHeight - 8}px`,
          borderRadius: `${slotRadius}px`,
          backgroundColor: "rgba(0, 0, 0, 0.45)",
          filter: "blur(22px)",
          transform: "translateY(18px) scale(0.96)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      {/* ══════════════════════════════════════════════════════════════════════
          LAYER 1: USER ARTWORK (Clipped to Printable Phone Case Shape)
          Positioned directly behind the transparent slot in the PSD template.
          ══════════════════════════════════════════════════════════════════════ */}
      <div
        onMouseDown={handleMouseDown}
        style={{
          position: "absolute",
          left: `${slotLeft}px`,
          top: `${slotTop}px`,
          width: `${slotWidth}px`,
          height: `${slotHeight}px`,
          borderRadius: `${slotRadius}px`,
          overflow: "hidden",
          zIndex: 10,
          cursor: isDragging ? "grabbing" : interactive ? "grab" : "default",
          backgroundColor: "#111115",
        }}
        title={interactive ? "Click and drag to reposition image" : undefined}
      >
        {/* User Image Layer with Translation, Scale, and Rotation */}
        {artworkUrl ? (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: "100%",
              height: "100%",
              transform: `translate(-50%, -50%) translate(${transform.x * displayScale}px, ${transform.y * displayScale}px) scale(${transform.scale}) rotate(${transform.rotation}deg)`,
              transformOrigin: "center center",
              transition: isDragging ? "none" : "transform 0.08s ease-out",
              filter: filterStyle,
            }}
          >
            <Image
              src={artworkUrl}
              alt="Custom Artwork"
              fill
              sizes={`${slotWidth}px`}
              style={{ objectFit: "cover" }}
              unoptimized
              priority
              draggable={false}
            />
          </div>
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255,255,255,0.4)",
              fontSize: "0.8rem",
              fontWeight: 700,
              padding: "20px",
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: "1.8rem", marginBottom: "8px" }}>📸</span>
            <span>Upload your photo or design</span>
          </div>
        )}

        {/* Custom Text Overlays (Clipped inside case) */}
        {customTexts.map((txt) => (
          <div
            key={txt.id}
            style={{
              position: "absolute",
              left: `${txt.x}%`,
              top: `${txt.y}%`,
              transform: `translate(-50%, -50%) rotate(${txt.rotation || 0}deg)`,
              fontFamily: txt.font,
              fontSize: `${txt.size * displayScale * 1.6}px`,
              color: txt.color,
              fontWeight: 900,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              textShadow: "0 2px 8px rgba(0,0,0,0.85)",
              pointerEvents: "none",
              zIndex: 15,
              whiteSpace: "nowrap",
            }}
          >
            {txt.text}
          </div>
        ))}

        {/* Custom Sticker Overlays (Clipped inside case) */}
        {customStickers.map((stk) => (
          <div
            key={stk.id}
            style={{
              position: "absolute",
              left: `${stk.x}%`,
              top: `${stk.y}%`,
              transform: `translate(-50%, -50%) scale(${stk.scale || 1})`,
              backgroundColor: "var(--shinra-red, #dc2626)",
              color: "#ffffff",
              fontSize: "0.72rem",
              fontWeight: 900,
              padding: "4px 8px",
              borderRadius: "4px",
              letterSpacing: "0.08em",
              boxShadow: "0 4px 12px rgba(0,0,0,0.8)",
              pointerEvents: "none",
              zIndex: 16,
              whiteSpace: "nowrap",
            }}
          >
            {stk.name}
          </div>
        ))}

        {/* Safe Area & Bleed Guidelines (Visible when toggled) */}
        {showGuidelines && (
          <>
            <div
              style={{
                position: "absolute",
                inset: "12px",
                border: "2px dashed rgba(34, 197, 94, 0.8)",
                borderRadius: `${Math.max(4, slotRadius - 10)}px`,
                pointerEvents: "none",
                zIndex: 25,
              }}
            >
              <span
                style={{
                  position: "absolute",
                  bottom: "6px",
                  left: "8px",
                  backgroundColor: "rgba(0,0,0,0.7)",
                  color: "#22c55e",
                  fontSize: "0.58rem",
                  fontWeight: 800,
                  padding: "1px 5px",
                  borderRadius: "3px",
                }}
              >
                SAFE AREA
              </span>
            </div>
            <div
              style={{
                position: "absolute",
                inset: "-4px",
                border: "2px dashed rgba(245, 158, 11, 0.8)",
                borderRadius: `${slotRadius + 4}px`,
                pointerEvents: "none",
                zIndex: 24,
              }}
            />
          </>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          LAYER 2 & 3: PSD TEMPLATE OVERLAY (Phone Bumper, Camera Module,
          Lenses, Side Buttons, Wall Background & Floor Shadow)
          This layer sits directly ON TOP of the artwork so the camera lenses
          and phone frame NEVER get covered by the customer's picture.
          ══════════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 20,
          pointerEvents: "none",
        }}
      >
        <Image
          src={mockup.templateUrl}
          alt={mockup.name}
          fill
          sizes={`${scaledWidth}px`}
          style={{ objectFit: "contain" }}
          priority
          draggable={false}
        />
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          LAYER 4: GLASS SHEEN & SPECULAR HIGHLIGHTS
          Simulates authentic 9H tempered glass reflection or matte finish.
          ══════════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          left: `${slotLeft}px`,
          top: `${slotTop}px`,
          width: `${slotWidth}px`,
          height: `${slotHeight}px`,
          borderRadius: `${slotRadius}px`,
          background: isGlass
            ? "linear-gradient(135deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.03) 42%, rgba(0,0,0,0.2) 100%)"
            : isMatte
            ? "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%)"
            : "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(0,0,0,0.15) 100%)",
          boxShadow: "inset 0 0 16px rgba(255,255,255,0.1)",
          pointerEvents: "none",
          zIndex: 30,
        }}
      />

      {/* Camera Cutout Guideline Indicator (When guidelines are enabled) */}
      {showGuidelines && (
        <div
          style={{
            position: "absolute",
            left: `${camLeft}px`,
            top: `${camTop}px`,
            width: `${camWidth}px`,
            height: `${camHeight}px`,
            borderRadius: `${camRadius}px`,
            border: "2px solid rgba(239, 68, 68, 0.8)",
            backgroundColor: "rgba(239, 68, 68, 0.15)",
            zIndex: 35,
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: "0.55rem",
              fontWeight: 900,
              color: "#ef4444",
              backgroundColor: "rgba(0,0,0,0.7)",
              padding: "1px 4px",
              borderRadius: "2px",
            }}
          >
            CAMERA CUTOUT
          </span>
        </div>
      )}
    </div>
  );
}
