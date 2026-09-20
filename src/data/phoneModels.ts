export type CameraArchetype =
  | "iphone-triple"
  | "iphone-dual-diag"
  | "iphone-dual-vert"
  | "samsung-ultra"
  | "samsung-triple"
  | "samsung-flip"
  | "pixel-visor"
  | "oneplus-dial"
  | "nothing-glyph"
  | "matrix-island";

export interface PhoneModelItem {
  id: string;
  name: string;
  brand: string;
  cameraType: CameraArchetype;
  corners: "rounded" | "sharp" | "extra-rounded";
  hasMagSafe: boolean;
  releaseYear?: number;
  popular?: boolean;
}

export interface BrandGroup {
  brand: string;
  icon: string;
  models: string[];
  items: PhoneModelItem[];
}

export const ALL_PHONE_MODELS: PhoneModelItem[] = [
  // ==================== APPLE IPHONE ====================
  { id: "ip-16-pm", name: "iPhone 16 Pro Max", brand: "Apple", cameraType: "iphone-triple", corners: "rounded", hasMagSafe: true, releaseYear: 2024, popular: true },
  { id: "ip-16-p", name: "iPhone 16 Pro", brand: "Apple", cameraType: "iphone-triple", corners: "rounded", hasMagSafe: true, releaseYear: 2024, popular: true },
  { id: "ip-16-plus", name: "iPhone 16 Plus", brand: "Apple", cameraType: "iphone-dual-vert", corners: "rounded", hasMagSafe: true, releaseYear: 2024 },
  { id: "ip-16", name: "iPhone 16", brand: "Apple", cameraType: "iphone-dual-vert", corners: "rounded", hasMagSafe: true, releaseYear: 2024, popular: true },
  { id: "ip-15-pm", name: "iPhone 15 Pro Max", brand: "Apple", cameraType: "iphone-triple", corners: "rounded", hasMagSafe: true, releaseYear: 2023, popular: true },
  { id: "ip-15-p", name: "iPhone 15 Pro", brand: "Apple", cameraType: "iphone-triple", corners: "rounded", hasMagSafe: true, releaseYear: 2023, popular: true },
  { id: "ip-15-plus", name: "iPhone 15 Plus", brand: "Apple", cameraType: "iphone-dual-diag", corners: "rounded", hasMagSafe: true, releaseYear: 2023 },
  { id: "ip-15", name: "iPhone 15", brand: "Apple", cameraType: "iphone-dual-diag", corners: "rounded", hasMagSafe: true, releaseYear: 2023, popular: true },
  { id: "ip-14-pm", name: "iPhone 14 Pro Max", brand: "Apple", cameraType: "iphone-triple", corners: "rounded", hasMagSafe: true, releaseYear: 2022 },
  { id: "ip-14-p", name: "iPhone 14 Pro", brand: "Apple", cameraType: "iphone-triple", corners: "rounded", hasMagSafe: true, releaseYear: 2022 },
  { id: "ip-14-plus", name: "iPhone 14 Plus", brand: "Apple", cameraType: "iphone-dual-diag", corners: "rounded", hasMagSafe: true, releaseYear: 2022 },
  { id: "ip-14", name: "iPhone 14", brand: "Apple", cameraType: "iphone-dual-diag", corners: "rounded", hasMagSafe: true, releaseYear: 2022 },
  { id: "ip-13-pm", name: "iPhone 13 Pro Max", brand: "Apple", cameraType: "iphone-triple", corners: "rounded", hasMagSafe: true, releaseYear: 2021 },
  { id: "ip-13-p", name: "iPhone 13 Pro", brand: "Apple", cameraType: "iphone-triple", corners: "rounded", hasMagSafe: true, releaseYear: 2021 },
  { id: "ip-13", name: "iPhone 13", brand: "Apple", cameraType: "iphone-dual-diag", corners: "rounded", hasMagSafe: true, releaseYear: 2021 },
  { id: "ip-12-pm", name: "iPhone 12 Pro Max", brand: "Apple", cameraType: "iphone-triple", corners: "rounded", hasMagSafe: true, releaseYear: 2020 },
  { id: "ip-12-p", name: "iPhone 12 Pro", brand: "Apple", cameraType: "iphone-triple", corners: "rounded", hasMagSafe: true, releaseYear: 2020 },
  { id: "ip-12", name: "iPhone 12", brand: "Apple", cameraType: "iphone-dual-vert", corners: "rounded", hasMagSafe: true, releaseYear: 2020 },
  { id: "ip-11", name: "iPhone 11", brand: "Apple", cameraType: "iphone-dual-vert", corners: "rounded", hasMagSafe: false, releaseYear: 2019 },

  // ==================== SAMSUNG GALAXY ====================
  { id: "sg-s25-ultra", name: "Galaxy S25 Ultra", brand: "Samsung", cameraType: "samsung-ultra", corners: "sharp", hasMagSafe: true, releaseYear: 2025, popular: true },
  { id: "sg-s25-plus", name: "Galaxy S25+", brand: "Samsung", cameraType: "samsung-triple", corners: "rounded", hasMagSafe: true, releaseYear: 2025 },
  { id: "sg-s25", name: "Galaxy S25", brand: "Samsung", cameraType: "samsung-triple", corners: "rounded", hasMagSafe: true, releaseYear: 2025, popular: true },
  { id: "sg-s24-ultra", name: "Galaxy S24 Ultra", brand: "Samsung", cameraType: "samsung-ultra", corners: "sharp", hasMagSafe: true, releaseYear: 2024, popular: true },
  { id: "sg-s24-plus", name: "Galaxy S24+", brand: "Samsung", cameraType: "samsung-triple", corners: "rounded", hasMagSafe: true, releaseYear: 2024 },
  { id: "sg-s24", name: "Galaxy S24", brand: "Samsung", cameraType: "samsung-triple", corners: "rounded", hasMagSafe: true, releaseYear: 2024, popular: true },
  { id: "sg-s23-ultra", name: "Galaxy S23 Ultra", brand: "Samsung", cameraType: "samsung-ultra", corners: "sharp", hasMagSafe: true, releaseYear: 2023, popular: true },
  { id: "sg-s23-plus", name: "Galaxy S23+", brand: "Samsung", cameraType: "samsung-triple", corners: "rounded", hasMagSafe: true, releaseYear: 2023 },
  { id: "sg-s23", name: "Galaxy S23", brand: "Samsung", cameraType: "samsung-triple", corners: "rounded", hasMagSafe: true, releaseYear: 2023 },
  { id: "sg-s23-fe", name: "Galaxy S23 FE", brand: "Samsung", cameraType: "samsung-triple", corners: "rounded", hasMagSafe: false, releaseYear: 2023 },
  { id: "sg-s22-ultra", name: "Galaxy S22 Ultra", brand: "Samsung", cameraType: "samsung-ultra", corners: "sharp", hasMagSafe: false, releaseYear: 2022 },
  { id: "sg-z-flip6", name: "Galaxy Z Flip 6", brand: "Samsung", cameraType: "samsung-flip", corners: "extra-rounded", hasMagSafe: true, releaseYear: 2024, popular: true },
  { id: "sg-z-flip5", name: "Galaxy Z Flip 5", brand: "Samsung", cameraType: "samsung-flip", corners: "extra-rounded", hasMagSafe: true, releaseYear: 2023 },
  { id: "sg-a55", name: "Galaxy A55 5G", brand: "Samsung", cameraType: "samsung-triple", corners: "rounded", hasMagSafe: false, releaseYear: 2024 },
  { id: "sg-a35", name: "Galaxy A35 5G", brand: "Samsung", cameraType: "samsung-triple", corners: "rounded", hasMagSafe: false, releaseYear: 2024 },
  { id: "sg-a54", name: "Galaxy A54 5G", brand: "Samsung", cameraType: "samsung-triple", corners: "rounded", hasMagSafe: false, releaseYear: 2023 },
  { id: "sg-m35", name: "Galaxy M35 5G", brand: "Samsung", cameraType: "samsung-triple", corners: "rounded", hasMagSafe: false, releaseYear: 2024 },

  // ==================== ONEPLUS ====================
  { id: "op-13", name: "OnePlus 13", brand: "OnePlus", cameraType: "oneplus-dial", corners: "rounded", hasMagSafe: true, releaseYear: 2024, popular: true },
  { id: "op-12", name: "OnePlus 12", brand: "OnePlus", cameraType: "oneplus-dial", corners: "rounded", hasMagSafe: true, releaseYear: 2024, popular: true },
  { id: "op-12r", name: "OnePlus 12R", brand: "OnePlus", cameraType: "oneplus-dial", corners: "rounded", hasMagSafe: false, releaseYear: 2024, popular: true },
  { id: "op-11", name: "OnePlus 11 5G", brand: "OnePlus", cameraType: "oneplus-dial", corners: "rounded", hasMagSafe: false, releaseYear: 2023 },
  { id: "op-11r", name: "OnePlus 11R 5G", brand: "OnePlus", cameraType: "oneplus-dial", corners: "rounded", hasMagSafe: false, releaseYear: 2023 },
  { id: "op-nord4", name: "OnePlus Nord 4", brand: "OnePlus", cameraType: "matrix-island", corners: "rounded", hasMagSafe: false, releaseYear: 2024, popular: true },
  { id: "op-nord-ce4", name: "OnePlus Nord CE 4", brand: "OnePlus", cameraType: "matrix-island", corners: "rounded", hasMagSafe: false, releaseYear: 2024 },
  { id: "op-open", name: "OnePlus Open", brand: "OnePlus", cameraType: "oneplus-dial", corners: "rounded", hasMagSafe: false, releaseYear: 2023 },

  // ==================== GOOGLE PIXEL ====================
  { id: "gp-9-pro-xl", name: "Pixel 9 Pro XL", brand: "Google Pixel", cameraType: "pixel-visor", corners: "extra-rounded", hasMagSafe: true, releaseYear: 2024, popular: true },
  { id: "gp-9-pro", name: "Pixel 9 Pro", brand: "Google Pixel", cameraType: "pixel-visor", corners: "extra-rounded", hasMagSafe: true, releaseYear: 2024, popular: true },
  { id: "gp-9", name: "Pixel 9", brand: "Google Pixel", cameraType: "pixel-visor", corners: "extra-rounded", hasMagSafe: true, releaseYear: 2024, popular: true },
  { id: "gp-8-pro", name: "Pixel 8 Pro", brand: "Google Pixel", cameraType: "pixel-visor", corners: "rounded", hasMagSafe: true, releaseYear: 2023, popular: true },
  { id: "gp-8", name: "Pixel 8", brand: "Google Pixel", cameraType: "pixel-visor", corners: "rounded", hasMagSafe: true, releaseYear: 2023 },
  { id: "gp-8a", name: "Pixel 8a", brand: "Google Pixel", cameraType: "pixel-visor", corners: "extra-rounded", hasMagSafe: false, releaseYear: 2024 },
  { id: "gp-7-pro", name: "Pixel 7 Pro", brand: "Google Pixel", cameraType: "pixel-visor", corners: "rounded", hasMagSafe: false, releaseYear: 2022 },
  { id: "gp-7", name: "Pixel 7", brand: "Google Pixel", cameraType: "pixel-visor", corners: "rounded", hasMagSafe: false, releaseYear: 2022 },
  { id: "gp-7a", name: "Pixel 7a", brand: "Google Pixel", cameraType: "pixel-visor", corners: "rounded", hasMagSafe: false, releaseYear: 2023 },

  // ==================== NOTHING PHONE ====================
  { id: "np-2", name: "Nothing Phone (2)", brand: "Nothing", cameraType: "nothing-glyph", corners: "rounded", hasMagSafe: true, releaseYear: 2023, popular: true },
  { id: "np-2a-plus", name: "Nothing Phone (2a) Plus", brand: "Nothing", cameraType: "nothing-glyph", corners: "rounded", hasMagSafe: false, releaseYear: 2024 },
  { id: "np-2a", name: "Nothing Phone (2a)", brand: "Nothing", cameraType: "nothing-glyph", corners: "rounded", hasMagSafe: false, releaseYear: 2024, popular: true },
  { id: "np-1", name: "Nothing Phone (1)", brand: "Nothing", cameraType: "nothing-glyph", corners: "rounded", hasMagSafe: false, releaseYear: 2022 },
  { id: "cmf-1", name: "CMF Phone 1", brand: "Nothing", cameraType: "matrix-island", corners: "rounded", hasMagSafe: false, releaseYear: 2024 },

  // ==================== XIAOMI & REDMI ====================
  { id: "xm-14-ultra", name: "Xiaomi 14 Ultra", brand: "Xiaomi", cameraType: "oneplus-dial", corners: "rounded", hasMagSafe: true, releaseYear: 2024, popular: true },
  { id: "xm-14", name: "Xiaomi 14", brand: "Xiaomi", cameraType: "matrix-island", corners: "rounded", hasMagSafe: false, releaseYear: 2024 },
  { id: "rn-13-pro-plus", name: "Redmi Note 13 Pro+", brand: "Xiaomi", cameraType: "matrix-island", corners: "rounded", hasMagSafe: false, releaseYear: 2024, popular: true },
  { id: "rn-13-pro", name: "Redmi Note 13 Pro", brand: "Xiaomi", cameraType: "matrix-island", corners: "rounded", hasMagSafe: false, releaseYear: 2024 },
  { id: "rn-12-pro", name: "Redmi Note 12 Pro", brand: "Xiaomi", cameraType: "matrix-island", corners: "rounded", hasMagSafe: false, releaseYear: 2023 },

  // ==================== POCO ====================
  { id: "poco-x6-pro", name: "Poco X6 Pro 5G", brand: "Poco", cameraType: "matrix-island", corners: "rounded", hasMagSafe: false, releaseYear: 2024, popular: true },
  { id: "poco-f6", name: "Poco F6 5G", brand: "Poco", cameraType: "matrix-island", corners: "rounded", hasMagSafe: false, releaseYear: 2024, popular: true },
  { id: "poco-f5", name: "Poco F5", brand: "Poco", cameraType: "matrix-island", corners: "rounded", hasMagSafe: false, releaseYear: 2023 },
  { id: "poco-x5-pro", name: "Poco X5 Pro", brand: "Poco", cameraType: "matrix-island", corners: "rounded", hasMagSafe: false, releaseYear: 2023 },

  // ==================== REALME ====================
  { id: "rm-gt6", name: "Realme GT 6", brand: "Realme", cameraType: "matrix-island", corners: "rounded", hasMagSafe: false, releaseYear: 2024, popular: true },
  { id: "rm-gt6t", name: "Realme GT 6T", brand: "Realme", cameraType: "matrix-island", corners: "rounded", hasMagSafe: false, releaseYear: 2024 },
  { id: "rm-12-pro-plus", name: "Realme 12 Pro+", brand: "Realme", cameraType: "oneplus-dial", corners: "rounded", hasMagSafe: false, releaseYear: 2024, popular: true },
  { id: "rm-12-pro", name: "Realme 12 Pro", brand: "Realme", cameraType: "oneplus-dial", corners: "rounded", hasMagSafe: false, releaseYear: 2024 },

  // ==================== VIVO & IQOO ====================
  { id: "iqoo-12", name: "iQOO 12 5G", brand: "Vivo / iQOO", cameraType: "matrix-island", corners: "rounded", hasMagSafe: false, releaseYear: 2023, popular: true },
  { id: "iqoo-neo9-pro", name: "iQOO Neo 9 Pro", brand: "Vivo / iQOO", cameraType: "matrix-island", corners: "rounded", hasMagSafe: false, releaseYear: 2024, popular: true },
  { id: "iqoo-z9", name: "iQOO Z9 5G", brand: "Vivo / iQOO", cameraType: "matrix-island", corners: "rounded", hasMagSafe: false, releaseYear: 2024 },
  { id: "vivo-x100-pro", name: "Vivo X100 Pro", brand: "Vivo / iQOO", cameraType: "oneplus-dial", corners: "rounded", hasMagSafe: false, releaseYear: 2024 },
  { id: "vivo-v30-pro", name: "Vivo V30 Pro", brand: "Vivo / iQOO", cameraType: "matrix-island", corners: "rounded", hasMagSafe: false, releaseYear: 2024 },

  // ==================== MOTOROLA ====================
  { id: "moto-edge-50-pro", name: "Moto Edge 50 Pro", brand: "Motorola", cameraType: "matrix-island", corners: "rounded", hasMagSafe: false, releaseYear: 2024, popular: true },
  { id: "moto-edge-50-ultra", name: "Moto Edge 50 Ultra", brand: "Motorola", cameraType: "matrix-island", corners: "rounded", hasMagSafe: false, releaseYear: 2024 },
  { id: "moto-g84", name: "Moto G84 5G", brand: "Motorola", cameraType: "matrix-island", corners: "rounded", hasMagSafe: false, releaseYear: 2023 },
];

