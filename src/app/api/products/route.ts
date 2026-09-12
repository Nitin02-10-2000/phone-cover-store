import { NextResponse } from "next/server";
import { PRODUCTS, CASE_TYPES, UNIVERSES } from "@/data/products";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const franchise = searchParams.get("franchise") || searchParams.get("universe") || searchParams.get("category");
  const limit = searchParams.get("limit");

  let filtered = [...PRODUCTS];

  if (franchise && franchise !== "all") {
    const fLower = franchise.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.franchise.toLowerCase() === fLower ||
        p.theme?.toLowerCase() === fLower ||
        (fLower === "anime" && (!p.theme || p.theme === "anime"))
    );
  }

  if (limit) {
    filtered = filtered.slice(0, parseInt(limit, 10) || 10);
  }

  return NextResponse.json({
    success: true,
    total: filtered.length,
    caseTypes: CASE_TYPES.map((c) => ({
      id: c.id,
      name: c.name,
      specs: c.specs,
      basePrice: c.basePrice,
      tag: c.tag,
    })),
    universes: UNIVERSES.map((u) => ({
      id: u.id,
      name: u.name,
      icon: u.icon,
      tagline: u.tagline,
      subtags: u.subtags,
      badge: u.badge,
      count: u.count,
      accentColor: u.accentColor,
      isCustom: u.isCustom,
    })),
    data: filtered,
  });
}
