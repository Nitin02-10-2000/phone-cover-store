import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PRODUCTS, CASE_TYPES, UNIVERSES, Product } from "@/data/products";
import fs from "fs";
import path from "path";

const CUSTOM_PRODUCTS_FILE = path.join(process.cwd(), "src", "data", "custom_products.json");

export function getLocalCustomProducts(): Product[] {
  try {
    if (fs.existsSync(CUSTOM_PRODUCTS_FILE)) {
      const content = fs.readFileSync(CUSTOM_PRODUCTS_FILE, "utf-8");
      const parsed = JSON.parse(content);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (err) {
    console.error("Failed to read custom_products.json", err);
  }
  return [];
}

export function saveLocalCustomProduct(product: Product) {
  try {
    const dir = path.dirname(CUSTOM_PRODUCTS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const current = getLocalCustomProducts();
    const updated = [product, ...current.filter((p) => p.id !== product.id)];
    fs.writeFileSync(CUSTOM_PRODUCTS_FILE, JSON.stringify(updated, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write to custom_products.json", err);
  }
}

export function deleteLocalCustomProduct(id: string) {
  try {
    const current = getLocalCustomProducts();
    const updated = current.filter((p) => p.id !== id);
    fs.writeFileSync(CUSTOM_PRODUCTS_FILE, JSON.stringify(updated, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to delete from custom_products.json", err);
  }
}

function formatDbProduct(p: any): Product {
  return {
    id: p.id,
    name: p.name,
    franchise: p.franchise,
    theme: p.theme,
    category: (p.category as any) || "case",
    tag: p.tag,
    price: p.price,
    originalPrice: p.originalPrice,
    rating: p.rating,
    reviewsCount: p.reviewsCount,
    image: (p.id === "case-tadka-signature-edition" && (p.image === "/case-tadka-logo.png" || !p.image))
      ? "/mockups/case_tadka_signature.jpg"
      : p.image,
    tiltedImage: p.tiltedImage || p.image,
    badge: p.badge || undefined,
    formats: typeof p.formats === "string" ? p.formats.split(",") : p.formats || ["Ultra Impact MagSafe"],
    description: p.description || "",
    supportedBrands: typeof p.supportedBrands === "string" ? p.supportedBrands.split(",") : p.supportedBrands || ["Apple iPhone", "Samsung Galaxy"],
    dropProtection: p.dropProtection || "12ft Drop Tested",
    isCustom: Boolean(p.isCustom),
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const franchise = searchParams.get("franchise") || searchParams.get("universe") || searchParams.get("category");
    const search = searchParams.get("search") || searchParams.get("q");
    const limit = searchParams.get("limit");

    let products: Product[] = [];

    const localCustom = getLocalCustomProducts();

    try {
      const dbProducts = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
      });
      if (dbProducts.length > 0) {
        const formatted = dbProducts.map(formatDbProduct);
        const map = new Map<string, Product>();
        localCustom.forEach((p) => map.set(p.id, p));
        formatted.forEach((p) => map.set(p.id, p));
        products = Array.from(map.values());
      } else {
        products = [...localCustom, ...PRODUCTS];
      }
    } catch {
      products = [...localCustom, ...PRODUCTS];
    }

    if (franchise && franchise !== "all") {
      const fLower = franchise.toLowerCase();
      products = products.filter(
        (p) =>
          p.franchise.toLowerCase() === fLower ||
          p.theme?.toLowerCase() === fLower ||
          (fLower === "anime" && (!p.theme || p.theme === "anime"))
      );
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.franchise.toLowerCase().includes(q) ||
          p.tag.toLowerCase().includes(q)
      );
    }

    if (limit) {
      products = products.slice(0, parseInt(limit, 10) || 10);
    }

    return NextResponse.json({
      success: true,
      total: products.length,
      caseTypes: CASE_TYPES,
      universes: UNIVERSES,
      data: products,
    });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      franchise = "Anime",
      theme = "anime",
      category = "case",
      tag = "New Drop",
      price,
      originalPrice = 999,
      image,
      badge = "NEW DROP",
      formats = ["Ultra Impact MagSafe", "Tough Armor Dual-Layer", "9H Tempered Glass Back"],
      description = "",
      supportedBrands = ["Apple iPhone", "Samsung Galaxy", "OnePlus", "Google Pixel"],
      dropProtection = "12ft Drop Tested",
    } = body;

    if (!name || !price || !image) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: name, price, and image are required." },
        { status: 400 }
      );
    }

    const id = body.id || `case-${Date.now()}`;
    const formatsStr = Array.isArray(formats) ? formats.join(",") : formats;
    const brandsStr = Array.isArray(supportedBrands) ? supportedBrands.join(",") : supportedBrands;

    let createdProduct: Product;
    try {
      const created = await prisma.product.create({
        data: {
          id,
          name,
          franchise,
          theme,
          category,
          tag,
          price: Number(price),
          originalPrice: Number(originalPrice),
          rating: 5.0,
          reviewsCount: 1,
          image,
          tiltedImage: image,
          badge,
          formats: formatsStr,
          description,
          supportedBrands: brandsStr,
          dropProtection,
          isCustom: true,
        },
      });
      createdProduct = formatDbProduct(created);
    } catch (dbErr) {
      console.warn("Prisma DB create failed, saving to local file fallback:", dbErr);
      createdProduct = {
        id,
        name,
        franchise,
        theme,
        category: (category as any) || "case",
        tag,
        price: Number(price),
        originalPrice: Number(originalPrice),
        rating: 5.0,
        reviewsCount: 1,
        image,
        tiltedImage: image,
        badge,
        formats: Array.isArray(formats) ? formats : [formats],
        description,
        supportedBrands: Array.isArray(supportedBrands) ? supportedBrands : [supportedBrands],
        dropProtection,
        isCustom: true,
      };
      saveLocalCustomProduct(createdProduct);
    }

    return NextResponse.json({
      success: true,
      message: `Phone case "${name}" created successfully.`,
      data: createdProduct,
    });
  } catch (error: any) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create phone case" },
      { status: 500 }
    );
  }
}
