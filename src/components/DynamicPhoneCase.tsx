"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
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
  tiltSide?: "front" | "left" | "right" | "threeQuarter" | "side";
  onTiltChange?: (tilt: "front" | "left" | "right") => void;
  allowClickToTilt?: boolean;
  showModelBadge?: boolean;
  customOverlay?: React.ReactNode;
  useGlassMockupOverlay?: boolean;
  artworkFit?: "cover" | "contain";
  artworkPosition?: string;
  artworkScale?: number;
  artworkOffsetX?: number;
  artworkOffsetY?: number;
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
  tiltSide,
  onTiltChange,
  allowClickToTilt = false,
  showModelBadge = true,
  customOverlay,
  useGlassMockupOverlay = true,
  artworkFit = "cover",
  artworkPosition = "center",
  artworkScale = 1,
  artworkOffsetX = 0,
  artworkOffsetY = 0,
  style,
  className,
}: DynamicPhoneCaseProps) {
  const { selectedModel: globalModel } = useDevice();
  const activeModelName = phoneModel || globalModel;
  const phone = getPhoneModelDetails(activeModelName);

  const [isHovered, setIsHovered] = useState(false);
  const [internalTilt, setInternalTilt] = useState<"front" | "left" | "right">("front");

  // Continuous mouse-drag rotation state
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const [dragRotY, setDragRotY] = useState(0);
  const [dragRotX, setDragRotX] = useState(0);
  const animFrameId = useRef<number | null>(null);
  const targetRotY = useRef(0);
  const targetRotX = useRef(0);
  const currentRotY = useRef(0);
  const currentRotX = useRef(0);

  // Lerp animation loop for smooth spring-back
  const startAnimLoop = useCallback(() => {
    const loop = () => {
      currentRotY.current += (targetRotY.current - currentRotY.current) * 0.14;
      currentRotX.current += (targetRotX.current - currentRotX.current) * 0.14;
      setDragRotY(currentRotY.current);
      setDragRotX(currentRotX.current);
      const stillMoving =
        Math.abs(targetRotY.current - currentRotY.current) > 0.05 ||
        Math.abs(targetRotX.current - currentRotX.current) > 0.05;
      if (stillMoving) {
        animFrameId.current = requestAnimationFrame(loop);
      } else {
        animFrameId.current = null;
      }
    };
    if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    animFrameId.current = requestAnimationFrame(loop);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!interactive) return;
    isDragging.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
    e.preventDefault();
  }, [interactive]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      lastMouse.current = { x: e.clientX, y: e.clientY };
      // Clamp rotation to safe, realistic 3D angles so the back of the case remains the primary surface
      targetRotY.current = Math.max(-24, Math.min(24, targetRotY.current + dx * 0.38));
      targetRotX.current = Math.max(-14, Math.min(14, targetRotX.current - dy * 0.25));
      startAnimLoop();
    };
    const onMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      targetRotY.current = 0;
      targetRotX.current = 0;
      startAnimLoop();
      const absY = Math.abs(currentRotY.current);
      if (absY > 8) {
        const side = currentRotY.current < 0 ? "left" : "right";
        setInternalTilt(side);
        onTiltChange?.(side);
      } else {
        setInternalTilt("front");
        onTiltChange?.("front");
      }
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [startAnimLoop, onTiltChange]);

  useEffect(() => {
    if (tiltSide === undefined) return;
    // Elegant, photorealistic perspective view angles
    if (tiltSide === "threeQuarter" || tiltSide === "left") {
      targetRotY.current = -14;
      targetRotX.current = 4;
    } else if (tiltSide === "side" || tiltSide === "right") {
      targetRotY.current = -22;
      targetRotX.current = 2;
    } else {
      targetRotY.current = 0;
      targetRotX.current = 0;
    }
    startAnimLoop();
  }, [tiltSide, startAnimLoop]);

  const currentTilt: "front" | "left" | "right" | "threeQuarter" | "side" =
    tiltSide !== undefined
      ? tiltSide
      : dragRotY < -12
      ? "left"
      : dragRotY > 12
      ? "right"
      : "front";

  const handleCaseClick = (e: React.MouseEvent) => {
    if (!allowClickToTilt && tiltSide === undefined && onTiltChange === undefined) return;
    if (Math.abs(dragRotY) > 3 || Math.abs(dragRotX) > 3) return;
    e.stopPropagation();
    const nextTilt = currentTilt === "front" ? "left" : "front";
    if (tiltSide === undefined) {
      setInternalTilt(nextTilt);
    }
    onTiltChange?.(nextTilt);
  };

  const cornerRadius =
    phone.corners === "sharp"
      ? "12px"
      : phone.corners === "extra-rounded"
      ? "44px"
      : "38px";

  const isMagSafe =
    showMagSafe !== undefined
      ? showMagSafe
      : caseType.toLowerCase().includes("magsafe");

  // Photorealistic 9H Glass Case Mockup Overlay
  // Uses authentic transparent PNG frame when available
  const isGlassMockupAvailable =
    useGlassMockupOverlay !== false &&
    (phone.cameraType === "iphone-triple" ||
      phone.cameraType === "iphone-dual-diag" ||
      phone.cameraType === "iphone-dual-vert" ||
      phone.cameraType === "iphone-plateau" ||
      phone.cameraType === "samsung-ultra" ||
      phone.cameraType === "samsung-triple" ||
      phone.cameraType === "oneplus-dial");

  const glassOverlaySrc =
    phone.cameraType === "iphone-plateau"
      ? "/mockups/glass_case_iphone_18_white.png"
      : phone.cameraType === "iphone-triple"
      ? "/mockups/glass_case_iphone_pro.png"
      : phone.cameraType === "iphone-dual-diag"
      ? "/mockups/glass_case_iphone_dual.png"
      : phone.cameraType === "iphone-dual-vert"
      ? "/mockups/glass_case_iphone_16.png"
      : phone.cameraType === "samsung-ultra"
      ? "/mockups/glass_case_samsung_ultra.png"
      : phone.cameraType === "samsung-triple"
      ? "/mockups/glass_case_samsung_triple.png"
      : phone.cameraType === "oneplus-dial"
      ? "/mockups/glass_case_oneplus.png"
      : "/mockups/glass_case_iphone_pro.png";

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

      // ================= 10. APPLE IPHONE 17 / 18 (Horizontal Camera Plateau / Visor) =================
      // ================= 10. APPLE IPHONE 17 / 18 (Large Rectangular Plateau Cutout) =================
      case "iphone-plateau":
        return (
          <div
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              right: "12px",
              height: "82px",
              borderRadius: "16px",
              backgroundColor: "transparent",
              border: lensProtectorAddon ? "3px solid #22c55e" : "3.5px solid #18181b",
              boxShadow: "0 6px 16px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.18)",
              zIndex: 10,
              pointerEvents: "none",
            }}
          />
        );

      // ================= 10. APPLE IPHONE PRO TRIPLE (Default) =================
      case "iphone-triple":
      default:
        return (
          <div
            style={{
              position: "absolute",
              top: "14px",
              left: "14px",
              width: "72px",
              height: "78px",
              borderRadius: "20px",
              backgroundColor: "rgba(28, 30, 36, 0.75)",
              backdropFilter: "blur(8px)",
              border: lensProtectorAddon ? "2px solid #22c55e" : "1.5px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 6px 18px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.12)",
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
                width: "25px",
                height: "25px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #4b5563 0%, #1f2937 50%, #111827 100%)",
                border: "1.5px solid #6b7280",
                boxShadow: "0 2px 6px rgba(0,0,0,0.8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle at 35% 35%, #1e293b 0%, #030712 75%)",
                  border: "1px solid #0f172a",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "3px",
                    left: "3px",
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.85)",
                  }}
                />
              </div>
            </div>

            {/* Bottom-Left Lens */}
            <div
              style={{
                position: "absolute",
                bottom: "8px",
                left: "8px",
                width: "25px",
                height: "25px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #4b5563 0%, #1f2937 50%, #111827 100%)",
                border: "1.5px solid #6b7280",
                boxShadow: "0 2px 6px rgba(0,0,0,0.8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle at 35% 35%, #1e293b 0%, #030712 75%)",
                  border: "1px solid #0f172a",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "3px",
                    left: "3px",
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.85)",
                  }}
                />
              </div>
            </div>

            {/* Right-Middle Lens */}
            <div
              style={{
                position: "absolute",
                top: "26px",
                right: "8px",
                width: "25px",
                height: "25px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #4b5563 0%, #1f2937 50%, #111827 100%)",
                border: "1.5px solid #6b7280",
                boxShadow: "0 2px 6px rgba(0,0,0,0.8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle at 35% 35%, #1e293b 0%, #030712 75%)",
                  border: "1px solid #0f172a",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "3px",
                    left: "3px",
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.85)",
                  }}
                />
              </div>
            </div>

            {/* Top-Right Flash */}
            <div
              style={{
                position: "absolute",
                top: "10px",
                right: "13px",
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "radial-gradient(circle, #fef08a 0%, #facc15 60%, #eab308 100%)",
                border: "1px solid rgba(255,255,255,0.4)",
                boxShadow: "0 0 6px rgba(250, 204, 21, 0.4)",
              }}
            />

            {/* Bottom-Right LiDAR Scanner */}
            <div
              style={{
                position: "absolute",
                bottom: "12px",
                right: "14px",
                width: "9px",
                height: "9px",
                borderRadius: "50%",
                backgroundColor: "#030712",
                border: "1px solid #374151",
              }}
            />
          </div>
        );
    }
  };

  // ── Build transform from continuous drag rotation values ─────────────────
  const isDraggingNow = isDragging.current;
  const hasDragRotation = Math.abs(dragRotY) > 0.5 || Math.abs(dragRotX) > 0.5;

  // Subtle specular shift based on rotation angle
  const normalizedY = dragRotY / 60; // -1 to 1
  const normalizedX = dragRotX / 35;

  let currentTransform: string;
  if (hasDragRotation) {
    const skewZ = dragRotY * 0.06;
    const scale = isDraggingNow ? 1.04 : 1.01;
    currentTransform = `perspective(900px) rotateY(${dragRotY}deg) rotateX(${-dragRotX}deg) rotateZ(${-skewZ}deg) scale(${scale})`;
  } else if (isHovered && interactive) {
    currentTransform = "perspective(900px) translateY(-6px) rotateY(-3deg) rotateX(2deg)";
  } else {
    currentTransform = "none";
  }

  // Dynamic box shadow follows rotation direction
  const shadowXOffset = normalizedY * -18;
  const shadowYOffset = 20 + Math.abs(normalizedX) * 10;
  let currentBoxShadow: string;
  if (hasDragRotation) {
    currentBoxShadow = `${shadowXOffset}px ${shadowYOffset}px 42px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.25), inset ${normalizedY > 0 ? 2 : -2}px 0 4px rgba(255,255,255,0.22)`;
  } else if (isHovered) {
    currentBoxShadow = "0 30px 70px rgba(0,0,0,0.9), inset 0 0 0 1.5px rgba(255,255,255,0.2)";
  } else {
    currentBoxShadow = "0 20px 50px rgba(0,0,0,0.85), inset 0 0 0 1.5px rgba(255,255,255,0.15)";
  }

  // Shadow blob beneath the case
  const shadowSkewX = normalizedY * -4;
  const shadowOffsetX = normalizedY * -18;
  let shadowTransform: string;
  if (hasDragRotation) {
    shadowTransform = `translateX(${shadowOffsetX}px) translateY(24px) rotate(${shadowSkewX}deg) scale(0.92)`;
  } else if (isHovered) {
    shadowTransform = "translateY(16px) scale(0.96)";
  } else {
    shadowTransform = "translateY(10px) scale(0.92)";
  }

  return (
    <div
      className={`dynamic-phone-case ${className || ""}`}
      onClick={handleCaseClick}
      onMouseDown={interactive ? handleMouseDown : undefined}
      title={interactive ? "Click and drag to rotate 3D view" : undefined}
      style={{
        position: "relative",
        width: `${width}px`,
        height: `${height}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: isDragging.current ? "grabbing" : interactive ? "grab" : undefined,
        userSelect: "none",
        ...style,
      }}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => { if (interactive) { setIsHovered(false); } }}
    >
      {/* Dynamic Drop Shadow beneath Phone Case */}
      <div
        style={{
          position: "absolute",
          inset: "8px",
          borderRadius: cornerRadius,
          background: currentTilt !== "front" 
            ? "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.15) 55%, transparent 75%)" 
            : "rgba(0, 0, 0, 0.5)",
          filter: "blur(12px)",
          transform: shadowTransform,
          transition: "transform 0.4s cubic-bezier(0.2, 0.9, 0.3, 1)",
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
          borderRadius: phone.corners === "sharp" ? "16px" : cornerRadius,
          backgroundColor: "#121214",
          border: hasDragRotation ? "6px solid #282832" : "6px solid #1a1a22",
          outline: "1px solid rgba(255, 255, 255, 0.14)",
          boxShadow: `
            ${currentBoxShadow},
            inset 0 7px 12px -2px rgba(0, 0, 0, 0.9),
            inset 0 -5px 10px -2px rgba(0, 0, 0, 0.7),
            inset 6px 0 10px -2px rgba(0, 0, 0, 0.8),
            inset -6px 0 10px -2px rgba(0, 0, 0, 0.8),
            inset 0 0 24px rgba(0, 0, 0, 0.7),
            inset 0 0 0 1.5px rgba(255, 255, 255, 0.16)
          `,
          overflow: "hidden",
          transform: currentTransform,
          // Only use CSS transition when NOT actively dragging (for spring-back)
          transition: isDragging.current
            ? "none"
            : "transform 0.05s linear, box-shadow 0.25s ease, border-color 0.2s ease",
          zIndex: 1,
        }}
      >
        {/* Inward Recessed Bumper Wall Depth (Tray Ambient Occlusion) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            boxShadow: `
              inset 0 7px 12px -2px rgba(0, 0, 0, 0.9),
              inset 0 -5px 10px -2px rgba(0, 0, 0, 0.7),
              inset 6px 0 10px -2px rgba(0, 0, 0, 0.8),
              inset -6px 0 10px -2px rgba(0, 0, 0, 0.8),
              inset 0 0 24px rgba(0, 0, 0, 0.65),
              inset 0 0 0 1.5px rgba(255, 255, 255, 0.14)
            `,
            pointerEvents: "none",
            zIndex: 12,
          }}
        />

        {/* Full-bleed Case Artwork with Zoom / Scale and Position Offsets */}
        <div
          style={{
            position: "absolute",
            inset: "-3px",
            transform: `scale(${Math.max(1.04, artworkScale || 1)}) translate(${artworkOffsetX}%, ${artworkOffsetY}%)`,
            transformOrigin: "center center",
            transition: "transform 0.12s cubic-bezier(0.2, 0.9, 0.3, 1)",
          }}
        >
          <Image
            src={artworkUrl || "/mockups/akira.jpg"}
            alt={phone.name}
            fill
            sizes={`${width}px`}
            style={{ objectFit: artworkFit, objectPosition: artworkPosition }}
            unoptimized
            priority
          />
        </div>

        {/* Dynamic Camera Cutout or Photorealistic 9H Glass Frame Overlay */}
        {isGlassMockupAvailable ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 10,
              pointerEvents: "none",
            }}
          >
            <Image
              src={glassOverlaySrc}
              alt="Photorealistic 9H Glass Case Frame"
              fill
              sizes={`${width}px`}
              style={{ objectFit: "fill" }}
              priority
              unoptimized
            />
          </div>
        ) : (
          renderCameraCutout(phone.cameraType)
        )}

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



        {/* Continuous Specular Reflection — follows drag rotation */}
        {hasDragRotation && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(${90 + dragRotY * 0.8}deg, transparent 28%, rgba(255,255,255,${Math.min(0.38, 0.08 + Math.abs(normalizedY) * 0.3)}) 44%, rgba(255,255,255,0.05) 52%, transparent 66%)`,
              pointerEvents: "none",
              zIndex: 14,
            }}
          />
        )}

        {/* Dynamic Model Pill Badge on Bottom Frame (hidden when tilted or disabled for clean look) */}
        {showModelBadge && currentTilt === "front" && (
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
        )}
      </div>
    </div>
  );
}
