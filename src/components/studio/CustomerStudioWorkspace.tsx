"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cartContext";
import { useDevice } from "@/lib/deviceContext";
import { saveUserStudioProduct } from "@/lib/productsStorage";
import { Product } from "@/data/products";
import PhoneCase3D from "@/components/studio/PhoneCase3D";
import CaseTadkaLogo from "@/components/CaseTadkaLogo";
import { ALL_PHONE_MODELS, PhoneModelItem, CameraArchetype, getAllPhoneModels, getPhoneModelDetails } from "@/data/phoneModels";
import { getMockupModelByName } from "@/lib/mockupData";
import {
  getStudioPhoneModels,
  getStudioPricing,
  calculateCustomPrice,
  saveCustomOrderDesign,
  generateProductionPrintCanvas,
  StudioPricingConfig,
} from "@/lib/studioStorage";

const INITIAL_UPLOADS: { id: string; name: string; url: string }[] = [];

const CASE_FINISHES = [
  { id: "glossy", name: "Plastic matt", subtitle: "Zero Fingerprint Velvet Touch", price: 399, tag: "POPULAR" },
  { id: "tempered", name: "9H Tempered Glass", subtitle: "Ultra High-Gloss Scratchproof", price: 499, tag: "BESTSELLER" },
  { id: "magsafe", name: "MagSafe Armor", subtitle: "Magnetic Ring + Clear Frame", price: 549, tag: "MAGNETIC" },
  { id: "transparent", name: "Transparent TPU", subtitle: "Anti-Yellowing Crystal Clear", price: 349, tag: "SLIM" },
];

const PACKAGE_COLORS = [
  { id: "white", color: "#ffffff", label: "Pure White" },
  { id: "cream", color: "#fef3c7", label: "Linen Cream" },
  { id: "yellow", color: "#fde047", label: "Sunset Gold" },
  { id: "pink", color: "#fbcfe8", label: "Sakura Pink" },
  { id: "brown", color: "#78350f", label: "Vintage Amber" },
  { id: "green", color: "#15803d", label: "Emerald Pine" },
  { id: "black", color: "#18181b", label: "Obsidian" },
];

// Mini Phone Case SVG Component for Layout Drawer Mockup Cards
function SvgMiniCase({
  x = 0,
  y = 0,
  w = 24,
  h = 50,
  rot = 0,
  isDark = false,
  isBack = false,
}: {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  rot?: number;
  isDark?: boolean;
  isBack?: boolean;
}) {
  const transform = rot !== 0 ? `rotate(${rot} ${x + w / 2} ${y + h / 2})` : undefined;
  return (
    <g transform={transform}>
      {/* Soft Drop Shadow */}
      <rect
        x={x + 1}
        y={y + 1.5}
        width={w}
        height={h}
        rx={5}
        fill="rgba(0,0,0,0.08)"
      />
      {/* Case Body */}
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={5}
        fill={isDark ? "#27272a" : "#ffffff"}
        stroke={isDark ? "#18181b" : "#cbd5e1"}
        strokeWidth={0.9}
      />
      {isBack ? (
        // Back Plate with Camera Cutout (Top-Left)
        <g>
          <rect
            x={x + 2}
            y={y + 2.5}
            width={w * 0.42}
            height={h * 0.28}
            rx={2.5}
            fill={isDark ? "#3f3f46" : "#e2e8f0"}
            stroke={isDark ? "#52525b" : "#94a3b8"}
            strokeWidth={0.5}
          />
          <circle cx={x + 2 + w * 0.21} cy={y + 2.5 + h * 0.08} r={1.6} fill={isDark ? "#18181b" : "#64748b"} />
          <circle cx={x + 2 + w * 0.21} cy={y + 2.5 + h * 0.20} r={1.6} fill={isDark ? "#18181b" : "#64748b"} />
        </g>
      ) : (
        // Front / Screen Mockup with Cyan Wave
        <g>
          {/* Dynamic Island Notch */}
          <rect x={x + w / 2 - 3} y={y + 2} width={6} height={1.8} rx={0.9} fill="#18181b" />
          {/* Screen Background */}
          <rect x={x + 1.2} y={y + 1.2} width={w - 2.4} height={h - 2.4} rx={4} fill="#f0f9ff" />
          {/* Wave Gradients */}
          <path
            d={`M ${x + 1.2} ${y + h * 0.58} Q ${x + w * 0.5} ${y + h * 0.48} ${x + w - 1.2} ${y + h * 0.58} L ${x + w - 1.2} ${y + h - 1.2} L ${x + 1.2} ${y + h - 1.2} Z`}
            fill="#38bdf8"
            opacity={0.45}
          />
          <path
            d={`M ${x + 1.2} ${y + h * 0.7} Q ${x + w * 0.5} ${y + h * 0.62} ${x + w - 1.2} ${y + h * 0.68} L ${x + w - 1.2} ${y + h - 1.2} L ${x + 1.2} ${y + h - 1.2} Z`}
            fill="#0284c7"
            opacity={0.55}
          />
          <text
            x={x + w / 2}
            y={y + h * 0.38}
            fontSize={2.8}
            fontWeight="bold"
            fill="#0369a1"
            textAnchor="middle"
          >
            Phone
          </text>
          <text
            x={x + w / 2}
            y={y + h * 0.44}
            fontSize={2.3}
            fill="#64748b"
            textAnchor="middle"
          >
            Mockup
          </text>
        </g>
      )}
    </g>
  );
}

function MiniPhoneCoverModel({ model, isSelected }: { model: PhoneModelItem; isSelected: boolean }) {
  const isSharp = model.corners === "sharp";
  const cornerRadius = isSharp ? "4px" : "13px";

  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "1 / 1.55",
        borderRadius: "10px",
        background: isSelected
          ? "radial-gradient(ellipse at center, rgba(237, 233, 254, 0.95) 0%, rgba(221, 214, 254, 0.6) 100%)"
          : "radial-gradient(ellipse at center, #ffffff 0%, #f1f5f9 100%)",
        border: isSelected ? "1.5px solid #a855f7" : "1px solid #e2e8f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "6px 4px",
      }}
    >
      {/* 3D Miniature Phone Case Chassis */}
      <div
        style={{
          width: "54px",
          height: "90px",
          borderRadius: cornerRadius,
          position: "relative",
          background: isSelected
            ? "linear-gradient(155deg, #4338ca 0%, #312e81 40%, #1e1b4b 100%)"
            : "linear-gradient(155deg, #3f3f46 0%, #27272a 40%, #18181b 100%)",
          boxShadow: isSelected
            ? "0 8px 18px rgba(124, 58, 237, 0.4), 0 2px 5px rgba(0,0,0,0.3)"
            : "0 6px 14px rgba(0, 0, 0, 0.28), 0 1px 3px rgba(0,0,0,0.2)",
          border: isSelected ? "1.5px solid rgba(196, 181, 253, 0.6)" : "1.5px solid rgba(255, 255, 255, 0.2)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Specular Liquid Glass Sheen */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(125deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 35%, transparent 50%, rgba(255,255,255,0.12) 100%)",
            pointerEvents: "none",
            zIndex: 3,
          }}
        />

        {/* MagSafe Array Visual if applicable */}
        {model.hasMagSafe && (
          <div
            style={{
              position: "absolute",
              top: "52%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              border: "1px dashed rgba(255, 255, 255, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              zIndex: 2,
            }}
          >
            <div
              style={{
                width: "2px",
                height: "6px",
                backgroundColor: "rgba(255, 255, 255, 0.45)",
                position: "absolute",
                bottom: "-8px",
                borderRadius: "1px",
              }}
            />
          </div>
        )}

        {/* Camera Cutout Module */}
        {(() => {
          switch (model.cameraType) {
            // 1. iPhone 16 / 17 / 18 (Authentic Vertical Pill + Flash on right)
            case "iphone-dual-vert":
              return (
                <div style={{ position: "absolute", top: "5px", left: "5px", zIndex: 4 }}>
                  {/* Vertical Pill */}
                  <div
                    style={{
                      width: "14px",
                      height: "27px",
                      borderRadius: "7px",
                      backgroundColor: "#09090b",
                      border: "1px solid rgba(255, 255, 255, 0.4)",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.6)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "space-around",
                      padding: "2px 0",
                    }}
                  >
                    {/* Top lens */}
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: "radial-gradient(circle at 35% 35%, #3b82f6 0%, #000000 80%)",
                        border: "0.8px solid #52525b",
                      }}
                    />
                    {/* Bottom lens */}
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: "radial-gradient(circle at 35% 35%, #3b82f6 0%, #000000 80%)",
                        border: "0.8px solid #52525b",
                      }}
                    />
                  </div>
                  {/* Separate circular flash hole on the right */}
                  <div
                    style={{
                      position: "absolute",
                      top: "6px",
                      left: "17px",
                      width: "4px",
                      height: "4px",
                      borderRadius: "50%",
                      backgroundColor: "#fef08a",
                      border: "0.5px solid #ca8a04",
                      boxShadow: "0 0 3px rgba(250, 204, 21, 0.6)",
                    }}
                  />
                </div>
              );

            // 2. iPhone 16 Pro / Pro Max (Triple lens in triangle + flash + LiDAR)
            case "iphone-triple":
              return (
                <div
                  style={{
                    position: "absolute",
                    top: "5px",
                    left: "5px",
                    width: "24px",
                    height: "24px",
                    borderRadius: "6px",
                    backgroundColor: "#09090b",
                    border: "1px solid rgba(255, 255, 255, 0.4)",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.6)",
                    zIndex: 4,
                  }}
                >
                  {/* Lens 1 (Top Left) */}
                  <div
                    style={{
                      position: "absolute",
                      top: "3px",
                      left: "3px",
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      background: "radial-gradient(circle at 35% 35%, #3b82f6 0%, #000000 80%)",
                      border: "0.8px solid #52525b",
                    }}
                  />
                  {/* Lens 2 (Bottom Left) */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "3px",
                      left: "3px",
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      background: "radial-gradient(circle at 35% 35%, #3b82f6 0%, #000000 80%)",
                      border: "0.8px solid #52525b",
                    }}
                  />
                  {/* Lens 3 (Middle Right) */}
                  <div
                    style={{
                      position: "absolute",
                      top: "8.5px",
                      right: "3px",
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      background: "radial-gradient(circle at 35% 35%, #3b82f6 0%, #000000 80%)",
                      border: "0.8px solid #52525b",
                    }}
                  />
                  {/* Flash dot */}
                  <div
                    style={{
                      position: "absolute",
                      top: "3.5px",
                      right: "4.5px",
                      width: "3px",
                      height: "3px",
                      borderRadius: "50%",
                      backgroundColor: "#fef08a",
                    }}
                  />
                  {/* LiDAR dot */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "4px",
                      right: "4.5px",
                      width: "3px",
                      height: "3px",
                      borderRadius: "50%",
                      backgroundColor: "#27272a",
                      border: "0.5px solid #52525b",
                    }}
                  />
                </div>
              );

            // iPhone 17 / 18 Large Rectangular Plateau Window (matching real case)
            case "iphone-plateau":
              return (
                <div
                  style={{
                    position: "absolute",
                    top: "5px",
                    left: "4px",
                    right: "4px",
                    height: "26px",
                    borderRadius: "6px",
                    backgroundColor: "#09090b",
                    border: "1.2px solid rgba(255, 255, 255, 0.45)",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.6), inset 0 1px 2px rgba(0,0,0,0.8)",
                    zIndex: 4,
                  }}
                />
              );

            // 3. iPhone Dual Diagonal (iPhone 15, 14, 13)
            case "iphone-dual-diag":
              return (
                <div
                  style={{
                    position: "absolute",
                    top: "5px",
                    left: "5px",
                    width: "21px",
                    height: "21px",
                    borderRadius: "5px",
                    backgroundColor: "#09090b",
                    border: "1px solid rgba(255, 255, 255, 0.4)",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.6)",
                    zIndex: 4,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "3px",
                      left: "3px",
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      background: "radial-gradient(circle at 35% 35%, #3b82f6 0%, #000000 80%)",
                      border: "0.8px solid #52525b",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "3px",
                      right: "3px",
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      background: "radial-gradient(circle at 35% 35%, #3b82f6 0%, #000000 80%)",
                      border: "0.8px solid #52525b",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "3.5px",
                      right: "4px",
                      width: "3px",
                      height: "3px",
                      borderRadius: "50%",
                      backgroundColor: "#fef08a",
                    }}
                  />
                </div>
              );

            // 4. Samsung S24 Ultra (Sharp body + vertical lenses + sensors)
            case "samsung-ultra":
              return (
                <div style={{ position: "absolute", top: "5px", left: "5px", zIndex: 4 }}>
                  {[0, 9, 18].map((topOffset, i) => (
                    <div
                      key={i}
                      style={{
                        position: "absolute",
                        top: `${topOffset}px`,
                        left: "0px",
                        width: "7.5px",
                        height: "7.5px",
                        borderRadius: "50%",
                        background: "radial-gradient(circle at 35% 35%, #3b82f6 0%, #000000 80%)",
                        border: "1px solid #71717a",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.5)",
                      }}
                    />
                  ))}
                  <div
                    style={{
                      position: "absolute",
                      top: "2px",
                      left: "10px",
                      width: "4.5px",
                      height: "4.5px",
                      borderRadius: "50%",
                      backgroundColor: "#27272a",
                      border: "0.8px solid #71717a",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: "10px",
                      width: "4.5px",
                      height: "4.5px",
                      borderRadius: "50%",
                      backgroundColor: "#27272a",
                      border: "0.8px solid #71717a",
                    }}
                  />
                </div>
              );

            // 5. Samsung Triple Floating (S24, S23, A54)
            case "samsung-triple":
              return (
                <div style={{ position: "absolute", top: "6px", left: "6px", zIndex: 4 }}>
                  {[0, 10, 20].map((topOffset, i) => (
                    <div
                      key={i}
                      style={{
                        position: "absolute",
                        top: `${topOffset}px`,
                        left: "0px",
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: "radial-gradient(circle at 35% 35%, #3b82f6 0%, #000000 80%)",
                        border: "1.2px solid #a1a1aa",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.6)",
                      }}
                    />
                  ))}
                </div>
              );

            // 6. Google Pixel Visor
            case "pixel-visor":
              return (
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    left: "0",
                    right: "0",
                    height: "12px",
                    backgroundColor: "#09090b",
                    borderTop: "0.8px solid #52525b",
                    borderBottom: "0.8px solid #52525b",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "8px",
                    zIndex: 4,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
                  }}
                >
                  <div
                    style={{
                      width: "16px",
                      height: "6px",
                      borderRadius: "3px",
                      backgroundColor: "#18181b",
                      border: "0.6px solid #3f3f46",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-around",
                    }}
                  >
                    <div style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "#3b82f6" }} />
                    <div style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "#3b82f6" }} />
                  </div>
                </div>
              );

            // 7. OnePlus Circular Dial
            case "oneplus-dial":
              return (
                <div
                  style={{
                    position: "absolute",
                    top: "6px",
                    left: "4px",
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    backgroundColor: "#09090b",
                    border: "1.2px solid #71717a",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.6)",
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    padding: "3px",
                    gap: "2px",
                    zIndex: 4,
                  }}
                >
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        background: "radial-gradient(circle at 35% 35%, #3b82f6 0%, #000000 80%)",
                        border: "0.5px solid #52525b",
                      }}
                    />
                  ))}
                </div>
              );

            default:
              return (
                <div
                  style={{
                    position: "absolute",
                    top: "5px",
                    left: "5px",
                    width: "14px",
                    height: "27px",
                    borderRadius: "7px",
                    backgroundColor: "#09090b",
                    border: "1px solid rgba(255, 255, 255, 0.4)",
                    zIndex: 4,
                  }}
                />
              );
          }
        })()}

        {/* Center Brand / Armor Logo */}
        <div
          style={{
            marginTop: "auto",
            marginBottom: "8px",
            fontSize: "0.48rem",
            fontWeight: 800,
            letterSpacing: "0.08em",
            color: isSelected ? "rgba(255, 255, 255, 0.85)" : "rgba(255, 255, 255, 0.5)",
            textTransform: "uppercase",
            zIndex: 3,
          }}
        >
          {model.brand === "Apple" ? "iPhone" : model.brand}
        </div>
      </div>
    </div>
  );
}

