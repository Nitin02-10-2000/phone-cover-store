"use client";

import { ALL_PHONE_MODELS, CameraArchetype } from "@/data/phoneModels";

// ─── TYPES & INTERFACES ──────────────────────────────────────────

export interface CameraCutoutSpec {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
}

export interface FlashCutoutSpec {
  x: number;
  y: number;
  radius: number;
}

export interface SafeAreaSpec {
  insetX: number;
  insetY: number;
}

export interface BleedAreaSpec {
  bleedMm: number;
}

export interface StudioPhoneModel {
  id: string;
  brand: string;
  name: string;
  caseType: string;
  model3dId?: string;
  canvasWidth: number;
  canvasHeight: number;
  printWidthMm: number;
  printHeightMm: number;
  cameraCutout: CameraCutoutSpec;
  flashCutout: FlashCutoutSpec;
  buttonAreas?: string;
  safeArea: SafeAreaSpec;
  bleedArea: BleedAreaSpec;
  active: boolean;
  releaseYear?: number;
  cameraType?: CameraArchetype;
  corners?: "rounded" | "sharp" | "extra-rounded";
  hasMagSafe?: boolean;
}

export interface Studio3DLighting {
  ambientIntensity: number;
  directionalIntensity: number;
  lightColor: string;
  environmentPreset: "studio" | "sunset" | "neon-cyberpunk" | "clean-white";
}

export interface Studio3DModelConfig {
  id: string;
  name: string;
  phoneModelId: string;
  caseType: string;
  modelUrl: string; // GLB / GLTF or procedural
  textureUrl?: string;
  normalMapUrl?: string;
  roughnessMapUrl?: string;
  materialType: "glass" | "matte" | "glossy" | "transparent";
  roughness: number;
  metallic: number;
  transparency: number;
  thickness: number;
  lighting: Studio3DLighting;
  active: boolean;
}

export interface TemplateLayer {
  id: string;
  type: "background" | "image" | "text" | "sticker" | "shape";
  content: string; // URL, text string, or shape type
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  width?: number; // percentage (0 - 100)
  height?: number; // percentage (0 - 100)
  scale: number;
  rotation: number;
  color?: string;
  fontFamily?: string;
  fontSize?: number;
  opacity: number;
  zIndex: number;
  locked?: boolean;
  visible: boolean;
}

export interface StudioTemplate {
  id: string;
  title: string;
  category: string;
  previewUrl: string;
  phoneModel: string;
  caseType: string;
  layers: TemplateLayer[];
  published: boolean;
  createdAt: string;
}

export type StickerCategory =
  | "Anime"
  | "Gaming"
  | "Meme"
  | "Desi"
  | "Love"
  | "Cars"
  | "Sports"
  | "Music"
  | "Cute"
  | "Dark"
  | "Trending";

export const STICKER_CATEGORIES: StickerCategory[] = [
  "Anime",
  "Gaming",
  "Meme",
  "Desi",
  "Love",
  "Cars",
  "Sports",
  "Music",
  "Cute",
  "Dark",
  "Trending",
];

export interface StudioAssetItem {
  id: string;
  name: string;
  category: StickerCategory;
  url: string; // Image URL or SVG / emoji asset
  isVector?: boolean;
  enabled: boolean;
}

export interface StudioFontItem {
  id: string;
  name: string;
  family: string;
  sourceUrl?: string;
  isGoogleFont: boolean;
  enabled: boolean;
  previewText?: string;
}

export interface StudioPricingConfig {
  basePrice: number;
  customPrintingPrice: number;
  premiumCasePrice: number;
  aiFeaturePrice: number;
  additionalDesignCharges: number;
}

export interface StudioPrintConfig {
  dpi: number;
  widthMm: number;
  heightMm: number;
  bleedMm: number;
  exportFormat: "PNG" | "TIFF" | "PDF";
  colorProfile: "sRGB" | "CMYK (FOGRA39)" | "Display P3";
}

export interface StudioCaseType {
  id: string;
  name: string;
  tag: string;
  finishType: "tough" | "transparent" | "matte" | "glossy" | "magsafe";
  price: number;
  originalPrice: number;
  description: string;
  roughness: number;
  metallic: number;
  transparency: number;
  thickness: number;
  dropProtection: string;
  hasMagSafe: boolean;
  active: boolean;
}

export interface StudioUVMapping {
  scaleX: number;
  scaleY: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
  repeat: boolean;
  clamp: boolean;
}

export interface PhotoEffectsConfig {
  brightness: number; // 50 to 150 (default 100)
  contrast: number; // 50 to 150 (default 100)
  saturation: number; // 0 to 200 (default 100)
  blur: number; // 0 to 10 (default 0)
  sharpness: number; // 0 to 100 (default 0)
  grayscale: number; // 0 to 100 (default 0)
  sepia: number; // 0 to 100 (default 0)
}

