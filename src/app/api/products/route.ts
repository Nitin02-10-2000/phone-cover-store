import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PRODUCTS, CASE_TYPES, UNIVERSES, Product } from "@/data/products";

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
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const franchise = searchParams.get("franchise") || searchParams.get("universe") || searchParams.get("category");
    const search = searchParams.get("search") || searchParams.get("q");
    const limit = searchParams.get("limit");

    let products: Product[] = [];

    try {
      const dbProducts = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
      });
      if (dbProducts.length > 0) {
        products = dbProducts.map(formatDbProduct);
      } else {
        products = [...PRODUCTS];
      }
    } catch {
      products = [...PRODUCTS];
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

    return NextResponse.json({
      success: true,
      message: `Phone case "${name}" created in database successfully.`,
      data: formatDbProduct(created),
    });
  } catch (error: any) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create phone case in database" },
      { status: 500 }
    );
  }
}