export const BRAND_GROUPS: BrandGroup[] = [
  {
    brand: "Apple",
    icon: "🍎",
    models: ALL_PHONE_MODELS.filter((p) => p.brand === "Apple").map((p) => p.name),
    items: ALL_PHONE_MODELS.filter((p) => p.brand === "Apple"),
  },
  {
    brand: "Samsung",
    icon: "🌌",
    models: ALL_PHONE_MODELS.filter((p) => p.brand === "Samsung").map((p) => p.name),
    items: ALL_PHONE_MODELS.filter((p) => p.brand === "Samsung"),
  },
  {
    brand: "OnePlus",
    icon: "🔴",
    models: ALL_PHONE_MODELS.filter((p) => p.brand === "OnePlus").map((p) => p.name),
    items: ALL_PHONE_MODELS.filter((p) => p.brand === "OnePlus"),
  },
  {
    brand: "Google Pixel",
    icon: "🔷",
    models: ALL_PHONE_MODELS.filter((p) => p.brand === "Google Pixel").map((p) => p.name),
    items: ALL_PHONE_MODELS.filter((p) => p.brand === "Google Pixel"),
  },
  {
    brand: "Nothing",
    icon: "⚡",
    models: ALL_PHONE_MODELS.filter((p) => p.brand === "Nothing").map((p) => p.name),
    items: ALL_PHONE_MODELS.filter((p) => p.brand === "Nothing"),
  },
  {
    brand: "Xiaomi",
    icon: "🟠",
    models: ALL_PHONE_MODELS.filter((p) => p.brand === "Xiaomi").map((p) => p.name),
    items: ALL_PHONE_MODELS.filter((p) => p.brand === "Xiaomi"),
  },
  {
    brand: "Poco",
    icon: "🟡",
    models: ALL_PHONE_MODELS.filter((p) => p.brand === "Poco").map((p) => p.name),
    items: ALL_PHONE_MODELS.filter((p) => p.brand === "Poco"),
  },
  {
    brand: "Realme",
    icon: "⭐",
    models: ALL_PHONE_MODELS.filter((p) => p.brand === "Realme").map((p) => p.name),
    items: ALL_PHONE_MODELS.filter((p) => p.brand === "Realme"),
  },
  {
    brand: "Vivo / iQOO",
    icon: "💠",
    models: ALL_PHONE_MODELS.filter((p) => p.brand === "Vivo / iQOO").map((p) => p.name),
    items: ALL_PHONE_MODELS.filter((p) => p.brand === "Vivo / iQOO"),
  },
  {
    brand: "Motorola",
    icon: "🦇",
    models: ALL_PHONE_MODELS.filter((p) => p.brand === "Motorola").map((p) => p.name),
    items: ALL_PHONE_MODELS.filter((p) => p.brand === "Motorola"),
  },
];