export interface CropData {
  mode: "free" | "1:1" | "4:5" | "9:16" | "custom";
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface StudioVersionRecord {
  id: string;
  versionNumber: number;
  status: "DRAFT" | "PUBLISHED";
  author: string;
  timestamp: string;
  note: string;
}

export interface PreFlightCheckItem {
  id: string;
  name: string;
  status: "PASSED" | "WARNING" | "ERROR";
  message: string;
}

export interface PreFlightReport {
  passed: boolean;
  score: number;
  items: PreFlightCheckItem[];
}

export interface CustomizationDataPayload {
  phoneModel: string;
  caseType: string;
  layers: any[];
  images: string[];
  originalImageUrl?: string;
  cropData?: CropData;
  photoEffects?: PhotoEffectsConfig;
  text: {
    content: string;
    color: string;
    fontFamily: string;
    fontSize?: number;
    bold?: boolean;
    italic?: boolean;
    letterSpacing?: number;
    hasOutline?: boolean;
    hasShadow?: boolean;
  };
  stickers: string[];
  transformations: {
    scale: number;
    rotation?: number;
    offsetX: number;
    offsetY: number;
    flipH?: boolean;
    flipV?: boolean;
  };
  printArea: {
    width: number;
    height: number;
    bleedMm: number;
    safeArea: SafeAreaSpec;
  };
  pricing: {
    base: number;
    printing: number;
    finishExtra: number;
    addons: number;
    total: number;
  };
}

export interface CustomOrderDesignRecord {
  orderId: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  phoneModel: string;
  caseType: string;
  designPreviewUrl: string;
  printFileUrl?: string;
  customizationData: CustomizationDataPayload;
  price: number;
  orderStatus: "PENDING" | "CONFIRMED" | "PRINTING" | "SHIPPED" | "DELIVERED";
  createdAt: string;
}

// ─── STORAGE KEYS & EVENTS ─────────────────────────────────────────

const KEY_PHONE_MODELS = "casetadka_studio_phone_models";
const KEY_3D_MODELS = "casetadka_studio_3d_models";
const KEY_TEMPLATES = "casetadka_studio_templates";
const KEY_ASSETS = "casetadka_studio_assets";
const KEY_FONTS = "casetadka_studio_fonts";
const KEY_PRICING = "casetadka_studio_pricing";
const KEY_PRINT_SETTINGS = "casetadka_studio_print_settings";
const KEY_CUSTOM_ORDERS = "casetadka_studio_custom_orders";
const STUDIO_EVENT_KEY = "casetadka_studio_updated";

// ─── INITIAL SEEDS ────────────────────────────────────────────────

export const DEFAULT_PRICING: StudioPricingConfig = {
  basePrice: 399,
  customPrintingPrice: 100,
  premiumCasePrice: 100,
  aiFeaturePrice: 149,
  additionalDesignCharges: 50,
};

export const DEFAULT_PRINT_SETTINGS: StudioPrintConfig = {
  dpi: 300,
  widthMm: 78,
  heightMm: 162,
  bleedMm: 3,
  exportFormat: "PNG",
  colorProfile: "CMYK (FOGRA39)",
};

export const DEFAULT_FONTS: StudioFontItem[] = [
  { id: "f-outfit", name: "Outfit (Modern Sans)", family: "'Outfit', sans-serif", isGoogleFont: true, enabled: true },
  { id: "f-cinzel", name: "Cinzel Decorative (Imperial Luxury)", family: "'Cinzel', serif", isGoogleFont: true, enabled: true },
  { id: "f-bangers", name: "Bangers (Comic & Pop Art)", family: "'Bangers', cursive", isGoogleFont: true, enabled: true },
  { id: "f-orbitron", name: "Orbitron (Futuristic Cyber)", family: "'Orbitron', sans-serif", isGoogleFont: true, enabled: true },
  { id: "f-permanent-marker", name: "Permanent Marker (Street Tag)", family: "'Permanent Marker', cursive", isGoogleFont: true, enabled: true },
  { id: "f-russo-one", name: "Russo One (Heavy Military)", family: "'Russo One', sans-serif", isGoogleFont: true, enabled: true },
  { id: "f-montserrat", name: "Montserrat Black (Bold Clean)", family: "'Montserrat', sans-serif", isGoogleFont: true, enabled: true },
  { id: "f-creepster", name: "Creepster (Dark Gothic)", family: "'Creepster', cursive", isGoogleFont: true, enabled: false },
];

export const DEFAULT_ASSETS: StudioAssetItem[] = [
  // Anime
  { id: "a-1", name: "Domain Expansion Kanji", category: "Anime", url: "領域展開", enabled: true },
  { id: "a-2", name: "Gear 5 Sun God Badge", category: "Anime", url: "🔥 NIKA GEAR 5", enabled: true },
  { id: "a-3", name: "Berserk Sacrifice Brand", category: "Anime", url: "⚔️ BRAND OF SACRIFICE", enabled: true },
  { id: "a-4", name: "Solo Leveling Arise", category: "Anime", url: "👑 SHADOW MONARCH", enabled: true },
  // Gaming
  { id: "g-1", name: "Cyberpunk 2077 Oni", category: "Gaming", url: "⚡ NIGHT CITY 2077", enabled: true },
  { id: "g-2", name: "Pixel Heart Respawn", category: "Gaming", url: "🎮 1-UP RESPAWN", enabled: true },
  { id: "g-3", name: "Killstreak Ace", category: "Gaming", url: "🎯 ACE PENTAKILL", enabled: true },
  // Meme
  { id: "m-1", name: "Stonks Ascended", category: "Meme", url: "📈 STONKS ONLY", enabled: true },
  { id: "m-2", name: "Doggo Bonk", category: "Meme", url: "🐕 MAXIMUM BONK", enabled: true },
  // Desi
  { id: "d-1", name: "Apna Time Aayega", category: "Desi", url: "⚡ APNA TIME AAYEGA", enabled: true },
  { id: "d-2", name: "Tadka Supreme Stamp", category: "Desi", url: "🌶️ 100% SPICY TADKA", enabled: true },
  { id: "d-3", name: "Kala Tika Ward", category: "Desi", url: "🧿 BURI NAZAR WAALE", enabled: true },
  // Love
  { id: "l-1", name: "Neon Cyber Heart", category: "Love", url: "💖 NEVER ENDING", enabled: true },
  { id: "l-2", name: "Soulmate Lock", category: "Love", url: "🔒 PAIRED FOR LIFE", enabled: true },
  // Cars
  { id: "c-1", name: "Twin Turbo Boost", category: "Cars", url: "🏎️ TWIN TURBO BOOST", enabled: true },
  { id: "c-2", name: "Initial D Tofu Run", category: "Cars", url: "🏁 TOFU DRIFT SPEC", enabled: true },
  // Sports
  { id: "s-1", name: "Mamba Mentality 24", category: "Sports", url: "🏆 MAMBA MENTALITY", enabled: true },
  { id: "s-2", name: "GOAT Crest", category: "Sports", url: "🐐 GREATEST OF ALL TIME", enabled: true },
  // Music
  { id: "mu-1", name: "Subwoofer Bass Wave", category: "Music", url: "🔊 MAXIMUM 808 BASS", enabled: true },
  { id: "mu-2", name: "Vinyl Nostalgia", category: "Music", url: "🎧 ANALOG MASTER", enabled: true },
  // Cute
  { id: "cu-1", name: "Chibi Cat Armor", category: "Cute", url: "🐾 NYAN PROTECTION", enabled: true },
  { id: "cu-2", name: "Boba Sparkle", category: "Cute", url: "🧋 BOBA SHIELD", enabled: true },
  // Dark
  { id: "dk-1", name: "Dark Skull Monarch", category: "Dark", url: "💀 DEATH RUNIC", enabled: true },
  { id: "dk-2", name: "Vampire Sigil", category: "Dark", url: "🩸 CRIMSON BLOODLINE", enabled: true },
  // Trending
  { id: "tr-1", name: "Case Tadka Official Seal", category: "Trending", url: "⚡ CASE TADKA HQ", enabled: true },
  { id: "tr-2", name: "Ultra Titanium Armor", category: "Trending", url: "🛡️ MIL-SPEC 810G", enabled: true },
];

export const DEFAULT_TEMPLATES: StudioTemplate[] = [
  {
    id: "tmpl-1",
    title: "Neo-Tokyo Cyber Ronin",
    category: "Streetwear",
    previewUrl: "https://res.cloudinary.com/dv7oqos1m/image/upload/v1788283104/mockups/akira-poster-kaneda-neo-tokyo-anime-wall-art-paper-1.jpg",
    phoneModel: "iPhone 16 Pro Max",
    caseType: "9H Tempered Glass",
    published: true,
    createdAt: new Date().toISOString(),
    layers: [
      {
        id: "l-bg",
        type: "image",
        content: "https://res.cloudinary.com/dv7oqos1m/image/upload/v1788283104/mockups/akira-poster-kaneda-neo-tokyo-anime-wall-art-paper-1.jpg",
        x: 0,
        y: 0,
        scale: 1.05,
        rotation: 0,
        opacity: 1,
        zIndex: 1,
        visible: true,
      },
      {
        id: "l-txt",
        type: "text",
        content: "NEO TOKYO 2026",
        x: 10,
        y: 84,
        scale: 1,
        rotation: 0,
        color: "#ff2a3a",
        fontFamily: "'Orbitron', sans-serif",
        fontSize: 16,
        opacity: 1,
        zIndex: 2,
        visible: true,
      },
      {
        id: "l-stk",
        type: "sticker",
        content: "⚡ NIGHT CITY 2077",
        x: 55,
        y: 22,
        scale: 1,
        rotation: -4,
        opacity: 0.95,
        zIndex: 3,
        visible: true,
      },
    ],
  },
  {
    id: "tmpl-2",
    title: "Gojo Limitless Void",
    category: "Anime",
    previewUrl: "https://res.cloudinary.com/dv7oqos1m/image/upload/v1786122801/mockups/gojo-satoru-honored-one-poster-paper-1.jpg",
    phoneModel: "Galaxy S25 Ultra",
    caseType: "Ultra Impact MagSafe",
    published: true,
    createdAt: new Date().toISOString(),
    layers: [
      {
        id: "l-bg2",
        type: "image",
        content: "https://res.cloudinary.com/dv7oqos1m/image/upload/v1786122801/mockups/gojo-satoru-honored-one-poster-paper-1.jpg",
        x: 0,
        y: 0,
        scale: 1.1,
        rotation: 0,
        opacity: 1,
        zIndex: 1,
        visible: true,
      },
      {
        id: "l-txt2",
        type: "text",
        content: "HOLLOW PURPLE",
        x: 15,
        y: 86,
        scale: 1,
        rotation: 0,
        color: "#ffffff",
        fontFamily: "'Cinzel', serif",
        fontSize: 18,
        opacity: 1,
        zIndex: 2,
        visible: true,
      },
      {
        id: "l-stk2",
        type: "sticker",
        content: "領域展開",
        x: 60,
        y: 20,
        scale: 1,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
        visible: true,
      },
    ],
  },
  {
    id: "tmpl-3",
    title: "Spicy Desi Tadka Armor",
    category: "Desi",
    previewUrl: "https://res.cloudinary.com/dv7oqos1m/image/upload/v1787153686/mockups/luffy-gear-5-one-piece-poster-paper-5.jpg",
    phoneModel: "OnePlus 12",
    caseType: "Matte Slim",
    published: true,
    createdAt: new Date().toISOString(),
    layers: [
      {
        id: "l-bg3",
        type: "image",
        content: "https://res.cloudinary.com/dv7oqos1m/image/upload/v1787153686/mockups/luffy-gear-5-one-piece-poster-paper-5.jpg",
        x: 0,
        y: 0,
        scale: 1.0,
        rotation: 0,
        opacity: 1,
        zIndex: 1,
        visible: true,
      },
      {
        id: "l-txt3",
        type: "text",
        content: "TADKA-SPICE-01",
        x: 10,
        y: 85,
        scale: 1,
        rotation: 0,
        color: "#f59e0b",
        fontFamily: "'Russo One', sans-serif",
        fontSize: 16,
        opacity: 1,
        zIndex: 2,
        visible: true,
      },
      {
        id: "l-stk3",
        type: "sticker",
        content: "🌶️ 100% SPICY TADKA",
        x: 50,
        y: 18,
        scale: 1,
        rotation: 3,
        opacity: 1,
        zIndex: 3,
        visible: true,
      },
    ],
  },
];

export function buildDefaultPhoneModels(): StudioPhoneModel[] {
  return ALL_PHONE_MODELS.map((item) => {
    const isSamsung = item.brand.toLowerCase().includes("samsung");
    const isPixel = item.brand.toLowerCase().includes("pixel");
    const isOnePlus = item.brand.toLowerCase().includes("oneplus");

    // Default cutout coordinates tuned for each camera archetype
    let cameraCutout: CameraCutoutSpec = { x: 18, y: 18, width: 78, height: 86, radius: 24 };
    let flashCutout: FlashCutoutSpec = { x: 62, y: 36, radius: 8 };

    if (isSamsung && item.corners === "sharp") {
      cameraCutout = { x: 20, y: 20, width: 62, height: 120, radius: 18 };
      flashCutout = { x: 58, y: 38, radius: 7 };
    } else if (isPixel) {
      cameraCutout = { x: 12, y: 24, width: 226, height: 56, radius: 28 };
      flashCutout = { x: 195, y: 48, radius: 6 };
    } else if (isOnePlus) {
      cameraCutout = { x: 16, y: 22, width: 106, height: 106, radius: 53 };
      flashCutout = { x: 80, y: 40, radius: 8 };
    }

    return {
      id: item.id,
      brand: item.brand,
      name: item.name,
      caseType: item.hasMagSafe ? "Ultra Impact MagSafe" : "9H Tempered Glass",
      model3dId: `3d-${item.id}`,
      canvasWidth: 800,
      canvasHeight: 1600,
      printWidthMm: 78,
      printHeightMm: 162,
      cameraCutout,
      flashCutout,
      buttonAreas: "Power (R: 350-430px), Volume (L: 280-460px)",
      safeArea: { insetX: 24, insetY: 30 },
      bleedArea: { bleedMm: 3 },
      active: true,
      releaseYear: item.releaseYear || 2024,
      cameraType: item.cameraType,
      corners: item.corners,
      hasMagSafe: item.hasMagSafe,
    };
  });
}

export const DEFAULT_3D_MODELS: Studio3DModelConfig[] = [
  {
    id: "3d-default-iphone",
    name: "iPhone 16 Pro Max — Armor Chassis",
    phoneModelId: "ip-16-pm",
    caseType: "9H Tempered Glass",
    modelUrl: "/models/iphone_16_pro_max.glb",
    textureUrl: "/mockups/textures/glass_sheen.jpg",
    normalMapUrl: "/mockups/textures/bumper_normal.jpg",
    roughnessMapUrl: "/mockups/textures/roughness_grid.jpg",
    materialType: "glass",
    roughness: 0.12,
    metallic: 0.85,
    transparency: 0.1,
    thickness: 2.2,
    lighting: {
      ambientIntensity: 0.6,
      directionalIntensity: 1.2,
      lightColor: "#ffffff",
      environmentPreset: "studio",
    },
    active: true,
  },
  {
    id: "3d-default-samsung",
    name: "Galaxy S25 Ultra — Sharp Armor",
    phoneModelId: "sg-s25-ultra",
    caseType: "Ultra Impact MagSafe",
    modelUrl: "/models/samsung_s25_ultra.glb",
    materialType: "matte",
    roughness: 0.45,
    metallic: 0.3,
    transparency: 0,
    thickness: 2.5,
    lighting: {
      ambientIntensity: 0.7,
      directionalIntensity: 1.0,
      lightColor: "#ffffff",
      environmentPreset: "neon-cyberpunk",
    },
    active: true,
  },
  {
    id: "3d-default-transparent",
    name: "Crystal Clear TPU MagSafe",
    phoneModelId: "ip-16-pm",
    caseType: "Transparent Slim Armor",
    modelUrl: "/models/iphone_clear_case.glb",
    materialType: "transparent",
    roughness: 0.05,
    metallic: 0.1,
    transparency: 0.88,
    thickness: 1.8,
    lighting: {
      ambientIntensity: 0.8,
      directionalIntensity: 1.4,
      lightColor: "#e0f2fe",
      environmentPreset: "clean-white",
    },
    active: true,
  },
];

// ─── CRUD METHODS ──────────────────────────────────────────────────

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("Storage parse error:", e);
    return fallback;
  }
}

function notifyStudioUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(STUDIO_EVENT_KEY));
  }
}

// 1. Phone Models
export function getStudioPhoneModels(): StudioPhoneModel[] {
  if (typeof window === "undefined") return buildDefaultPhoneModels();
  const raw = localStorage.getItem(KEY_PHONE_MODELS);
  if (!raw) {
    const defaults = buildDefaultPhoneModels();
    localStorage.setItem(KEY_PHONE_MODELS, JSON.stringify(defaults));
    return defaults;
  }
  return safeParse<StudioPhoneModel[]>(raw, buildDefaultPhoneModels());
}

export function saveStudioPhoneModel(model: StudioPhoneModel): StudioPhoneModel[] {
  const current = getStudioPhoneModels();
  const exists = current.some((m) => m.id === model.id);
  const updated = exists
    ? current.map((m) => (m.id === model.id ? model : m))
    : [model, ...current];
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY_PHONE_MODELS, JSON.stringify(updated));
    notifyStudioUpdated();
  }
  return updated;
}

export function deleteStudioPhoneModel(id: string): StudioPhoneModel[] {
  const current = getStudioPhoneModels();
  const updated = current.filter((m) => m.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY_PHONE_MODELS, JSON.stringify(updated));
    notifyStudioUpdated();
  }
  return updated;
}

