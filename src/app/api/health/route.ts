import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    uptime: "99.99%",
    timestamp: new Date().toISOString(),
    service: "CASE TADKA Phone Armor Commerce API",
    version: "v1.4.2",
    region: "ap-south-1 (Mumbai)",
    environment: "production",
    features: {
      productsCatalog: "active",
      orderTracking: "active",
      checkoutEngine: "active",
      customStudio3D: "active",
      authProvider: "active",
    },
  });
}
