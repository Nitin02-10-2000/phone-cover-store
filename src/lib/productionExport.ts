import { MockupConfig } from "./mockupData";
import { ArtworkTransform, CustomTextItem, CustomStickerItem } from "@/components/studio/PSDMockupCanvas";

export interface CustomDesignPayload {
  version: "2.0";
  phoneModel: string;
  brand: string;
  slug: string;
  caseType: string;
  originalArtworkUrl: string;
  transform: ArtworkTransform;
  customTexts: CustomTextItem[];
  customStickers: CustomStickerItem[];
  filterStyle?: string;
  printSpecs: {
    widthMm: number;
    heightMm: number;
    dpi: number;
    pixelWidth: number;
    pixelHeight: number;
  };
  mockupPreviewUrl?: string;
  productionArtworkUrl?: string;
  createdAt: string;
}

/**
 * 1. FLAT HIGH-RESOLUTION PRODUCTION FILE GENERATOR
 * Generates print-ready flat artwork formatted to the exact physical dimensions
 * of the phone case (at 300 DPI) WITHOUT the phone mockup, frame, wall, or shadows.
 */
export async function generateProductionArtwork(params: {
  mockup: MockupConfig;
  artworkUrl: string;
  transform: ArtworkTransform;
  customTexts: CustomTextItem[];
  customStickers: CustomStickerItem[];
}): Promise<string> {
  const { mockup, artworkUrl, transform, customTexts, customStickers } = params;

  // Compute 300 DPI pixel dimensions from millimeters
  const dpi = mockup.dpi || 300;
  const pxWidth = Math.round((mockup.printWidthMm / 25.4) * dpi);
  const pxHeight = Math.round((mockup.printHeightMm / 25.4) * dpi);

  const canvas = document.createElement("canvas");
  canvas.width = pxWidth;
  canvas.height = pxHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create canvas 2d context");

  // Fill black base
  ctx.fillStyle = "#111115";
  ctx.fillRect(0, 0, pxWidth, pxHeight);

  // Load user image
  if (artworkUrl) {
    const img = await loadImage(artworkUrl);
    ctx.save();
    
    // Position at center of production canvas
    ctx.translate(pxWidth / 2, pxHeight / 2);
    
    // Scale factor from preview slot to production canvas
    const scaleFactor = pxWidth / mockup.printableWidth;
    ctx.translate(transform.x * scaleFactor, transform.y * scaleFactor);
    ctx.scale(transform.scale, transform.scale);
    ctx.rotate((transform.rotation * Math.PI) / 180);

    // Compute cover sizing
    const imgAspect = img.width / img.height;
    const canvasAspect = pxWidth / pxHeight;
    let drawW = pxWidth;
    let drawH = pxHeight;
    if (imgAspect > canvasAspect) {
      drawW = pxHeight * imgAspect;
      drawH = pxHeight;
    } else {
      drawW = pxWidth;
      drawH = pxWidth / imgAspect;
    }

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();
  }

  // Draw custom text layers
  for (const txt of customTexts) {
    ctx.save();
    const tx = (txt.x / 100) * pxWidth;
    const ty = (txt.y / 100) * pxHeight;
    ctx.translate(tx, ty);
    if (txt.rotation) {
      ctx.rotate((txt.rotation * Math.PI) / 180);
    }
    
    // Scale font size proportionally to 300 DPI
    const fontSizePx = Math.round((txt.size / mockup.printableHeight) * pxHeight * 1.8);
    ctx.font = `900 ${fontSizePx}px ${txt.font || "sans-serif"}`;
    ctx.fillStyle = txt.color || "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0,0,0,0.85)";
    ctx.shadowBlur = 12;
    ctx.fillText(txt.text.toUpperCase(), 0, 0);
    ctx.restore();
  }

  // Draw custom stickers
  for (const stk of customStickers) {
    ctx.save();
    const sx = (stk.x / 100) * pxWidth;
    const sy = (stk.y / 100) * pxHeight;
    ctx.translate(sx, sy);
    const stickerScale = stk.scale || 1;
    ctx.scale(stickerScale, stickerScale);

    // Draw tactical badge
    const badgeW = pxWidth * 0.32;
    const badgeH = badgeW * 0.28;
    ctx.fillStyle = "#dc2626";
    ctx.beginPath();
    ctx.roundRect(-badgeW / 2, -badgeH / 2, badgeW, badgeH, 12);
    ctx.fill();

    ctx.font = `900 ${Math.round(badgeH * 0.45)}px sans-serif`;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(stk.name, 0, 0);
    ctx.restore();
  }

  return canvas.toDataURL("image/png", 0.95);
}

/**
 * 2. REALISTIC E-COMMERCE MOCKUP PREVIEW GENERATOR
 * Composites the user's artwork behind the authentic PSD phone case template.
 */