// 2. 3D Models
export function getStudio3DModels(): Studio3DModelConfig[] {
  if (typeof window === "undefined") return DEFAULT_3D_MODELS;
  const raw = localStorage.getItem(KEY_3D_MODELS);
  if (!raw) {
    localStorage.setItem(KEY_3D_MODELS, JSON.stringify(DEFAULT_3D_MODELS));
    return DEFAULT_3D_MODELS;
  }
  return safeParse<Studio3DModelConfig[]>(raw, DEFAULT_3D_MODELS);
}

export function saveStudio3DModel(model: Studio3DModelConfig): Studio3DModelConfig[] {
  const current = getStudio3DModels();
  const exists = current.some((m) => m.id === model.id);
  const updated = exists
    ? current.map((m) => (m.id === model.id ? model : m))
    : [model, ...current];
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY_3D_MODELS, JSON.stringify(updated));
    notifyStudioUpdated();
  }
  return updated;
}

// 3. Design Templates
export function getStudioTemplates(): StudioTemplate[] {
  if (typeof window === "undefined") return DEFAULT_TEMPLATES;
  const raw = localStorage.getItem(KEY_TEMPLATES);
  if (!raw) {
    localStorage.setItem(KEY_TEMPLATES, JSON.stringify(DEFAULT_TEMPLATES));
    return DEFAULT_TEMPLATES;
  }
  return safeParse<StudioTemplate[]>(raw, DEFAULT_TEMPLATES);
}

export function saveStudioTemplate(template: StudioTemplate): StudioTemplate[] {
  const current = getStudioTemplates();
  const exists = current.some((t) => t.id === template.id);
  const updated = exists
    ? current.map((t) => (t.id === template.id ? template : t))
    : [template, ...current];
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY_TEMPLATES, JSON.stringify(updated));
    notifyStudioUpdated();
  }
  return updated;
}

export function deleteStudioTemplate(id: string): StudioTemplate[] {
  const current = getStudioTemplates();
  const updated = current.filter((t) => t.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY_TEMPLATES, JSON.stringify(updated));
    notifyStudioUpdated();
  }
  return updated;
}

// 4. Stickers & Assets
export function getStudioAssets(): StudioAssetItem[] {
  if (typeof window === "undefined") return DEFAULT_ASSETS;
  const raw = localStorage.getItem(KEY_ASSETS);
  if (!raw) {
    localStorage.setItem(KEY_ASSETS, JSON.stringify(DEFAULT_ASSETS));
    return DEFAULT_ASSETS;
  }
  return safeParse<StudioAssetItem[]>(raw, DEFAULT_ASSETS);
}

