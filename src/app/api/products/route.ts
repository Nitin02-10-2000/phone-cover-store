import { NextResponse } from "next/server";
import { PRODUCTS, CASE_TYPES, UNIVERSES } from "@/data/products";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const franchise = searchParams.get("franchise");
  const limit = searchParams.get("limit");

  let filtered = [...PRODUCTS];

  if (franchise) {
    filtered = filtered.filter(
      (p) => p.franchise.toLowerCase() === franchise.toLowerCase()
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
      count: u.count,
    })),
    data: filtered,
  });
}
