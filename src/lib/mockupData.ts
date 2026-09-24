// Real PSD-based phone case mockup models and configurations
import { getPhoneModelDetails } from "../data/phoneModels";

export interface MockupConfig {
  id: string;
  name: string;
  brand: string;
  slug: string;
  active: boolean;
  archetype: string;
  
  // Visual PSD Template & Overlay Assets
  templateUrl: string;       // The complete PSD-derived scene frame with transparent printable area
  overlayUrl?: string;       // Optional isolated transparent case overlay
  shadowUrl?: string;        // Optional ambient ground shadow
  highlightUrl?: string;     // Optional specular gloss layer
  
  // Canvas Resolution
  canvasWidth: number;
  canvasHeight: number;
  
  // Printable Area (slot where user's artwork sits inside the case)
  printableX: number;
  printableY: number;
  printableWidth: number;
  printableHeight: number;
  printableRadius: number;
  
  // Camera Cutout (zone where the physical camera lenses reside)
  cameraX: number;
  cameraY: number;
  cameraWidth: number;
  cameraHeight: number;
  cameraRadius: number;
  
  // Factory Print Specifications (in millimeters for production artwork export)
  printWidthMm: number;
  printHeightMm: number;
  dpi: number;
  
  caseTypes: string[];
}

export const DEFAULT_MOCKUP_MODELS: MockupConfig[] = [
  // iPhone 18 Series
  {
    id: "ip-18-pm",
    name: "iPhone 18 Pro Max",
    brand: "Apple",
    slug: "iphone-18-pro-max",
    active: true,
    archetype: "iphone-plateau",
    templateUrl: "/mockups/glass_case_iphone_pro.png",
    canvasWidth: 393,
    canvasHeight: 805,
    printableX: 8,
    printableY: 8,
    printableWidth: 377,
    printableHeight: 789,
    printableRadius: 42,
    cameraX: 26,
    cameraY: 35,
    cameraWidth: 340,
    cameraHeight: 216,
    cameraRadius: 53,
    printWidthMm: 78.0,
    printHeightMm: 163.4,
    dpi: 300,
    caseTypes: ["9H Tempered Glass", "Ultra Impact MagSafe", "Matte Slim", "Transparent Crystal TPU"],
  },
  {
    id: "ip-18-p",
    name: "iPhone 18 Pro",
    brand: "Apple",
    slug: "iphone-18-pro",
    active: true,
    archetype: "iphone-plateau",
    templateUrl: "/mockups/glass_case_iphone_pro.png",
    canvasWidth: 393,
    canvasHeight: 805,
    printableX: 8,
    printableY: 8,
    printableWidth: 377,
    printableHeight: 789,
    printableRadius: 40,
    cameraX: 27,
    cameraY: 36,
    cameraWidth: 338,
    cameraHeight: 221,
    cameraRadius: 57,
    printWidthMm: 71.9,
    printHeightMm: 150.0,
    dpi: 300,
    caseTypes: ["9H Tempered Glass", "Ultra Impact MagSafe", "Matte Slim", "Transparent Crystal TPU"],
  },
  {
    id: "ip-18-std",
    name: "iPhone 18",
    brand: "Apple",
    slug: "iphone-18",
    active: true,
    archetype: "iphone-dual-vert",
    templateUrl: "/mockups/glass_case_iphone_16.png",
    canvasWidth: 393,
    canvasHeight: 805,
    printableX: 8,
    printableY: 8,
    printableWidth: 377,
    printableHeight: 789,
    printableRadius: 42,
    cameraX: 26,
    cameraY: 26,
    cameraWidth: 80,
    cameraHeight: 146,
    cameraRadius: 34,
    printWidthMm: 71.6,
    printHeightMm: 147.6,
    dpi: 300,
    caseTypes: ["9H Tempered Glass", "Ultra Impact MagSafe", "Matte Slim", "Transparent Crystal TPU"],
  },

  // iPhone 17 Series
  {
    id: "ip-17-pm",
    name: "iPhone 17 Pro Max",
    brand: "Apple",
    slug: "iphone-17-pro-max",
    active: true,
    archetype: "iphone-plateau",
    templateUrl: "/mockups/glass_case_iphone_pro.png",
    canvasWidth: 393,
    canvasHeight: 805,
    printableX: 8,
    printableY: 8,
    printableWidth: 377,
    printableHeight: 789,
    printableRadius: 42,
    cameraX: 26,
    cameraY: 35,
    cameraWidth: 340,
    cameraHeight: 216,
    cameraRadius: 53,
    printWidthMm: 78.0,
    printHeightMm: 163.4,
    dpi: 300,
    caseTypes: ["9H Tempered Glass", "Ultra Impact MagSafe", "Matte Slim", "Transparent Crystal TPU"],
  },
  {
    id: "ip-17-p",
    name: "iPhone 17 Pro",
    brand: "Apple",
    slug: "iphone-17-pro",
    active: true,
    archetype: "iphone-plateau",
    templateUrl: "/mockups/glass_case_iphone_pro.png",
    canvasWidth: 393,
    canvasHeight: 805,
    printableX: 8,
    printableY: 8,
    printableWidth: 377,
    printableHeight: 789,
    printableRadius: 40,
    cameraX: 27,
    cameraY: 36,
    cameraWidth: 338,
    cameraHeight: 221,
    cameraRadius: 57,
    printWidthMm: 71.9,
    printHeightMm: 150.0,
    dpi: 300,
    caseTypes: ["9H Tempered Glass", "Ultra Impact MagSafe", "Matte Slim", "Transparent Crystal TPU"],
  },
  {
    id: "ip-17-air",
    name: "iPhone 17 Air",
    brand: "Apple",
    slug: "iphone-17-air",
    active: true,
    archetype: "iphone-dual-vert",
    templateUrl: "/mockups/glass_case_iphone_16.png",
    canvasWidth: 393,
    canvasHeight: 805,
    printableX: 8,
    printableY: 8,
    printableWidth: 377,
    printableHeight: 789,
    printableRadius: 42,
    cameraX: 26,
    cameraY: 26,
    cameraWidth: 80,
    cameraHeight: 146,
    cameraRadius: 34,
    printWidthMm: 71.6,
    printHeightMm: 147.6,
    dpi: 300,
    caseTypes: ["9H Tempered Glass", "Ultra Impact MagSafe", "Matte Slim", "Transparent Crystal TPU"],
  },
  {
    id: "ip-17-std",
    name: "iPhone 17",
    brand: "Apple",
    slug: "iphone-17",
    active: true,
    archetype: "iphone-dual-vert",
    templateUrl: "/mockups/glass_case_iphone_16.png",
    canvasWidth: 393,
    canvasHeight: 805,
    printableX: 8,
    printableY: 8,
    printableWidth: 377,
    printableHeight: 789,
    printableRadius: 42,
    cameraX: 26,
    cameraY: 26,
    cameraWidth: 80,
    cameraHeight: 146,
    cameraRadius: 34,
    printWidthMm: 71.6,
    printHeightMm: 147.6,
    dpi: 300,
    caseTypes: ["9H Tempered Glass", "Ultra Impact MagSafe", "Matte Slim", "Transparent Crystal TPU"],
  },
  {
    id: "ip-16-pm",
    name: "iPhone 16 Pro Max",
    brand: "Apple",
    slug: "iphone-16-pro-max",
    active: true,
    archetype: "iphone-triple",
    templateUrl: "/mockups/glass_case_iphone_pro.png",
    canvasWidth: 393,
    canvasHeight: 805,
    printableX: 8,
    printableY: 8,
    printableWidth: 377,
    printableHeight: 789,
    printableRadius: 42,
    cameraX: 20,
    cameraY: 20,
    cameraWidth: 155,
    cameraHeight: 165,
    cameraRadius: 36,
    printWidthMm: 77.6,
    printHeightMm: 163.0,
    dpi: 300,
    caseTypes: ["9H Tempered Glass", "Ultra Impact MagSafe", "Matte Slim", "Transparent Crystal TPU"],
  },
  {
    id: "ip-16-p",
    name: "iPhone 16 Pro",
    brand: "Apple",
    slug: "iphone-16-pro",
    active: true,
    archetype: "iphone-triple",
    templateUrl: "/mockups/glass_case_iphone_pro.png",
    canvasWidth: 393,
    canvasHeight: 805,
    printableX: 8,
    printableY: 8,
    printableWidth: 377,
    printableHeight: 789,
    printableRadius: 40,
    cameraX: 20,
    cameraY: 20,
    cameraWidth: 155,
    cameraHeight: 165,
    cameraRadius: 36,
    printWidthMm: 71.5,
    printHeightMm: 149.6,
    dpi: 300,
    caseTypes: ["9H Tempered Glass", "Ultra Impact MagSafe", "Matte Slim", "Transparent Crystal TPU"],
  },
  {
    id: "ip-16-std",
    name: "iPhone 16",
    brand: "Apple",
    slug: "iphone-16",
    active: true,
    archetype: "iphone-dual-vert",
    templateUrl: "/mockups/glass_case_iphone_16.png",
    canvasWidth: 393,
    canvasHeight: 805,
    printableX: 8,
    printableY: 8,
    printableWidth: 377,
    printableHeight: 789,
    printableRadius: 42,
    cameraX: 26,
    cameraY: 26,
    cameraWidth: 80,
    cameraHeight: 146,
    cameraRadius: 34,
    printWidthMm: 71.6,
    printHeightMm: 147.6,
    dpi: 300,
    caseTypes: ["9H Tempered Glass", "Ultra Impact MagSafe", "Matte Slim", "Transparent Crystal TPU"],
  },
  {
    id: "ip-15-pm",
    name: "iPhone 15 Pro Max",
    brand: "Apple",
    slug: "iphone-15-pro-max",
    active: true,
    archetype: "iphone-triple",
    templateUrl: "/mockups/glass_case_iphone_pro.png",
    canvasWidth: 393,
    canvasHeight: 805,
    printableX: 8,
    printableY: 8,
    printableWidth: 377,
    printableHeight: 789,
    printableRadius: 42,
    cameraX: 20,
    cameraY: 20,
    cameraWidth: 155,
    cameraHeight: 165,
    cameraRadius: 36,
    printWidthMm: 76.7,
    printHeightMm: 159.9,
    dpi: 300,
    caseTypes: ["9H Tempered Glass", "Ultra Impact MagSafe", "Matte Slim"],
  },
  {
    id: "ip-14-pm",
    name: "iPhone 14 Pro Max",
    brand: "Apple",
    slug: "iphone-14-pro-max",
    active: true,
    archetype: "iphone-triple",
    templateUrl: "/mockups/glass_case_iphone_pro.png",
    canvasWidth: 393,
    canvasHeight: 805,
    printableX: 8,
    printableY: 8,
    printableWidth: 377,
    printableHeight: 789,
    printableRadius: 40,
    cameraX: 20,
    cameraY: 20,
    cameraWidth: 155,
    cameraHeight: 165,
    cameraRadius: 36,
    printWidthMm: 77.6,
    printHeightMm: 160.7,
    dpi: 300,
    caseTypes: ["9H Tempered Glass", "Ultra Impact MagSafe", "Matte Slim"],
  },
  {
    id: "ip-15-std",
    name: "iPhone 15",
    brand: "Apple",
    slug: "iphone-15",
    active: true,
    archetype: "iphone-dual-diag",
    templateUrl: "/mockups/glass_case_iphone_dual.png",
    canvasWidth: 377,
    canvasHeight: 743,
    printableX: 8,
    printableY: 8,
    printableWidth: 361,
    printableHeight: 727,
    printableRadius: 40,
    cameraX: 18,
    cameraY: 18,
    cameraWidth: 140,
    cameraHeight: 140,
    cameraRadius: 32,
    printWidthMm: 71.6,
    printHeightMm: 147.6,
    dpi: 300,
    caseTypes: ["9H Tempered Glass", "Ultra Impact MagSafe", "Matte Slim"],
  },
  {
    id: "sg-s24-ultra",
    name: "Galaxy S24 Ultra",
    brand: "Samsung",
    slug: "samsung-s24-ultra",
    active: true,
    archetype: "samsung-ultra",
    templateUrl: "/mockups/glass_case_samsung_ultra.png",
    canvasWidth: 393,
    canvasHeight: 805,
    printableX: 8,
    printableY: 8,
    printableWidth: 377,
    printableHeight: 789,
    printableRadius: 18,
    cameraX: 20,
    cameraY: 20,
    cameraWidth: 120,
    cameraHeight: 230,
    cameraRadius: 20,
    printWidthMm: 79.0,
    printHeightMm: 162.3,
    dpi: 300,
    caseTypes: ["9H Tempered Glass", "Ultra Impact MagSafe", "Matte Slim EDC Anti-Glare"],
  },
  {
    id: "sg-s23-ultra",
    name: "Galaxy S23 Ultra",
    brand: "Samsung",
    slug: "samsung-s23-ultra",
    active: true,
    archetype: "samsung-ultra",
    templateUrl: "/mockups/glass_case_samsung_ultra.png",
    canvasWidth: 393,
    canvasHeight: 805,
    printableX: 8,
    printableY: 8,
    printableWidth: 377,
    printableHeight: 789,
    printableRadius: 18,
    cameraX: 20,
    cameraY: 20,
    cameraWidth: 120,
    cameraHeight: 230,
    cameraRadius: 20,
    printWidthMm: 78.1,
    printHeightMm: 163.4,
    dpi: 300,
    caseTypes: ["9H Tempered Glass", "Ultra Impact MagSafe", "Matte Slim EDC Anti-Glare"],
  },
  {
    id: "op-11",
    name: "OnePlus 11 5G",
    brand: "OnePlus",
    slug: "oneplus-11",
    active: true,
    archetype: "oneplus-dial",
    templateUrl: "/mockups/glass_case_oneplus.png",
    canvasWidth: 393,
    canvasHeight: 805,
    printableX: 8,
    printableY: 8,
    printableWidth: 377,
    printableHeight: 789,
    printableRadius: 42,
    cameraX: 30,
    cameraY: 60,
    cameraWidth: 156,
    cameraHeight: 156,
    cameraRadius: 78,
    printWidthMm: 74.1,
    printHeightMm: 163.1,
    dpi: 300,
    caseTypes: ["9H Tempered Glass", "Matte Slim EDC Anti-Glare"],
  },
  {
    id: "sg-a54",
    name: "Galaxy A54 5G",
    brand: "Samsung",
    slug: "samsung-galaxy-a54-5g",
    active: true,
    archetype: "samsung-triple",
    templateUrl: "/mockups/glass_case_samsung_triple.png",
    canvasWidth: 393,
    canvasHeight: 805,
    printableX: 8,
    printableY: 8,
    printableWidth: 377,
    printableHeight: 789,
    printableRadius: 36,
    cameraX: 20,
    cameraY: 20,
    cameraWidth: 72,
    cameraHeight: 180,
    cameraRadius: 24,
    printWidthMm: 76.7,
    printHeightMm: 158.2,
    dpi: 300,
    caseTypes: ["9H Tempered Glass", "Ultra Impact MagSafe", "Matte Slim EDC Anti-Glare"],
  },
  {
    id: "sg-s24",
    name: "Galaxy S24",
    brand: "Samsung",
    slug: "samsung-galaxy-s24",
    active: true,
    archetype: "samsung-triple",
    templateUrl: "/mockups/glass_case_samsung_triple.png",
    canvasWidth: 393,
    canvasHeight: 805,
    printableX: 8,
    printableY: 8,
    printableWidth: 377,
    printableHeight: 789,
    printableRadius: 36,
    cameraX: 20,
    cameraY: 20,
    cameraWidth: 72,
    cameraHeight: 180,
    cameraRadius: 24,
    printWidthMm: 70.6,
    printHeightMm: 147.0,
    dpi: 300,
    caseTypes: ["9H Tempered Glass", "Ultra Impact MagSafe", "Matte Slim EDC Anti-Glare"],
  }
];