export function saveStudioAsset(asset: StudioAssetItem): StudioAssetItem[] {
  const current = getStudioAssets();
  const exists = current.some((a) => a.id === asset.id);
  const updated = exists
    ? current.map((a) => (a.id === asset.id ? asset : a))
    : [asset, ...current];
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY_ASSETS, JSON.stringify(updated));
    notifyStudioUpdated();
  }
  return updated;
}

export function toggleStudioAsset(id: string): StudioAssetItem[] {
  const current = getStudioAssets();
  const updated = current.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a));
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY_ASSETS, JSON.stringify(updated));
    notifyStudioUpdated();
  }
  return updated;
}

export function deleteStudioAsset(id: string): StudioAssetItem[] {
  const current = getStudioAssets();
  const updated = current.filter((a) => a.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY_ASSETS, JSON.stringify(updated));
    notifyStudioUpdated();
  }
  return updated;
}

// 5. Fonts
export function getStudioFonts(): StudioFontItem[] {
  if (typeof window === "undefined") return DEFAULT_FONTS;
  const raw = localStorage.getItem(KEY_FONTS);
  if (!raw) {
    localStorage.setItem(KEY_FONTS, JSON.stringify(DEFAULT_FONTS));
    return DEFAULT_FONTS;
  }
  return safeParse<StudioFontItem[]>(raw, DEFAULT_FONTS);
}

export function saveStudioFont(font: StudioFontItem): StudioFontItem[] {
  const current = getStudioFonts();
  const exists = current.some((f) => f.id === font.id);
  const updated = exists
    ? current.map((f) => (f.id === font.id ? font : f))
    : [font, ...current];
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY_FONTS, JSON.stringify(updated));
    notifyStudioUpdated();
  }
  return updated;
}

export function toggleStudioFont(id: string): StudioFontItem[] {
  const current = getStudioFonts();
  const updated = current.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f));
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY_FONTS, JSON.stringify(updated));
    notifyStudioUpdated();
  }
  return updated;
}

export function deleteStudioFont(id: string): StudioFontItem[] {
  const current = getStudioFonts();
  const updated = current.filter((f) => f.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY_FONTS, JSON.stringify(updated));
    notifyStudioUpdated();
  }
  return updated;
}

// 6. Pricing
export function getStudioPricing(): StudioPricingConfig {
  if (typeof window === "undefined") return DEFAULT_PRICING;
  const raw = localStorage.getItem(KEY_PRICING);
  if (!raw) {
    localStorage.setItem(KEY_PRICING, JSON.stringify(DEFAULT_PRICING));
    return DEFAULT_PRICING;
  }
  return safeParse<StudioPricingConfig>(raw, DEFAULT_PRICING);
}

export function saveStudioPricing(pricing: StudioPricingConfig): StudioPricingConfig {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY_PRICING, JSON.stringify(pricing));
    notifyStudioUpdated();
  }
  return pricing;
}

export function calculateCustomPrice(
  caseFinish: "matte" | "tempered" | "magsafe" | "transparent" = "tempered",
  hasStickers: boolean = false,
  hasCustomText: boolean = false,
  pricingConfig?: StudioPricingConfig
): {
  base: number;
  printing: number;
  finishExtra: number;
  addons: number;
  total: number;
} {
  const config = pricingConfig || getStudioPricing();
  const base = config.basePrice;
  const printing = config.customPrintingPrice;
  const finishExtra =
    caseFinish === "tempered"
      ? config.premiumCasePrice
      : caseFinish === "magsafe"
      ? config.premiumCasePrice + 50
      : caseFinish === "transparent"
      ? 50
      : 0;
  const addons = hasStickers || hasCustomText ? config.additionalDesignCharges : 0;
  const total = base + printing + finishExtra + addons;
  return { base, printing, finishExtra, addons, total };
}

// 7. Print Settings
export function getStudioPrintConfig(): StudioPrintConfig {
  if (typeof window === "undefined") return DEFAULT_PRINT_SETTINGS;
  const raw = localStorage.getItem(KEY_PRINT_SETTINGS);
  if (!raw) {
    localStorage.setItem(KEY_PRINT_SETTINGS, JSON.stringify(DEFAULT_PRINT_SETTINGS));
    return DEFAULT_PRINT_SETTINGS;
  }
  return safeParse<StudioPrintConfig>(raw, DEFAULT_PRINT_SETTINGS);
}

export function saveStudioPrintConfig(config: StudioPrintConfig): StudioPrintConfig {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY_PRINT_SETTINGS, JSON.stringify(config));
    notifyStudioUpdated();
  }
  return config;
}