function renderDielineCameraCutout(archetype: CameraArchetype, isMask: boolean = false) {
  const fill = isMask ? "black" : "#f5f5f7";
  const stroke = isMask ? "none" : "#475569";
  const strokeWidth = isMask ? 0 : 1.5;

  switch (archetype) {
    case "iphone-plateau":
      // Authentic iPhone 17 / 18 Large Rectangular Plateau Window (matches user photo)
      return (
        <rect
          x="127"
          y="170"
          width="186"
          height="125"
          rx="28"
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );

    case "iphone-triple":
      // iPhone Pro Squircle (iPhone 16 Pro, 15 Pro, 14 Pro, 13 Pro, 12 Pro)
      return (
        <rect
          x="120"
          y="168"
          width="96"
          height="102"
          rx="26"
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );

    case "iphone-dual-vert":
      // iPhone 16 / 16 Plus / 12 / 11 Vertical Pill with separate Flash Hole
      return (
        <g>
          <rect
            x="124"
            y="168"
            width="54"
            height="116"
            rx="27"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
          <circle
            cx="198"
            cy="204"
            r="9"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        </g>
      );

    case "iphone-dual-diag":
      // iPhone 15 / 14 / 13 Diagonal Squircle
      return (
        <rect
          x="122"
          y="168"
          width="88"
          height="92"
          rx="24"
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );

    case "samsung-ultra":
      // Samsung Galaxy S25 / S24 / S23 Ultra floating lenses
      return (
        <g>
          <circle cx="140" cy="190" r="14" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
          <circle cx="140" cy="230" r="14" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
          <circle cx="140" cy="270" r="14" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
          <circle cx="176" cy="200" r="8" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
          <circle cx="176" cy="240" r="8" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
        </g>
      );

    case "samsung-triple":
      // Samsung Galaxy S25 / S24 / S23 / A55 triple floating lenses
      return (
        <g>
          <circle cx="140" cy="190" r="14" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
          <circle cx="140" cy="232" r="14" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
          <circle cx="140" cy="274" r="14" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
          <circle cx="174" cy="200" r="7" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
        </g>
      );

    case "samsung-flip":
      return (
        <g>
          <rect x="122" y="166" width="196" height="150" rx="22" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
        </g>
      );

    case "pixel-visor":
      // Google Pixel Visor Bar
      return (
        <rect
          x="115"
          y="186"
          width="210"
          height="58"
          rx="29"
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );

    case "oneplus-dial":
      // OnePlus Circular Dial
      return (
        <circle
          cx="180"
          cy="228"
          r="48"
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );

    case "nothing-glyph":
      return (
        <rect
          x="126"
          y="172"
          width="52"
          height="98"
          rx="26"
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );

    case "matrix-island":
    default:
      return (
        <rect
          x="124"
          y="168"
          width="84"
          height="112"
          rx="22"
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );
  }
}

function renderDielineButtons(modelDetails: PhoneModelItem) {
  const isSamsung = modelDetails.brand.toLowerCase().includes("samsung");
  const isApple = modelDetails.brand.toLowerCase() === "apple";
  const isIPhone16OrAbove = isApple && /16|17|18/i.test(modelDetails.name);

  if (isSamsung) {
    return (
      <g>
        {/* Samsung Right Side: Volume Rocker & Power Button */}
        <rect x="327" y="240" width="8" height="54" rx="4" fill="#f5f5f7" stroke="#94a3b8" strokeWidth="1.2" />
        <rect x="327" y="315" width="8" height="32" rx="4" fill="#f5f5f7" stroke="#94a3b8" strokeWidth="1.2" />
      </g>
    );
  }

  // Apple & standard layout
  return (
    <g>
      {/* Left Side Fold Cutout Slots (Action Button + Volume Up + Volume Down) */}
      <rect x="105" y="215" width="8" height="22" rx="4" fill="#f5f5f7" stroke="#94a3b8" strokeWidth="1.2" />
      <rect x="105" y="255" width="8" height="32" rx="4" fill="#f5f5f7" stroke="#94a3b8" strokeWidth="1.2" />
      <rect x="105" y="300" width="8" height="32" rx="4" fill="#f5f5f7" stroke="#94a3b8" strokeWidth="1.2" />

      {/* Right Side Fold Cutout Slots (Side/Power Key) */}
      <rect x="327" y="245" width="8" height="48" rx="4" fill="#f5f5f7" stroke="#94a3b8" strokeWidth="1.2" />
      {/* Camera Control button slot on bottom right (iPhone 16 / 17 / 18) */}
      {isIPhone16OrAbove && (
        <rect x="327" y="380" width="8" height="36" rx="4" fill="#f5f5f7" stroke="#94a3b8" strokeWidth="1.2" />
      )}
    </g>
  );
}

