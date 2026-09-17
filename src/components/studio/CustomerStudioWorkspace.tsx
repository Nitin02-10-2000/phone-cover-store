"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cartContext";
import { useDevice } from "@/lib/deviceContext";
import DynamicPhoneCase from "@/components/DynamicPhoneCase";
import PhoneCase3D from "@/components/studio/PhoneCase3D";
import PSDMockupCanvas from "@/components/studio/PSDMockupCanvas";
import { getMockupModelByName, MockupConfig } from "@/lib/mockupData";
import { generateProductionArtwork, generateMockupPreview } from "@/lib/productionExport";
import {
  getStudioPhoneModels,
  getStudioFonts,
  getStudioAssets,
  getStudioTemplates,
  getStudioPricing,
  getStudioCaseTypes,
  calculateCustomPrice,
  saveCustomOrderDesign,
  generateProductionPrintCanvas,
  StudioPhoneModel,
  StudioCaseType,
  StudioFontItem,
  StudioAssetItem,
  StudioTemplate,
  PhotoEffectsConfig,
  CropData,
  STICKER_CATEGORIES,
} from "@/lib/studioStorage";

const DEFAULT_EFFECTS: PhotoEffectsConfig = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  sharpness: 0,
  grayscale: 0,
  sepia: 0,
};

const STARTER_ARTWORKS = [
  { id: "art-1", name: "Akira Neo-Tokyo", url: "/mockups/akira.jpg" },
  { id: "art-2", name: "Gojo Limitless Void", url: "https://res.cloudinary.com/dv7oqos1m/image/upload/v1786122801/mockups/gojo-satoru-honored-one-poster-paper-1.jpg" },
  { id: "art-3", name: "Luffy Sun God Gear 5", url: "https://res.cloudinary.com/dv7oqos1m/image/upload/v1787153686/mockups/luffy-gear-5-one-piece-poster-paper-5.jpg" },
  { id: "art-4", name: "Sukuna Malevolent Shrine", url: "https://res.cloudinary.com/dv7oqos1m/image/upload/v1787407303/mockups/ryomen-sukuna-jujutsu-kaisen-poster-cinematic-anime-wall-art-sukuna-decor-paper-1.jpg" },
  { id: "art-5", name: "Solo Leveling Arise", url: "https://res.cloudinary.com/dv7oqos1m/image/upload/v1786123391/mockups/sung-jinwoo-arise-poster-paper-5.jpg" },
];

