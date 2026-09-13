import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const map = new Map<string, {
      id: string;
      fullName: string;
      phone: string;
      email?: string;
      city: string;
      state: string;
      address: string;
      pincode: string;
      ordersCount: number;
      totalSpent: number;
      latestOrderId: string;
      latestOrderDate: string;
      latestStatus: string;
      itemsSummary: string[];
    }>();

    orders.forEach((o) => {
      const key = o.customerPhone.replace(/\D/g, "") || o.customerName.toLowerCase().trim();
      const existing = map.get(key);
      const items = o.items.map((it) => `${it.quantity}x ${it.productName}`);

      if (existing) {
        existing.ordersCount += 1;
        existing.totalSpent += o.total;
        existing.itemsSummary = Array.from(new Set([...existing.itemsSummary, ...items]));
      } else {
        map.set(key, {
          id: `cust-${key.slice(-6) || Math.random().toString(36).substring(2, 8)}`,
          fullName: o.customerName,
          phone: o.customerPhone,
          email: o.customerEmail || undefined,
          city: o.city,
          state: o.state,
          address: o.address,
          pincode: o.pincode,
          ordersCount: 1,
          totalSpent: o.total,
          latestOrderId: o.id,
          latestOrderDate: o.createdAt.toISOString().split("T")[0],
          latestStatus: o.status,
          itemsSummary: items,
        });
      }
    });

    const customers = Array.from(map.values());

    return NextResponse.json({
      success: true,
      total: customers.length,
      customers,
    });
  } catch (error: any) {
    console.error("GET /api/customers error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to fetch customer database" }, { status: 500 });
  }
}
