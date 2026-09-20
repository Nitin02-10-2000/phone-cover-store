"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import * as THREE from "three";
import { getPhoneModelDetails, CameraArchetype } from "@/data/phoneModels";

interface PhoneCase3DProps {
  artworkUrl?: string;
  templateUrl?: string;
  phoneModel?: string;
  caseType?: string;
  caseColor?: string;
  layout?: string;
  customText?: string;
  textColor?: string;
  selectedFont?: string;
  activeSticker?: string | null;
  artworkScale?: number;
  artworkOffsetX?: number;
  artworkOffsetY?: number;
  artworkRotation?: number;
  filterStyle?: string;
  width?: number;
  height?: number;
  rotY?: number;
  rotX?: number;
  onRotate?: (y: number, x: number) => void;
  hideControls?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

type ViewPreset = "hero" | "back" | "hollow" | "side";

// Preset Angles: Corrected so the printed back faces the camera with camera cutout on the TOP-LEFT
const PRESETS: Record<ViewPreset, { rotY: number; rotX: number; zoom: number }> = {
  hero: { rotY: 0.35, rotX: -0.08, zoom: 0.96 },     // 3/4 beauty view: Camera in top-left, text unmirrored, 3D side wrap
  back: { rotY: 0, rotX: 0, zoom: 0.96 },             // Pure straight-on rear print view
  hollow: { rotY: Math.PI - 0.40, rotX: 0.12, zoom: 0.96 }, // Rotates 180° into the hollow interior cavity (Image 1)
  side: { rotY: -1.57, rotX: 0, zoom: 0.96 },         // Side profile view
};

interface LayoutItemConfig {
  x: number;
  y: number;
  z: number;
  rotX?: number;
  rotY?: number;
  rotZ?: number;
  scale?: number;
}

export const LAYOUT_CONFIGS: Record<
  string,
  { cameraZ: number; defaultRot: { rotY: number; rotX: number }; items: LayoutItemConfig[] }
> = {
  "solo": {
    cameraZ: 20.5,
    defaultRot: { rotY: 0.35, rotX: -0.08 },
    items: [{ x: 0, y: 0, z: 0 }],
  },
  "duo-standing": {
    cameraZ: 22.0,
    defaultRot: { rotY: 0, rotX: 0 },
    items: [
      { x: -2.2, y: 0, z: 0, rotY: Math.PI },
      { x: 2.2, y: 0, z: 0, rotY: 0 },
    ],
  },
  "duo-overlap": {
    cameraZ: 22.0,
    defaultRot: { rotY: 0, rotX: 0 },
    items: [
      { x: -1.7, y: 0.25, z: -1.2, rotY: -0.2 },
      { x: 1.5, y: -0.25, z: 0.8, rotY: 0.15 },
    ],
  },
  "duo-floating": {
    cameraZ: 23.0,
    defaultRot: { rotY: 0, rotX: 0 },
    items: [
      { x: -2.3, y: 1.2, z: -0.8, rotX: 0.35, rotY: 0.45, rotZ: -0.3 },
      { x: 1.9, y: -1.0, z: 0.6, rotX: -0.3, rotY: -0.35, rotZ: 0.25 },
    ],
  },
  "isometric-duo": {
    cameraZ: 22.5,
    defaultRot: { rotY: 0, rotX: 0 },
    items: [
      { x: -2.4, y: -1.3, z: 0.5, rotX: 1.2, rotY: 0.05, rotZ: -0.7 },
      { x: 1.8, y: 0.5, z: -0.5, rotX: -0.08, rotY: 0.3, rotZ: 0 },
    ],
  },
  "flat-duo": {
    cameraZ: 22.5,
    defaultRot: { rotY: 0, rotX: 0 },
    items: [
      { x: -2.2, y: -0.6, z: -0.5, rotX: 1.25, rotY: 0.1, rotZ: -0.45 },
      { x: 2.0, y: -0.6, z: 0.6, rotX: 1.25, rotY: -0.1, rotZ: 0.45 },
    ],
  },
  "dynamic-duo": {
    cameraZ: 22.0,
    defaultRot: { rotY: 0, rotX: 0 },
    items: [
      { x: -1.8, y: 0.3, z: -0.6, rotX: 0.15, rotY: 0.45, rotZ: -0.22 },
      { x: 1.8, y: -0.2, z: 0.6, rotX: -0.12, rotY: -0.4, rotZ: 0.22 },
    ],
  },
  "trio-lineup": {
    cameraZ: 24.0,
    defaultRot: { rotY: 0, rotX: 0 },
    items: [
      { x: -3.8, y: 0, z: -0.3, rotY: 0.15 },
      { x: 0, y: 0, z: 0, rotY: 0 },
      { x: 3.8, y: 0, z: -0.3, rotY: -0.15 },
    ],
  },
  "trio-pyramid": {
    cameraZ: 24.0,
    defaultRot: { rotY: 0, rotX: 0 },
    items: [
      { x: -3.0, y: 0.3, z: -1.2, rotY: 0.25 },
      { x: 0, y: -0.3, z: 1.0, rotY: 0 },
      { x: 3.0, y: 0.3, z: -1.2, rotY: -0.25 },
    ],
  },
  "fan-4": {
    cameraZ: 24.5,
    defaultRot: { rotY: 0, rotX: 0 },
    items: [
      { x: -4.3, y: -0.65, z: -0.9, rotX: 0.05, rotY: -0.15, rotZ: 0.44 },
      { x: -1.45, y: -0.05, z: -0.3, rotX: 0.05, rotY: -0.05, rotZ: 0.16 },
      { x: 1.45, y: -0.05, z: 0.3, rotX: 0.05, rotY: 0.05, rotZ: -0.14 },
      { x: 4.3, y: -0.65, z: 0.9, rotX: 0.05, rotY: 0.15, rotZ: -0.42 },
    ],
  },
  "lineup-5": {
    cameraZ: 27.5,
    defaultRot: { rotY: 0, rotX: 0 },
    items: [
      { x: -6.4, y: 0, z: -0.6, rotY: 0.25 },
      { x: -3.2, y: 0, z: -0.2, rotY: 0.12 },
      { x: 0, y: 0, z: 0.1, rotY: 0 },
      { x: 3.2, y: 0, z: -0.2, rotY: -0.12 },
      { x: 6.4, y: 0, z: -0.6, rotY: -0.25 },
    ],
  },
  "grid-matrix": {
    cameraZ: 28.0,
    defaultRot: { rotY: 0, rotX: 0 },
    items: [
      { x: -4.2, y: 2.2, z: -3.0, rotX: 1.1, rotY: 0.1, rotZ: -0.45 },
      { x: 0.0, y: 2.2, z: -3.0, rotX: 1.1, rotY: 0.1, rotZ: -0.45 },
      { x: 4.2, y: 2.2, z: -3.0, rotX: 1.1, rotY: 0.1, rotZ: -0.45 },
      { x: -4.2, y: -1.8, z: 1.5, rotX: 1.1, rotY: 0.1, rotZ: -0.45 },
      { x: 0.0, y: -1.8, z: 1.5, rotX: 1.1, rotY: 0.1, rotZ: -0.45 },
      { x: 4.2, y: -1.8, z: 1.5, rotX: 1.1, rotY: 0.1, rotZ: -0.45 },
    ],
  },
};

const MIN_ROT_X = -0.65;
const MAX_ROT_X = 0.65;
const MIN_ZOOM = 0.72;
const MAX_ZOOM = 1.45;

function isColorDark(hexColor?: string): boolean {
  if (!hexColor) return false;
  let hex = hexColor.replace("#", "").trim();
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) return false;
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 145;
}

