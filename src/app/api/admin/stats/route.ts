import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [orders, productsCount] = await Promise.all([
      prisma.order.findMany({
        include: { items: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count(),
    ]);

    const grossRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const activeDispatches = orders.filter((o) => o.status !== "DELIVERED").length;

    // Unique customers
    const uniquePhones = new Set(orders.map((o) => o.customerPhone.replace(/\D/g, "")));

    // City distribution
    const cityMap: Record<string, number> = {};
    orders.forEach((o) => {
      cityMap[o.city] = (cityMap[o.city] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      stats: {
        grossRevenue,
        totalOrders: orders.length,
        activeDispatches,
        customersCount: uniquePhones.size,
        catalogCount: productsCount,
        cityDistribution: cityMap,
        recentOrders: orders.slice(0, 5),
      },
    });
  } catch (error: any) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to calculate stats" }, { status: 500 });
  }
}