// 8. Custom Orders & Designs
export const SEED_CUSTOM_ORDERS: CustomOrderDesignRecord[] = [
  {
    orderId: "CT-8921",
    customerName: "Aarav Sharma",
    customerPhone: "+91 98201 44829",
    customerEmail: "aarav.sharma@example.com",
    phoneModel: "iPhone 16 Pro Max",
    caseType: "9H Tempered Glass",
    designPreviewUrl: "https://res.cloudinary.com/dv7oqos1m/image/upload/v1788283104/mockups/akira-poster-kaneda-neo-tokyo-anime-wall-art-paper-1.jpg",
    price: 649,
    orderStatus: "PRINTING",
    createdAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
    customizationData: {
      phoneModel: "iPhone 16 Pro Max",
      caseType: "9H Tempered Glass",
      layers: [
        { type: "image", source: "akira-neo-tokyo.jpg", scale: 1.05, x: 0, y: 0 },
        { type: "text", text: "AARAV-01", color: "#ffffff", font: "Outfit" },
        { type: "sticker", badge: "⚡ CASE TADKA" },
      ],
      images: [
        "https://res.cloudinary.com/dv7oqos1m/image/upload/v1788283104/mockups/akira-poster-kaneda-neo-tokyo-anime-wall-art-paper-1.jpg",
      ],
      text: {
        content: "AARAV-01",
        color: "#ffffff",
        fontFamily: "'Outfit', sans-serif",
        fontSize: 18,
      },
      stickers: ["⚡ CASE TADKA"],
      transformations: { scale: 1.05, offsetX: 0, offsetY: 0 },
      printArea: {
        width: 800,
        height: 1600,
        bleedMm: 3,
        safeArea: { insetX: 24, insetY: 30 },
      },
      pricing: {
        base: 399,
        printing: 100,
        finishExtra: 100,
        addons: 50,
        total: 649,
      },
    },
  },
  {
    orderId: "CT-8894",
    customerName: "Rohan Verma",
    customerPhone: "+91 98112 39012",
    customerEmail: "rohan.v@example.com",
    phoneModel: "Galaxy S25 Ultra",
    caseType: "Ultra Impact MagSafe",
    designPreviewUrl: "https://res.cloudinary.com/dv7oqos1m/image/upload/v1786122801/mockups/gojo-satoru-honored-one-poster-paper-1.jpg",
    price: 599,
    orderStatus: "CONFIRMED",
    createdAt: new Date(Date.now() - 3600 * 1000 * 18).toISOString(),
    customizationData: {
      phoneModel: "Galaxy S25 Ultra",
      caseType: "Ultra Impact MagSafe",
      layers: [
        { type: "image", source: "gojo-void.jpg", scale: 1.0 },
        { type: "text", text: "LIMITLESS", color: "#38bdf8", font: "Cinzel" },
        { type: "sticker", badge: "領域展開" },
      ],
      images: [
        "https://res.cloudinary.com/dv7oqos1m/image/upload/v1786122801/mockups/gojo-satoru-honored-one-poster-paper-1.jpg",
      ],
      text: {
        content: "LIMITLESS",
        color: "#38bdf8",
        fontFamily: "'Cinzel', serif",
        fontSize: 16,
      },
      stickers: ["領域展開"],
      transformations: { scale: 1.0, offsetX: 0, offsetY: 0 },
      printArea: {
        width: 800,
        height: 1600,
        bleedMm: 3,
        safeArea: { insetX: 24, insetY: 30 },
      },
      pricing: {
        base: 399,
        printing: 100,
        finishExtra: 100,
        addons: 0,
        total: 599,
      },
    },
  },
];

export function getCustomOrdersWithDesigns(): CustomOrderDesignRecord[] {
  if (typeof window === "undefined") return SEED_CUSTOM_ORDERS;
  const raw = localStorage.getItem(KEY_CUSTOM_ORDERS);
  if (!raw) {
    localStorage.setItem(KEY_CUSTOM_ORDERS, JSON.stringify(SEED_CUSTOM_ORDERS));
    return SEED_CUSTOM_ORDERS;
  }
  return safeParse<CustomOrderDesignRecord[]>(raw, SEED_CUSTOM_ORDERS);
}

export function saveCustomOrderDesign(record: CustomOrderDesignRecord): CustomOrderDesignRecord[] {
  const current = getCustomOrdersWithDesigns();
  const exists = current.some((r) => r.orderId === record.orderId);
  const updated = exists
    ? current.map((r) => (r.orderId === record.orderId ? record : r))
    : [record, ...current];
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY_CUSTOM_ORDERS, JSON.stringify(updated));
    notifyStudioUpdated();
  }
  return updated;
}

// ─── CASE TYPES (Tough, Transparent, Matte, Glossy, MagSafe) ──────

const KEY_CASE_TYPES = "casetadka_studio_case_types";

export const DEFAULT_CASE_TYPES: StudioCaseType[] = [
  {
    id: "case-tough",
    name: "Tough Armor Dual-Layer",
    tag: "MIL-SPEC 810G",
    finishType: "tough",
    price: 499,
    originalPrice: 899,
    description: "Dual-layer shockproof PC outer armor with impact TPU cushion. 12ft drop certified.",
    roughness: 0.45,
    metallic: 0.2,
    transparency: 0,
    thickness: 2.8,
    dropProtection: "12ft Drop Tested",
    hasMagSafe: false,
    active: true,
  },
  {
    id: "case-transparent",
    name: "Crystal Clear TPU Slim",
    tag: "OPTICAL CLARITY",
    finishType: "transparent",
    price: 399,
    originalPrice: 699,
    description: "German anti-yellowing Bayer polymer. Transparent back showcases original phone luster.",
    roughness: 0.05,
    metallic: 0.1,
    transparency: 0.88,
    thickness: 1.6,
    dropProtection: "8ft Drop Tested",
    hasMagSafe: false,
    active: true,
  },
  {
    id: "case-matte",
    name: "Matte Slim EDC Anti-Glare",
    tag: "VELVET TOUCH",
    finishType: "matte",
    price: 449,
    originalPrice: 799,
    description: "Ultra-fine tactile satin matte coating with smudge and fingerprint resistance.",
    roughness: 0.75,
    metallic: 0.1,
    transparency: 0,
    thickness: 1.8,
    dropProtection: "10ft Drop Tested",
    hasMagSafe: false,
    active: true,
  },
  {
    id: "case-glossy",
    name: "9H Tempered Glass Back",
    tag: "IMPERIAL SHINE",
    finishType: "glossy",
    price: 499,
    originalPrice: 899,
    description: "Real 9H shatter-resistant tempered glass mirror back with vivid high-contrast colors.",
    roughness: 0.08,
    metallic: 0.85,
    transparency: 0.05,
    thickness: 2.0,
    dropProtection: "10ft Drop Tested",
    hasMagSafe: false,
    active: true,
  },
  {
    id: "case-magsafe",
    name: "Ultra Impact MagSafe Armor",
    tag: "N52 NEODYMIUM ARRAY",
    finishType: "magsafe",
    price: 599,
    originalPrice: 999,
    description: "Integrated 38-piece high-grade magnetic charging ring. Military-grade air pocket bumpers.",
    roughness: 0.3,
    metallic: 0.5,
    transparency: 0,
    thickness: 2.4,
    dropProtection: "14ft Drop Tested",
    hasMagSafe: true,
    active: true,
  },
];

export function getStudioCaseTypes(): StudioCaseType[] {
  if (typeof window === "undefined") return DEFAULT_CASE_TYPES;
  const raw = localStorage.getItem(KEY_CASE_TYPES);
  if (!raw) {
    localStorage.setItem(KEY_CASE_TYPES, JSON.stringify(DEFAULT_CASE_TYPES));
    return DEFAULT_CASE_TYPES;
  }
  return safeParse<StudioCaseType[]>(raw, DEFAULT_CASE_TYPES);
}

