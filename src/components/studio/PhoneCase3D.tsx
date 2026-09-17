"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import * as THREE from "three";

interface PhoneCase3DProps {
  artworkUrl: string;
  phoneModel?: string;
  caseType?: string;
  customOverlay?: React.ReactNode;
  width?: number;
  height?: number;
  rotY?: number;
  rotX?: number;
  onRotate?: (y: number, x: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

type ViewPreset = "back" | "threeQuarter" | "side";

// ── Preset Angles (Radians) ──────────────────────────────────────────────────
// Default BACK view: mostly back surface with subtle, elegant 3D perspective depth
const PRESETS: Record<ViewPreset, { rotY: number; rotX: number; zoom: number }> = {
  back: { rotY: 0.16, rotX: -0.05, zoom: 1.0 },         // ~9° Y, -3° X (Back focus + subtle depth)
  threeQuarter: { rotY: 0.44, rotX: -0.08, zoom: 1.02 }, // ~25° Y (Classic e-commerce 3/4 beauty view)
  side: { rotY: 0.88, rotX: -0.05, zoom: 1.05 },         // ~50° Y (Side profile, button & case thickness)
};

// Rotation constraints (prevents disappearing edge-on or flipping upside down)
const MIN_ROT_Y = -0.95; // -54°
const MAX_ROT_Y = 0.95;  // +54°
const MIN_ROT_X = -0.32; // -18°
const MAX_ROT_X = 0.32;  // +18°
const MIN_ZOOM = 0.85;
const MAX_ZOOM = 1.35;

/**
 * Creates a 2D rounded rectangle shape for Three.js extrusions
 */
function createRoundedRectShape(width: number, height: number, radius: number): THREE.Shape {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

/**
 * Creates a soft radial gradient texture for ground contact shadow
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
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, cx);
    gradient.addColorStop(0, "rgba(0, 0, 0, 0.65)");
    gradient.addColorStop(0.3, "rgba(0, 0, 0, 0.45)");
    gradient.addColorStop(0.65, "rgba(0, 0, 0, 0.15)");
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
  phoneModel = "iPhone 16 Pro Max",
  caseType = "9H Tempered Glass",
  customOverlay,
  width = 340,
  height = 580,
  rotY: externalRotY,
  rotX: externalRotX,
  onRotate,
  className,
  style,
}: PhoneCase3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);

  // Active preset & interactive state
  const [activePreset, setActivePreset] = useState<ViewPreset>("back");
  const [isInteracting, setIsInteracting] = useState(false);

  // Refs for animation loop and Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rootGroupRef = useRef<THREE.Group | null>(null);
  const artworkMeshRef = useRef<THREE.Mesh | null>(null);
  const animIdRef = useRef<number | null>(null);

  // Continuous physics / lerp state
  const targetRotY = useRef(PRESETS.back.rotY);
  const targetRotX = useRef(PRESETS.back.rotX);
  const currentRotY = useRef(PRESETS.back.rotY);
  const currentRotX = useRef(PRESETS.back.rotX);
  const currentZoom = useRef(PRESETS.back.zoom);
  const targetZoom = useRef(PRESETS.back.zoom);

  const isPointerDown = useRef(false);
  const pointerStart = useRef({ x: 0, y: 0 });
  const lastPointer = useRef({ x: 0, y: 0 });

  // Handle external rotation props if passed from studio
  useEffect(() => {
    if (externalRotY !== undefined) {
      // Map external degrees to radians if necessary
      const radY = Math.abs(externalRotY) > 3 ? (externalRotY * Math.PI) / 180 : externalRotY;
      targetRotY.current = Math.max(MIN_ROT_Y, Math.min(MAX_ROT_Y, radY));
    }
  }, [externalRotY]);

  useEffect(() => {
    if (externalRotX !== undefined) {
      const radX = Math.abs(externalRotX) > 3 ? (externalRotX * Math.PI) / 180 : externalRotX;
      targetRotX.current = Math.max(MIN_ROT_X, Math.min(MAX_ROT_X, radX));
    }
  }, [externalRotX]);

  // ── Apply Preset View ──────────────────────────────────────────────────────
  const setPreset = useCallback((preset: ViewPreset) => {
    setActivePreset(preset);
    const p = PRESETS[preset];
    targetRotY.current = p.rotY;
    targetRotX.current = p.rotX;
    targetZoom.current = p.zoom;
  }, []);

  const resetView = useCallback(() => {
    setPreset("back");
  }, [setPreset]);

  // ── Build 3D Scene ────────────────────────────────────────────────────────
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const w = mount.clientWidth || width;
    const h = mount.clientHeight || height;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera: 30° FOV eliminates fisheye distortion; phone occupies 75-80% of frame
    const camera = new THREE.PerspectiveCamera(30, w / h, 0.1, 100);
    camera.position.set(0, 0, 17.6);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer with high dynamic range tone mapping
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.innerHTML = "";
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Professional Studio Lighting
    // Soft warm key light
    const keyLight = new THREE.DirectionalLight(0xfffaf2, 2.2);
    keyLight.position.set(4.5, 6.0, 7.0);
    scene.add(keyLight);

    // Cool fill light for shadow balance
    const fillLight = new THREE.DirectionalLight(0xe8f2ff, 1.2);
    fillLight.position.set(-5.0, 2.5, 5.0);
    scene.add(fillLight);

    // Rim / Back light for crisp specular edge definition on glass case & metallic bevels
    const rimLight = new THREE.DirectionalLight(0xffffff, 2.0);
    rimLight.position.set(3.0, -4.0, -6.0);
    scene.add(rimLight);

    // Top soft accent light
    const topLight = new THREE.DirectionalLight(0xffffff, 1.1);
    topLight.position.set(0, 8.0, 2.0);
    scene.add(topLight);

    // Ambient fill
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    // 5. Contact Shadow Ground Plane
    const shadowTex = createContactShadowTexture();
    const shadowGeo = new THREE.PlaneGeometry(6.8, 6.8);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -4.3;
    scene.add(shadowMesh);

    // 6. Master Product Root Group
    const rootGroup = new THREE.Group();
    rootGroupRef.current = rootGroup;
    scene.add(rootGroup);

    // ── Smartphone Dimensions & Geometry ─────────────────────────────────────
    const phoneW = 3.6;
    const phoneH = 7.6;
    const phoneD = 0.36;
    const phoneRadius = 0.72;

    // A. Inner Smartphone Chassis (Solid Aluminum / Titanium Body)
    const phoneShape = createRoundedRectShape(phoneW, phoneH, phoneRadius);
    const phoneGeo = new THREE.ExtrudeGeometry(phoneShape, {
      depth: phoneD,
      bevelEnabled: true,
      bevelSegments: 8,
      steps: 1,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    });
    phoneGeo.center();

    const phoneMat = new THREE.MeshStandardMaterial({
      color: 0x1a1b20,
      roughness: 0.32,
      metalness: 0.82,
    });
    const phoneMesh = new THREE.Mesh(phoneGeo, phoneMat);
    rootGroup.add(phoneMesh);

    // B. Front Screen Glass (-Z face)
    const screenShape = createRoundedRectShape(phoneW - 0.14, phoneH - 0.14, phoneRadius - 0.06);
    const screenGeo = new THREE.ShapeGeometry(screenShape);
    const screenMat = new THREE.MeshPhysicalMaterial({
      color: 0x050507,
      roughness: 0.05,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.z = -phoneD / 2 - 0.081;
    screenMesh.rotation.y = Math.PI; // Faces toward front
    rootGroup.add(screenMesh);

    // C. Physical Hardware Side Buttons
    const buttonMat = new THREE.MeshStandardMaterial({
      color: 0x272930,
      roughness: 0.25,
      metalness: 0.88,
    });

    // Power / Lock button (Right side, +X)
    const powerGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.9, 16);
    const powerBtn = new THREE.Mesh(powerGeo, buttonMat);
    powerBtn.position.set(phoneW / 2 + 0.08, 1.2, 0);
    rootGroup.add(powerBtn);

    // Volume Up (Left side, -X)
    const volUpGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.65, 16);
    const volUpBtn = new THREE.Mesh(volUpGeo, buttonMat);
    volUpBtn.position.set(-phoneW / 2 - 0.08, 1.35, 0);
    rootGroup.add(volUpBtn);

    // Volume Down (Left side, -X)
    const volDownGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.65, 16);
    const volDownBtn = new THREE.Mesh(volDownGeo, buttonMat);
    volDownBtn.position.set(-phoneW / 2 - 0.08, 0.55, 0);
    rootGroup.add(volDownBtn);

    // Action Button (Left side, -X)
    const actionGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.38, 16);
    const actionBtn = new THREE.Mesh(actionGeo, buttonMat);
    actionBtn.position.set(-phoneW / 2 - 0.08, 2.15, 0);
    rootGroup.add(actionBtn);

    // D. Camera Plateau & Lenses (+Z Back Face)
    const isSamsung = phoneModel.toLowerCase().includes("samsung") || phoneModel.toLowerCase().includes("ultra");
    const isDual = phoneModel.toLowerCase().includes("15") || phoneModel.toLowerCase().includes("14") || phoneModel.toLowerCase().includes("13");
    const isPro = !isSamsung && !isDual;

    if (!isSamsung) {
      // iPhone Style Camera Plateau Island
      const plateauW = isPro ? 1.55 : 1.15;
      const plateauH = isPro ? 1.65 : 1.95;
      const plateauR = 0.42;
      const plateauShape = createRoundedRectShape(plateauW, plateauH, plateauR);
      const plateauGeo = new THREE.ExtrudeGeometry(plateauShape, {
        depth: 0.18,
        bevelEnabled: true,
        bevelSegments: 6,
        steps: 1,
        bevelSize: 0.04,
        bevelThickness: 0.04,
      });
      plateauGeo.center();

      const plateauMat = new THREE.MeshStandardMaterial({
        color: 0x16171c,
        roughness: 0.28,
        metalness: 0.75,
      });
      const plateauMesh = new THREE.Mesh(plateauGeo, plateauMat);
      plateauMesh.position.set(
        -phoneW / 2 + plateauW / 2 + 0.22,
        phoneH / 2 - plateauH / 2 - 0.22,
        phoneD / 2 + 0.09 + 0.08
      );
      rootGroup.add(plateauMesh);

      // Camera Lenses
      const lensBezelMat = new THREE.MeshStandardMaterial({
        color: 0x32353e,
        metalness: 0.92,
        roughness: 0.18,
      });
      const lensGlassMat = new THREE.MeshPhysicalMaterial({
        color: 0x020510,
        metalness: 0.95,
        roughness: 0.03,
        clearcoat: 1.0,
        clearcoatRoughness: 0.02,
      });

      const lensCoords = isPro
        ? [
            { x: -0.34, y: 0.38 },
            { x: -0.34, y: -0.38 },
            { x: 0.34, y: 0.0 },
          ]
        : [
            { x: 0, y: 0.42 },
            { x: 0, y: -0.42 },
          ];

      lensCoords.forEach(({ x, y }) => {
        // Metallic Outer Lens Ring
        const ringGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.14, 32);
        const ringMesh = new THREE.Mesh(ringGeo, lensBezelMat);
        ringMesh.rotation.x = Math.PI / 2;
        ringMesh.position.set(
          plateauMesh.position.x + x,
          plateauMesh.position.y + y,
          plateauMesh.position.z + 0.12
        );
        rootGroup.add(ringMesh);

        // Dark Sapphire Crystal Lens Cap
        const capGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.06, 32);
        const capMesh = new THREE.Mesh(capGeo, lensGlassMat);
        capMesh.rotation.x = Math.PI / 2;
        capMesh.position.set(ringMesh.position.x, ringMesh.position.y, ringMesh.position.z + 0.05);
        rootGroup.add(capMesh);

        // Aperture pupil glint
        const pupilGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.02, 16);
        const pupilMat = new THREE.MeshBasicMaterial({ color: 0x1d4ed8 });
        const pupilMesh = new THREE.Mesh(pupilGeo, pupilMat);
        pupilMesh.rotation.x = Math.PI / 2;
        pupilMesh.position.set(capMesh.position.x, capMesh.position.y, capMesh.position.z + 0.02);
        rootGroup.add(pupilMesh);
      });

      // True-Tone Flash
      const flashGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.05, 24);
      const flashMat = new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        roughness: 0.3,
        emissive: 0xca8a04,
        emissiveIntensity: 0.3,
      });
      const flashMesh = new THREE.Mesh(flashGeo, flashMat);
      flashMesh.rotation.x = Math.PI / 2;
      flashMesh.position.set(
        plateauMesh.position.x + (isPro ? 0.38 : 0.3),
        plateauMesh.position.y + 0.42,
        plateauMesh.position.z + 0.08
      );
      rootGroup.add(flashMesh);

      // LiDAR Sensor
      if (isPro) {
        const lidarGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.04, 24);
        const lidarMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.8 });
        const lidarMesh = new THREE.Mesh(lidarGeo, lidarMat);
        lidarMesh.rotation.x = Math.PI / 2;
        lidarMesh.position.set(plateauMesh.position.x + 0.38, plateauMesh.position.y - 0.42, plateauMesh.position.z + 0.07);
        rootGroup.add(lidarMesh);
      }
    } else {
      // Samsung Ultra Floating Lenses
      const lensBezelMat = new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.9, roughness: 0.2 });
      const lensGlassMat = new THREE.MeshPhysicalMaterial({ color: 0x020510, metalness: 0.95, roughness: 0.03, clearcoat: 1.0 });

      [-0.8, 0.0, 0.8].forEach((offsetY) => {
        const ringGeo = new THREE.CylinderGeometry(0.33, 0.33, 0.14, 32);
        const ringMesh = new THREE.Mesh(ringGeo, lensBezelMat);
        ringMesh.rotation.x = Math.PI / 2;
        ringMesh.position.set(-phoneW / 2 + 0.65, phoneH / 2 - 1.2 + offsetY, phoneD / 2 + 0.15);
        rootGroup.add(ringMesh);

        const capGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.06, 32);
        const capMesh = new THREE.Mesh(capGeo, lensGlassMat);
        capMesh.rotation.x = Math.PI / 2;
        capMesh.position.set(ringMesh.position.x, ringMesh.position.y, ringMesh.position.z + 0.05);
        rootGroup.add(capMesh);
      });
    }

    // E. Large Printable Artwork Surface (Back Face Under Transparent Glass)
    // Follows the phone back geometry smoothly, covering the entire back naturally
    const artShape = createRoundedRectShape(phoneW - 0.06, phoneH - 0.06, phoneRadius - 0.03);
    const artGeo = new THREE.ShapeGeometry(artShape);

    // Compute exact UV mapping spanning [0, 1] edge-to-edge
    const pos = artGeo.attributes.position;
    const uvs = new Float32Array((pos.count * 2));
    const aw = phoneW - 0.06;
    const ah = phoneH - 0.06;
    for (let i = 0; i < pos.count; i++) {
      const px = pos.getX(i);
      const py = pos.getY(i);
      uvs[i * 2] = (px + aw / 2) / aw;
      uvs[i * 2 + 1] = (py + ah / 2) / ah;
    }
    artGeo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));

    const artMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.35,
      metalness: 0.02,
    });
    const artMesh = new THREE.Mesh(artGeo, artMat);
    artMesh.position.z = phoneD / 2 + 0.081; // Perfectly flush on back surface
    rootGroup.add(artMesh);
    artworkMeshRef.current = artMesh;

    // Load user artwork texture
    if (artworkUrl) {
      const loader = new THREE.TextureLoader();
      loader.load(
        artworkUrl,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.generateMipmaps = true;
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          artMat.map = tex;
          artMat.needsUpdate = true;
        },
        undefined,
        () => {
          // Fallback solid color on texture error
          artMat.color.setHex(0x1e293b);
        }
      );
    }

    // F. Transparent Glossy Glass Case (Protective Outer Shell)
    // Realistic thickness, rounded corners, raised edges, camera cutout opening
    const caseW = phoneW + 0.20;
    const caseH = phoneH + 0.20;
    const caseD = phoneD + 0.16;
    const caseRadius = phoneRadius + 0.08;

    const caseShape = createRoundedRectShape(caseW, caseH, caseRadius);
    const caseGeo = new THREE.ExtrudeGeometry(caseShape, {
      depth: caseD,
      bevelEnabled: true,
      bevelSegments: 8,
      steps: 1,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    });
    caseGeo.center();

    // High-refraction physical tempered glass material
    const caseMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.48,
      transmission: 0.82,       // Physically realistic glass light pass-through
      roughness: 0.06,          // Ultra-smooth high-gloss finish
      metalness: 0.04,
      ior: 1.52,                // Refractive index of tempered glass
      thickness: 0.55,          // Volumetric refraction thickness
      clearcoat: 1.0,           // Glossy reflection sheen
      clearcoatRoughness: 0.03,
      reflectivity: 0.65,
      depthWrite: false,        // Prevents clipping/z-fighting with inner artwork
    });
    const caseMesh = new THREE.Mesh(caseGeo, caseMat);
    rootGroup.add(caseMesh);

    // Subtle edge highlight bevel wire for visible glass thickness gleam
    const caseEdges = new THREE.EdgesGeometry(caseGeo, 24);
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.28,
    });
    const edgeLines = new THREE.LineSegments(caseEdges, edgeMat);
    caseMesh.add(edgeLines);

    // ── Continuous Animation & Physics Render Loop ───────────────────────────
    const animate = () => {
      // Smooth lerp toward target rotation & zoom
      currentRotY.current += (targetRotY.current - currentRotY.current) * 0.12;
      currentRotX.current += (targetRotX.current - currentRotX.current) * 0.12;
      currentZoom.current += (targetZoom.current - currentZoom.current) * 0.12;

      rootGroup.rotation.y = currentRotY.current;
      rootGroup.rotation.x = currentRotX.current;
      rootGroup.scale.setScalar(currentZoom.current);

      // Inform parent component of current orientation
      onRotate?.(currentRotY.current, currentRotX.current);

      // Gentle shadow drift matching phone angle
      shadowMesh.position.x = currentRotY.current * -0.65;
      shadowMesh.scale.x = 1.0 + Math.abs(currentRotY.current) * 0.2;

      renderer.render(scene, camera);
      animIdRef.current = requestAnimationFrame(animate);
    };

    animIdRef.current = requestAnimationFrame(animate);

    // Handle container resize
    const handleResize = () => {
      if (!mount || !cameraRef.current || !rendererRef.current) return;
      const nw = mount.clientWidth || width;
      const nh = mount.clientHeight || height;
      cameraRef.current.aspect = nw / nh;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(nw, nh);
    };
    window.addEventListener("resize", handleResize);

    // ── Cleanup on Unmount ───────────────────────────────────────────────────
    return () => {
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      window.removeEventListener("resize", handleResize);

      // Dispose Three.js scene assets
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
  }, [phoneModel, artworkUrl, width, height, onRotate]);

  // ── Dynamic Artwork Texture Update ─────────────────────────────────────────
  useEffect(() => {
    if (!artworkMeshRef.current || !artworkUrl) return;
    const mesh = artworkMeshRef.current;
    const mat = mesh.material as THREE.MeshStandardMaterial;

    const loader = new THREE.TextureLoader();
    loader.load(artworkUrl, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      mat.map = tex;
      mat.needsUpdate = true;
    });
  }, [artworkUrl]);

  // ── Mouse & Touch Orbit Controls ───────────────────────────────────────────
  const handlePointerDown = (e: React.PointerEvent) => {
    isPointerDown.current = true;
    setIsInteracting(true);
    pointerStart.current = { x: e.clientX, y: e.clientY };
    lastPointer.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDown.current) return;
    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;
    lastPointer.current = { x: e.clientX, y: e.clientY };

    // Clamped orbit physics
    targetRotY.current = Math.max(MIN_ROT_Y, Math.min(MAX_ROT_Y, targetRotY.current + dx * 0.0075));
    targetRotX.current = Math.max(MIN_ROT_X, Math.min(MAX_ROT_X, targetRotX.current + dy * 0.006));
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

  // Scroll to Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.0012;
    targetZoom.current = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, targetZoom.current + delta));
  };

  return (
    <div
      ref={containerRef}
      className={`phone-case-3d-container ${className || ""}`}
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
        title="Drag to orbit 3D model • Scroll to zoom"
        style={{
          width: "100%",
          height: "100%",
          cursor: isInteracting ? "grabbing" : "grab",
          borderRadius: "28px",
          overflow: "hidden",
          outline: "none",
        }}
      />

      {/* Custom Text / Sticker 2D Overlays */}
      {customOverlay && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          {customOverlay}
        </div>
      )}