const LAYOUT_PRESET_ITEMS = [
  {
    id: "solo",
    title: "Solo Front",
    renderThumbnail: () => (
      <svg viewBox="0 0 120 86" width="100%" height="100%">
        <SvgMiniCase x={48} y={16} w={24} h={54} />
      </svg>
    ),
  },
  {
    id: "duo-standing",
    title: "Duo Standing",
    renderThumbnail: () => (
      <svg viewBox="0 0 120 86" width="100%" height="100%">
        <SvgMiniCase x={30} y={16} w={24} h={54} />
        <SvgMiniCase x={66} y={16} w={24} h={54} isDark isBack />
      </svg>
    ),
  },
  {
    id: "duo-overlap",
    title: "Duo Overlap",
    renderThumbnail: () => (
      <svg viewBox="0 0 120 86" width="100%" height="100%">
        <SvgMiniCase x={34} y={12} w={24} h={54} isDark isBack />
        <SvgMiniCase x={54} y={20} w={24} h={54} />
      </svg>
    ),
  },
  {
    id: "duo-floating",
    title: "Duo Floating",
    renderThumbnail: () => (
      <svg viewBox="0 0 120 86" width="100%" height="100%">
        <SvgMiniCase x={30} y={16} w={23} h={50} rot={16} />
        <SvgMiniCase x={67} y={16} w={23} h={50} rot={-16} />
      </svg>
    ),
  },
  {
    id: "isometric-duo",
    title: "Isometric Duo",
    renderThumbnail: () => (
      <svg viewBox="0 0 120 86" width="100%" height="100%">
        <g transform="matrix(0.85 0.35 -0.6 0.65 42 26)">
          <SvgMiniCase x={0} y={0} w={22} h={48} />
        </g>
        <SvgMiniCase x={68} y={14} w={22} h={50} isDark isBack />
      </svg>
    ),
  },
  {
    id: "flat-duo",
    title: "Flat Laying Duo",
    renderThumbnail: () => (
      <svg viewBox="0 0 120 86" width="100%" height="100%">
        <g transform="matrix(0.88 0.38 -0.52 0.7 28 20)">
          <SvgMiniCase x={0} y={0} w={22} h={48} isDark isBack />
        </g>
        <g transform="matrix(0.88 0.38 -0.52 0.7 64 20)">
          <SvgMiniCase x={0} y={0} w={22} h={48} />
        </g>
      </svg>
    ),
  },
  {
    id: "dynamic-duo",
    title: "Dynamic Duo",
    renderThumbnail: () => (
      <svg viewBox="0 0 120 86" width="100%" height="100%">
        <SvgMiniCase x={32} y={18} w={22} h={50} rot={20} />
        <SvgMiniCase x={66} y={18} w={22} h={50} isDark isBack rot={-20} />
      </svg>
    ),
  },
  {
    id: "trio-lineup",
    title: "Trio Lineup",
    renderThumbnail: () => (
      <svg viewBox="0 0 120 86" width="100%" height="100%">
        <SvgMiniCase x={18} y={18} w={22} h={50} />
        <SvgMiniCase x={49} y={18} w={22} h={50} />
        <SvgMiniCase x={80} y={18} w={22} h={50} />
      </svg>
    ),
  },
  {
    id: "trio-pyramid",
    title: "Trio Pyramid",
    renderThumbnail: () => (
      <svg viewBox="0 0 120 86" width="100%" height="100%">
        <SvgMiniCase x={23} y={14} w={21} h={48} />
        <SvgMiniCase x={76} y={14} w={21} h={48} />
        <SvgMiniCase x={49} y={22} w={22} h={50} />
      </svg>
    ),
  },
  {
    id: "fan-4",
    title: "Fanned 4 Cases",
    renderThumbnail: () => (
      <svg viewBox="0 0 120 86" width="100%" height="100%">
        <SvgMiniCase x={23} y={24} w={20} h={46} rot={24} />
        <SvgMiniCase x={40} y={18} w={20} h={46} rot={9} />
        <SvgMiniCase x={60} y={18} w={20} h={46} rot={-8} />
        <SvgMiniCase x={77} y={24} w={20} h={46} rot={-24} />
      </svg>
    ),
  },
  {
    id: "lineup-5",
    title: "Lineup 5 Cases",
    renderThumbnail: () => (
      <svg viewBox="0 0 120 86" width="100%" height="100%">
        <SvgMiniCase x={14} y={20} w={16} h={44} />
        <SvgMiniCase x={33} y={20} w={16} h={44} />
        <SvgMiniCase x={52} y={20} w={16} h={44} />
        <SvgMiniCase x={71} y={20} w={16} h={44} />
        <SvgMiniCase x={90} y={20} w={16} h={44} />
      </svg>
    ),
  },
  {
    id: "grid-matrix",
    title: "Isometric Grid",
    renderThumbnail: () => (
      <svg viewBox="0 0 120 86" width="100%" height="100%">
        <g transform="matrix(0.82 0.42 -0.75 0.5 50 16)">
          <SvgMiniCase x={-24} y={-26} w={18} h={38} />
          <SvgMiniCase x={6} y={-26} w={18} h={38} />
          <SvgMiniCase x={-24} y={18} w={18} h={38} />
          <SvgMiniCase x={6} y={18} w={18} h={38} />
        </g>
      </svg>
    ),
  },
];