export default function CustomerStudioWorkspace() {
  const router = useRouter();
  const { addToCart, saveDesign } = useCart();
  const { selectedModel: globalModel, setDevice } = useDevice();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Workflow Active Step (1 to 7)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Studio Configurations (from Admin)
  const [phoneModels, setPhoneModels] = useState<StudioPhoneModel[]>([]);
  const [caseTypes, setCaseTypes] = useState<StudioCaseType[]>([]);
  const [fonts, setFonts] = useState<StudioFontItem[]>([]);
  const [assets, setAssets] = useState<StudioAssetItem[]>([]);
  const [templates, setTemplates] = useState<StudioTemplate[]>([]);
  const [pricing, setPricing] = useState(getStudioPricing());

  // STEP 1: Phone Selection
  const [selectedBrand, setSelectedBrand] = useState<string>("Apple");
  const [selectedModel, setSelectedModel] = useState<string>("iPhone 16 Pro Max");

  // STEP 2: Case Selection
  const [selectedCaseType, setSelectedCaseType] = useState<string>("9H Tempered Glass");
  const [selectedFinish, setSelectedFinish] = useState<"tough" | "transparent" | "matte" | "glossy" | "magsafe">("glossy");

  // STEP 3: Photo Upload
  const [originalImageUrl, setOriginalImageUrl] = useState<string>(STARTER_ARTWORKS[0].url);
  const [activeArtworkUrl, setActiveArtworkUrl] = useState<string>(STARTER_ARTWORKS[0].url);

  // STEP 4: 2D Design Editor State
  const [scale, setScale] = useState<number>(100);
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true);
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  const [posX, setPosX] = useState<number>(0);
  const [posY, setPosY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Photo Effects
  const [effects, setEffects] = useState<PhotoEffectsConfig>(DEFAULT_EFFECTS);

  // Crop State
  const [isCropActive, setIsCropActive] = useState<boolean>(false);
  const [cropMode, setCropMode] = useState<CropData["mode"]>("free");

  // History State
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // STEP 5: Text & Stickers
  const [customText, setCustomText] = useState<string>("TADKA-01");
  const [textColor, setTextColor] = useState<string>("#ffffff");
  const [selectedFont, setSelectedFont] = useState<string>("'Outfit', sans-serif");
  const [textSize, setTextSize] = useState<number>(18);
  const [isBold, setIsBold] = useState<boolean>(true);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [hasShadow, setHasShadow] = useState<boolean>(true);
  const [hasOutline, setHasOutline] = useState<boolean>(false);
  const [letterSpacing, setLetterSpacing] = useState<number>(2);

  const [activeSticker, setActiveSticker] = useState<string | null>("⚡ CASE TADKA");
  const [stickerCategory, setStickerCategory] = useState<string>("ALL");

  // STEP 6: Real 3D Preview State
  const [rot3dX, setRot3dX] = useState<number>(0);
  const [rot3dY, setRot3dY] = useState<number>(0);
  const [zoom3d, setZoom3d] = useState<number>(100);
  const [is3dDragging, setIs3dDragging] = useState<boolean>(false);
  const [drag3dStart, setDrag3dStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Guidelines Toggles
  const [showGuidelines, setShowGuidelines] = useState<boolean>(true);

  // UI state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Load from Storage
  const reloadData = () => {
    const models = getStudioPhoneModels().filter((m) => m.active);
    const types = getStudioCaseTypes().filter((c) => c.active);
    const fList = getStudioFonts().filter((f) => f.enabled);
    const aList = getStudioAssets().filter((a) => a.enabled);
    const tList = getStudioTemplates().filter((t) => t.published);
    const pConfig = getStudioPricing();

    setPhoneModels(models);
    setCaseTypes(types);
    setFonts(fList);
    setAssets(aList);
    setTemplates(tList);
    setPricing(pConfig);

    if (fList.length > 0 && !fList.some((f) => f.family === selectedFont)) {
      setSelectedFont(fList[0].family);
    }
  };

  useEffect(() => {
    reloadData();
    if (typeof window !== "undefined") {
      window.addEventListener("casetadka_studio_updated", reloadData);
      return () => window.removeEventListener("casetadka_studio_updated", reloadData);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Push to Undo/Redo History
  const pushHistory = (stateSnapshot: any) => {
    const next = history.slice(0, historyIndex + 1);
    next.push(stateSnapshot);
    if (next.length > 20) next.shift();
    setHistory(next);
    setHistoryIndex(next.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      restoreSnapshot(prev);
      showToast("Undid last action");
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      restoreSnapshot(next);
      showToast("Redid action");
    }
  };

  const restoreSnapshot = (snap: any) => {
    if (!snap) return;
    setScale(snap.scale);
    setRotation(snap.rotation);
    setPosX(snap.posX);
    setPosY(snap.posY);
    setFlipH(snap.flipH);
    setFlipV(snap.flipV);
    setEffects(snap.effects);
  };

  // Active target phone model
  const activePhone = phoneModels.find((m) => m.name === selectedModel) || phoneModels[0];
  const activeMockup = useMemo(() => getMockupModelByName(selectedModel), [selectedModel]);

  // Dynamic Price Calculation
  const priceQuote = calculateCustomPrice(
    selectedFinish === "glossy" ? "tempered" : selectedFinish === "magsafe" ? "magsafe" : selectedFinish === "transparent" ? "transparent" : "matte",
    activeSticker !== null,
    Boolean(customText.trim()),
    pricing
  );

  // File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const url = event.target.result as string;
          setOriginalImageUrl(url);
          setActiveArtworkUrl(url);
          // Reset positioning
          setPosX(0);
          setPosY(0);
          setScale(100);
          setRotation(0);
          showToast("Photo uploaded successfully!");
          setCurrentStep(4); // Advance to editor
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 2D Canvas Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - posX, y: e.clientY - posY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosX(e.clientX - dragStart.x);
    setPosY(e.clientY - dragStart.y);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      pushHistory({ scale, rotation, posX, posY, flipH, flipV, effects });
    }
  };

  // 3D Canvas Drag Orbit
  const handle3dMouseDown = (e: React.MouseEvent) => {
    setIs3dDragging(true);
    setDrag3dStart({ x: e.clientX, y: e.clientY });
  };

  const handle3dMouseMove = (e: React.MouseEvent) => {
    if (!is3dDragging) return;
    const deltaX = e.clientX - drag3dStart.x;
    const deltaY = e.clientY - drag3dStart.y;
    setRot3dY((prev) => Math.max(-65, Math.min(65, prev + deltaX * 0.5)));
    setRot3dX((prev) => Math.max(-35, Math.min(35, prev - deltaY * 0.5)));
    setDrag3dStart({ x: e.clientX, y: e.clientY });
  };

  const handle3dMouseUp = () => {
    setIs3dDragging(false);
  };

  // Framing Presets
  const handleFitToCase = () => {
    setScale(95);
    setPosX(0);
    setPosY(0);
    setRotation(0);
    showToast("Fit artwork within case boundaries");
  };

  const handleFillCase = () => {
    setScale(125);
    setPosX(0);
    setPosY(0);
    showToast("Filled entire print surface");
  };

  const handleCenter = () => {
    setPosX(0);
    setPosY(0);
    showToast("Centered on chassis");
  };

  // Rotation helpers
  const rotateStep = (delta: number) => {
    const next = (rotation + delta) % 360;
    setRotation(next);
    pushHistory({ scale, rotation: next, posX, posY, flipH, flipV, effects });
  };

  // Reset entire design
  const handleReset = () => {
    setScale(100);
    setRotation(0);
    setPosX(0);
    setPosY(0);
    setFlipH(false);
    setFlipV(false);
    setEffects(DEFAULT_EFFECTS);
    showToast("Reset 2D design to original values");
  };

  // Structured Payload Builder
  const getStructuredPayload = () => {
    return {
      phoneModel: selectedModel,
      caseType: selectedCaseType,
      finishType: selectedFinish,
      originalImageUrl,
      cropData: { mode: cropMode, x: posX, y: posY, width: scale, height: scale },
      photoEffects: effects,
      layers: [
        { type: "image", source: activeArtworkUrl, scale, rotation, posX, posY, flipH, flipV },
        customText ? { type: "text", content: customText, color: textColor, font: selectedFont, size: textSize, bold: isBold, italic: isItalic } : null,
        activeSticker ? { type: "sticker", badge: activeSticker } : null,
      ].filter(Boolean),
      images: [activeArtworkUrl],
      text: {
        content: customText,
        color: textColor,
        fontFamily: selectedFont,
        fontSize: textSize,
        bold: isBold,
        italic: isItalic,
        letterSpacing,
        hasOutline,
        hasShadow,
      },
      stickers: activeSticker ? [activeSticker] : [],
      transformations: { scale: scale / 100, rotation, offsetX: posX, offsetY: posY, flipH, flipV },
      printArea: {
        width: activePhone?.canvasWidth || 800,
        height: activePhone?.canvasHeight || 1600,
        bleedMm: activePhone?.bleedArea?.bleedMm || 3,
        safeArea: activePhone?.safeArea || { insetX: 24, insetY: 30 },
      },
      pricing: {
        base: priceQuote.base,
        printing: priceQuote.printing,
        finishExtra: priceQuote.finishExtra,
        addons: priceQuote.addons,
        total: priceQuote.total,
      },
    };
  };

  // Save to Saved Designs
  const handleSaveToDesigns = async () => {
    setIsExporting(true);
    try {
      // 1. Generate realistic PSD-based e-commerce product preview
      const mockupPreviewUrl = await generateMockupPreview({
        mockup: activeMockup,
        artworkUrl: activeArtworkUrl,
        transform: { x: posX, y: posY, scale: scale / 100, rotation },
        customTexts: customText
          ? [{ id: "txt-1", text: customText, font: selectedFont, size: textSize, color: textColor, x: 50, y: 84, rotation: 0 }]
          : [],
        customStickers: activeSticker
          ? [{ id: "stk-1", name: activeSticker, x: 80, y: 20, scale: 1 }]
          : [],
      });

      // 2. Generate flat high-resolution 300 DPI production file (ONLY customer art, no phone chassis or wall)
      const productionPrintUrl = await generateProductionArtwork({
        mockup: activeMockup,
        artworkUrl: activeArtworkUrl,
        transform: { x: posX, y: posY, scale: scale / 100, rotation },
        customTexts: customText
          ? [{ id: "txt-1", text: customText, font: selectedFont, size: textSize, color: textColor, x: 50, y: 84, rotation: 0 }]
          : [],
        customStickers: activeSticker
          ? [{ id: "stk-1", name: activeSticker, x: 80, y: 20, scale: 1 }]
          : [],
      });

      const payload = {
        ...getStructuredPayload(),
        mockupId: activeMockup.id,
        mockupName: activeMockup.name,
        productionArtworkUrl: productionPrintUrl,
        mockupPreviewUrl: mockupPreviewUrl,
      };
      const orderId = `CT-${Math.floor(1000 + Math.random() * 9000)}`;

      saveDesign({
        title: `${selectedModel} — ${customText || "Custom Armor"}`,
        productType: "phone_case",
        phoneModel: selectedModel,
        previewUrl: mockupPreviewUrl,
        price: priceQuote.total,
      });

      saveCustomOrderDesign({
        orderId,
        customerName: "Buyer (Saved Design)",
        phoneModel: selectedModel,
        caseType: selectedCaseType,
        designPreviewUrl: mockupPreviewUrl,
        printFileUrl: productionPrintUrl,
        customizationData: payload as any,
        price: priceQuote.total,
        orderStatus: "PENDING",
        createdAt: new Date().toISOString(),
      });

      showToast("Design saved to your collection!");
      router.push("/saved-designs");
    } catch (err) {
      console.error("Failed saving design:", err);
      showToast("Error saving design. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // Add Custom to Cart
  const handleAddToCart = async () => {
    setIsExporting(true);
    try {
      // 1. Generate realistic PSD-based e-commerce product preview
      const mockupPreviewUrl = await generateMockupPreview({
        mockup: activeMockup,
        artworkUrl: activeArtworkUrl,
        transform: { x: posX, y: posY, scale: scale / 100, rotation },
        customTexts: customText
          ? [{ id: "txt-1", text: customText, font: selectedFont, size: textSize, color: textColor, x: 50, y: 84, rotation: 0 }]
          : [],
        customStickers: activeSticker
          ? [{ id: "stk-1", name: activeSticker, x: 80, y: 20, scale: 1 }]
          : [],
      });

      // 2. Generate flat high-resolution 300 DPI production file (ONLY customer art, no phone chassis or wall)
      const productionPrintUrl = await generateProductionArtwork({
        mockup: activeMockup,
        artworkUrl: activeArtworkUrl,
        transform: { x: posX, y: posY, scale: scale / 100, rotation },
        customTexts: customText
          ? [{ id: "txt-1", text: customText, font: selectedFont, size: textSize, color: textColor, x: 50, y: 84, rotation: 0 }]
          : [],
        customStickers: activeSticker
          ? [{ id: "stk-1", name: activeSticker, x: 80, y: 20, scale: 1 }]
          : [],
      });

      const payload = {
        ...getStructuredPayload(),
        mockupId: activeMockup.id,
        mockupName: activeMockup.name,
        productionArtworkUrl: productionPrintUrl,
        mockupPreviewUrl: mockupPreviewUrl,
      };
      const orderId = `CT-${Math.floor(1000 + Math.random() * 9000)}`;

      saveCustomOrderDesign({
        orderId,
        customerName: "Custom Studio Buyer",
        customerPhone: "+91 98200 11223",
        phoneModel: selectedModel,
        caseType: selectedCaseType,
        designPreviewUrl: mockupPreviewUrl,
        printFileUrl: productionPrintUrl,
        customizationData: payload as any,
        price: priceQuote.total,
        orderStatus: "CONFIRMED",
        createdAt: new Date().toISOString(),
      });

      addToCart(
        {
          id: `custom-${Date.now()}`,
          name: `Custom ${selectedModel} ${selectedCaseType}`,
          franchise: "custom",
          category: "case",
          tag: "Personalized Armor",
          price: priceQuote.total,
          originalPrice: Math.round(priceQuote.total * 1.5),
          rating: 5.0,
          reviewsCount: 1,
          image: mockupPreviewUrl,
          formats: [selectedCaseType],
          description: `Custom ${selectedModel} phone case (${selectedCaseType}) with custom call-sign "${customText}".`,
        },
        selectedCaseType,
        selectedModel,
        undefined,
        mockupPreviewUrl
      );
      showToast("Added realistic custom case to cart!");
    } catch (err) {
      console.error("Failed adding to cart:", err);
      showToast("Error creating product preview. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const brands = Array.from(new Set(phoneModels.map((m) => m.brand)));
  const modelsInBrand = phoneModels.filter((m) => m.brand === selectedBrand);

  const filteredAssets = assets.filter((a) => {
    if (stickerCategory === "ALL") return true;
    return a.category === stickerCategory;
  });

  // Filter effect style
  const filterStyle = `brightness(${effects.brightness}%) contrast(${effects.contrast}%) saturate(${effects.saturation}%) blur(${effects.blur}px) grayscale(${effects.grayscale}%) sepia(${effects.sepia}%)`;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--background)", color: "var(--foreground)" }}>
      {/* Floating Toast */}
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

      {/* ─── STEP PROGRESS WIZARD BAR ───────────────────────── */}
      <div
        style={{
          backgroundColor: "var(--surface)",
          borderBottom: "1px solid var(--surface-border)",
          padding: "12px 24px",
          position: "sticky",
          top: "70px",
          zIndex: 40,
          overflowX: "auto",
        }}
      >
        <div className="container" style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: "750px" }}>
          {[
            { step: 1, label: "1. Choose Phone", icon: "📱" },
            { step: 2, label: "2. Choose Case", icon: "🛡️" },
            { step: 3, label: "3. Upload Photo", icon: "📷" },
            { step: 4, label: "4. Edit Photo", icon: "🎨" },
            { step: 5, label: "5. Text & Stickers", icon: "✨" },
            { step: 6, label: "6. 3D Preview", icon: "🧊" },
            { step: 7, label: "7. Buy Case", icon: "🛒" },
          ].map((s) => {
            const isDone = currentStep > s.step;
            const isCurr = currentStep === s.step;
            return (
              <button
                key={s.step}
                onClick={() => setCurrentStep(s.step)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 14px",
                  borderRadius: "20px",
                  backgroundColor: isCurr ? "var(--main-accent)" : isDone ? "rgba(46, 213, 115, 0.12)" : "var(--surface-raised)",
                  color: isCurr ? "#fff" : isDone ? "#2ed573" : "var(--foreground-muted)",
                  border: isCurr ? "none" : isDone ? "1px solid rgba(46, 213, 115, 0.3)" : "1px solid var(--surface-border)",
                  fontSize: "0.78rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s",
                }}
              >
                <span>{isDone ? "✓" : s.icon}</span>
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── WORKSPACE LAYOUT ─────────────────────────────────── */}
      <div className="container" style={{ padding: "30px 16px 60px", flex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 440px", gap: "36px", alignItems: "start" }}>

          {/* ════ LEFT COLUMN: REAL-TIME 2D CANVAS & 3D STAGE ════ */}
          <div
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--surface-border)",
              borderRadius: "16px",
              padding: "32px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "680px",
              position: "relative",
              boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
            }}
          >
            {/* View Mode Toggle: Realistic PSD Mockup vs 3D Angles */}
            <div
              style={{
                position: "absolute",
                top: "18px",
                display: "flex",
                gap: "6px",
                backgroundColor: "rgba(10, 10, 12, 0.85)",
                backdropFilter: "blur(12px)",
                padding: "4px",
                borderRadius: "999px",
                border: "1px solid var(--surface-border)",
                zIndex: 30,
              }}
            >
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "999px",
                  fontSize: "0.78rem",
                  fontWeight: 800,
                  backgroundColor: currentStep !== 6 ? "var(--main-accent)" : "transparent",
                  color: currentStep !== 6 ? "#fff" : "var(--foreground-muted)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                📱 Realistic PSD Mockup
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(6)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "999px",
                  fontSize: "0.78rem",
                  fontWeight: 800,
                  backgroundColor: currentStep === 6 ? "var(--main-accent)" : "transparent",
                  color: currentStep === 6 ? "#fff" : "var(--foreground-muted)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                🧊 3D Case Angles
              </button>
            </div>

            {/* Visual Guidelines Indicator Pill */}
            {currentStep !== 6 && (
              <div
                style={{
                  position: "absolute",
                  bottom: "18px",
                  left: "20px",
                  display: "flex",
                  gap: "12px",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  backgroundColor: "var(--surface-raised)",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  border: "1px solid var(--surface-border)",
                  zIndex: 25,
                }}
              >
                <span style={{ color: "#22c55e", display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#22c55e" }} />
                  Safe Zone
                </span>
                <span style={{ color: "#3b82f6", display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#3b82f6" }} />
                  Printable Slot
                </span>
                <span style={{ color: "#ef4444", display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#ef4444" }} />
                  Camera Protected
                </span>
              </div>
            )}

            {/* ─── STAGE A: REAL PSD-BASED PHONE CASE MOCKUP CANVAS ─── */}
            {currentStep !== 6 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  position: "relative",
                }}
              >
                <PSDMockupCanvas
                  mockup={activeMockup}
                  artworkUrl={activeArtworkUrl}
                  transform={{
                    x: posX,
                    y: posY,
                    scale: scale / 100,
                    rotation: rotation,
                  }}
                  onTransformChange={(t) => {
                    setPosX(t.x);
                    setPosY(t.y);
                    setScale(Math.round(t.scale * 100));
                    setRotation(t.rotation);
                  }}
                  customTexts={
                    customText
                      ? [
                          {
                            id: "user-text",
                            text: customText,
                            font: selectedFont,
                            size: textSize,
                            color: textColor,
                            x: 50,
                            y: 84,
                            rotation: 0,
                          },
                        ]
                      : []
                  }
                  customStickers={
                    activeSticker
                      ? [
                          {
                            id: "user-sticker",
                            name: activeSticker,
                            x: 80,
                            y: 20,
                            scale: 1,
                          },
                        ]
                      : []
                  }
                  filterStyle={filterStyle}
                  caseType={selectedCaseType}
                  interactive={true}
                  showGuidelines={showGuidelines}
                  displayScale={0.72}
                />

                {/* Floating Canvas Quick Tools */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginTop: "16px",
                    backgroundColor: "rgba(10, 10, 14, 0.85)",
                    backdropFilter: "blur(12px)",
                    padding: "6px 14px",
                    borderRadius: "24px",
                    border: "1px solid var(--surface-border)",
                    zIndex: 25,
                  }}
                >
                  <button
                    type="button"
                    onClick={handleFitToCase}
                    title="Fit photo inside case"
                    style={{
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      backgroundColor: "var(--surface-raised)",
                      border: "1px solid var(--surface-border)",
                      color: "var(--foreground)",
                      cursor: "pointer",
                    }}
                  >
                    Fit Case
                  </button>
                  <button
                    type="button"
                    onClick={handleFillCase}
                    title="Fill entire phone case"
                    style={{
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      backgroundColor: "var(--surface-raised)",
                      border: "1px solid var(--surface-border)",
                      color: "var(--foreground)",
                      cursor: "pointer",
                    }}
                  >
                    Fill Case
                  </button>
                  <button
                    type="button"
                    onClick={handleCenter}
                    title="Center image"
                    style={{
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      backgroundColor: "var(--surface-raised)",
                      border: "1px solid var(--surface-border)",
                      color: "var(--foreground)",
                      cursor: "pointer",
                    }}
                  >
                    Center
                  </button>
                  <button
                    type="button"
                    onClick={() => rotateStep(90)}
                    title="Rotate 90 degrees"
                    style={{
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      backgroundColor: "var(--surface-raised)",
                      border: "1px solid var(--surface-border)",
                      color: "var(--foreground)",
                      cursor: "pointer",
                    }}
                  >
                    ↻ 90°
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowGuidelines(!showGuidelines)}
                    title="Toggle Print/Camera Guidelines"
                    style={{
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      backgroundColor: showGuidelines ? "rgba(230, 57, 70, 0.2)" : "var(--surface-raised)",
                      border: showGuidelines ? "1px solid var(--main-accent)" : "1px solid var(--surface-border)",
                      color: showGuidelines ? "var(--main-accent)" : "var(--foreground-muted)",
                      cursor: "pointer",
                    }}
                  >
                    {showGuidelines ? "Hide Guides" : "Show Guides"}
                  </button>
                </div>
              </div>
            )}

            {/* ─── STAGE B: REAL 3D PREVIEW ─── */}
            {currentStep === 6 && (
              <PhoneCase3D
                artworkUrl={activeArtworkUrl}
                phoneModel={selectedModel}
                caseType={selectedCaseType}
                width={280}
                height={570}
                rotY={rot3dY}
                rotX={rot3dX}
                onRotate={(y, x) => {
                  setRot3dY(y);
                  setRot3dX(x);
                }}
                customOverlay={
                  <>
                    {/* Text overlay in 3D */}
                    {customText && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: "38px",
                          left: "20px",
                          right: "20px",
                          textAlign: "center",
                          color: textColor,
                          fontFamily: selectedFont,
                          fontSize: "1.1rem",
                          fontWeight: 900,
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          textShadow: "0 2px 10px rgba(0,0,0,0.9)",
                          backgroundColor: "rgba(0,0,0,0.45)",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        {customText}
                      </div>
                    )}

                    {/* Sticker overlay in 3D */}
                    {activeSticker && (
                      <div
                        style={{
                          position: "absolute",
                          top: "130px",
                          right: "16px",
                          backgroundColor: "var(--shinra-red)",
                          color: "#ffffff",
                          fontFamily: selectedFont,
                          fontSize: "0.7rem",
                          fontWeight: 900,
                          padding: "4px 8px",
                          borderRadius: "3px",
                          boxShadow: "0 4px 10px rgba(0,0,0,0.8)",
                        }}
                      >
                        {activeSticker}
                      </div>
                    )}
                  </>
                }
              />
            )}

            {/* 3D View Angle Controls */}
            {currentStep === 6 && (
              <div style={{ display: "flex", gap: "8px", marginTop: "16px", flexWrap: "wrap", justifyContent: "center" }}>
                <button
                  onClick={() => {
                    setRot3dY(0);
                    setRot3dX(0);
                  }}
                  style={{ padding: "6px 12px", borderRadius: "6px", backgroundColor: rot3dY === 0 ? "var(--main-accent)" : "var(--surface-raised)", color: rot3dY === 0 ? "#fff" : "var(--foreground)", border: "1px solid var(--surface-border)", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}
                >
                  Front View
                </button>
                <button
                  onClick={() => {
                    setRot3dY(-28);
                    setRot3dX(8);
                  }}
                  style={{ padding: "6px 12px", borderRadius: "6px", backgroundColor: rot3dY === -28 ? "var(--main-accent)" : "var(--surface-raised)", color: rot3dY === -28 ? "#fff" : "var(--foreground)", border: "1px solid var(--surface-border)", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}
                >
                  Left Tilt 3D
                </button>
                <button
                  onClick={() => {
                    setRot3dY(28);
                    setRot3dX(8);
                  }}
                  style={{ padding: "6px 12px", borderRadius: "6px", backgroundColor: rot3dY === 28 ? "var(--main-accent)" : "var(--surface-raised)", color: rot3dY === 28 ? "#fff" : "var(--foreground)", border: "1px solid var(--surface-border)", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}
                >
                  Right Tilt 3D
                </button>
                <button
                  onClick={() => {
                    setRot3dY(0);
                    setRot3dX(0);
                    setZoom3d(100);
                  }}
                  style={{ padding: "6px 12px", borderRadius: "6px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}
                >
                  ↺ Reset Angle
                </button>
              </div>
            )}
          </div>

          {/* ════ RIGHT COLUMN: 7-STEP INTERACTIVE CONTROLS ════ */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* ─── STEP 1: CHOOSE PHONE ─── */}
            <div
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--surface-border)",
                borderRadius: "14px",
                padding: "20px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--main-accent)" }}>
                  STEP 1: Choose Your Phone
                </span>
                <span style={{ fontSize: "0.72rem", color: "var(--foreground-muted)", fontWeight: 700 }}>
                  {phoneModels.length} Models in Database
                </span>
              </div>

              {/* Brand Chips */}
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
                {brands.map((b) => (
                  <button
                    key={b}
                    onClick={() => {
                      setSelectedBrand(b);
                      const first = phoneModels.find((m) => m.brand === b);
                      if (first) {
                        setSelectedModel(first.name);
                        setDevice(b, first.name);
                      }
                    }}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "6px",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      backgroundColor: selectedBrand === b ? "var(--main-accent)" : "var(--surface-raised)",
                      color: selectedBrand === b ? "#fff" : "var(--foreground-muted)",
                      border: "1px solid var(--surface-border)",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {b}
                  </button>
                ))}
              </div>

              {/* Model Select */}
              <select
                value={selectedModel}
                onChange={(e) => {
                  setSelectedModel(e.target.value);
                  setDevice(selectedBrand, e.target.value);
                }}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  backgroundColor: "var(--surface-raised)",
                  border: "1px solid var(--surface-border)",
                  color: "var(--foreground)",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                {modelsInBrand.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name} ({m.canvasWidth}x{m.canvasHeight}px)
                  </option>
                ))}
              </select>
            </div>

            {/* ─── STEP 2: CHOOSE CASE FINISH ─── */}
            <div
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--surface-border)",
                borderRadius: "14px",
                padding: "20px",
              }}
            >
              <div style={{ fontSize: "0.8rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--main-accent)", marginBottom: "12px" }}>
                STEP 2: Select Armor Finish & Grade
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
                {caseTypes.map((c) => {
                  const isSel = selectedFinish === c.finishType;
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedFinish(c.finishType);
                        setSelectedCaseType(c.name);
                      }}
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        textAlign: "left",
                        backgroundColor: isSel ? "rgba(230, 57, 70, 0.12)" : "var(--surface-raised)",
                        border: isSel ? "2px solid var(--main-accent)" : "1px solid var(--surface-border)",
                        cursor: "pointer",
                        color: "var(--foreground)",
                        transition: "all 0.15s",
                      }}
                    >
                      <div style={{ fontWeight: 800, fontSize: "0.82rem" }}>{c.name}</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--main-accent)", fontWeight: 900, marginTop: "2px" }}>
                        ₹{c.price}
                      </div>
                      <div style={{ fontSize: "0.68rem", color: "var(--foreground-muted)", marginTop: "2px" }}>
                        {c.dropProtection}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ─── STEP 3: UPLOAD PHOTO ─── */}
            <div
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--surface-border)",
                borderRadius: "14px",
                padding: "20px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--main-accent)" }}>
                  STEP 3: Upload Your Photo
                </span>
                <span style={{ fontSize: "0.7rem", color: "var(--foreground-muted)" }}>
                  JPG, JPEG, PNG, WEBP
                </span>
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: "8px",
                  border: "2px dashed var(--main-accent)",
                  backgroundColor: "rgba(230, 57, 70, 0.05)",
                  color: "var(--foreground)",
                  fontWeight: 800,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.15s",
                }}
              >
                <span style={{ fontSize: "1.6rem" }}>📤</span>
                <span>+ UPLOAD YOUR PHOTO</span>
                <span style={{ fontSize: "0.72rem", color: "var(--foreground-muted)", fontWeight: 500 }}>
                  High-resolution photo for maximum 300 DPI clarity
                </span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/png, image/jpeg, image/jpg, image/webp"
                style={{ display: "none" }}
              />


            </div>

            {/* ─── STEP 4: 2D DESIGN EDITOR ─── */}
            <div
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--surface-border)",
                borderRadius: "14px",
                padding: "20px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--main-accent)" }}>
                  STEP 4: 2D Photo Editor
                </span>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button onClick={handleUndo} disabled={historyIndex <= 0} style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "0.72rem", fontWeight: 700, backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)", cursor: "pointer", opacity: historyIndex <= 0 ? 0.4 : 1 }}>
                    ↺ Undo
                  </button>
                  <button onClick={handleRedo} disabled={historyIndex >= history.length - 1} style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "0.72rem", fontWeight: 700, backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)", cursor: "pointer", opacity: historyIndex >= history.length - 1 ? 0.4 : 1 }}>
                    ↻ Redo
                  </button>
                  <button onClick={handleReset} style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "0.72rem", fontWeight: 700, backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)", cursor: "pointer" }}>
                    Reset
                  </button>
                </div>
              </div>

              {/* Framing Shortcuts */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "16px" }}>
                <button
                  onClick={handleFitToCase}
                  style={{ padding: "8px", borderRadius: "6px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", fontSize: "0.75rem", fontWeight: 800, cursor: "pointer", color: "var(--foreground)" }}
                >
                  FIT TO CASE
                </button>
                <button
                  onClick={handleFillCase}
                  style={{ padding: "8px", borderRadius: "6px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", fontSize: "0.75rem", fontWeight: 800, cursor: "pointer", color: "var(--foreground)" }}
                >
                  FILL CASE
                </button>
                <button
                  onClick={handleCenter}
                  style={{ padding: "8px", borderRadius: "6px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", fontSize: "0.75rem", fontWeight: 800, cursor: "pointer", color: "var(--foreground)" }}
                >
                  CENTER
                </button>
              </div>

              {/* Resize & Zoom Slider */}
              <div style={{ marginBottom: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px" }}>
                  <span>Scale / Zoom</span>
                  <span>{scale}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="200"
                  value={scale}
                  onChange={(e) => setScale(parseInt(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--main-accent)" }}
                />
              </div>

              {/* Rotation Sliders & 90deg buttons */}
              <div style={{ marginBottom: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>Rotation</span>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button onClick={() => rotateStep(-90)} style={{ padding: "2px 8px", borderRadius: "4px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", fontSize: "0.7rem", fontWeight: 800, cursor: "pointer" }}>
                      -90°
                    </button>
                    <button onClick={() => rotateStep(90)} style={{ padding: "2px 8px", borderRadius: "4px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", fontSize: "0.7rem", fontWeight: 800, cursor: "pointer" }}>
                      +90°
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={rotation}
                  onChange={(e) => setRotation(parseInt(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--main-accent)" }}
                />
              </div>

              {/* Flip Horizontal / Vertical */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
                <button
                  onClick={() => setFlipH(!flipH)}
                  style={{ flex: 1, padding: "7px", borderRadius: "6px", backgroundColor: flipH ? "rgba(230, 57, 70, 0.15)" : "var(--surface-raised)", border: flipH ? "1px solid var(--main-accent)" : "1px solid var(--surface-border)", color: flipH ? "var(--main-accent)" : "var(--foreground)", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}
                >
                  ⇄ Flip Horizontal
                </button>
                <button
                  onClick={() => setFlipV(!flipV)}
                  style={{ flex: 1, padding: "7px", borderRadius: "6px", backgroundColor: flipV ? "rgba(230, 57, 70, 0.15)" : "var(--surface-raised)", border: flipV ? "1px solid var(--main-accent)" : "1px solid var(--surface-border)", color: flipV ? "var(--main-accent)" : "var(--foreground)", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}
                >
                  ⇅ Flip Vertical
                </button>
              </div>

              {/* Photo Effects Sliders */}
              <div style={{ backgroundColor: "var(--surface-raised)", borderRadius: "8px", padding: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", color: "var(--main-accent)" }}>
                  Photo Effects & Filters
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", fontWeight: 700 }}>
                    <span>Brightness</span>
                    <span>{effects.brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={effects.brightness}
                    onChange={(e) => setEffects({ ...effects, brightness: parseInt(e.target.value) })}
                    style={{ width: "100%", accentColor: "var(--main-accent)" }}
                  />
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", fontWeight: 700 }}>
                    <span>Contrast</span>
                    <span>{effects.contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={effects.contrast}
                    onChange={(e) => setEffects({ ...effects, contrast: parseInt(e.target.value) })}
                    style={{ width: "100%", accentColor: "var(--main-accent)" }}
                  />
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", fontWeight: 700 }}>
                    <span>Grayscale</span>
                    <span>{effects.grayscale}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={effects.grayscale}
                    onChange={(e) => setEffects({ ...effects, grayscale: parseInt(e.target.value) })}
                    style={{ width: "100%", accentColor: "var(--main-accent)" }}
                  />
                </div>
              </div>
            </div>

            {/* ─── STEP 5: OPTIONAL TEXT & STICKERS ─── */}
            <div
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--surface-border)",
                borderRadius: "14px",
                padding: "20px",
              }}
            >
              <div style={{ fontSize: "0.8rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--main-accent)", marginBottom: "12px" }}>
                STEP 5: Custom Typography & Stickers
              </div>

              {/* Text Input & Color Picker */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Enter name, gamertag, kanji..."
                  maxLength={20}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRadius: "6px",
                    backgroundColor: "var(--surface-raised)",
                    border: "1px solid var(--surface-border)",
                    color: "var(--foreground)",
                    fontSize: "0.85rem",
                    fontFamily: selectedFont,
                  }}
                />
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  style={{ width: "42px", height: "42px", borderRadius: "6px", border: "1px solid var(--surface-border)", padding: "2px", cursor: "pointer", backgroundColor: "var(--surface-raised)" }}
                />
              </div>

              {/* Font Selector */}
              <div style={{ marginBottom: "14px" }}>
                <select
                  value={selectedFont}
                  onChange={(e) => setSelectedFont(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)", fontSize: "0.82rem", fontWeight: 700 }}
                >
                  {fonts.map((f) => (
                    <option key={f.id} value={f.family}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sticker Selector */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--foreground-muted)" }}>
                    Hologram Badge:
                  </span>
                  <select
                    value={stickerCategory}
                    onChange={(e) => setStickerCategory(e.target.value)}
                    style={{ padding: "3px 6px", borderRadius: "4px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", fontSize: "0.7rem", color: "var(--foreground)" }}
                  >
                    <option value="ALL">All Categories</option>
                    {STICKER_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  <button
                    onClick={() => setActiveSticker(null)}
                    style={{ padding: "5px 10px", borderRadius: "4px", backgroundColor: activeSticker === null ? "var(--main-accent)" : "var(--surface-raised)", color: "#fff", border: "1px solid var(--surface-border)", fontSize: "0.7rem", fontWeight: 700, cursor: "pointer" }}
                  >
                    None
                  </button>
                  {filteredAssets.map((stk) => (
                    <button
                      key={stk.id}
                      onClick={() => setActiveSticker(stk.url)}
                      style={{ padding: "5px 10px", borderRadius: "4px", backgroundColor: activeSticker === stk.url ? "var(--main-accent)" : "var(--surface-raised)", color: "#fff", border: "1px solid var(--surface-border)", fontSize: "0.7rem", fontWeight: 700, cursor: "pointer" }}
                    >
                      {stk.url}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ─── STEP 7: PRICE & BUY ─── */}
            <div
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--surface-border)",
                borderRadius: "14px",
                padding: "20px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "var(--foreground-muted)", textTransform: "uppercase" }}>
                    Total Custom Case Price
                  </div>
                  <div style={{ fontSize: "2rem", fontWeight: 900, color: "var(--foreground)" }}>
                    ₹{priceQuote.total}
                  </div>
                </div>
                <div style={{ textAlign: "right", fontSize: "0.72rem", color: "#22c55e", fontWeight: 700 }}>
                  ✓ 100% Precision Mold Guarantee
                  <br />
                  ✓ High-Speed UV DTF Press
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={handleSaveToDesigns}
                  disabled={isExporting}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "8px",
                    backgroundColor: "transparent",
                    border: "1px solid var(--surface-border)",
                    color: "var(--foreground)",
                    fontSize: "0.85rem",
                    fontWeight: 800,
                    cursor: "pointer",
                    textTransform: "uppercase",
                  }}
                >
                  Save Design
                </button>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isExporting}
                  style={{
                    flex: 1.5,
                    padding: "12px",
                    borderRadius: "8px",
                    backgroundColor: "var(--main-accent)",
                    border: "none",
                    color: "#ffffff",
                    fontSize: "0.85rem",
                    fontWeight: 900,
                    cursor: "pointer",
                    textTransform: "uppercase",
                    boxShadow: "0 4px 14px rgba(230, 57, 70, 0.3)",
                  }}
                >
                  {isExporting ? "Generating Print Master..." : "Add to Cart 🛒"}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