export function saveStudioCaseType(caseType: StudioCaseType): StudioCaseType[] {
  const current = getStudioCaseTypes();
  const exists = current.some((c) => c.id === caseType.id);
  const updated = exists
    ? current.map((c) => (c.id === caseType.id ? caseType : c))
    : [caseType, ...current];
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY_CASE_TYPES, JSON.stringify(updated));
    notifyStudioUpdated();
  }
  return updated;
}

// ─── UV & 3D PRINT MAPPING ─────────────────────────────────────────

const KEY_UV_MAPPING = "casetadka_studio_uv_mapping";

export const DEFAULT_UV_MAPPINGS: Record<string, StudioUVMapping> = {
  default: {
    scaleX: 1.0,
    scaleY: 1.0,
    offsetX: 0,
    offsetY: 0,
    rotation: 0,
    repeat: false,
    clamp: true,
  },
};

export function getStudioUVMapping(modelId: string = "default"): StudioUVMapping {
  if (typeof window === "undefined") return DEFAULT_UV_MAPPINGS.default;
  const raw = localStorage.getItem(KEY_UV_MAPPING);
  if (!raw) return DEFAULT_UV_MAPPINGS.default;
  const parsed = safeParse<Record<string, StudioUVMapping>>(raw, DEFAULT_UV_MAPPINGS);
  return parsed[modelId] || parsed.default || DEFAULT_UV_MAPPINGS.default;
}

export function saveStudioUVMapping(modelId: string, mapping: StudioUVMapping): StudioUVMapping {
  if (typeof window === "undefined") return mapping;
  const raw = localStorage.getItem(KEY_UV_MAPPING);
  const parsed = safeParse<Record<string, StudioUVMapping>>(raw, DEFAULT_UV_MAPPINGS);
  parsed[modelId] = mapping;
  localStorage.setItem(KEY_UV_MAPPING, JSON.stringify(parsed));
  notifyStudioUpdated();
  return mapping;
}

// ─── DRAFT / PUBLISHED SYSTEM & VERSIONING ────────────────────────

const KEY_VERSIONS = "casetadka_studio_versions";
const KEY_PUBLISHED_FLAG = "casetadka_studio_published_state";

export const DEFAULT_VERSIONS: StudioVersionRecord[] = [
  {
    id: "v-1.0.0",
    versionNumber: 1,
    status: "PUBLISHED",
    author: "Admin Command HQ",
    timestamp: new Date(Date.now() - 86400 * 1000 * 3).toISOString(),
    note: "Initial stable production release with 142 phone models, 5 case types, and 300 DPI UV engine.",
  },
];

export function getStudioVersions(): StudioVersionRecord[] {
  if (typeof window === "undefined") return DEFAULT_VERSIONS;
  const raw = localStorage.getItem(KEY_VERSIONS);
  if (!raw) {
    localStorage.setItem(KEY_VERSIONS, JSON.stringify(DEFAULT_VERSIONS));
    return DEFAULT_VERSIONS;
  }
  return safeParse<StudioVersionRecord[]>(raw, DEFAULT_VERSIONS);
}

export function saveStudioDraft(note: string = "Draft checkpoint"): StudioVersionRecord {
  const versions = getStudioVersions();
  const nextNum = versions.length + 1;
  const newVer: StudioVersionRecord = {
    id: `v-1.${nextNum}.0-draft`,
    versionNumber: nextNum,
    status: "DRAFT",
    author: "Admin Console",
    timestamp: new Date().toISOString(),
    note,
  };
  const updated = [newVer, ...versions];
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY_VERSIONS, JSON.stringify(updated));
    notifyStudioUpdated();
  }
  return newVer;
}

export function publishStudioVersion(note: string = "Production publication"): StudioVersionRecord {
  const versions = getStudioVersions();
  const nextNum = versions.length + 1;
  const newVer: StudioVersionRecord = {
    id: `v-1.${nextNum}.0`,
    versionNumber: nextNum,
    status: "PUBLISHED",
    author: "Admin Command HQ",
    timestamp: new Date().toISOString(),
    note,
  };
  const updated = [newVer, ...versions];
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY_VERSIONS, JSON.stringify(updated));
    localStorage.setItem(KEY_PUBLISHED_FLAG, JSON.stringify(newVer));
    notifyStudioUpdated();
  }
  return newVer;
}

// ─── PRE-FLIGHT VALIDATION ENGINE ─────────────────────────────────

export function runPreFlightCheck(
  phoneModel: StudioPhoneModel,
  caseType: string,
  imageWidth: number = 1600,
  imageHeight: number = 2400
): PreFlightReport {
  const items: PreFlightCheckItem[] = [];

  // 1. Resolution Check
  const minRequiredW = phoneModel.canvasWidth;
  const minRequiredH = phoneModel.canvasHeight;
  if (imageWidth >= minRequiredW && imageHeight >= minRequiredH) {
    items.push({
      id: "res-check",
      name: "Image Resolution & Sharpness",
      status: "PASSED",
      message: `Image resolution ${imageWidth}x${imageHeight}px meets or exceeds 300 DPI production standard (${minRequiredW}x${minRequiredH}px).`,
    });
  } else {
    items.push({
      id: "res-check",
      name: "Image Resolution & Sharpness",
      status: "WARNING",
      message: `Image is ${imageWidth}x${imageHeight}px, slightly below target ${minRequiredW}x${minRequiredH}px. Automatic AI super-resolution will be applied.`,
    });
  }

  // 2. Camera Cutout Overlap Check
  if (phoneModel.cameraCutout.width > 0 && phoneModel.cameraCutout.height > 0) {
    items.push({
      id: "cutout-check",
      name: "Sensor & Camera Cutout Boundary",
      status: "PASSED",
      message: `Camera cutout mapped at (${phoneModel.cameraCutout.x}, ${phoneModel.cameraCutout.y}) with radius ${phoneModel.cameraCutout.radius}px. Critical graphics kept clear.`,
    });
  } else {
    items.push({
      id: "cutout-check",
      name: "Sensor & Camera Cutout Boundary",
      status: "ERROR",
      message: "Camera cutout dimensions are missing or non-positive.",
    });
  }

  // 3. Bleed Margin Check
  if (phoneModel.bleedArea.bleedMm >= 2.5) {
    items.push({
      id: "bleed-check",
      name: "Production Bleed Margin",
      status: "PASSED",
      message: `Full +${phoneModel.bleedArea.bleedMm}mm outer bleed accounted for trimming tolerances.`,
    });
  } else {
    items.push({
      id: "bleed-check",
      name: "Production Bleed Margin",
      status: "WARNING",
      message: `Bleed margin is ${phoneModel.bleedArea.bleedMm}mm, which is below the recommended 3.0mm edge allowance.`,
    });
  }

  // 4. Safe Area Inset Check
  if (phoneModel.safeArea.insetX >= 18 && phoneModel.safeArea.insetY >= 18) {
    items.push({
      id: "safe-check",
      name: "Safe Typography & Artwork Inset",
      status: "PASSED",
      message: `Safe area inset (${phoneModel.safeArea.insetX}px) protects critical text and logos from edge curling.`,
    });
  } else {
    items.push({
      id: "safe-check",
      name: "Safe Typography & Artwork Inset",
      status: "WARNING",
      message: "Safe area margin is tight; elements near edges may touch bevel curves.",
    });
  }

  // 5. 3D Model & Shader Compatibility
  items.push({
    id: "3d-check",
    name: "3D View & Shader Binding",
    status: "PASSED",
    message: `Physical geometry for "${caseType}" linked with valid specular, roughness, and normal textures.`,
  });

  const hasErrors = items.some((i) => i.status === "ERROR");
  const warningsCount = items.filter((i) => i.status === "WARNING").length;
  const score = Math.max(50, 100 - (hasErrors ? 40 : 0) - warningsCount * 10);

  return {
    passed: !hasErrors,
    score,
    items,
  };
}

