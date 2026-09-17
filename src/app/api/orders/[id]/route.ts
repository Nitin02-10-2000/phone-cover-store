import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check Supabase first
    try {
      const { data: sbOrder, error: sbErr } = await supabase
        .from("orders")
        .select("*, items:order_items(*)")
        .eq("id", id)
        .single();

      if (!sbErr && sbOrder) {
        return NextResponse.json({ success: true, order: sbOrder });
      }
    } catch {
      // ignore
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, trackingNumber } = body;

    // Sync to Supabase
    try {
      const sbUpdate: any = {};
      if (status) sbUpdate.status = status;
      if (trackingNumber) sbUpdate.tracking_number = trackingNumber;
      await supabase.from("orders").update(sbUpdate).eq("id", id);
    } catch (e) {
      console.warn("Supabase PATCH order sync:", e);
    }

    const dataToUpdate: any = {};
    if (status) dataToUpdate.status = status;
    if (trackingNumber) dataToUpdate.trackingNumber = trackingNumber;

    const updated = await prisma.order.update({
      where: { id },
      data: dataToUpdate,
      include: { items: true },
    });

    return NextResponse.json({
      success: true,
      message: `Order #${id} updated to status ${updated.status}`,
      order: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let sbDeleted = false;
    let prismaDeleted = false;

    // 1. Delete from Supabase
    try {
      await supabase.from("order_items").delete().eq("order_id", id);
      const { error: sbErr } = await supabase.from("orders").delete().eq("id", id);
      if (!sbErr) sbDeleted = true;
    } catch (e) {
      console.warn("Supabase DELETE order sync:", e);
    }

    // 2. Delete from Prisma
    try {
      await prisma.orderItem.deleteMany({
        where: { orderId: id },
      });
      const result = await prisma.order.deleteMany({
        where: { id },
      });
      if (result.count > 0) prismaDeleted = true;
    } catch (e) {
      console.warn("Prisma DELETE order sync:", e);
    }

    return NextResponse.json({
      success: true,
      message: `Order #${id} deleted successfully.`,
      sbDeleted,
      prismaDeleted,
    });
  } catch (error: any) {
    console.error("DELETE /api/orders/[id] error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
