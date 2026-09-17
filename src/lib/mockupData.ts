// Real PSD-based phone case mockup models and configurations

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
  return (
    models.find(
      (m) =>
        m.name.toLowerCase() === name.toLowerCase() ||
        name.toLowerCase().includes(m.name.toLowerCase())
    ) || models[0]
  );
}