/**
 * Helper: Detect iPhone 16 or newer models that feature the Apple Camera Control capacitive button
 */
function isIPhone16OrAbove(model: string): boolean {
  if (!model) return false;
  const m = model.toLowerCase();
  const numMatch = m.match(/iphone\s*(\d+)/i) || m.match(/(\d+)/);
  if (numMatch) {
    const ver = parseInt(numMatch[1], 10);
    return ver >= 16;
  }
  return m.includes("16") || m.includes("17") || m.includes("18");
}

/**
 * Helper: Draw Counter-Clockwise Rounded Rectangle (Outer Shells)
 * Supports Apple Camera Control cutout notch for iPhone 16+ models on the right rail
 */
function drawRoundedRectCCW(
  path: THREE.Shape | THREE.Path,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  withCameraControlCutout = false
) {
  const radius = Math.min(r, w / 2, h / 2);
  path.moveTo(x + radius, y);
  path.lineTo(x + w - radius, y);
  path.quadraticCurveTo(x + w, y, x + w, y + radius);

  if (withCameraControlCutout) {
    // Apple iPhone 16+ Camera Control ergonomic recessed cutout notch on the right rail
    // Centered at y = -0.95, smooth scooped chamfer
    const notchBottom = -1.41;
    const notchTop = -0.49;
    const notchDepth = 0.048;
    const notchR = 0.08;

    path.lineTo(x + w, notchBottom - notchR);
    path.quadraticCurveTo(x + w, notchBottom, x + w - notchDepth, notchBottom);
    path.lineTo(x + w - notchDepth, notchTop);
    path.quadraticCurveTo(x + w, notchTop, x + w, notchTop + notchR);
    path.lineTo(x + w, y + h - radius);
  } else {
    path.lineTo(x + w, y + h - radius);
  }

  path.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  path.lineTo(x + radius, y + h);
  path.quadraticCurveTo(x, y + h, x, y + h - radius);
  path.lineTo(x, y + radius);
  path.quadraticCurveTo(x, y, x + radius, y);
}

/**
 * Helper: Draw Clockwise Rounded Rectangle (Inner Holes - opposite winding ensures true through-hole cutout)
 */
function drawRoundedRectCW(
  path: THREE.Path,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  path.moveTo(x + radius, y + h);
  path.lineTo(x + w - radius, y + h);
  path.quadraticCurveTo(x + w, y + h, x + w, y + h - radius);
  path.lineTo(x + w, y + radius);
  path.quadraticCurveTo(x + w, y, x + w - radius, y);
  path.lineTo(x + radius, y);
  path.quadraticCurveTo(x, y, x, y + radius);
  path.lineTo(x, y + h - radius);
  path.quadraticCurveTo(x, y + h, x + radius, y + h);
}

/**
 * Creates through-hole camera cutout paths matching phone archetypes
 * Positioned in the TOP-LEFT of the phone back (negative X, positive Y)
 */
