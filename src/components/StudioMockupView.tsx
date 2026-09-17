"use client";

import React from "react";
import Image from "next/image";

interface StudioMockupViewProps {
  artworkUrl: string;
  phoneModel: string;
  customText?: string;
  textColor?: string;
  activeSticker?: string | null;
  width?: number;
  height?: number;
}

interface TemplateSpec {
  file: string;
  canvasW: number;
  canvasH: number;
  slotX: number;
  slotY: number;
  slotW: number;
  slotH: number;
  deviceLabel: string;
}

const TEMPLATES: Record<string, TemplateSpec> = {
  iphone: {
    file: "/mockups/templates/iphone_16_pro_max.png",
    canvasW: 1059,
    canvasH: 1256,
    slotX: 350,
    slotY: 250,
    slotW: 359,
    slotH: 756,
    deviceLabel: "iPhone 16 Pro Max",
  },
  samsung: {
    file: "/mockups/templates/samsung_s23_ultra.png",
    canvasW: 1176,
    canvasH: 1498,
    slotX: 350,
    slotY: 250,
    slotW: 476,
    slotH: 998,
    deviceLabel: "Galaxy S23 Ultra",
  },
  oneplus: {
    file: "/mockups/templates/oneplus_11.png",
    canvasW: 1111,
    canvasH: 1423,
    slotX: 350,
    slotY: 250,
    slotW: 411,
    slotH: 923,
    deviceLabel: "OnePlus 11",
  },
};

export default function StudioMockupView({
  artworkUrl,
  phoneModel,
  customText,
  textColor = "#ffffff",
  activeSticker,
  width = 340,
}: StudioMockupViewProps) {
  const modelLower = phoneModel.toLowerCase();
  let key = "iphone";
  if (modelLower.includes("samsung") || modelLower.includes("galaxy") || modelLower.includes("s2") || modelLower.includes("ultra")) {
    key = "samsung";
  } else if (modelLower.includes("oneplus") || modelLower.includes("1+")) {
    key = "oneplus";
  }

  const spec = TEMPLATES[key] || TEMPLATES.iphone;
  const aspectRatio = spec.canvasH / spec.canvasW;
  const height = Math.round(width * aspectRatio);

  const leftPercent = (spec.slotX / spec.canvasW) * 100;
  const topPercent = (spec.slotY / spec.canvasH) * 100;
  const widthPercent = (spec.slotW / spec.canvasW) * 100;
  const heightPercent = (spec.slotH / spec.canvasH) * 100;

  return (
    <div
      style={{
        position: "relative",
        width: `${width}px`,
        height: `${height}px`,
        borderRadius: "16px",
        overflow: "hidden",
        backgroundColor: "#f4f4f6",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
        userSelect: "none",
      }}
    >
      {/* Studio Background Fill */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, #ececf0 0%, #dedfe4 70%, #d4d5db 100%)",
        }}
      />

      {/* Artwork Slot Underneath Template Mask */}
      <div
        style={{
          position: "absolute",
          left: `${leftPercent}%`,
          top: `${topPercent}%`,
          width: `${widthPercent}%`,
          height: `${heightPercent}%`,
          overflow: "hidden",
          borderRadius: "6px",
          zIndex: 1,
        }}
      >
        <Image
          src={artworkUrl}
          alt={phoneModel}
          fill
          sizes={`${spec.slotW}px`}
          style={{ objectFit: "cover" }}
          priority
        />

        {/* Custom Text Overlay if present */}
        {customText && (
          <div
            style={{
              position: "absolute",
              bottom: "8%",
              left: "8%",
              right: "8%",
              textAlign: "center",
              color: textColor,
              fontSize: `${Math.max(10, Math.round(width * 0.035))}px`,
              fontWeight: 900,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textShadow: "0 2px 8px rgba(0,0,0,0.8)",
              backgroundColor: "rgba(0,0,0,0.45)",
              padding: "2px 4px",
              borderRadius: "3px",
              backdropFilter: "blur(2px)",
              zIndex: 3,
            }}
          >
            {customText}
          </div>
        )}

        {/* Sticker Overlay if present */}
        {activeSticker && (
          <div
            style={{
              position: "absolute",
              top: "22%",
              right: "6%",
              backgroundColor: "var(--shinra-red, #dc2626)",
              color: "#ffffff",
              fontSize: `${Math.max(8, Math.round(width * 0.024))}px`,
              fontWeight: 800,
              padding: "2px 6px",
              borderRadius: "3px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
              zIndex: 3,
            }}
          >
            {activeSticker}
          </div>
        )}
      </div>

      {/* PSD Studio Layer: Leaning Phone Frame + Camera Cutouts + Studio Shadows + Glass Reflection */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        <Image
          src={spec.file}
          alt={`${spec.deviceLabel} Studio Mockup`}
          fill
          sizes={`${width}px`}
          style={{ objectFit: "contain" }}
          priority
        />
      </div>

      {/* Device & Studio Tag Badge */}
      <div
        style={{
          position: "absolute",
          top: "12px",
          left: "14px",
          zIndex: 5,
          display: "flex",
          alignItems: "center",
          gap: "6px",
          backgroundColor: "rgba(15, 15, 18, 0.8)",
          backdropFilter: "blur(8px)",
          padding: "4px 10px",
          borderRadius: "999px",
          border: "1px solid rgba(255, 255, 255, 0.15)",
        }}
      >
        <span style={{ fontSize: "0.65rem", color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          3D Studio
        </span>
        <span style={{ fontSize: "0.72rem", color: "#ffffff", fontWeight: 700 }}>
          {spec.deviceLabel}
        </span>
      </div>
    </div>
  );
}