export async function generateMockupPreview(params: {
  mockup: MockupConfig;
  artworkUrl: string;
  transform: ArtworkTransform;
  customTexts: CustomTextItem[];
  customStickers: CustomStickerItem[];
}): Promise<string> {
  const { mockup, artworkUrl, transform, customTexts, customStickers } = params;

  const canvas = document.createElement("canvas");
  canvas.width = mockup.canvasWidth;
  canvas.height = mockup.canvasHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create canvas 2d context");

  // Step A: Draw User Artwork clipped to printable slot
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(
    mockup.printableX,
    mockup.printableY,
    mockup.printableWidth,
    mockup.printableHeight,
    mockup.printableRadius
  );
  ctx.clip();

  // Fill black base
  ctx.fillStyle = "#111115";
  ctx.fillRect(
    mockup.printableX,
    mockup.printableY,
    mockup.printableWidth,
    mockup.printableHeight
  );

  // Draw user image
  if (artworkUrl) {
    const artImg = await loadImage(artworkUrl);
    ctx.save();
    const centerX = mockup.printableX + mockup.printableWidth / 2;
    const centerY = mockup.printableY + mockup.printableHeight / 2;
    ctx.translate(centerX, centerY);
    ctx.translate(transform.x, transform.y);
    ctx.scale(transform.scale, transform.scale);
    ctx.rotate((transform.rotation * Math.PI) / 180);

    const imgAspect = artImg.width / artImg.height;
    const slotAspect = mockup.printableWidth / mockup.printableHeight;
    let dw = mockup.printableWidth;
    let dh = mockup.printableHeight;
    if (imgAspect > slotAspect) {
      dw = mockup.printableHeight * imgAspect;
      dh = mockup.printableHeight;
    } else {
      dw = mockup.printableWidth;
      dh = mockup.printableWidth / imgAspect;
    }

    ctx.drawImage(artImg, -dw / 2, -dh / 2, dw, dh);
    ctx.restore();
  }

  // Draw custom text layers
  for (const txt of customTexts) {
    ctx.save();
    const tx = mockup.printableX + (txt.x / 100) * mockup.printableWidth;
    const ty = mockup.printableY + (txt.y / 100) * mockup.printableHeight;
    ctx.translate(tx, ty);
    if (txt.rotation) ctx.rotate((txt.rotation * Math.PI) / 180);
    
    ctx.font = `900 ${Math.round(txt.size * 1.6)}px ${txt.font || "sans-serif"}`;
    ctx.fillStyle = txt.color || "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0,0,0,0.85)";
    ctx.shadowBlur = 8;
    ctx.fillText(txt.text.toUpperCase(), 0, 0);
    ctx.restore();
  }

  // Draw custom stickers
  for (const stk of customStickers) {
    ctx.save();
    const sx = mockup.printableX + (stk.x / 100) * mockup.printableWidth;
    const sy = mockup.printableY + (stk.y / 100) * mockup.printableHeight;
    ctx.translate(sx, sy);
    const stickerScale = stk.scale || 1;
    ctx.scale(stickerScale, stickerScale);

    const bw = mockup.printableWidth * 0.35;
    const bh = 34;
    ctx.fillStyle = "#dc2626";
    ctx.beginPath();
    ctx.roundRect(-bw / 2, -bh / 2, bw, bh, 6);
    ctx.fill();

    ctx.font = "900 13px sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(stk.name, 0, 0);
    ctx.restore();
  }
  ctx.restore();

  // Step B: Draw PSD Template Overlay ON TOP (Frame, Camera Bump, Wall, Shadow)
  const templateImg = await loadImage(mockup.templateUrl);
  ctx.drawImage(templateImg, 0, 0, mockup.canvasWidth, mockup.canvasHeight);

  // Step C: Draw Glass Sheen Highlight
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(
    mockup.printableX,
    mockup.printableY,
    mockup.printableWidth,
    mockup.printableHeight,
    mockup.printableRadius
  );
  ctx.clip();
  const grad = ctx.createLinearGradient(
    mockup.printableX,
    mockup.printableY,
    mockup.printableX + mockup.printableWidth,
    mockup.printableY + mockup.printableHeight
  );
  grad.addColorStop(0, "rgba(255,255,255,0.3)");
  grad.addColorStop(0.45, "rgba(255,255,255,0.03)");
  grad.addColorStop(1, "rgba(0,0,0,0.2)");
  ctx.fillStyle = grad;
  ctx.fillRect(
    mockup.printableX,
    mockup.printableY,
    mockup.printableWidth,
    mockup.printableHeight
  );
  ctx.restore();

  return canvas.toDataURL("image/png", 0.92);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}