// Backward-compatible structure matching original PHONE_MODELS format
export const PHONE_MODELS = BRAND_GROUPS.map((b) => ({
  brand: b.brand === "Apple" ? "Apple iPhone" : b.brand === "Samsung" ? "Samsung Galaxy" : b.brand,
  models: b.models,
}));

export function getAllPhoneModels(): PhoneModelItem[] {
  if (typeof window === "undefined") {
    return ALL_PHONE_MODELS;
  }
  try {
    const raw = localStorage.getItem("casetadka_studio_phone_models");
    if (!raw) return ALL_PHONE_MODELS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return ALL_PHONE_MODELS;

    const existingNames = new Set(ALL_PHONE_MODELS.map((m) => m.name.toLowerCase()));
    const customItems: PhoneModelItem[] = parsed
      .filter((m: any) => m.active !== false && !existingNames.has((m.name || "").toLowerCase()))
      .map((m: any) => ({
        id: m.id || `custom-model-${Date.now()}`,
        name: m.name,
        brand: m.brand,
        cameraType: (m.cameraType || "iphone-triple") as CameraArchetype,
        corners: m.corners || "rounded",
        hasMagSafe: Boolean(m.hasMagSafe),
        releaseYear: m.releaseYear || new Date().getFullYear(),
        popular: false,
      }));

    return [...customItems, ...ALL_PHONE_MODELS];
  } catch {
    return ALL_PHONE_MODELS;
  }
}