      {/* Preset View Buttons (BACK, 3/4, SIDE, RESET) */}
      <div
        style={{
          position: "absolute",
          bottom: "16px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          backgroundColor: "rgba(14, 16, 22, 0.82)",
          backdropFilter: "blur(10px)",
          padding: "5px 8px",
          borderRadius: "999px",
          border: "1px solid rgba(255, 255, 255, 0.14)",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.6)",
          zIndex: 20,
        }}
      >
        <button
          type="button"
          onClick={() => setPreset("back")}
          title="Back view (default product view)"
          style={{
            padding: "5px 12px",
            borderRadius: "999px",
            fontSize: "0.72rem",
            fontWeight: 800,
            letterSpacing: "0.06em",
            border: "none",
            backgroundColor: activePreset === "back" ? "var(--main-accent, #FF2A3A)" : "transparent",
            color: activePreset === "back" ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
            cursor: "pointer",
            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          BACK
        </button>

        <button
          type="button"
          onClick={() => setPreset("threeQuarter")}
          title="3/4 perspective view"
          style={{
            padding: "5px 12px",
            borderRadius: "999px",
            fontSize: "0.72rem",
            fontWeight: 800,
            letterSpacing: "0.06em",
            border: "none",
            backgroundColor: activePreset === "threeQuarter" ? "var(--main-accent, #FF2A3A)" : "transparent",
            color: activePreset === "threeQuarter" ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
            cursor: "pointer",
            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          3/4
        </button>

        <button
          type="button"
          onClick={() => setPreset("side")}
          title="Side profile (chassis thickness & buttons)"
          style={{
            padding: "5px 12px",
            borderRadius: "999px",
            fontSize: "0.72rem",
            fontWeight: 800,
            letterSpacing: "0.06em",
            border: "none",
            backgroundColor: activePreset === "side" ? "var(--main-accent, #FF2A3A)" : "transparent",
            color: activePreset === "side" ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
            cursor: "pointer",
            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          SIDE
        </button>

        <button
          type="button"
          onClick={resetView}
          title="Reset to default angle"
          style={{
            padding: "5px 9px",
            borderRadius: "999px",
            fontSize: "0.72rem",
            fontWeight: 700,
            border: "none",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            color: "rgba(255, 255, 255, 0.8)",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          ↺
        </button>
      </div>
    </div>
  );
}