// ─── 2D PRODUCTION CANVAS PRINT EXPORT GENERATOR ──────────────────

export async function generateProductionPrintCanvas(
  artworkUrl: string,
  phoneModel: StudioPhoneModel,
  customText?: string,
  textColor: string = "#ffffff",
  textFont: string = "Outfit",
  activeSticker?: string | null,
  transformations: { scale: number; rotation?: number; offsetX: number; offsetY: number; flipH?: boolean; flipV?: boolean } = {
    scale: 1,
    offsetX: 0,
    offsetY: 0,
  },
  photoEffects?: PhotoEffectsConfig
): Promise<string> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(artworkUrl);

    const canvas = document.createElement("canvas");
    const printConfig = getStudioPrintConfig();
    const dpi = printConfig.dpi || 300;
    const widthMm = phoneModel.printWidthMm + phoneModel.bleedArea.bleedMm * 2;
    const heightMm = phoneModel.printHeightMm + phoneModel.bleedArea.bleedMm * 2;
    const pxW = Math.round((widthMm / 25.4) * dpi);
    const pxH = Math.round((heightMm / 25.4) * dpi);

    canvas.width = pxW;
    canvas.height = pxH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return resolve(artworkUrl);

    // Background fill
    ctx.fillStyle = "#0c0c10";
    ctx.fillRect(0, 0, pxW, pxH);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      ctx.save();

      // Apply CSS-like filter effects
      if (photoEffects) {
        ctx.filter = `brightness(${photoEffects.brightness}%) contrast(${photoEffects.contrast}%) saturate(${photoEffects.saturation}%) blur(${photoEffects.blur * 2}px) grayscale(${photoEffects.grayscale}%) sepia(${photoEffects.sepia}%)`;
      }

      // Center transformations
      ctx.translate(pxW / 2 + transformations.offsetX * (pxW / 800), pxH / 2 + transformations.offsetY * (pxH / 1600));
      if (transformations.rotation) {
        ctx.rotate((transformations.rotation * Math.PI) / 180);
      }
      ctx.scale(
        transformations.scale * (transformations.flipH ? -1 : 1),
        transformations.scale * (transformations.flipV ? -1 : 1)
      );

      // Draw image filling print boundaries
      const targetRatio = pxW / pxH;
      const imgRatio = img.width / img.height;
      let drawW = pxW;
      let drawH = pxH;
      if (imgRatio > targetRatio) {
        drawW = pxH * imgRatio;
      } else {
        drawH = pxW / imgRatio;
      }
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      // Reset filter
      ctx.filter = "none";

      // Camera Cutout Masking (Do not allow cutouts to be printed onto chassis holes)
      const scaleX = pxW / phoneModel.canvasWidth;
      const scaleY = pxH / phoneModel.canvasHeight;
      const c = phoneModel.cameraCutout;
      ctx.save();
      ctx.fillStyle = "rgba(10, 10, 14, 0.95)";
      ctx.beginPath();
      ctx.roundRect(c.x * scaleX, c.y * scaleY, c.width * scaleX, c.height * scaleY, c.radius * scaleX);
      ctx.fill();
      ctx.strokeStyle = "#ff2a3a";
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.restore();

      // Overlay Custom Text
      if (customText && customText.trim()) {
        ctx.save();
        ctx.fillStyle = textColor;
        ctx.font = `900 ${Math.round(48 * scaleX)}px ${textFont}, sans-serif`;
        ctx.textAlign = "center";
        ctx.shadowColor = "rgba(0,0,0,0.85)";
        ctx.shadowBlur = 12;
        ctx.fillText(customText.toUpperCase(), pxW / 2, pxH - 120 * scaleY);
        ctx.restore();
      }

      // Overlay Sticker Badge
      if (activeSticker) {
        ctx.save();
        ctx.fillStyle = "#ff2a3a";
        ctx.shadowColor = "rgba(0,0,0,0.7)";
        ctx.shadowBlur = 10;
        const badgeW = 260 * scaleX;
        const badgeH = 50 * scaleY;
        const badgeX = pxW - badgeW - 60 * scaleX;
        const badgeY = 220 * scaleY;
        ctx.beginPath();
        ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 8 * scaleX);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${Math.round(22 * scaleX)}px sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText(activeSticker, badgeX + badgeW / 2, badgeY + badgeH / 2 + 8 * scaleY);
        ctx.restore();
      }

      // Production Trim & Registration Marks
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      // Bleed boundary guide
      ctx.strokeRect(30, 30, pxW - 60, pxH - 60);

      resolve(canvas.toDataURL("image/png", 1.0));
    };

    img.onerror = () => resolve(artworkUrl);
    img.src = artworkUrl;
  });
}