export function getPhoneModelDetails(modelName?: string): PhoneModelItem {
  const allModels = getAllPhoneModels();
  if (!modelName) {
    return allModels[0]; // iPhone 16 Pro Max default
  }
  const clean = modelName.trim().toLowerCase();

  // 1. Exact match by name or id (PRIORITY #1)
  const exactMatch = allModels.find(
    (p) => p.name.toLowerCase() === clean || p.id.toLowerCase() === clean
  );
  if (exactMatch) return exactMatch;

  // 2. Exact match when stripped of extra spaces/symbols
  const normalizedClean = clean.replace(/[^a-z0-9]/g, "");
  const normalizedMatch = allModels.find(
    (p) => p.name.toLowerCase().replace(/[^a-z0-9]/g, "") === normalizedClean
  );
  if (normalizedMatch) return normalizedMatch;

  // 3. For non-pro queries (e.g. "iphone 15", "iphone 16", "iphone 14"), NEVER match a "pro" or "max" model
  const isProOrMax = clean.includes("pro") || clean.includes("max") || clean.includes("ultra");
  if (!isProOrMax) {
    const nonProMatch = allModels.find((p) => {
      const pLower = p.name.toLowerCase();
      const pIsPro = pLower.includes("pro") || pLower.includes("max") || pLower.includes("ultra");
      return !pIsPro && (pLower.includes(clean) || clean.includes(pLower));
    });
    if (nonProMatch) return nonProMatch;
  }

  // 4. General partial match
  const partialMatch = allModels.find(
    (p) => clean.includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(clean)
  );
  if (partialMatch) return partialMatch;

  // Archetype heuristics for unlisted variants
  if (clean.includes("iphone") && (clean.includes("pro") || clean.includes("max"))) {
    return { id: "custom-ip-pro", name: modelName, brand: "Apple", cameraType: "iphone-triple", corners: "rounded", hasMagSafe: true };
  }
  if (clean.includes("iphone") && clean.includes("16")) {
    return { id: "custom-ip-16", name: modelName, brand: "Apple", cameraType: "iphone-dual-vert", corners: "rounded", hasMagSafe: true };
  }
  if (clean.includes("iphone")) {
    return { id: "custom-ip", name: modelName, brand: "Apple", cameraType: "iphone-dual-diag", corners: "rounded", hasMagSafe: true };
  }
  if (clean.includes("ultra")) {
    return { id: "custom-ultra", name: modelName, brand: "Samsung", cameraType: "samsung-ultra", corners: "sharp", hasMagSafe: true };
  }
  if (clean.includes("pixel")) {
    return { id: "custom-pixel", name: modelName, brand: "Google Pixel", cameraType: "pixel-visor", corners: "extra-rounded", hasMagSafe: true };
  }
  if (clean.includes("oneplus") || clean.includes("1+")) {
    return { id: "custom-oneplus", name: modelName, brand: "OnePlus", cameraType: "oneplus-dial", corners: "rounded", hasMagSafe: true };
  }
  if (clean.includes("nothing")) {
    return { id: "custom-nothing", name: modelName, brand: "Nothing", cameraType: "nothing-glyph", corners: "rounded", hasMagSafe: true };
  }

  // Generic flagship fallback
  return { id: "custom-generic", name: modelName, brand: "Generic", cameraType: "matrix-island", corners: "rounded", hasMagSafe: false };
}