function createCameraHolePaths(archetype: CameraArchetype): THREE.Path[] {
  const paths: THREE.Path[] = [];

  switch (archetype) {
    case "iphone-triple": {
      // iPhone Pro squircle camera cutout (Top-Left)
      const hole = new THREE.Path();
      const w = 1.48, h = 1.58, r = 0.40;
      const x = -1.50, y = 1.82;
      drawRoundedRectCW(hole, x, y, w, h, r);
      paths.push(hole);
      break;
    }
    case "iphone-dual-vert": {
      // Authentic Apple iPhone 16 vertical camera pill (stadium shape with perfectly semicircular caps)
      const pillHole = new THREE.Path();
      const w = 0.86, h = 1.96, r = 0.43; // r = w/2 ensures true pill/capsule curve
      const x = -1.48, y = 1.40;
      drawRoundedRectCW(pillHole, x, y, w, h, r);
      paths.push(pillHole);

      // Clean circular flash through-hole to the right of the upper lens (matching real Apple iPhone 16 cases)
      const flashHole = new THREE.Path();
      flashHole.absarc(-0.36, 2.45, 0.13, 0, Math.PI * 2, true);
      paths.push(flashHole);
      break;
    }
    case "iphone-dual-diag": {
      // iPhone 15 / 14 / 13 diagonal dual camera squircle
      const hole = new THREE.Path();
      const w = 1.35, h = 1.35, r = 0.38;
      const x = -1.50, y = 1.95;
      drawRoundedRectCW(hole, x, y, w, h, r);
      paths.push(hole);
      break;
    }
    case "samsung-triple": {
      // Samsung Galaxy S24/S23/A54 cutout (Top-Left vertical pill with flash notch)
      const hole = new THREE.Path();
      const w = 0.98, h = 2.45, r = 0.38;
      const x = -1.50, y = 1.15;
      drawRoundedRectCW(hole, x, y, w, h, r);
      paths.push(hole);
      break;
    }
    case "samsung-ultra": {
      // Samsung S24 Ultra sensor matrix cutout (Top-Left)
      const hole = new THREE.Path();
      const w = 1.40, h = 2.55, r = 0.28;
      const x = -1.50, y = 1.15;
      drawRoundedRectCW(hole, x, y, w, h, r);
      paths.push(hole);
      break;
    }
    case "pixel-visor": {
      // Google Pixel horizontal visor cutout
      const hole = new THREE.Path();
      const w = 3.3, h = 0.72, r = 0.24;
      const x = -1.65, y = 2.2;
      drawRoundedRectCW(hole, x, y, w, h, r);
      paths.push(hole);
      break;
    }
    case "oneplus-dial": {
      // OnePlus circular dial cutout (drawn clockwise)
      const hole = new THREE.Path();
      const radius = 0.88;
      const cx = -0.68, cy = 2.22;
      hole.absarc(cx, cy, radius, 0, Math.PI * 2, true);
      paths.push(hole);
      break;
    }
    default: {
      const hole = new THREE.Path();
      const w = 0.86, h = 1.96, r = 0.43;
      const x = -1.48, y = 1.40;
      drawRoundedRectCW(hole, x, y, w, h, r);
      paths.push(hole);
      break;
    }
  }

  return paths;
}

/**
 * Creates soft radial contact ground shadow
 */
function createContactShadowTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const cx = size / 2;
    const cy = size / 2;
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, cx * 0.9);
    gradient.addColorStop(0, "rgba(0, 0, 0, 0.45)");
    gradient.addColorStop(0.25, "rgba(0, 0, 0, 0.28)");
    gradient.addColorStop(0.55, "rgba(0, 0, 0, 0.10)");
    gradient.addColorStop(0.85, "rgba(0, 0, 0, 0.02)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function PhoneCase3D({
  artworkUrl,
  templateUrl,
  phoneModel = "iPhone 16 Pro Max",
  caseType = "9H Tempered Glass",
  caseColor = "#ffffff",
  layout = "solo",
  customText,
  textColor = "#ffffff",
  selectedFont = "sans-serif",
  activeSticker,
  artworkScale = 1,
  artworkOffsetX = 0,
  artworkOffsetY = 0,
  artworkRotation = 0,
  filterStyle = "none",
  width = 360,
  height = 620,
  rotY: externalRotY,
  rotX: externalRotX,
  onRotate,
  hideControls = false,
  className,
  style,
}: PhoneCase3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);

  const phoneDetails = React.useMemo(() => getPhoneModelDetails(phoneModel), [phoneModel]);
  // Default to HERO angle: Camera on top-left, artwork right-side up, 3D side wrap visible
  const [activePreset, setActivePreset] = useState<ViewPreset>("hero");
  const [isAutoSpinning, setIsAutoSpinning] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  // Three.js scene refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rootGroupRef = useRef<THREE.Group | null>(null);
  const wrapMatRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const animIdRef = useRef<number | null>(null);
  const shadowMeshRef = useRef<THREE.Mesh | null>(null);

  // Continuous physics / lerp state
  const targetRotY = useRef(PRESETS.hero.rotY);
  const targetRotX = useRef(PRESETS.hero.rotX);
  const currentRotY = useRef(PRESETS.hero.rotY);
  const currentRotX = useRef(PRESETS.hero.rotX);
  const currentZoom = useRef(PRESETS.hero.zoom);
  const targetZoom = useRef(PRESETS.hero.zoom);

  const isPointerDown = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  const onRotateRef = useRef(onRotate);
  useEffect(() => {
    onRotateRef.current = onRotate;
  }, [onRotate]);

  // Handle external rotation props
  useEffect(() => {
    if (externalRotY !== undefined) {
      const radY = Math.abs(externalRotY) > 3 ? (externalRotY * Math.PI) / 180 : externalRotY;
      targetRotY.current = radY;
    }
  }, [externalRotY]);

  useEffect(() => {
    if (externalRotX !== undefined) {
      const radX = Math.abs(externalRotX) > 3 ? (externalRotX * Math.PI) / 180 : externalRotX;
      targetRotX.current = Math.max(MIN_ROT_X, Math.min(MAX_ROT_X, radX));
    }
  }, [externalRotX]);

  // Apply Preset
  const setPreset = useCallback((preset: ViewPreset) => {
    setIsAutoSpinning(false);
    setActivePreset(preset);
    const p = PRESETS[preset];
    targetRotY.current = p.rotY;
    targetRotX.current = p.rotX;
    targetZoom.current = p.zoom;
  }, []);

  const toggleAutoSpin = useCallback(() => {
    setIsAutoSpinning((prev) => !prev);
  }, []);

  // ── Composite Artwork Full-Wrap Sublimation Texture ────────────────────────
  const updateWrapTexture = useCallback(() => {
    if (!wrapMatRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 2048;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Helper: Draw Pacdora Signature Placeholder Pattern (used when no user photo is uploaded yet)
    const drawPlaceholderPattern = () => {
      const activeBg = caseColor || "#ffffff";
      const isDark = isColorDark(activeBg);

      ctx.fillStyle = activeBg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Delicate diagonal watermark grid lines
      ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)";
      ctx.lineWidth = 2;
      const step = 110;
      for (let x = -canvas.height; x < canvas.width + canvas.height; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + canvas.height, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x, canvas.height);
        ctx.lineTo(x + canvas.height, 0);
        ctx.stroke();
      }

      // Watermark text in diamond intersections
      ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.14)" : "rgba(0, 0, 0, 0.09)";
      ctx.font = "600 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
      ctx.textAlign = "center";
      for (let y = 180; y < canvas.height - 100; y += 220) {
        for (let x = 120; x < canvas.width; x += 220) {
          ctx.fillText("casetadka", x, y);
        }
      }

      // Exact Centered Callout Text (from user's screenshot!)
      ctx.save();
      ctx.fillStyle = isDark ? "#f8fafc" : "#1e2026";
      ctx.font = "600 48px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Upload your images", canvas.width / 2, canvas.height * 0.53);
      ctx.fillStyle = isDark ? "#cbd5e1" : "#4b5563";
      ctx.font = "500 38px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillText("341 × 640 px", canvas.width / 2, canvas.height * 0.53 + 54);
      ctx.restore();
    };

    const applyTextureToMaterial = () => {
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;

      if (wrapMatRef.current) {
        if (wrapMatRef.current.map) {
          wrapMatRef.current.map.dispose();
        }
        wrapMatRef.current.map = texture;
        wrapMatRef.current.needsUpdate = true;
      }
    };

    if (artworkUrl && artworkUrl.trim()) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        ctx.fillStyle = caseColor || "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        if (filterStyle && filterStyle !== "none") {
          ctx.filter = filterStyle;
        }

        const cx = canvas.width / 2 + (artworkOffsetX || 0) * 2.2;
        const cy = canvas.height / 2 + (artworkOffsetY || 0) * 2.2;
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

        // Custom Text
        if (customText && customText.trim()) {
          ctx.save();
          ctx.font = `900 ${canvas.width * 0.065}px ${selectedFont || "sans-serif"}`;
          ctx.fillStyle = textColor || "#ffffff";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
          ctx.shadowBlur = 18;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 4;
          ctx.fillText(customText.toUpperCase(), canvas.width / 2, canvas.height * 0.82);
          ctx.restore();
        }

        // Active Sticker
        if (activeSticker) {
          ctx.save();
          ctx.fillStyle = "#dc2626";
          ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
          ctx.shadowBlur = 12;
          const badgeW = canvas.width * 0.28;
          const badgeH = canvas.height * 0.038;
          const badgeX = canvas.width * 0.76 - badgeW / 2;
          const badgeY = canvas.height * 0.18;
          ctx.fillRect(badgeX, badgeY, badgeW, badgeH);
          ctx.fillStyle = "#ffffff";
          ctx.font = `900 ${canvas.width * 0.028}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(activeSticker, badgeX + badgeW / 2, badgeY + badgeH / 2);
          ctx.restore();
        }

        // MagSafe Alignment Ring
        if (caseType.toLowerCase().includes("magsafe")) {
          ctx.save();
          ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
          ctx.lineWidth = 14;
          ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
          ctx.shadowBlur = 8;
          const ringRadius = canvas.width * 0.28;
          ctx.beginPath();
          ctx.arc(canvas.width / 2, canvas.height * 0.48, ringRadius, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
          ctx.fillRect(canvas.width / 2 - 8, canvas.height * 0.48 + ringRadius + 22, 16, 68);
          ctx.restore();
        }

        applyTextureToMaterial();
      };

      img.onerror = () => {
        drawPlaceholderPattern();
        applyTextureToMaterial();
      };

      img.src = artworkUrl;
    } else {
      drawPlaceholderPattern();
      applyTextureToMaterial();
    }
  }, [artworkUrl, caseColor, customText, textColor, selectedFont, activeSticker, artworkScale, artworkOffsetX, artworkOffsetY, artworkRotation, filterStyle, caseType]);

  // ── Build True Hollow 3D Phone Case with Wrap Geometry ────────────────────
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const w = mount.clientWidth || width;
    const h = mount.clientHeight || height;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera: 26° FOV for clean product studio framing
    const activeLayoutConfig = LAYOUT_CONFIGS[layout || "solo"] || LAYOUT_CONFIGS["solo"];
    const camera = new THREE.PerspectiveCamera(26, w / h, 0.1, 100);
    camera.position.set(0, 0, activeLayoutConfig.cameraZ);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Apply layout-specific default rotations
    targetRotY.current = activeLayoutConfig.defaultRot.rotY;
    targetRotX.current = activeLayoutConfig.defaultRot.rotX;
    currentRotY.current = activeLayoutConfig.defaultRot.rotY;
    currentRotX.current = activeLayoutConfig.defaultRot.rotX;

    // 3. WebGL Renderer with ACES Tone Mapping
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.innerHTML = "";
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Bright Studio Lighting Environment
    const keyLight = new THREE.DirectionalLight(0xfffbf5, 2.6);
    keyLight.position.set(5.5, 7.0, 8.0);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf0f5ff, 1.8);
    fillLight.position.set(-6.0, 3.0, 7.0);
    scene.add(fillLight);

    const backCavityLight = new THREE.DirectionalLight(0xffffff, 2.0);
    backCavityLight.position.set(0, 1.5, -12.0);
    scene.add(backCavityLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 2.2);
    rimLight.position.set(3.0, -5.0, 7.0);
    scene.add(rimLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    // 5. Ground Contact Shadows
    const shadowTex = createContactShadowTexture();
    const shadowGeo = new THREE.PlaneGeometry(5.8, 2.8);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.36,
      depthWrite: false,
    });
    const shadowGroup = new THREE.Group();
    activeLayoutConfig.items.forEach((item) => {
      const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
      shadowMesh.rotation.x = -Math.PI / 2;
      shadowMesh.position.set(item.x, -4.35, item.z);
      shadowMesh.scale.set(0.95, 0.55, 1);
      shadowGroup.add(shadowMesh);
    });
    scene.add(shadowGroup);
    shadowMeshRef.current = shadowGroup as unknown as THREE.Mesh;

    // 6. Master Product Root Group & Single Case Prototype
    const rootGroup = new THREE.Group();
    rootGroupRef.current = rootGroup;
    scene.add(rootGroup);

    const singleCase = new THREE.Group();

    // ── Dimensions of Hollow Case (Units) ──────────────────────────────────
    const caseW = 3.65;
    const caseH = 7.60;
    const caseD = 0.42; // Depth of the hollow tray
    const wallT = 0.07; // Thickness of the plastic wall
    const cornerR = phoneDetails.corners === "sharp" ? 0.35 : 0.70;

    // ════════════════════════════════════════════════════════════════════════
    // A. OUTER WRAP SHELL (Back Plate + 4 Side Walls with Seamless Wrap UVs)
    // Oriented so the back face with artwork faces +Z (toward the camera).
    // Camera cutout at x < 0 is on the TOP-LEFT!
    // ════════════════════════════════════════════════════════════════════════
    const archetype: CameraArchetype = phoneDetails.cameraType || "iphone-triple";
    const hasCameraControl = isIPhone16OrAbove(phoneModel);

    // 1. Back Plate with Camera Cutout Hole (Facing +Z)
    const backShape = new THREE.Shape();
    drawRoundedRectCCW(backShape, -caseW / 2, -caseH / 2, caseW, caseH, cornerR, hasCameraControl);
    // Cut open the authentic camera through-holes using clockwise winding!
    const camHoles = createCameraHolePaths(archetype);
    camHoles.forEach((h) => backShape.holes.push(h));

    // Back plate extruded from z = 0 backward to z = -wallT
    const backGeo = new THREE.ExtrudeGeometry(backShape, {
      depth: wallT,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.03,
      bevelThickness: 0.03,
    });

    // 2. Extruded Hollow Side Walls (Curving around to the front lip at -caseD)
    const wallShape = new THREE.Shape();
    drawRoundedRectCCW(wallShape, -caseW / 2, -caseH / 2, caseW, caseH, cornerR, hasCameraControl);
    const innerCavityHole = new THREE.Path();
    drawRoundedRectCW(
      innerCavityHole,
      -caseW / 2 + wallT,
      -caseH / 2 + wallT,
      caseW - 2 * wallT,
      caseH - 2 * wallT,
      Math.max(0.12, cornerR - wallT)
    );
    wallShape.holes.push(innerCavityHole);

    const wallGeo = new THREE.ExtrudeGeometry(wallShape, {
      depth: caseD,
      bevelEnabled: true,
      bevelSegments: 6,
      steps: 1,
      bevelSize: 0.035,
      bevelThickness: 0.035,
    });

    // 3. Compute Continuous Full-Wrap UV Mapping (Matching Pacdora Dieline!)
    // Ensures Left is Left, Right is Right, and artwork is unmirrored!
    const totalW = caseW + 2 * caseD;
    const totalH = caseH + 2 * caseD;

    const applyWrapUVs = (geometry: THREE.BufferGeometry, isWall: boolean) => {
      const pos = geometry.attributes.position;
      const count = pos.count;
      const uvs = new Float32Array(count * 2);

      for (let i = 0; i < count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = pos.getZ(i);

        const distFromCenterX = Math.abs(x) / (caseW / 2);
        const distFromCenterY = Math.abs(y) / (caseH / 2);
        const normFactor = Math.max(1, Math.sqrt(distFromCenterX * distFromCenterX + distFromCenterY * distFromCenterY));

        const nx = (x / (caseW / 2)) / normFactor;
        const ny = (y / (caseH / 2)) / normFactor;

        const wrapDistance = isWall ? Math.abs(z) : 0;
        const wrapX = x + nx * wrapDistance;
        const wrapY = y + ny * wrapDistance;

        uvs[i * 2] = (wrapX + totalW / 2) / totalW;
        uvs[i * 2 + 1] = (wrapY + totalH / 2) / totalH;
      }
      geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    };

    applyWrapUVs(backGeo, false);
    applyWrapUVs(wallGeo, true);

    // High-gloss 9H Tempered Glass or Matte Finish
    const isGlass = caseType.toLowerCase().includes("glass") || caseType.toLowerCase().includes("tempered");
    const wrapMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: isGlass ? 0.08 : 0.45,
      metalness: 0.02,
      clearcoat: isGlass ? 1.0 : 0.08,
      clearcoatRoughness: 0.03,
      side: THREE.FrontSide,
    });
    wrapMatRef.current = wrapMat;

    const outerWrapGroup = new THREE.Group();
    const backMesh = new THREE.Mesh(backGeo, wrapMat);
    backMesh.position.z = 0;
    outerWrapGroup.add(backMesh);

    const wallMesh = new THREE.Mesh(wallGeo, wrapMat);
    wallMesh.position.z = -caseD + wallT;
    outerWrapGroup.add(wallMesh);

    singleCase.add(outerWrapGroup);

    // ════════════════════════════════════════════════════════════════════════
    // B. HOLLOW INNER CAVITY (The "Inward Parts" where the phone rests)
    // Clean, bright light-grey satin interior matching Pacdora Image 1!
    // ════════════════════════════════════════════════════════════════════════
    const cavityFloorW = caseW - 2 * wallT;
    const cavityFloorH = caseH - 2 * wallT;
    const cavityFloorR = Math.max(0.12, cornerR - wallT);

    const cavityShape = new THREE.Shape();
    drawRoundedRectCCW(cavityShape, -cavityFloorW / 2, -cavityFloorH / 2, cavityFloorW, cavityFloorH, cavityFloorR);
    const innerCamHoles = createCameraHolePaths(archetype);
    innerCamHoles.forEach((h) => cavityShape.holes.push(h));

    const cavityGeo = new THREE.ShapeGeometry(cavityShape);
    const cavityMat = new THREE.MeshStandardMaterial({
      color: 0xdde0e8, // Clean, bright light grey interior (Image 1)
      roughness: 0.55,
      metalness: 0.04,
      side: THREE.DoubleSide,
    });
    const cavityMesh = new THREE.Mesh(cavityGeo, cavityMat);
    cavityMesh.position.z = -wallT - 0.002;
    singleCase.add(cavityMesh);

    // Inner cavity side walls
    const innerWallShape = new THREE.Shape();
    drawRoundedRectCCW(innerWallShape, -cavityFloorW / 2, -cavityFloorH / 2, cavityFloorW, cavityFloorH, cavityFloorR);
    const innerHoleCavity = new THREE.Path();
    drawRoundedRectCW(
      innerHoleCavity,
      -cavityFloorW / 2 + 0.01,
      -cavityFloorH / 2 + 0.01,
      cavityFloorW - 0.02,
      cavityFloorH - 0.02,
      cavityFloorR
    );
    innerWallShape.holes.push(innerHoleCavity);

    const innerWallGeo = new THREE.ExtrudeGeometry(innerWallShape, {
      depth: caseD - wallT,
      bevelEnabled: false,
    });
    const innerWallMesh = new THREE.Mesh(innerWallGeo, cavityMat);
    innerWallMesh.position.z = -caseD + wallT;
    singleCase.add(innerWallMesh);

    // ════════════════════════════════════════════════════════════════════════
    // D. AUTHENTIC RAISED CAMERA PROTECTION RING (3D Bumper Bezel Lip)
    // Matches Apple iPhone 16 raised camera ring perimeter
    // ════════════════════════════════════════════════════════════════════════
    if (archetype === "iphone-dual-vert") {
      const ringLipT = 0.07;
      const ringH = 0.07;
      const ringShape = new THREE.Shape();
      drawRoundedRectCCW(
        ringShape,
        -1.48 - ringLipT,
        1.40 - ringLipT,
        0.86 + 2 * ringLipT,
        1.96 + 2 * ringLipT,
        0.43 + ringLipT
      );
      const ringHole = new THREE.Path();
      drawRoundedRectCW(ringHole, -1.48, 1.40, 0.86, 1.96, 0.43);
      ringShape.holes.push(ringHole);

      const ringGeo = new THREE.ExtrudeGeometry(ringShape, {
        depth: ringH,
        bevelEnabled: true,
        bevelSegments: 3,
        bevelSize: 0.02,
        bevelThickness: 0.02,
      });

      const ringMat = new THREE.MeshPhysicalMaterial({
        color: 0x18181f,
        roughness: 0.35,
        metalness: 0.35,
        clearcoat: 0.5,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.z = 0.001;
      singleCase.add(ringMesh);

      // Flash ring accent
      const flashRingGeo = new THREE.RingGeometry(0.13, 0.17, 32);
      const flashRingMesh = new THREE.Mesh(flashRingGeo, ringMat);
      flashRingMesh.position.set(-0.36, 2.45, 0.002);
      singleCase.add(flashRingMesh);
    } else if (archetype === "iphone-triple") {
      const ringLipT = 0.07;
      const ringH = 0.07;
      const ringShape = new THREE.Shape();
      drawRoundedRectCCW(
        ringShape,
        -1.50 - ringLipT,
        1.82 - ringLipT,
        1.48 + 2 * ringLipT,
        1.58 + 2 * ringLipT,
        0.40 + ringLipT
      );
      const ringHole = new THREE.Path();
      drawRoundedRectCW(ringHole, -1.50, 1.82, 1.48, 1.58, 0.40);
      ringShape.holes.push(ringHole);

      const ringGeo = new THREE.ExtrudeGeometry(ringShape, {
        depth: ringH,
        bevelEnabled: true,
        bevelSegments: 3,
        bevelSize: 0.02,
        bevelThickness: 0.02,
      });

      const ringMat = new THREE.MeshPhysicalMaterial({
        color: 0x18181f,
        roughness: 0.35,
        metalness: 0.35,
        clearcoat: 0.5,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.z = 0.001;
      singleCase.add(ringMesh);
    }

    // ════════════════════════════════════════════════════════════════════════
    // C. SOLID MOLDED SIDE BUTTONS (Seamless with Case Body - No Hollow Slits)
    // ════════════════════════════════════════════════════════════════════════
    const buttonMat = wrapMat; // Matches seamless case color and material (like Apple Silicone & armor cases)

    // 1. Left Side: Volume & Action Button Bumps (Subtle tactile bumps molded on outer rail)
    const volBtnGeo = new THREE.CapsuleGeometry(0.042, 0.46, 8, 16);
    const volBtn1 = new THREE.Mesh(volBtnGeo, buttonMat);
    volBtn1.position.set(-caseW / 2 - 0.02, 1.45, -caseD * 0.5);
    singleCase.add(volBtn1);

    const volBtn2 = new THREE.Mesh(volBtnGeo, buttonMat);
    volBtn2.position.set(-caseW / 2 - 0.02, 0.75, -caseD * 0.5);
    singleCase.add(volBtn2);

    // Action button bump
    const actionBtnGeo = new THREE.CapsuleGeometry(0.042, 0.24, 8, 16);
    const actionBtn = new THREE.Mesh(actionBtnGeo, buttonMat);
    actionBtn.position.set(-caseW / 2 - 0.02, 2.25, -caseD * 0.5);
    singleCase.add(actionBtn);

    // 2. Right Side: Power Button Bump
    const powerBtnGeo = new THREE.CapsuleGeometry(0.045, 0.65, 8, 16);
    const powerBtn = new THREE.Mesh(powerBtnGeo, buttonMat);
    powerBtn.position.set(caseW / 2 + 0.02, 1.20, -caseD * 0.5);
    singleCase.add(powerBtn);

    // Camera Control (iPhone 16 and above - Authentic Cutout with Exposed Sapphire Capacitive Sensor)
    if (hasCameraControl) {
      const ccGroup = new THREE.Group();
      // Positioned right inside the scooped rail cutout
      ccGroup.position.set(caseW / 2 - 0.046, -0.95, -caseD * 0.5);

      // 1. Titanium Phone Frame exposed through the cutout slot
      const chassisMat = new THREE.MeshPhysicalMaterial({
        color: 0x22242a,
        metalness: 0.85,
        roughness: 0.28,
        clearcoat: 0.2,
      });
      const chassisPlateGeo = new THREE.BoxGeometry(0.016, 0.88, caseD * 0.85);
      const chassisPlate = new THREE.Mesh(chassisPlateGeo, chassisMat);
      ccGroup.add(chassisPlate);

      // 2. Sapphire Crystal Capacitive Touch Button (recessed inside cutout)
      const sapphireMat = new THREE.MeshPhysicalMaterial({
        color: 0x111216,
        roughness: 0.12,
        metalness: 0.45,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
      });
      const sapphireBtnGeo = new THREE.CapsuleGeometry(0.028, 0.62, 8, 16);
      const sapphireBtn = new THREE.Mesh(sapphireBtnGeo, sapphireMat);
      sapphireBtn.position.set(0.012, 0, 0);
      ccGroup.add(sapphireBtn);

      // 3. Capacitive Sensor Hairline Rim
      const sensorBorderMat = new THREE.MeshBasicMaterial({ color: 0x475569 });
      const sensorBorderGeo = new THREE.CapsuleGeometry(0.030, 0.64, 4, 8);
      const sensorBorder = new THREE.Mesh(sensorBorderGeo, sensorBorderMat);
      sensorBorder.position.set(0.010, 0, 0);
      ccGroup.add(sensorBorder);

      singleCase.add(ccGroup);
    }

    const portMat = new THREE.MeshBasicMaterial({ color: 0x27272a });

    // 3. Bottom: USB-C Port Cutout & Speaker Grille Holes
    const usbcGeo = new THREE.CapsuleGeometry(0.06, 0.42, 8, 16);
    usbcGeo.rotateZ(Math.PI / 2);
    const usbcMesh = new THREE.Mesh(usbcGeo, portMat);
    usbcMesh.position.set(0, -caseH / 2 + 0.02, -caseD * 0.5);
    singleCase.add(usbcMesh);

    for (let i = 0; i < 4; i++) {
      const spkGeo = new THREE.CircleGeometry(0.026, 12);
      const spkMesh = new THREE.Mesh(spkGeo, portMat);
      spkMesh.rotation.x = Math.PI / 2;
      spkMesh.position.set(-0.45 - i * 0.08, -caseH / 2 + 0.01, -caseD * 0.5);
      singleCase.add(spkMesh);
    }
    for (let i = 0; i < 3; i++) {
      const spkGeo = new THREE.CircleGeometry(0.026, 12);
      const spkMesh = new THREE.Mesh(spkGeo, portMat);
      spkMesh.rotation.x = Math.PI / 2;
      spkMesh.position.set(0.45 + i * 0.08, -caseH / 2 + 0.01, -caseD * 0.5);
      singleCase.add(spkMesh);
    }

    // 7. Instantiate Multi-Case Layout (Fan-4, Duo, Trio, Lineup, etc.)
    activeLayoutConfig.items.forEach((item, idx) => {
      const caseInstance = idx === 0 ? singleCase : singleCase.clone(true);
      caseInstance.position.set(item.x, item.y, item.z);
      caseInstance.rotation.set(item.rotX || 0, item.rotY || 0, item.rotZ || 0);
      if (item.scale) caseInstance.scale.setScalar(item.scale);
      rootGroup.add(caseInstance);
    });

    // ── Continuous Animation & Physics Render Loop ───────────────────────────
    const animate = () => {
      // 360° Auto-spin
      if (isAutoSpinning) {
        targetRotY.current += 0.0075;
      }

      // Smooth physics lerp
      currentRotY.current += (targetRotY.current - currentRotY.current) * 0.14;
      currentRotX.current += (targetRotX.current - currentRotX.current) * 0.14;
      currentZoom.current += (targetZoom.current - currentZoom.current) * 0.14;

      rootGroup.rotation.y = currentRotY.current;
      rootGroup.rotation.x = currentRotX.current;
      rootGroup.scale.setScalar(currentZoom.current);

      onRotateRef.current?.(currentRotY.current, currentRotX.current);

      // Smooth ground shadow drift
      if (shadowMeshRef.current) {
        shadowMeshRef.current.position.x = Math.sin(currentRotY.current) * -0.55;
        shadowMeshRef.current.scale.x = 1.0 + Math.abs(Math.sin(currentRotY.current)) * 0.25;
      }

      renderer.render(scene, camera);
      animIdRef.current = requestAnimationFrame(animate);
    };

    animIdRef.current = requestAnimationFrame(animate);

    // Initial artwork texture load
    updateWrapTexture();

    // Container resize handling
    const handleResize = () => {
      if (!mount || !cameraRef.current || !rendererRef.current) return;
      const nw = mount.clientWidth || width;
      const nh = mount.clientHeight || height;
      cameraRef.current.aspect = nw / nh;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(nw, nh);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      window.removeEventListener("resize", handleResize);

      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            mesh.material.dispose();
          }
        }
      });
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [phoneModel, caseType, layout, width, height]);

  // Keep texture updated whenever artwork, custom text, or transforms change
  useEffect(() => {
    updateWrapTexture();
  }, [updateWrapTexture]);

  // ── Mouse & Touch Orbit Controls ───────────────────────────────────────────
  const handlePointerDown = (e: React.PointerEvent) => {
    isPointerDown.current = true;
    setIsInteracting(true);
    setIsAutoSpinning(false);
    lastPointer.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDown.current) return;
    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;
    lastPointer.current = { x: e.clientX, y: e.clientY };

    targetRotY.current += dx * 0.0075;
    targetRotX.current = Math.max(MIN_ROT_X, Math.min(MAX_ROT_X, targetRotX.current + dy * 0.0055));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isPointerDown.current = false;
    setIsInteracting(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.0012;
    targetZoom.current = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, targetZoom.current + delta));
  };

  return (
    <div
      ref={containerRef}
      className={`phone-case-3d-casetadka ${className || ""}`}
      style={{
        position: "relative",
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        touchAction: "none",
        // Clean, bright luxury studio background (like Pacdora)
        background: "radial-gradient(ellipse at 50% 38%, #ffffff 0%, #f0f3f8 60%, #dfe3eb 100%)",
        borderRadius: "28px",
        boxShadow: "0 16px 48px rgba(0, 0, 0, 0.12), inset 0 0 0 1px rgba(255, 255, 255, 0.8)",
        ...style,
      }}
    >
      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={mountRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        title="Click & Drag to Orbit 3D Phone Case • Scroll to Zoom"
        style={{
          width: "100%",
          height: "100%",
          cursor: isInteracting ? "grabbing" : "grab",
          borderRadius: "28px",
          overflow: "hidden",
          outline: "none",
        }}
      />

      {/* Pacdora-Style Preset Angle & Orbit Controls Bar */}
      {!hideControls && (
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            backgroundColor: "rgba(15, 17, 23, 0.86)",
            backdropFilter: "blur(14px)",
            padding: "5px 8px",
            borderRadius: "999px",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
            zIndex: 20,
          }}
        >
          <button
            type="button"
            onClick={() => setPreset("hero")}
            title="CaseTadka 3D Hero View (Shows artwork & 3D wrap curve)"
            style={{
              padding: "5px 12px",
              borderRadius: "999px",
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.04em",
              border: "none",
              backgroundColor: activePreset === "hero" && !isAutoSpinning ? "var(--main-accent, #FF2A3A)" : "transparent",
              color: activePreset === "hero" && !isAutoSpinning ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
              cursor: "pointer",
              transition: "all 0.18s ease",
            }}
          >
            💎 3D HERO
          </button>

          <button
            type="button"
            onClick={() => setPreset("back")}
            title="Rear Print View (Camera in Top-Left, Unmirrored)"
            style={{
              padding: "5px 12px",
              borderRadius: "999px",
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.04em",
              border: "none",
              backgroundColor: activePreset === "back" && !isAutoSpinning ? "var(--main-accent, #FF2A3A)" : "transparent",
              color: activePreset === "back" && !isAutoSpinning ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
              cursor: "pointer",
              transition: "all 0.18s ease",
            }}
          >
            📱 BACK
          </button>

          <button
            type="button"
            onClick={() => setPreset("hollow")}
            title="CaseTadka Hollow Cavity View (Inside cavity & side wrap)"
            style={{
              padding: "5px 12px",
              borderRadius: "999px",
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.04em",
              border: "none",
              backgroundColor: activePreset === "hollow" && !isAutoSpinning ? "var(--main-accent, #FF2A3A)" : "transparent",
              color: activePreset === "hollow" && !isAutoSpinning ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
              cursor: "pointer",
              transition: "all 0.18s ease",
            }}
          >
            📥 HOLLOW INSIDE
          </button>

          <button
            type="button"
            onClick={() => setPreset("side")}
            title="Side Profile (Edge Wrap & Button Cutouts)"
            style={{
              padding: "5px 12px",
              borderRadius: "999px",
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.04em",
              border: "none",
              backgroundColor: activePreset === "side" && !isAutoSpinning ? "var(--main-accent, #FF2A3A)" : "transparent",
              color: activePreset === "side" && !isAutoSpinning ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
              cursor: "pointer",
              transition: "all 0.18s ease",
            }}
          >
            📐 SIDE
          </button>

          <button
            type="button"
            onClick={toggleAutoSpin}
            title={isAutoSpinning ? "Pause 360° Auto-Spin" : "Start 360° Auto-Spin Showcase"}
            style={{
              padding: "5px 12px",
              borderRadius: "999px",
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.04em",
              border: "none",
              backgroundColor: isAutoSpinning ? "var(--main-accent, #FF2A3A)" : "rgba(255, 255, 255, 0.08)",
              color: isAutoSpinning ? "#ffffff" : "rgba(255, 255, 255, 0.8)",
              cursor: "pointer",
              transition: "all 0.18s ease",
            }}
          >
            🔄 {isAutoSpinning ? "SPINNING" : "AUTO-SPIN"}
          </button>

          <button
            type="button"
            onClick={() => setPreset("hero")}
            title="Reset to 3D Hero View"
            style={{
              padding: "5px 9px",
              borderRadius: "999px",
              fontSize: "0.72rem",
              fontWeight: 700,
              border: "none",
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              color: "rgba(255, 255, 255, 0.8)",
              cursor: "pointer",
              transition: "all 0.18s ease",
            }}
          >
            ↺
          </button>
        </div>
      )}
    </div>
  );
}