const STORAGE_KEY = "casetadka_psd_mockup_models";

export function getMockupModels(): MockupConfig[] {
  if (typeof window === "undefined") {
    return DEFAULT_MOCKUP_MODELS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure all built-in archetypes are present even with older localStorage cache
        const missing = DEFAULT_MOCKUP_MODELS.filter((dm) => !parsed.some((p: any) => p.id === dm.id));
        if (missing.length > 0) {
          const merged = [...parsed, ...missing];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          return merged;
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed reading mockup models from localStorage:", e);
  }
  return DEFAULT_MOCKUP_MODELS;
}

export function saveMockupModels(models: MockupConfig[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(models));
    window.dispatchEvent(new Event("casetadka_mockups_updated"));
  } catch (e) {
    console.error("Failed saving mockup models to localStorage:", e);
  }
}

export function getMockupModelBySlug(slug: string): MockupConfig {
  const models = getMockupModels();
  return (
    models.find((m) => m.slug === slug || m.name.toLowerCase() === slug.toLowerCase()) ||
    models[0]
  );
}

export function getMockupModelByName(name: string): MockupConfig {
  const models = getMockupModels();
  if (!name) return models[0];

  const cleanName = name.trim().toLowerCase();

  // 1. Exact name match or slug match
  const directMatch = models.find(
    (m) =>
      m.name.toLowerCase() === cleanName ||
      m.slug.toLowerCase() === cleanName ||
      cleanName.includes(m.name.toLowerCase())
  );
  if (directMatch) return directMatch;

  // 2. Query phone database for archetype & brand
  const phone = getPhoneModelDetails(name);
  const archetype = phone.cameraType;
  const brand = phone.brand;

  // 3. Find matching model by archetype
  const byArchetype = models.find((m) => m.archetype === archetype);
  if (byArchetype) {
    return {
      ...byArchetype,
      name: phone.name,
      brand: phone.brand,
    };
  }

  // 4. Fallback by brand archetype mapping
  if (brand.toLowerCase().includes("samsung")) {
    const isUltra = cleanName.includes("ultra");
    const samsungModel = models.find((m) => m.archetype === (isUltra ? "samsung-ultra" : "samsung-triple")) || models.find((m) => m.brand === "Samsung");
    if (samsungModel) {
      return {
        ...samsungModel,
        name: phone.name,
        brand: "Samsung",
      };
    }
  }

  if (brand.toLowerCase().includes("oneplus")) {
    const opModel = models.find((m) => m.archetype === "oneplus-dial") || models.find((m) => m.brand === "OnePlus");
    if (opModel) return { ...opModel, name: phone.name, brand: "OnePlus" };
  }

  if (brand.toLowerCase().includes("pixel")) {
    const pixelModel = models.find((m) => m.archetype === "iphone-dual-vert") || models[0];
    return { ...pixelModel, name: phone.name, brand: "Google Pixel" };
  }

  // Fallback to default model with resolved phone name
  return {
    ...models[0],
    name: phone.name,
    brand: phone.brand,
  };
}
