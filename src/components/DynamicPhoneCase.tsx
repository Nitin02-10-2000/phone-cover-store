"use client";

import React, { useState } from "react";
import Image from "next/image";
import { getPhoneModelDetails, CameraArchetype } from "@/data/phoneModels";
import { useDevice } from "@/lib/deviceContext";

interface DynamicPhoneCaseProps {
  artworkUrl: string;
  phoneModel?: string;
  caseType?: string;
  showMagSafe?: boolean;
  lensProtectorAddon?: boolean;
  width?: number;
  height?: number;
  interactive?: boolean;
  customOverlay?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export default function DynamicPhoneCase({
  artworkUrl,
  phoneModel,
  caseType = "Ultra Impact MagSafe",
  showMagSafe,
  lensProtectorAddon = false,
  width = 250,
  height = 480,
  interactive = true,
  customOverlay,
  style,
  className,
}: DynamicPhoneCaseProps) {
  const { selectedModel: globalModel } = useDevice();
  const activeModelName = phoneModel || globalModel;
  const phone = getPhoneModelDetails(activeModelName);

  const [isHovered, setIsHovered] = useState(false);

  // Corner radius based on phone design
  const cornerRadius =
    phone.corners === "sharp"
      ? "12px"
      : phone.corners === "extra-rounded"
      ? "44px"
      : "38px";

  // MagSafe visibility
  const isMagSafe =
    showMagSafe !== undefined
      ? showMagSafe
      : caseType.toLowerCase().includes("magsafe") || phone.hasMagSafe;

  // Render camera cutouts according to archetype
  const renderCameraCutout = (type: CameraArchetype) => {
    switch (type) {
      // ================= 1. SAMSUNG GALAXY ULTRA (S25/S24/S23 Ultra) =================
      case "samsung-ultra":
        return (
          <div
            style={{
              position: "absolute",
              top: "18px",
              left: "16px",
              width: "72px",
              height: "128px",
              zIndex: 10,
              pointerEvents: "none",
            }}
          >
            {/* Left Vertical Column (3 Main Lenses) */}
            <div style={{ position: "absolute", left: "0", top: "0", display: "flex", flexDirection: "column", gap: "9px" }}>
              {[1, 2, 3].map((i) => (
                <div
                  key={`ultra-main-${i}`}
                  style={{
                    width: "25px",
                    height: "25px",
                    borderRadius: "50%",
                    backgroundColor: "#070709",
                    border: lensProtectorAddon ? "2px solid #22c55e" : "2px solid #3f3f46",
                    boxShadow: "0 3px 8px rgba(0,0,0,0.8), inset 0 0 4px #000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: "17px",
                      height: "17px",
                      borderRadius: "50%",
                      background: "radial-gradient(circle at 35% 35%, #1d4ed8 0%, #030712 80%)",
                      border: "1px solid #1e293b",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "2.5px",
                        left: "3px",
                        width: "3px",
                        height: "3px",
                        borderRadius: "50%",
                        backgroundColor: "#ffffff",
                        opacity: 0.85,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column (Flash, Laser AF, 4th Lens) */}
            <div style={{ position: "absolute", left: "34px", top: "4px", display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
              {/* Flash */}
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, #fffbeb 20%, #fbbf24 60%, #b45309 100%)",
                  border: "1px solid rgba(255,255,255,0.4)",
                  boxShadow: "0 0 4px rgba(251,191,36,0.6)",
                }}
              />
              {/* Laser AF Sensor */}
              <div
                style={{
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                  backgroundColor: "#050507",
                  border: "1.5px solid #3f3f46",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#ef4444" }} />
              </div>
              {/* 4th Periscope Lens */}
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: "#070709",
                  border: lensProtectorAddon ? "2px solid #22c55e" : "1.5px solid #3f3f46",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "radial-gradient(circle, #2563eb 0%, #050507 80%)" }} />
              </div>
            </div>
          </div>
        );

      // ================= 2. SAMSUNG GALAXY TRIPLE (S25/S24/A55) =================
      case "samsung-triple":
        return (
          <div
            style={{
              position: "absolute",
              top: "18px",
              left: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "9px",
              zIndex: 10,
              pointerEvents: "none",
            }}
          >
            {[1, 2, 3].map((i) => (
              <div
                key={`sg-triple-${i}`}
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  backgroundColor: "#08080a",
                  border: lensProtectorAddon ? "2px solid #22c55e" : "2px solid #52525b",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.85), inset 0 0 3px #000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle at 35% 35%, #1e40af 0%, #050508 80%)",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "2px",
                      left: "3px",
                      width: "3px",
                      height: "3px",
                      borderRadius: "50%",
                      backgroundColor: "#ffffff",
                      opacity: 0.9,
                    }}
                  />
                </div>
              </div>
            ))}
            {/* Flash next to first lens */}
            <div
              style={{
                position: "absolute",
                top: "6px",
                left: "32px",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "radial-gradient(circle, #fffbeb 20%, #fbbf24 60%, #b45309 100%)",
                border: "1px solid rgba(255,255,255,0.4)",
              }}
            />
          </div>
        );

      // ================= 3. GOOGLE PIXEL HORIZONTAL VISOR (Pixel 7/8/9) =================
      case "pixel-visor":
        return (
          <div
            style={{
              position: "absolute",
              top: "22px",
              left: "0",
              right: "0",
              height: "44px",
              backgroundColor: "#18181b",
              borderTop: lensProtectorAddon ? "2px solid #22c55e" : "2px solid #3f3f46",
              borderBottom: lensProtectorAddon ? "2px solid #22c55e" : "2px solid #3f3f46",
              boxShadow: "0 6px 16px rgba(0,0,0,0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 18px",
              zIndex: 10,
              pointerEvents: "none",
            }}
          >
            {/* Pill Cutout with Camera Lenses */}
            <div
              style={{
                height: "28px",
                width: "90px",
                backgroundColor: "#050507",
                borderRadius: "14px",
                border: "1.5px solid #27272a",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-evenly",
                padding: "0 6px",
              }}
            >
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle at 35% 35%, #2563eb 0%, #030712 80%)",
                  border: "1px solid #374151",
                }}
              />
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle at 35% 35%, #2563eb 0%, #030712 80%)",
                  border: "1px solid #374151",
                }}
              />
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, #3b82f6 0%, #030712 80%)",
                }}
              />
            </div>

            {/* Flash + Temp Sensor */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
              <div
                style={{
                  width: "9px",
                  height: "9px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, #fffbeb 20%, #fbbf24 60%, #b45309 100%)",
                  border: "1px solid rgba(255,255,255,0.4)",
                }}
              />
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#3f3f46" }} />
            </div>
          </div>
        );

      // ================= 4. ONEPLUS CIRCULAR DIAL (OnePlus 11/12/13) =================
      case "oneplus-dial":
        return (
          <div
            style={{
              position: "absolute",
              top: "16px",
              left: "14px",
              width: "74px",
              height: "74px",
              borderRadius: "50%",
              backgroundColor: "#111113",
              border: lensProtectorAddon ? "2.5px solid #22c55e" : "2.5px solid #52525b",
              boxShadow: "0 6px 20px rgba(0,0,0,0.9), inset 0 0 10px rgba(0,0,0,0.9)",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              padding: "10px",
              gap: "6px",
              alignItems: "center",
              justifyItems: "center",
              zIndex: 10,
              pointerEvents: "none",
            }}
          >
            {[1, 2, 3].map((i) => (
              <div
                key={`op-lens-${i}`}
                style={{
                  width: "19px",
                  height: "19px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle at 35% 35%, #1d4ed8 0%, #050507 80%)",
                  border: "1px solid #3f3f46",
                }}
              />
            ))}
            {/* Flash */}
            <div
              style={{
                width: "11px",
                height: "11px",
                borderRadius: "50%",
                background: "radial-gradient(circle, #fffbeb 20%, #fbbf24 60%, #b45309 100%)",
                border: "1px solid rgba(255,255,255,0.4)",
              }}
            />
          </div>
        );

      // ================= 5. NOTHING PHONE GLYPH & DUAL LENS =================
      case "nothing-glyph":
        return (
          <>
            {/* Glowing White Glyph Lines Accent */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                zIndex: 2,
                opacity: 0.65,
              }}
            >
              {/* Glyph around camera */}
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  left: "12px",
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  border: "2px solid rgba(255,255,255,0.75)",
                  borderRightColor: "transparent",
                  filter: "drop-shadow(0 0 6px rgba(255,255,255,0.6))",
                }}
              />
              {/* Glyph C-shape center */}
              <div
                style={{
                  position: "absolute",
                  top: "45%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "110px",
                  height: "110px",
                  borderRadius: "50%",
                  border: "2.5px solid rgba(255,255,255,0.7)",
                  borderTopColor: "transparent",
                  borderLeftColor: "transparent",
                  filter: "drop-shadow(0 0 6px rgba(255,255,255,0.6))",
                }}
              />
            </div>

            {/* Dual Pill Camera */}
            <div
              style={{
                position: "absolute",
                top: "16px",
                left: "18px",
                width: "30px",
                height: "56px",
                borderRadius: "15px",
                backgroundColor: "rgba(15,15,20,0.95)",
                border: lensProtectorAddon ? "2px solid #22c55e" : "2px solid rgba(255,255,255,0.5)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-around",
                padding: "4px 0",
                zIndex: 10,
                boxShadow: "0 4px 12px rgba(0,0,0,0.8)",
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle at 35% 35%, #2563eb 0%, #000 80%)",
                  border: "1px solid #444",
                }}
              />
              <div
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle at 35% 35%, #2563eb 0%, #000 80%)",
                  border: "1px solid #444",
                }}
              />
            </div>
          </>
        );

      // ================= 6. SAMSUNG Z FLIP =================
      case "samsung-flip":
        return (
          <div
            style={{
              position: "absolute",
              top: "16px",
              left: "14px",
              right: "14px",
              height: "140px",
              backgroundColor: "#050508",
              borderRadius: "16px",
              border: "2px solid #27272a",
              boxShadow: "0 6px 16px rgba(0,0,0,0.85)",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              padding: "10px",
              zIndex: 10,
              pointerEvents: "none",
            }}
          >
            {/* Dual Horizontal Lenses */}
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "radial-gradient(circle, #2563eb 0%, #000 80%)", border: "1.5px solid #52525b" }} />
              <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "radial-gradient(circle, #2563eb 0%, #000 80%)", border: "1.5px solid #52525b" }} />
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fbbf24" }} />
            </div>
            <span style={{ fontSize: "0.55rem", color: "#71717a", fontWeight: 700, letterSpacing: "0.08em" }}>COVER AMOLED</span>
          </div>
        );

      // ================= 7. APPLE IPHONE DUAL DIAGONAL (iPhone 13/14/15) =================
      case "iphone-dual-diag":
        return (
          <div
            style={{
              position: "absolute",
              top: "16px",
              left: "16px",
              width: "66px",
              height: "66px",
              borderRadius: "18px",
              backgroundColor: "rgba(10, 10, 14, 0.95)",
              border: lensProtectorAddon ? "2px solid #22c55e" : "1.5px solid rgba(255, 255, 255, 0.25)",
              boxShadow: "0 6px 16px rgba(0,0,0,0.7)",
              zIndex: 10,
              pointerEvents: "none",
            }}
          >
            {/* Top-Left Lens */}
            <div
              style={{
                position: "absolute",
                top: "8px",
                left: "8px",
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                background: "radial-gradient(circle at 35% 35%, #1d4ed8 0%, #000 80%)",
                border: "1.5px solid #3f3f46",
              }}
            />
            {/* Bottom-Right Lens */}
            <div
              style={{
                position: "absolute",
                bottom: "8px",
                right: "8px",
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                background: "radial-gradient(circle at 35% 35%, #1d4ed8 0%, #000 80%)",
                border: "1.5px solid #3f3f46",
              }}
            />
            {/* Top-Right Flash */}
            <div
              style={{
                position: "absolute",
                top: "10px",
                right: "12px",
                width: "9px",
                height: "9px",
                borderRadius: "50%",
                background: "radial-gradient(circle, #fffbeb 20%, #fbbf24 60%, #b45309 100%)",
              }}
            />
          </div>
        );

      // ================= 8. APPLE IPHONE DUAL VERTICAL (iPhone 16 / 12 / 11) =================
      case "iphone-dual-vert":
        return (
          <div
            style={{
              position: "absolute",
              top: "16px",
              left: "16px",
              width: "36px",
              height: "72px",
              borderRadius: "18px",
              backgroundColor: "rgba(10, 10, 14, 0.95)",
              border: lensProtectorAddon ? "2px solid #22c55e" : "1.5px solid rgba(255, 255, 255, 0.25)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-around",
              padding: "6px 0",
              zIndex: 10,
              boxShadow: "0 6px 16px rgba(0,0,0,0.7)",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                background: "radial-gradient(circle at 35% 35%, #1d4ed8 0%, #000 80%)",
                border: "1.5px solid #3f3f46",
              }}
            />
            <div
              style={{
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                background: "radial-gradient(circle at 35% 35%, #1d4ed8 0%, #000 80%)",
                border: "1.5px solid #3f3f46",
              }}
            />
          </div>
        );

      // ================= 9. MATRIX ISLAND (Poco, Realme, Xiaomi, Moto, Vivo) =================
      case "matrix-island":
        return (
          <div
            style={{
              position: "absolute",
              top: "16px",
              left: "16px",
              width: "60px",
              height: "78px",
              borderRadius: "14px",
              backgroundColor: "#0d0d10",
              border: lensProtectorAddon ? "2px solid #22c55e" : "1.5px solid #3f3f46",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-evenly",
              padding: "6px",
              zIndex: 10,
              boxShadow: "0 6px 16px rgba(0,0,0,0.8)",
              pointerEvents: "none",
            }}
          >
            <div style={{ display: "flex", width: "100%", justifyContent: "space-around" }}>
              <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "radial-gradient(circle, #2563eb 0%, #000 80%)", border: "1px solid #444" }} />
              <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "radial-gradient(circle, #2563eb 0%, #000 80%)", border: "1px solid #444" }} />
            </div>
            <div style={{ display: "flex", width: "100%", justifyContent: "space-around", alignItems: "center" }}>
              <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "radial-gradient(circle, #2563eb 0%, #000 80%)", border: "1px solid #444" }} />
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fbbf24" }} />
            </div>
          </div>
        );

      // ================= 10. APPLE IPHONE PRO TRIPLE (Default) =================
      case "iphone-triple":
      default:
        return (
          <div
            style={{
              position: "absolute",
              top: "16px",
              left: "16px",
              width: "68px",
              height: "74px",
              borderRadius: "18px",
              backgroundColor: "rgba(10, 10, 14, 0.95)",
              border: lensProtectorAddon ? "2px solid #22c55e" : "1.5px solid rgba(255, 255, 255, 0.25)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-around",
              padding: "6px",
              zIndex: 10,
              boxShadow: "0 6px 16px rgba(0,0,0,0.7)",
              pointerEvents: "none",
            }}
          >
            <div style={{ display: "flex", width: "100%", justifyContent: "space-around" }}>
              <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "radial-gradient(circle, #2563eb, #000)", border: "1px solid #444" }} />
              <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "radial-gradient(circle, #2563eb, #000)", border: "1px solid #444" }} />
            </div>
            <div style={{ display: "flex", width: "100%", justifyContent: "space-around", alignItems: "center" }}>
              <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "radial-gradient(circle, #2563eb, #000)", border: "1px solid #444" }} />
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fbbf24" }} />
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className={`dynamic-phone-case ${className || ""}`}
      style={{
        position: "relative",
        width: `${width}px`,
        height: `${height}px`,
        perspective: interactive ? "900px" : undefined,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
    >
      {/* Dynamic Drop Shadow beneath Phone Case */}
      <div
        style={{
          position: "absolute",
          inset: "10px",
          borderRadius: cornerRadius,
          background: "rgba(0, 0, 0, 0.5)",
          filter: "blur(14px)",
          transform: isHovered ? "translateY(16px) scale(0.96)" : "translateY(10px) scale(0.92)",
          transition: "transform 0.3s ease",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Main 3D Phone Body Frame */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: cornerRadius,
          backgroundColor: "#121214",
          border: "5px solid #27272a",
          boxShadow: isHovered
            ? "0 30px 70px rgba(0,0,0,0.9), inset 0 0 0 1.5px rgba(255,255,255,0.2)"
            : "0 20px 50px rgba(0,0,0,0.85), inset 0 0 0 1.5px rgba(255,255,255,0.15)",
          overflow: "hidden",
          transform: isHovered && interactive ? "translateY(-6px) rotateY(-3deg) rotateX(2deg)" : "none",
          transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease",
          zIndex: 1,
        }}
      >
        {/* Full-bleed Case Artwork */}
        <Image
          src={artworkUrl}
          alt={phone.name}
          fill
          sizes={`${width}px`}
          style={{ objectFit: "cover" }}
          priority
        />

        {/* Dynamic Physical Camera Cutout */}
        {renderCameraCutout(phone.cameraType)}

        {/* Glassmorphism / Gloss Finish Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              caseType.toLowerCase().includes("glass")
                ? "linear-gradient(135deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.05) 45%, rgba(0,0,0,0.3) 100%)"
                : "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%, rgba(0,0,0,0.25) 100%)",
            boxShadow: "inset 0 0 20px rgba(255,255,255,0.12)",
            pointerEvents: "none",
            zIndex: 3,
          }}
        />

        {/* MagSafe Array Ring Highlight (if MagSafe case) */}
        {isMagSafe && (
          <div
            style={{
              position: "absolute",
              top: "45%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: `${Math.round(width * 0.42)}px`,
              height: `${Math.round(width * 0.42)}px`,
              borderRadius: "50%",
              border: "2.5px solid rgba(255, 255, 255, 0.8)",
              boxShadow: "0 0 10px rgba(255,255,255,0.35), inset 0 0 10px rgba(255,255,255,0.35)",
              pointerEvents: "none",
              zIndex: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Magnetic Alignment Bar */}
            <div
              style={{
                width: "5px",
                height: "22px",
                backgroundColor: "rgba(255, 255, 255, 0.85)",
                position: "absolute",
                bottom: "-28px",
                borderRadius: "2.5px",
                boxShadow: "0 0 6px rgba(255,255,255,0.4)",
              }}
            />
          </div>
        )}

        {/* Custom Overlay (Text, Stickers, etc.) */}
        {customOverlay && (
          <div style={{ position: "absolute", inset: 0, zIndex: 6, pointerEvents: "none" }}>
            {customOverlay}
          </div>
        )}

        {/* Dynamic Model Pill Badge on Bottom Frame */}
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            padding: "3px 10px",
            borderRadius: "999px",
            fontSize: "0.62rem",
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            zIndex: 8,
            backdropFilter: "blur(4px)",
            pointerEvents: "none",
          }}
        >
          {phone.name}
        </div>
      </div>
    </div>
  );
}