export default function CustomerStudioWorkspace() {
  const router = useRouter();
  const { addToCart, totalItems, saveDesign, setIsCartOpen } = useCart();
  const { setDevice, setDeviceByModel } = useDevice();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const unfoldFileInputRef = useRef<HTMLInputElement>(null);

  // Main Left Rail Navigation Tab: 'models' | 'edit' | 'layout' | 'ai-background' | 'video' | 'more'
  const [activeRailTab, setActiveRailTab] = useState<string>("models");
  const [activeLayout, setActiveLayout] = useState<string>("solo");
  const [drawerOpen, setDrawerOpen] = useState<boolean>(true);

  // Model & Filter
  const [selectedBrand, setSelectedBrand] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("iPhone 18 Pro");
  const [selectedFinish, setSelectedFinish] = useState<string>("glossy");
  const currentPhoneDetails = useMemo(() => getPhoneModelDetails(selectedModel), [selectedModel]);

  // Artwork & Customization State
  // Default to empty string so the 3D phone case shows Pacdora's signature watermark & "Upload your images 341 x 640 px"
  const [artworkUrl, setArtworkUrl] = useState<string>("");
  const [artworkScale, setArtworkScale] = useState<number>(1);
  const [artworkOffsetX, setArtworkOffsetX] = useState<number>(0);
  const [artworkOffsetY, setArtworkOffsetY] = useState<number>(0);
  const [artworkRotation, setArtworkRotation] = useState<number>(0);

  // Base Package / Case Color
  const [packageColor, setPackageColor] = useState<string>("#ffffff");

  // Uploads Library State
  const [uploadsList, setUploadsList] = useState(INITIAL_UPLOADS);

  // ─── 2. "Upload & Design" Full-Screen Dieline Modal State (Image 2) ───
  const [isUploadDesignOpen, setIsUploadDesignOpen] = useState<boolean>(false);
  const [uploadDesignTab, setUploadDesignTab] = useState<"uploads" | "elements" | "text" | "tools">("uploads");
  const [dielineZoom, setDielineZoom] = useState<number>(100);

  // Dieline Canvas Dragging State
  const [isDielineDragging, setIsDielineDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // UI States
  const [stageBgColor, setStageBgColor] = useState<string>("#e2e5eb");
  const [activeTool, setActiveTool] = useState<"select" | "pan" | "comment">("select");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // History State
  const [history, setHistory] = useState<any[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const pushState = useCallback((state: any) => {
    setHistory((prev) => {
      const next = prev.slice(0, historyIdx + 1);
      next.push(state);
      if (next.length > 20) next.shift();
      return next;
    });
    setHistoryIdx((prev) => Math.min(prev + 1, 19));
  }, [historyIdx]);

  const handleUndo = () => {
    if (historyIdx > 0) {
      const prev = history[historyIdx - 1];
      setHistoryIdx(historyIdx - 1);
      if (prev) {
        setArtworkScale(prev.scale);
        setArtworkRotation(prev.rot);
        setArtworkOffsetX(prev.ox);
        setArtworkOffsetY(prev.oy);
      }
      showToast("Undone");
    }
  };

  const handleRedo = () => {
    if (historyIdx < history.length - 1) {
      const next = history[historyIdx + 1];
      setHistoryIdx(historyIdx + 1);
      if (next) {
        setArtworkScale(next.scale);
        setArtworkRotation(next.rot);
        setArtworkOffsetX(next.ox);
        setArtworkOffsetY(next.oy);
      }
      showToast("Redone");
    }
  };

  // Upload handler for new images
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const url = event.target.result as string;
          const newUpload = {
            id: `upload-${Date.now()}`,
            name: file.name.replace(/\.[^/.]+$/, ""),
            url,
          };
          setUploadsList((prev) => [newUpload, ...prev]);
          setArtworkUrl(url);
          setArtworkScale(1);
          setArtworkOffsetX(0);
          setArtworkOffsetY(0);
          setArtworkRotation(0);
          pushState({ scale: 1, rot: 0, ox: 0, oy: 0 });
          showToast("Photo uploaded successfully!");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const [allPhoneModels, setAllPhoneModels] = useState<PhoneModelItem[]>(ALL_PHONE_MODELS);

  useEffect(() => {
    setAllPhoneModels(getAllPhoneModels());
    const onStorage = () => setAllPhoneModels(getAllPhoneModels());
    window.addEventListener("casetadka_studio_updated", onStorage);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("casetadka_studio_updated", onStorage);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // Filtered phone models for models drawer
  const filteredModels = useMemo(() => {
    return allPhoneModels.filter((m) => {
      const matchesBrand = selectedBrand === "All" || m.brand.toLowerCase() === selectedBrand.toLowerCase();
      const matchesQuery = !searchQuery.trim() || m.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesBrand && matchesQuery;
    });
  }, [allPhoneModels, selectedBrand, searchQuery]);

  const currentFinishObj = CASE_FINISHES.find((f) => f.id === selectedFinish) || CASE_FINISHES[0];
  const totalPrice = currentFinishObj.price;

  const generateCustomCaseArtwork = (): Promise<string> => {
    return new Promise((resolve) => {
      let resolved = false;
      const safeResolve = (url: string) => {
        if (!resolved) {
          resolved = true;
          resolve(url);
        }
      };
      // Safety timeout in case image loading takes too long
      setTimeout(() => safeResolve(artworkUrl || "/mockups/custom_pattern.png"), 1200);

      const canvas = document.createElement("canvas");
      canvas.width = 640;
      canvas.height = 1280;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        safeResolve(artworkUrl || "/mockups/custom_pattern.png");
        return;
      }

      // 1. Base case color background
      ctx.fillStyle = packageColor || "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (artworkUrl && artworkUrl.trim()) {
        const img = new window.Image();
        if (!artworkUrl.startsWith("data:")) {
          img.crossOrigin = "anonymous";
        }
        img.onload = () => {
          ctx.save();
          const cx = canvas.width / 2 + (artworkOffsetX || 0) * 1.5;
          const cy = canvas.height / 2 + (artworkOffsetY || 0) * 1.5;
          ctx.translate(cx, cy);
          ctx.rotate(((artworkRotation || 0) * Math.PI) / 180);
          ctx.scale(artworkScale || 1, artworkScale || 1);

          const imgAspect = img.width / img.height;
          const canvasAspect = canvas.width / canvas.height;
          let drawW = canvas.width * 1.05;
          let drawH = canvas.height * 1.05;
          if (imgAspect > canvasAspect) {
            drawW = canvas.height * 1.05 * imgAspect;
          } else {
            drawH = (canvas.width * 1.05) / imgAspect;
          }

          ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
          ctx.restore();

          try {
            safeResolve(canvas.toDataURL("image/jpeg", 0.88));
          } catch {
            safeResolve(artworkUrl);
          }
        };
        img.onerror = () => {
          safeResolve(artworkUrl);
        };
        img.src = artworkUrl;
      } else {
        // When user hasn't uploaded a photo, generate solid/watermarked custom cover matching preview
        ctx.strokeStyle = "rgba(0, 0, 0, 0.06)";
        ctx.lineWidth = 1.5;
        for (let x = -canvas.height; x < canvas.width + canvas.height; x += 90) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x + canvas.height, canvas.height);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(x, canvas.height);
          ctx.lineTo(x + canvas.height, 0);
          ctx.stroke();
        }

        ctx.fillStyle = "rgba(0, 0, 0, 0.14)";
        ctx.font = "600 22px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
        ctx.textAlign = "center";
        for (let y = 140; y < canvas.height - 80; y += 180) {
          for (let x = 90; x < canvas.width; x += 180) {
            ctx.fillText("casetadka", x, y);
          }
        }

        ctx.save();
        ctx.fillStyle = "#1e2026";
        ctx.font = "700 40px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("CaseTadka Custom", canvas.width / 2, canvas.height * 0.5);
        ctx.fillStyle = "#64748b";
        ctx.font = "600 28px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.fillText(selectedModel, canvas.width / 2, canvas.height * 0.5 + 46);
        ctx.restore();

        try {
          safeResolve(canvas.toDataURL("image/jpeg", 0.88));
        } catch {
          safeResolve("/mockups/custom_pattern.png");
        }
      }
    });
  };

  // Handle direct Add to Cart and proceed to Cart without opening intermediate product page
  const handleAddToCart = async (destination: "cart" | "checkout" | "none" = "cart") => {
    setIsExporting(true);
    try {
      const previewUrl = await generateCustomCaseArtwork();
      const customId = `custom-${Date.now()}`;

      // Map studio finish to product page case types
      const finishMap: Record<string, string> = {
        magsafe: "Ultra Impact MagSafe",
        tempered: "9H Tempered Glass Back",
        glossy: "Matte Slim EDC",
        transparent: "Cyber Clear Hologram",
      };
      const mappedCaseType = finishMap[selectedFinish] || currentFinishObj.name || "Matte Slim EDC";
      const finalImage = previewUrl || artworkUrl || "/mockups/custom_pattern.png";

      const newCustomProduct: Product = {
        id: customId,
        name: `Custom ${selectedModel} (${currentFinishObj.name})`,
        franchise: "custom",
        category: "case",
        tag: "CaseTadka 3D Custom",
        price: totalPrice || 399,
        originalPrice: Math.round((totalPrice || 399) * 1.5),
        rating: 5.0,
        reviewsCount: 1,
        image: finalImage,
        formats: [currentFinishObj.name],
        description: `Custom ${selectedModel} phone case in ${currentFinishObj.name} finish. Case color: ${packageColor}.`,
        isCustom: true,
        artworkFit: "cover",
        artworkScale: 1,
        artworkOffsetX: 0,
        artworkOffsetY: 0,
      };

      // Save to private user studio storage
      saveUserStudioProduct(newCustomProduct);
      setDeviceByModel(selectedModel);

      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem(`casetadka_studio_${customId}`, JSON.stringify(newCustomProduct));
          sessionStorage.setItem("casetadka_latest_custom_product", JSON.stringify(newCustomProduct));
          sessionStorage.setItem("casetadka_latest_custom_image", finalImage);
        } catch (e) {
          console.warn("sessionStorage save error:", e);
        }
      }

      addToCart(
        newCustomProduct,
        currentFinishObj.name,
        selectedModel,
        undefined,
        finalImage
      );

      if (saveDesign) {
        saveDesign({
          title: `Custom ${selectedModel} (${currentFinishObj.name})`,
          productType: "phone_case",
          phoneModel: selectedModel,
          previewUrl: finalImage,
          price: totalPrice,
        });
      }

      setShowExportModal(false);

      if (destination === "checkout") {
        if (setIsCartOpen) setIsCartOpen(false);
        showToast("Case saved! Opening checkout...");
        setTimeout(() => {
          router.push("/checkout");
        }, 300);
      } else if (destination === "cart") {
        if (setIsCartOpen) setIsCartOpen(false);
        showToast("Added to cart! Opening cart...");
        setTimeout(() => {
          router.push("/cart");
        }, 300);
      } else {
        if (setIsCartOpen) setIsCartOpen(true);
        showToast(`✨ Added Custom ${selectedModel} to cart! 🛒`);
      }
    } catch (err) {
      console.error(err);
      showToast("Error adding to cart. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // Redirect directly to cart with the customized case
  const handleProceedToProductPage = async () => {
    await handleAddToCart("cart");
  };

  const handleDownloadMockup = () => {
    const canvas = document.querySelector("#case-3d-viewport canvas") as HTMLCanvasElement | null;
    if (canvas) {
      const link = document.createElement("a");
      link.download = `${selectedModel.replace(/\s+/g, "_")}_CaseTadka_Mockup.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      showToast("Mockup PNG downloaded!");
    } else {
      showToast("Canvas render ready.");
    }
  };

  // Dieline Canvas Mouse Interaction
  const handleDielineMouseDown = (e: React.MouseEvent) => {
    if (!artworkUrl) return;
    setIsDielineDragging(true);
    setDragStart({ x: e.clientX - artworkOffsetX, y: e.clientY - artworkOffsetY });
  };

  const handleDielineMouseMove = (e: React.MouseEvent) => {
    if (!isDielineDragging) return;
    setArtworkOffsetX(e.clientX - dragStart.x);
    setArtworkOffsetY(e.clientY - dragStart.y);
  };

  const handleDielineMouseUp = () => {
    if (isDielineDragging) {
      setIsDielineDragging(false);
      pushState({ scale: artworkScale, rot: artworkRotation, ox: artworkOffsetX, oy: artworkOffsetY });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: stageBgColor,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        color: "#18181b",
        userSelect: "none",
        position: "relative",
      }}
    >
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/png, image/jpeg, image/webp"
        style={{ display: "none" }}
      />
      <input
        type="file"
        ref={unfoldFileInputRef}
        onChange={handleFileUpload}
        accept="image/png, image/jpeg, image/webp, image/svg+xml"
        style={{ display: "none" }}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#18181b",
            color: "#ffffff",
            padding: "10px 20px",
            borderRadius: "999px",
            fontSize: "0.85rem",
            fontWeight: 600,
            boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ─── 1. TOP NAVBAR (Pacdora Mockup Generator) ───────────────────────── */}
      <header
        style={{
          height: "54px",
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          zIndex: 40,
          flexShrink: 0,
        }}
      >
        {/* Left: Brand Logo & Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            onClick={() => router.push("/")}
            title="CaseTadka Home"
            style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
          >
            <CaseTadkaLogo variant="compact" size="sm" showTagline={false} />
            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "3px 8px",
                borderRadius: "6px",
                backgroundColor: "#fef2f2",
                color: "#FF2A3A",
                border: "1px solid #fecaca",
              }}
            >
              3D STUDIO
            </span>
          </div>
          <button
            onClick={() => router.push("/")}
            title="Home"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "6px",
              color: "#4b5563",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <button
            onClick={() => setDrawerOpen((prev) => !prev)}
            title={drawerOpen ? "Hide Drawer" : "Show Drawer"}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "6px",
              color: "#6b7280",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="3" x2="9" y2="21"></line>
            </svg>
          </button>
        </div>

        {/* Right: Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Shop / All Cases link */}
          <button
            onClick={() => router.push("/shop")}
            title="Browse all designs in store"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "6px 12px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              backgroundColor: "#ffffff",
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "#4b5563",
              cursor: "pointer",
            }}
          >
            <span>Shop All 🛍️</span>
          </button>

          {/* Live Shopping Cart Button */}
          <button
            onClick={() => router.push("/cart")}
            title="View Shopping Cart"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              backgroundColor: "#f9fafb",
              color: "#1f2937",
              fontSize: "0.82rem",
              fontWeight: 700,
              cursor: "pointer",
              position: "relative",
            }}
          >
            <span style={{ fontSize: "1rem" }}>🛒</span>
            <span>Cart</span>
            {totalItems > 0 && (
              <span
                style={{
                  backgroundColor: "#FF2A3A",
                  color: "#ffffff",
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  borderRadius: "999px",
                  padding: "1px 6px",
                  lineHeight: "1.2",
                }}
              >
                {totalItems}
              </span>
            )}
          </button>

          {/* Quick Snapshot / Download Mockup Icon */}
          <button
            onClick={handleDownloadMockup}
            title="Download 3D Mockup Image (PNG)"
            style={{
              background: "#f3f4f6",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "6px 10px",
              cursor: "pointer",
              color: "#4b5563",
              fontSize: "0.82rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span>📸</span>
            <span style={{ fontSize: "0.75rem" }}>PNG</span>
          </button>

          {/* Share Button */}
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                showToast("Mockup link copied!");
              }
            }}
            title="Share Mockup"
            style={{
              background: "none",
              border: "none",
              padding: "7px",
              cursor: "pointer",
              color: "#4b5563",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          </button>

          {/* Direct Add to Cart Button */}
          <button
            onClick={() => handleAddToCart("none")}
            disabled={isExporting}
            title="Add to cart and keep designing"
            style={{
              padding: "7px 14px",
              borderRadius: "8px",
              backgroundColor: "#f3f4f6",
              color: "#111827",
              border: "1px solid #d1d5db",
              fontSize: "0.82rem",
              fontWeight: 700,
              cursor: isExporting ? "wait" : "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {isExporting ? "Saving..." : "+ Add to Cart"}
          </button>

          {/* Primary PROCEED TO BUY CTA */}
          <button
            onClick={() => handleAddToCart("cart")}
            disabled={isExporting}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "8px 18px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #FF2A3A 0%, #dc2626 100%)",
              color: "#ffffff",
              border: "none",
              fontSize: "0.86rem",
              fontWeight: 800,
              letterSpacing: "-0.01em",
              cursor: isExporting ? "wait" : "pointer",
              boxShadow: "0 3px 12px rgba(255, 42, 58, 0.35)",
              transition: "transform 0.15s ease",
            }}
          >
            <span>{isExporting ? "Adding to Cart..." : "⚡ Proceed to Buy"}</span>
            <span
              style={{
                fontSize: "0.76rem",
                opacity: 0.95,
                backgroundColor: "rgba(0,0,0,0.22)",
                padding: "2px 7px",
                borderRadius: "5px",
                fontWeight: 700,
              }}
            >
              ₹{totalPrice}
            </span>
          </button>
        </div>
      </header>

      {/* ─── 2. BODY AREA: FAR-LEFT RAIL + FLOATING DRAWER + 3D VIEWPORT ───── */}
      <div style={{ flex: 1, display: "flex", position: "relative", overflow: "hidden" }}>
        {/* ─── 2A. FAR-LEFT VERTICAL ICON RAIL ─────────────────────── */}
        <aside
          style={{
            width: "68px",
            backgroundColor: "#ffffff",
            borderRight: "1px solid #e5e7eb",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 0",
            zIndex: 30,
            flexShrink: 0,
          }}
        >
          {/* Top Rail Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%", alignItems: "center" }}>
            {/* Edit Icon (Image 1 Active Tab) */}
            <button
              onClick={() => {
                setActiveRailTab("edit");
                setDrawerOpen(true);
              }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: activeRailTab === "edit" ? "#7c3aed" : "#64748b",
                padding: "6px 8px",
                borderRadius: "8px",
                width: "56px",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
              <span style={{ fontSize: "0.7rem", fontWeight: activeRailTab === "edit" ? 700 : 500 }}>Edit</span>
            </button>

            {/* Models Icon */}
            <button
              onClick={() => {
                setActiveRailTab("models");
                setDrawerOpen(true);
              }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: activeRailTab === "models" ? "#7c3aed" : "#64748b",
                padding: "6px 8px",
                borderRadius: "8px",
                width: "56px",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
              <span style={{ fontSize: "0.7rem", fontWeight: activeRailTab === "models" ? 700 : 500 }}>Models</span>
            </button>

            {/* Layout Icon */}
            <button
              onClick={() => {
                setActiveRailTab("layout");
                setDrawerOpen(true);
              }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: activeRailTab === "layout" ? "#7c3aed" : "#64748b",
                padding: "6px 8px",
                borderRadius: "8px",
                width: "56px",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
              </svg>
              <span style={{ fontSize: "0.7rem", fontWeight: activeRailTab === "layout" ? 700 : 500 }}>Layout</span>
            </button>

            {/* AI Background Icon */}
            <button
              onClick={() => {
                setActiveRailTab("ai-background");
                setDrawerOpen(true);
              }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: activeRailTab === "ai-background" ? "#7c3aed" : "#64748b",
                padding: "6px 8px",
                borderRadius: "8px",
                width: "56px",
                textAlign: "center",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"></path>
                <path d="m14 7 3 3"></path>
                <path d="M5 6v4"></path>
              </svg>
              <span style={{ fontSize: "0.65rem", fontWeight: activeRailTab === "ai-background" ? 700 : 500, lineHeight: 1.1 }}>
                AI Backdrop
              </span>
            </button>

            {/* Video Icon */}
            <button
              onClick={() => showToast("Auto-spin turntable video mode ready")}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#64748b",
                padding: "6px 8px",
                borderRadius: "8px",
                width: "56px",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
              </svg>
              <span style={{ fontSize: "0.7rem", fontWeight: 500 }}>Video</span>
            </button>

            {/* More Icon */}
            <button
              onClick={() => setDrawerOpen((prev) => !prev)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#64748b",
                padding: "6px 8px",
                borderRadius: "8px",
                width: "56px",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
              <span style={{ fontSize: "0.7rem", fontWeight: 500 }}>More</span>
            </button>
          </div>

          {/* Bottom AI Design Button */}
          <button
            onClick={() => {
              setActiveRailTab("edit");
              setDrawerOpen(true);
              setIsUploadDesignOpen(true);
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#7c3aed",
              padding: "6px 8px",
              borderRadius: "8px",
              width: "56px",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "8px",
                backgroundColor: "#f5f3ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: "1rem" }}>🪄</span>
            </div>
            <span style={{ fontSize: "0.68rem", fontWeight: 700 }}>AI Design</span>
          </button>
        </aside>

        {/* ─── 2B. FLOATING SECONDARY DRAWER ───────────────────────────────── */}
        {drawerOpen && (
          <div
            style={{
              position: "absolute",
              left: "80px",
              top: "14px",
              bottom: "14px",
              width: "330px",
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)",
              border: "1px solid #e5e7eb",
              display: "flex",
              flexDirection: "column",
              zIndex: 25,
              overflow: "hidden",
            }}
          >
            {/* ─── DRAWER VIEW 1: UPLOAD IMAGES SECTION (EXACT MATCH TO IMAGE 1) ─── */}
            {activeRailTab === "edit" && (
              <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "18px 16px", overflowY: "auto" }}>
                {/* Section Title */}
                <h3 style={{ margin: "0 0 14px", fontSize: "1rem", fontWeight: 700, color: "#111827" }}>
                  Upload images
                </h3>

                {/* Dashed Lavender Upload Dropzone (matching Image 1) */}
                <div
                  onClick={() => setIsUploadDesignOpen(true)}
                  style={{
                    border: "1.5px dashed #c084fc",
                    backgroundColor: "#f8f5ff",
                    borderRadius: "14px",
                    padding: "36px 16px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    marginBottom: "16px",
                    transition: "all 0.15s ease",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f3e8ff")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f8f5ff")}
                >
                  {/* Purple Picture Icon */}
                  <div style={{ color: "#7c3aed", marginBottom: "14px" }}>
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="3" ry="3"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  </div>

                  {/* Solid Purple Upload Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsUploadDesignOpen(true);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 22px",
                      borderRadius: "8px",
                      backgroundColor: "#7c3aed",
                      color: "#ffffff",
                      border: "none",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(124, 58, 237, 0.3)",
                      marginBottom: "12px",
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <span>Upload</span>
                  </button>

                  {/* Dimension Subtitle */}
                  <span style={{ fontSize: "0.78rem", color: "#7c3aed", fontWeight: 500 }}>
                    341 × 640 px
                  </span>
                </div>

                {/* Specification Cards List (Image 1) */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "14px" }}>
                  {/* Row 1: Custom material */}
                  <div
                    onClick={() => setActiveRailTab("layout")}
                    style={{
                      backgroundColor: "#f9fafb",
                      borderRadius: "10px",
                      padding: "12px 14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      border: "1px solid #f3f4f6",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "0.72rem", color: "#6b7280", marginBottom: "2px" }}>Custom material</div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#111827" }}>{currentFinishObj.name}</div>
                    </div>
                    <span style={{ color: "#9ca3af", fontSize: "0.9rem" }}>›</span>
                  </div>

                  {/* Row 2: Size */}
                  <div
                    style={{
                      backgroundColor: "#f9fafb",
                      borderRadius: "10px",
                      padding: "12px 14px",
                      border: "1px solid #f3f4f6",
                    }}
                  >
                    <div style={{ fontSize: "0.72rem", color: "#6b7280", marginBottom: "2px" }}>Size</div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#111827" }}>
                      5.91 × 2.7974 × 0.3152 in
                    </div>
                  </div>

                  {/* Row: Case Color with Spectrum Picker */}
                  <div
                    style={{
                      backgroundColor: "#f9fafb",
                      borderRadius: "10px",
                      padding: "12px 14px",
                      border: "1px solid #f3f4f6",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <div style={{ fontSize: "0.72rem", color: "#6b7280" }}>Case Color</div>
                      <span style={{ fontSize: "0.72rem", fontFamily: "monospace", fontWeight: 700, color: "#334155", textTransform: "uppercase" }}>
                        {packageColor}
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {/* Rainbow Spectrum Picker */}
                      <div
                        title="Pick from Color Spectrum"
                        style={{
                          position: "relative",
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          background:
                            "conic-gradient(from 0deg, #ff0000, #ffa500, #ffff00, #008000, #00ffff, #0000ff, #800080, #ff00ff, #ff0000)",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                          cursor: "pointer",
                          border: "2px solid #ffffff",
                          flexShrink: 0,
                          overflow: "hidden",
                        }}
                      >
                        <input
                          type="color"
                          value={packageColor}
                          onChange={(e) => setPackageColor(e.target.value)}
                          style={{
                            position: "absolute",
                            inset: -8,
                            width: "200%",
                            height: "200%",
                            opacity: 0,
                            cursor: "pointer",
                          }}
                        />
                      </div>

                      {/* Swatches */}
                      <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", flex: 1 }}>
                        {[
                          { name: "Ultramarine Blue", color: "#2e3d7a" },
                          { name: "Pure White", color: "#ffffff" },
                          { name: "Midnight Black", color: "#18181b" },
                          { name: "Hot Pink", color: "#ec4899" },
                          { name: "Teal Green", color: "#10b981" },
                          { name: "Desert Titanium", color: "#c5a880" },
                        ].map((c) => {
                          const isSelected = packageColor.toLowerCase() === c.color.toLowerCase();
                          return (
                            <button
                              key={c.name}
                              onClick={() => {
                                setPackageColor(c.color);
                                showToast(`Color: ${c.name}`);
                              }}
                              title={c.name}
                              style={{
                                width: "20px",
                                height: "20px",
                                borderRadius: "50%",
                                backgroundColor: c.color,
                                border: isSelected ? "2px solid #7c3aed" : "1px solid rgba(0,0,0,0.15)",
                                cursor: "pointer",
                                transform: isSelected ? "scale(1.15)" : "scale(1)",
                                padding: 0,
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Find similar with AI */}
                  <div
                    onClick={() => setIsUploadDesignOpen(true)}
                    style={{
                      backgroundColor: "#f9fafb",
                      borderRadius: "10px",
                      padding: "12px 14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      border: "1px solid #f3f4f6",
                    }}
                  >
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#111827" }}>
                      Find similar with AI
                    </div>
                    <span style={{ color: "#9ca3af", fontSize: "0.9rem" }}>›</span>
                  </div>
                </div>

                {/* Model ID Footnote */}
                <div style={{ marginTop: "auto", paddingTop: "12px", display: "flex", alignItems: "center", gap: "6px", color: "#9ca3af", fontSize: "0.72rem" }}>
                  <span>ⓘ</span>
                  <span>Model ID: 802030</span>
                </div>
              </div>
            )}

            {/* ─── DRAWER VIEW 2: MODELS LIBRARY ─── */}
            {activeRailTab === "models" && (
              <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "16px" }}>
                {/* Top Tabs: Library, Projects, Custom */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                  <button
                    style={{
                      padding: "6px 16px",
                      borderRadius: "999px",
                      backgroundColor: "#7c3aed",
                      color: "#ffffff",
                      fontWeight: 600,
                      fontSize: "0.8rem",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Library
                  </button>
                  <button
                    onClick={() => showToast("Projects saved locally")}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "999px",
                      backgroundColor: "transparent",
                      color: "#4b5563",
                      fontWeight: 600,
                      fontSize: "0.8rem",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Projects
                  </button>
                  <button
                    onClick={() => setActiveRailTab("edit")}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "999px",
                      backgroundColor: "transparent",
                      color: "#4b5563",
                      fontWeight: 600,
                      fontSize: "0.8rem",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Custom
                  </button>
                </div>

                {/* Search Bar */}
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#f3f4f6",
                    borderRadius: "10px",
                    padding: "8px 12px",
                    marginBottom: "12px",
                  }}
                >
                  <span style={{ color: "#9ca3af", marginRight: "8px", fontSize: "0.85rem" }}>🔍</span>
                  <input
                    type="text"
                    placeholder="Try 4+ words to describe..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      border: "none",
                      background: "transparent",
                      outline: "none",
                      fontSize: "0.82rem",
                      width: "100%",
                      color: "#1f2937",
                    }}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload reference photo"
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", color: "#6b7280" }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  </button>
                </div>

                {/* Horizontal Category Chips */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    overflowX: "auto",
                    paddingBottom: "8px",
                    marginBottom: "10px",
                    scrollbarWidth: "none",
                  }}
                >
                  {["All", "Apple", "Samsung", "OnePlus", "Google"].map((brand) => {
                    const isSelected = selectedBrand.toLowerCase() === brand.toLowerCase();
                    return (
                      <button
                        key={brand}
                        onClick={() => setSelectedBrand(brand)}
                        style={{
                          padding: "4px 10px",
                          borderRadius: "6px",
                          backgroundColor: isSelected ? "#f3f4f6" : "transparent",
                          color: isSelected ? "#111827" : "#6b7280",
                          fontWeight: isSelected ? 700 : 500,
                          fontSize: "0.75rem",
                          border: "none",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {brand === "Apple" ? "iPhone" : brand}
                      </button>
                    );
                  })}
                </div>

                {/* 3-Column Phone Model Grid */}
                <div
                  style={{
                    flex: 1,
                    overflowY: "auto",
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "10px",
                    paddingRight: "4px",
                  }}
                >
                  {filteredModels.map((model) => {
                    const isSelected = selectedModel === model.name;
                    return (
                      <div
                        key={model.id}
                        onClick={() => {
                          setSelectedModel(model.name);
                          setDevice(model.brand, model.name);
                          showToast(`Loaded ${model.name}`);
                        }}
                        style={{
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          borderRadius: "10px",
                          padding: "6px",
                          border: isSelected ? "2px solid #7c3aed" : "1px solid #f1f5f9",
                          backgroundColor: isSelected ? "#faf5ff" : "#ffffff",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {/* Miniature 3D Phone Cover Model */}
                        <MiniPhoneCoverModel model={model} isSelected={isSelected} />

                        {/* Title */}
                        <span
                          style={{
                            fontSize: "0.68rem",
                            fontWeight: isSelected ? 700 : 500,
                            color: isSelected ? "#7c3aed" : "#334155",
                            marginTop: "6px",
                            textAlign: "center",
                            width: "100%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {model.name.replace(/^(Apple |Samsung )/, "")}
                        </span>

                        {/* Color dots */}
                        <div style={{ display: "flex", gap: "3px", marginTop: "4px" }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#e2e8f0" }} />
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#1e293b" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ─── DRAWER VIEW 3: LAYOUT (EXACT MATCH TO PACDORA SCREENSHOT) ─── */}
            {activeRailTab === "layout" && (
              <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
                {/* Header */}
                <div style={{ padding: "18px 18px 12px", borderBottom: "1px solid #f1f5f9" }}>
                  <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "#111827", letterSpacing: "-0.01em" }}>
                    Layout
                  </h3>
                </div>

                {/* 2-Column Preset Cards Grid (12 items) */}
                <div
                  style={{
                    flex: 1,
                    padding: "16px",
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "12px",
                    overflowY: "auto",
                  }}
                >
                  {LAYOUT_PRESET_ITEMS.map((preset) => {
                    const isSelected = activeLayout === preset.id;
                    return (
                      <div
                        key={preset.id}
                        id={`layout-preset-${preset.id}`}
                        onClick={() => {
                          setActiveLayout(preset.id);
                          showToast(`Layout: ${preset.title}`);
                        }}
                        title={preset.title}
                        style={{
                          height: "92px",
                          borderRadius: "14px",
                          backgroundColor: "#ffffff",
                          border: isSelected ? "2px solid #7c3aed" : "1px solid #e2e8f0",
                          boxShadow: isSelected
                            ? "0 0 0 1px #7c3aed, 0 4px 14px rgba(124, 58, 237, 0.16)"
                            : "0 1px 3px rgba(0,0,0,0.03)",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "6px",
                          position: "relative",
                          transition: "all 0.15s ease",
                          overflow: "hidden",
                        }}
                        onMouseOver={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.borderColor = "#c4b5fd";
                            e.currentTarget.style.backgroundColor = "#faf5ff";
                          }
                        }}
                        onMouseOut={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.borderColor = "#e2e8f0";
                            e.currentTarget.style.backgroundColor = "#ffffff";
                          }
                        }}
                      >
                        {preset.renderThumbnail()}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ─── DRAWER VIEW 4: AI BACKDROP ─── */}
            {activeRailTab === "ai-background" && (
              <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "16px" }}>
                <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#111827", marginBottom: "12px" }}>
                  Studio Stage Background
                </span>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
                  {[
                    { name: "Studio Grey", color: "#e2e5eb" },
                    { name: "Pure White", color: "#ffffff" },
                    { name: "Midnight Obsidian", color: "#18181b" },
                    { name: "Cyber Lavender", color: "#ede9fe" },
                  ].map((bg) => {
                    const isSelected = stageBgColor === bg.color;
                    return (
                      <div
                        key={bg.name}
                        onClick={() => setStageBgColor(bg.color)}
                        style={{
                          padding: "10px",
                          borderRadius: "8px",
                          border: isSelected ? "2px solid #7c3aed" : "1px solid #cbd5e1",
                          cursor: "pointer",
                          backgroundColor: "#ffffff",
                        }}
                      >
                        <div style={{ height: "36px", borderRadius: "6px", backgroundColor: bg.color, marginBottom: "6px" }} />
                        <span style={{ fontSize: "0.72rem", fontWeight: 600 }}>{bg.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── 2C. CENTER STAGE (3D PHONE CASE VIEWPORT) ───────────────────── */}
        <div
          id="case-3d-viewport"
          style={{
            flex: 1,
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* PhoneCase3D component: full-bleed interactive 3D case */}
          <div style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}>
            <PhoneCase3D
              artworkUrl={artworkUrl}
              phoneModel={selectedModel}
              caseType={currentFinishObj.name}
              caseColor={packageColor}
              layout={activeLayout}
              hideControls={true}
              artworkScale={artworkScale}
              artworkOffsetX={artworkOffsetX}
              artworkOffsetY={artworkOffsetY}
              artworkRotation={artworkRotation}
              style={{ width: "100%", height: "100%", backgroundColor: "transparent" }}
            />
          </div>

          {/* ─── 2D. FLOATING RIGHT TOOLBAR ─── */}
          <div
            style={{
              position: "absolute",
              right: "16px",
              top: "100px",
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              border: "1px solid #e5e7eb",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "4px",
              gap: "4px",
              zIndex: 30,
            }}
          >
            <button
              onClick={() => setActiveTool("select")}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: activeTool === "select" ? "#f5f3ff" : "transparent",
                color: activeTool === "select" ? "#7c3aed" : "#64748b",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polygon points="3 3 10.07 19.97 12.58 12.58 19.97 10.07 3 3"></polygon>
              </svg>
            </button>
            <button
              onClick={() => setActiveTool("pan")}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: activeTool === "pan" ? "#f5f3ff" : "transparent",
                color: activeTool === "pan" ? "#7c3aed" : "#64748b",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"></path>
                <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"></path>
                <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"></path>
                <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"></path>
              </svg>
            </button>
            <div style={{ width: "24px", height: "1px", backgroundColor: "#e5e7eb", margin: "2px 0" }} />
            <button
              onClick={handleUndo}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "transparent",
                color: "#64748b",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 7v6h6"></path>
                <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path>
              </svg>
            </button>
            <button
              onClick={handleRedo}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "transparent",
                color: "#64748b",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 7v6h-6"></path>
                <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"></path>
              </svg>
            </button>
          </div>

          {/* ─── 2G. FLOATING CASE COLOR SPECTRUM BAR ─── */}
          <div
            style={{
              position: "absolute",
              bottom: "64px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.96)",
              backdropFilter: "blur(14px)",
              padding: "6px 14px",
              borderRadius: "999px",
              boxShadow: "0 6px 22px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06)",
              border: "1px solid rgba(229, 231, 235, 0.9)",
              zIndex: 35,
              transition: "all 0.2s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginRight: "2px" }}>
              <span style={{ fontSize: "0.85rem" }}>🎨</span>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#1e293b", letterSpacing: "0.02em" }}>
                Color
              </span>
            </div>

            <div style={{ width: "1px", height: "18px", backgroundColor: "#e2e8f0" }} />

            {/* Quick Swatches */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {[
                { name: "Ultramarine Blue", color: "#2e3d7a" },
                { name: "Pure White", color: "#ffffff" },
                { name: "Midnight Black", color: "#18181b" },
                { name: "Hot Pink", color: "#ec4899" },
                { name: "Teal Green", color: "#10b981" },
                { name: "Desert Titanium", color: "#c5a880" },
                { name: "Canary Yellow", color: "#facc15" },
                { name: "Cyber Red", color: "#dc2626" },
              ].map((c) => {
                const isSelected = packageColor.toLowerCase() === c.color.toLowerCase();
                return (
                  <button
                    key={c.name}
                    onClick={() => {
                      setPackageColor(c.color);
                      showToast(`Color: ${c.name}`);
                    }}
                    title={c.name}
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      backgroundColor: c.color,
                      border: isSelected ? "2.5px solid #7c3aed" : "1.5px solid rgba(0, 0, 0, 0.15)",
                      boxShadow: isSelected
                        ? "0 0 0 2px rgba(124, 58, 237, 0.35), 0 2px 6px rgba(0,0,0,0.2)"
                        : "0 1px 3px rgba(0,0,0,0.1)",
                      cursor: "pointer",
                      transform: isSelected ? "scale(1.15)" : "scale(1)",
                      transition: "all 0.15s ease",
                      padding: 0,
                    }}
                  />
                );
              })}
            </div>

            <div style={{ width: "1px", height: "18px", backgroundColor: "#e2e8f0" }} />

            {/* Rainbow Spectrum Picker Button */}
            <div
              title="Open Color Spectrum Picker"
              style={{
                position: "relative",
                width: "26px",
                height: "26px",
                borderRadius: "50%",
                background:
                  "conic-gradient(from 0deg, #ff0000, #ffa500, #ffff00, #008000, #00ffff, #0000ff, #800080, #ff00ff, #ff0000)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
                cursor: "pointer",
                border: "2px solid #ffffff",
                overflow: "hidden",
              }}
            >
              <input
                type="color"
                value={packageColor}
                onChange={(e) => {
                  setPackageColor(e.target.value);
                }}
                style={{
                  position: "absolute",
                  inset: -8,
                  width: "200%",
                  height: "200%",
                  opacity: 0,
                  cursor: "pointer",
                }}
              />
            </div>

            {/* Hex Code Input */}
            <input
              type="text"
              value={packageColor}
              onChange={(e) => setPackageColor(e.target.value)}
              style={{
                fontSize: "0.72rem",
                fontFamily: "monospace",
                fontWeight: 700,
                color: "#334155",
                backgroundColor: "#f1f5f9",
                padding: "3px 6px",
                borderRadius: "4px",
                textTransform: "uppercase",
                border: "1px solid #e2e8f0",
                width: "68px",
                textAlign: "center",
                outline: "none",
              }}
            />
          </div>

          {/* ─── 2F. FLOATING BOTTOM BAR (MATCHING PACDORA SCREENSHOT) ─── */}
          <div
            style={{
              position: "absolute",
              bottom: "16px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(12px)",
              padding: "5px 12px",
              borderRadius: "999px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)",
              border: "1px solid #e5e7eb",
              zIndex: 30,
            }}
          >
            <button
              onClick={() => showToast("3D View Active")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "5px 10px",
                borderRadius: "999px",
                border: "none",
                backgroundColor: "#f5f3ff",
                color: "#7c3aed",
                fontSize: "0.78rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              </svg>
              <span>3D</span>
            </button>

            <button
              onClick={() => setIsUploadDesignOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "5px 10px",
                borderRadius: "999px",
                border: "none",
                backgroundColor: "transparent",
                color: "#475569",
                fontSize: "0.78rem",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              <span>Dieline</span>
            </button>

            <button
              onClick={() => showToast("Model Specs: 5.91 × 2.79 × 0.31 in")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "5px 10px",
                borderRadius: "999px",
                border: "none",
                backgroundColor: "transparent",
                color: "#475569",
                fontSize: "0.78rem",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
              <span>Specs</span>
            </button>

            <div style={{ width: "1px", height: "14px", backgroundColor: "#e2e8f0" }} />

            {/* Active Model Indicator */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "3px 9px",
                borderRadius: "6px",
                backgroundColor: "#f1f5f9",
                border: "1px solid #e2e8f0",
                fontSize: "0.76rem",
                fontWeight: 700,
                color: "#1e293b",
              }}
              title="Active Phone Model"
            >
              <span style={{ fontSize: "0.82rem" }}>📱</span>
              <span>{selectedModel}</span>
            </div>

            <div style={{ width: "1px", height: "14px", backgroundColor: "#e2e8f0" }} />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "5px 8px",
                fontSize: "0.78rem",
                fontWeight: 600,
                color: "#1e293b",
              }}
            >
              <span style={{ fontSize: "0.85rem" }}>🟡</span>
              <span>Watermark free</span>
            </div>

            <div style={{ width: "1px", height: "14px", backgroundColor: "#e2e8f0" }} />

            {/* Quick Buy CTA in Bottom Floating Bar */}
            <button
              onClick={() => handleAddToCart("cart")}
              disabled={isExporting}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "5px 14px",
                borderRadius: "999px",
                border: "none",
                background: "linear-gradient(135deg, #FF2A3A 0%, #dc2626 100%)",
                color: "#ffffff",
                fontSize: "0.8rem",
                fontWeight: 800,
                cursor: isExporting ? "wait" : "pointer",
                boxShadow: "0 2px 10px rgba(255, 42, 58, 0.38)",
                transition: "all 0.15s ease",
              }}
            >
              <span>{isExporting ? "Adding to Cart..." : "⚡ Buy Now"}</span>
              <span style={{ fontSize: "0.72rem", opacity: 0.95, background: "rgba(0,0,0,0.22)", padding: "1px 6px", borderRadius: "999px" }}>
                ₹{totalPrice}
              </span>
            </button>
          </div>

          {/* ─── 2E. BOTTOM-RIGHT CIRCULAR CHAT WIDGET ─── */}
          <div
            onClick={() => showToast("Live 3D design support ready")}
            style={{
              position: "absolute",
              right: "20px",
              bottom: "20px",
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              backgroundColor: "#111827",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
              cursor: "pointer",
              zIndex: 30,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.1 21.2a1 1 0 0 0 1.2 1.2l4.2-1.238A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ─── 3. "UPLOAD & DESIGN" FULL-SCREEN WORKSPACE (EXACT MATCH IMAGE 2) ── */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {isUploadDesignOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "#f5f5f7",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          }}
        >
          {/* Top Bar: Close ✕ + 'Upload & Design' + Purple 'Save' */}
          <header
            style={{
              height: "54px",
              backgroundColor: "#ffffff",
              borderBottom: "1px solid #e5e7eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 20px",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <button
                onClick={() => setIsUploadDesignOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                  color: "#374151",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4px",
                }}
              >
                ✕
              </button>
              <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#111827" }}>
                Upload & Design
              </h2>
            </div>

            <button
              onClick={() => {
                setIsUploadDesignOpen(false);
                showToast("Design applied to 3D mockup!");
              }}
              style={{
                padding: "8px 24px",
                borderRadius: "8px",
                backgroundColor: "#7c3aed",
                color: "#ffffff",
                border: "none",
                fontWeight: 700,
                fontSize: "0.88rem",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(124, 58, 237, 0.35)",
              }}
            >
              Save
            </button>
          </header>

          {/* Workspace Body */}
          <div style={{ flex: 1, display: "flex", position: "relative", overflow: "hidden" }}>
            {/* Leftmost Rail: Uploads | Elements | Text | Tools */}
            <aside
              style={{
                width: "64px",
                backgroundColor: "#ffffff",
                borderRight: "1px solid #e5e7eb",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "16px 0",
                gap: "20px",
                flexShrink: 0,
              }}
            >
              {/* Uploads Tab */}
              <button
                onClick={() => setUploadDesignTab("uploads")}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: uploadDesignTab === "uploads" ? "#7c3aed" : "#64748b",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    backgroundColor: uploadDesignTab === "uploads" ? "#f5f3ff" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
                    <path d="M12 12v9"></path>
                    <path d="m16 16-4-4-4 4"></path>
                  </svg>
                </div>
                <span style={{ fontSize: "0.68rem", fontWeight: uploadDesignTab === "uploads" ? 700 : 500 }}>Uploads</span>
              </button>

              {/* Elements Tab */}
              <button
                onClick={() => setUploadDesignTab("elements")}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: uploadDesignTab === "elements" ? "#7c3aed" : "#64748b",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    backgroundColor: uploadDesignTab === "elements" ? "#f5f3ff" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                </div>
                <span style={{ fontSize: "0.68rem", fontWeight: uploadDesignTab === "elements" ? 700 : 500 }}>Elements</span>
              </button>

              {/* Text Tab */}
              <button
                onClick={() => setUploadDesignTab("text")}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: uploadDesignTab === "text" ? "#7c3aed" : "#64748b",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    backgroundColor: uploadDesignTab === "text" ? "#f5f3ff" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ fontWeight: 800, fontSize: "1.1rem" }}>T</span>
                </div>
                <span style={{ fontSize: "0.68rem", fontWeight: uploadDesignTab === "text" ? 700 : 500 }}>Text</span>
              </button>

              {/* Tools Tab */}
              <button
                onClick={() => setUploadDesignTab("tools")}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: uploadDesignTab === "tools" ? "#7c3aed" : "#64748b",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    backgroundColor: uploadDesignTab === "tools" ? "#f5f3ff" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                  </svg>
                </div>
                <span style={{ fontSize: "0.68rem", fontWeight: uploadDesignTab === "tools" ? 700 : 500 }}>Tools</span>
              </button>
            </aside>

            {/* Left Secondary Panel (Uploads List matching Image 2) */}
            <div
              style={{
                width: "210px",
                backgroundColor: "#ffffff",
                borderRight: "1px solid #e5e7eb",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                flexShrink: 0,
              }}
            >
              {/* Black Upload Pill Button: ↑ JPG, PNG, SVG */}
              <button
                onClick={() => unfoldFileInputRef.current?.click()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "10px",
                  borderRadius: "8px",
                  backgroundColor: "#18181b",
                  color: "#ffffff",
                  border: "none",
                  fontWeight: 600,
                  fontSize: "0.78rem",
                  cursor: "pointer",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <span>JPG, PNG, SVG</span>
              </button>

              {/* Uploaded Photos Grid */}
              <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
                {uploadsList.length === 0 ? (
                  <div
                    style={{
                      padding: "28px 12px",
                      textAlign: "center",
                      color: "#9ca3af",
                      fontSize: "0.8rem",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "10px",
                      border: "1.5px dashed #e2e8f0",
                      borderRadius: "12px",
                      marginTop: "8px",
                      backgroundColor: "#f8fafc",
                    }}
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span style={{ fontWeight: 600, color: "#64748b" }}>No photos uploaded yet</span>
                    <span style={{ fontSize: "0.72rem", color: "#94a3b8", lineHeight: 1.4 }}>
                      Click the button above to upload your JPG, PNG, or SVG artwork
                    </span>
                  </div>
                ) : (
                  uploadsList.map((item) => {
                    const isCurrent = artworkUrl === item.url;
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          setArtworkUrl(item.url);
                          showToast(`Placed ${item.name}`);
                        }}
                        style={{
                          borderRadius: "10px",
                          overflow: "hidden",
                          border: isCurrent ? "2px solid #7c3aed" : "1px solid #e5e7eb",
                          cursor: "pointer",
                          aspectRatio: "1 / 1.25",
                          backgroundColor: "#f3f4f6",
                          position: "relative",
                          transition: "all 0.15s ease",
                        }}
                      >
                        <img
                          src={item.url}
                          alt={item.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        {/* Remove uploaded photo button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setUploadsList((prev) => prev.filter((u) => u.id !== item.id));
                            if (artworkUrl === item.url) {
                              setArtworkUrl("");
                            }
                            showToast("Photo removed");
                          }}
                          style={{
                            position: "absolute",
                            top: "6px",
                            right: "6px",
                            width: "22px",
                            height: "22px",
                            borderRadius: "50%",
                            backgroundColor: "rgba(0,0,0,0.65)",
                            color: "#ffffff",
                            border: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "11px",
                            fontWeight: 700,
                            cursor: "pointer",
                            transition: "background-color 0.15s",
                          }}
                          title="Remove image"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* ─── CENTER: 2D FLAT DIELINE UNFOLD CANVAS (Image 2) ─── */}
            <div
              onMouseDown={handleDielineMouseDown}
              onMouseMove={handleDielineMouseMove}
              onMouseUp={handleDielineMouseUp}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                position: "relative",
                backgroundColor: "#f5f5f7",
                cursor: isDielineDragging ? "grabbing" : "grab",
              }}
            >
              {/* Dieline Wrap SVG Component */}
              <div
                style={{
                  position: "relative",
                  width: "420px",
                  height: "720px",
                  transform: `scale(${dielineZoom / 100})`,
                  transformOrigin: "center center",
                  transition: isDielineDragging ? "none" : "transform 0.1s ease",
                }}
              >
                {/* SVG Dieline Mask & Outlines (CaseTadka unfold cut) */}
                <svg
                  viewBox="0 0 440 760"
                  style={{
                    width: "100%",
                    height: "100%",
                    filter: "drop-shadow(0 12px 30px rgba(0,0,0,0.07))",
                  }}
                >
                  <defs>
                    {/* Exact flat unfold die-cut path */}
                    <clipPath id="caseUnfoldClip">
                      <path
                        d="
                          M 70 102
                          A 7 7 0 0 1 77 95
                          L 105 95
                          A 4 4 0 0 1 109 99
                          L 109 146
                          A 4 4 0 0 0 113 150
                          L 141 150
                          A 4 4 0 0 0 145 146
                          L 145 95
                          A 6 6 0 0 1 151 89
                          L 289 89
                          A 6 6 0 0 1 295 95
                          L 295 146
                          A 4 4 0 0 0 299 150
                          L 327 150
                          A 4 4 0 0 0 331 146
                          L 331 99
                          A 4 4 0 0 1 335 95
                          L 363 95
                          A 7 7 0 0 1 370 102
                          L 370 698
                          A 7 7 0 0 1 363 705
                          L 335 705
                          A 4 4 0 0 1 331 701
                          L 331 654
                          A 4 4 0 0 0 327 650
                          L 299 650
                          A 4 4 0 0 0 295 654
                          L 295 705
                          A 6 6 0 0 1 289 711
                          L 151 711
                          A 6 6 0 0 1 145 705
                          L 145 654
                          A 4 4 0 0 0 141 650
                          L 113 650
                          A 4 4 0 0 0 109 654
                          L 109 701
                          A 4 4 0 0 1 105 705
                          L 77 705
                          A 7 7 0 0 1 70 698
                          Z
                        "
                      />
                    </clipPath>

                    {/* Camera cutout mask (Dynamic per selected phone model) */}
                    <mask id="dielineMask">
                      <rect width="440" height="760" fill="white" />
                      {renderDielineCameraCutout(currentPhoneDetails.cameraType, true)}
                    </mask>
                  </defs>

                  {/* 1. Case Base Solid Fill (Package Color) */}
                  <path
                    d="
                      M 70 102
                      A 7 7 0 0 1 77 95
                      L 105 95
                      A 4 4 0 0 1 109 99
                      L 109 146
                      A 4 4 0 0 0 113 150
                      L 141 150
                      A 4 4 0 0 0 145 146
                      L 145 95
                      A 6 6 0 0 1 151 89
                      L 289 89
                      A 6 6 0 0 1 295 95
                      L 295 146
                      A 4 4 0 0 0 299 150
                      L 327 150
                      A 4 4 0 0 0 331 146
                      L 331 99
                      A 4 4 0 0 1 335 95
                      L 363 95
                      A 7 7 0 0 1 370 102
                      L 370 698
                      A 7 7 0 0 1 363 705
                      L 335 705
                      A 4 4 0 0 1 331 701
                      L 331 654
                      A 4 4 0 0 0 327 650
                      L 299 650
                      A 4 4 0 0 0 295 654
                      L 295 705
                      A 6 6 0 0 1 289 711
                      L 151 711
                      A 6 6 0 0 1 145 705
                      L 145 654
                      A 4 4 0 0 0 141 650
                      L 113 650
                      A 4 4 0 0 0 109 654
                      L 109 701
                      A 4 4 0 0 1 105 705
                      L 77 705
                      A 7 7 0 0 1 70 698
                      Z
                    "
                    fill={packageColor}
                  />

                  {/* 2. Customer Uploaded Artwork (Clipped inside the unfold dieline & camera cutout) */}
                  {artworkUrl && (
                    <g clipPath="url(#caseUnfoldClip)" mask="url(#dielineMask)">
                      <image
                        href={artworkUrl}
                        x={220 - 200 * artworkScale + artworkOffsetX}
                        y={380 - 340 * artworkScale + artworkOffsetY}
                        width={400 * artworkScale}
                        height={680 * artworkScale}
                        preserveAspectRatio="xMidYMid slice"
                        style={{ pointerEvents: "none" }}
                      />
                    </g>
                  )}

                  {/* 3. Concentric Inner Fold Line (Double outline matching user reference) */}
                  <path
                    d="
                      M 76 108
                      L 101 108
                      L 101 152
                      L 149 152
                      L 149 97
                      L 291 97
                      L 291 152
                      L 339 152
                      L 339 108
                      L 364 108
                      L 364 692
                      L 339 692
                      L 339 648
                      L 291 648
                      L 291 703
                      L 149 703
                      L 149 648
                      L 101 648
                      L 101 692
                      L 76 692
                      Z
                    "
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="1.2"
                  />

                  {/* 4. Inner Corner Crease Arcs (Connecting main phone body corners to notch tabs) */}
                  <path d="M 109 195 C 109 158, 116 150, 145 150" fill="none" stroke="#94a3b8" strokeWidth="1.2" />
                  <path d="M 295 150 C 324 150, 331 158, 331 195" fill="none" stroke="#94a3b8" strokeWidth="1.2" />
                  <path d="M 109 605 C 109 642, 116 650, 145 650" fill="none" stroke="#94a3b8" strokeWidth="1.2" />
                  <path d="M 295 650 C 324 650, 331 642, 331 605" fill="none" stroke="#94a3b8" strokeWidth="1.2" />

                  {/* 5 & 6. Side Fold Cutout Slots (Dynamic per phone model/brand) */}
                  {renderDielineButtons(currentPhoneDetails)}

                  {/* 7. Bottom Flap Cutouts (5 Speaker holes, center hole, USB-C Port, hole, 3 Mic holes) */}
                  <circle cx="165" cy="675" r="2.0" fill="none" stroke="#64748b" strokeWidth="1.2" />
                  <circle cx="171" cy="675" r="2.0" fill="none" stroke="#64748b" strokeWidth="1.2" />
                  <circle cx="177" cy="675" r="2.0" fill="none" stroke="#64748b" strokeWidth="1.2" />
                  <circle cx="183" cy="675" r="2.0" fill="none" stroke="#64748b" strokeWidth="1.2" />
                  <circle cx="189" cy="675" r="2.0" fill="none" stroke="#64748b" strokeWidth="1.2" />
                  <circle cx="197" cy="675" r="2.0" fill="none" stroke="#64748b" strokeWidth="1.2" />

                  <rect x="207" y="670" width="26" height="10" rx="5" fill="#f5f5f7" stroke="#94a3b8" strokeWidth="1.2" />

                  <circle cx="243" cy="675" r="2.0" fill="none" stroke="#64748b" strokeWidth="1.2" />
                  <circle cx="251" cy="675" r="2.0" fill="none" stroke="#64748b" strokeWidth="1.2" />
                  <circle cx="257" cy="675" r="2.0" fill="none" stroke="#64748b" strokeWidth="1.2" />
                  <circle cx="263" cy="675" r="2.0" fill="none" stroke="#64748b" strokeWidth="1.2" />

                  {/* 8. Camera Hole Outline (Dynamic per selected phone model) */}
                  {renderDielineCameraCutout(currentPhoneDetails.cameraType, false)}

                  {/* 9. Outer Cut Perimeter Stroke Line */}
                  <path
                    d="
                      M 70 102
                      A 7 7 0 0 1 77 95
                      L 105 95
                      A 4 4 0 0 1 109 99
                      L 109 146
                      A 4 4 0 0 0 113 150
                      L 141 150
                      A 4 4 0 0 0 145 146
                      L 145 95
                      A 6 6 0 0 1 151 89
                      L 289 89
                      A 6 6 0 0 1 295 95
                      L 295 146
                      A 4 4 0 0 0 299 150
                      L 327 150
                      A 4 4 0 0 0 331 146
                      L 331 99
                      A 4 4 0 0 1 335 95
                      L 363 95
                      A 7 7 0 0 1 370 102
                      L 370 698
                      A 7 7 0 0 1 363 705
                      L 335 705
                      A 4 4 0 0 1 331 701
                      L 331 654
                      A 4 4 0 0 0 327 650
                      L 299 650
                      A 4 4 0 0 0 295 654
                      L 295 705
                      A 6 6 0 0 1 289 711
                      L 151 711
                      A 6 6 0 0 1 145 705
                      L 145 654
                      A 4 4 0 0 0 141 650
                      L 113 650
                      A 4 4 0 0 0 109 654
                      L 109 701
                      A 4 4 0 0 1 105 705
                      L 77 705
                      A 7 7 0 0 1 70 698
                      Z
                    "
                    fill="none"
                    stroke="#475569"
                    strokeWidth="1.5"
                  />
                </svg>

                {/* Empty State Instructions when no artwork is uploaded */}
                {!artworkUrl && (
                  <div
                    style={{
                      position: "absolute",
                      inset: "100px 80px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      pointerEvents: "none",
                    }}
                  >
                    <span style={{ fontSize: "1.8rem", marginBottom: "8px" }}>🎨</span>
                    <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "#334155" }}>
                      Pick an artwork on the left
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "4px" }}>
                      or upload your own JPG/PNG to preview wrap
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* ─── TOP-RIGHT FLOATING 3D MINI-PREVIEW (Image 2) ─── */}
            <div
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                width: "180px",
                height: "230px",
                backgroundColor: "#ffffff",
                borderRadius: "14px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                border: "1px solid #e5e7eb",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                zIndex: 40,
              }}
            >
              {/* Card Header with 3D ↺ icon & Layout Selector */}
              <div
                style={{
                  padding: "5px 8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "rgba(255,255,255,0.92)",
                  backdropFilter: "blur(6px)",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  zIndex: 2,
                  borderBottom: "1px solid rgba(229,231,235,0.8)",
                }}
              >
                {/* Layout Selector */}
                <select
                  value={activeLayout}
                  onChange={(e) => {
                    setActiveLayout(e.target.value);
                    showToast(`Layout: ${LAYOUT_PRESET_ITEMS.find((l) => l.id === e.target.value)?.title || e.target.value}`);
                  }}
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    color: "#374151",
                    backgroundColor: "#f3f4f6",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    padding: "2px 4px",
                    cursor: "pointer",
                    outline: "none",
                    maxWidth: "110px",
                  }}
                  title="Choose 3D Model Layout"
                >
                  {LAYOUT_PRESET_ITEMS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </select>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    color: "#374151",
                    cursor: "pointer",
                  }}
                  title="3D Real-time Wrap Preview"
                >
                  <span>3D</span>
                  <span style={{ fontSize: "0.8rem" }}>↺</span>
                </div>
              </div>

              {/* 3D Phone Case Mini Canvas */}
              <div style={{ flex: 1, width: "100%", height: "100%", paddingTop: "28px" }}>
                <PhoneCase3D
                  artworkUrl={artworkUrl}
                  phoneModel={selectedModel}
                  caseType={currentFinishObj.name}
                  caseColor={packageColor}
                  layout={activeLayout}
                  artworkScale={artworkScale}
                  artworkOffsetX={artworkOffsetX}
                  artworkOffsetY={artworkOffsetY}
                  artworkRotation={artworkRotation}
                  hideControls={true}
                  style={{ width: "100%", height: "100%", backgroundColor: "#f3f4f6" }}
                />
              </div>
            </div>

            {/* ─── BOTTOM-RIGHT CARD: PACKAGE COLOR (Image 2) ─── */}
            <div
              style={{
                position: "absolute",
                bottom: "80px",
                right: "20px",
                backgroundColor: "#ffffff",
                borderRadius: "14px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                border: "1px solid #e5e7eb",
                padding: "14px 16px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                zIndex: 40,
              }}
            >
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#111827" }}>
                Package Color
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {/* Custom Color Add (+) */}
                <label
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    border: "1.5px dashed #7c3aed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: "12px",
                    color: "#7c3aed",
                    fontWeight: 700,
                  }}
                >
                  +
                  <input
                    type="color"
                    value={packageColor}
                    onChange={(e) => setPackageColor(e.target.value)}
                    style={{ display: "none" }}
                  />
                </label>

                {/* Swatches */}
                {PACKAGE_COLORS.map((pkg) => {
                  const isSelected = packageColor === pkg.color;
                  return (
                    <button
                      key={pkg.id}
                      onClick={() => setPackageColor(pkg.color)}
                      title={pkg.label}
                      style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        backgroundColor: pkg.color,
                        border: isSelected ? "2px solid #7c3aed" : "1px solid #cbd5e1",
                        boxShadow: isSelected ? "0 0 0 2px rgba(124,58,237,0.3)" : "none",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* ─── BOTTOM FLOATING TOOLBAR (Image 2) ─── */}
            <div
              style={{
                position: "absolute",
                bottom: "16px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                border: "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "8px 18px",
                zIndex: 40,
              }}
            >
              <button
                onClick={() => showToast("Selection active")}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#7c3aed" }}
                title="Select"
              >
                ↖
              </button>
              <button
                onClick={() => {
                  setArtworkUrl("");
                  showToast("Cleared image");
                }}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
                title="Delete"
              >
                🗑
              </button>
              <div style={{ width: "1px", height: "16px", backgroundColor: "#e5e7eb" }} />
              <button
                onClick={handleUndo}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
                title="Undo"
              >
                ↺
              </button>
              <button
                onClick={handleRedo}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
                title="Redo"
              >
                ↷
              </button>
              <div style={{ width: "1px", height: "16px", backgroundColor: "#e5e7eb" }} />

              {/* Zoom Controls */}
              <button
                onClick={() => setDielineZoom((prev) => Math.max(60, prev - 10))}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", fontWeight: 700 }}
              >
                -
              </button>
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#111827", minWidth: "42px", textAlign: "center" }}>
                {dielineZoom}%
              </span>
              <button
                onClick={() => setDielineZoom((prev) => Math.min(160, prev + 10))}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", fontWeight: 700 }}
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
