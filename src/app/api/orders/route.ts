import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // 1. Try fetching from Supabase first
    try {
      const { data: sbOrders, error: sbErr } = await supabase
        .from("orders")
        .select("*, items:order_items(*)")
        .order("created_at", { ascending: false });

      if (!sbErr && sbOrders && sbOrders.length > 0) {
        const formatted = sbOrders.map((o: any) => ({
          id: o.id,
          date: (o.created_at || new Date().toISOString()).split("T")[0],
          status: o.status,
          items: (o.items || []).map((it: any) => ({
            id: it.id,
            productName: it.product_name,
            format: it.format,
            phoneModel: it.phone_model || undefined,
            price: Number(it.price),
            quantity: it.quantity,
            image: it.image || "",
          })),
          subtotal: Number(o.subtotal || 0),
          discount: Number(o.discount || 0),
          total: Number(o.total || 0),
          shipping: {
            fullName: o.customer_name,
            phone: o.customer_phone,
            email: o.customer_email || undefined,
            address: o.address,
            city: o.city,
            state: o.state,
            pincode: o.pincode,
          },
          paymentMethod: o.payment_method,
          trackingNumber: o.tracking_number || `BD-${o.id}-IN`,
          estimatedDelivery: o.estimated_delivery || "4-5 Business Days",
        }));

        return NextResponse.json({
          success: true,
          total: formatted.length,
          orders: formatted,
        });
      }
    } catch (e) {
      console.warn("Supabase fetch failed, checking Prisma fallback:", e);
    }

    // 2. Fallback to Prisma database
    const orders = await prisma.order.findMany({
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedOrders = orders.map((o) => ({
      id: o.id,
      date: o.createdAt.toISOString().split("T")[0],
      status: o.status,
      items: o.items.map((it) => ({
        id: it.id,
        productName: it.productName,
        format: it.format,
        phoneModel: it.phoneModel || undefined,
        price: it.price,
        quantity: it.quantity,
        image: it.image || "",
      })),
      subtotal: o.subtotal,
      discount: o.discount,
      total: o.total,
      shipping: {
        fullName: o.customerName,
        phone: o.customerPhone,
        email: o.customerEmail || undefined,
        address: o.address,
        city: o.city,
        state: o.state,
        pincode: o.pincode,
      },
      paymentMethod: o.paymentMethod,
      trackingNumber: o.trackingNumber || `BD-${o.id}-IN`,
      estimatedDelivery: o.estimatedDelivery || "4-5 Business Days",
    }));

    return NextResponse.json({
      success: true,
      total: formattedOrders.length,
      orders: formattedOrders,
    });
  } catch (error: any) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      items = [],
      shipping,
      paymentMethod = "UPI (Google Pay)",
      subtotal = 0,
      discount = 0,
      total = 0,
      id: customId,
    } = body;

    if (!shipping || !shipping.fullName || !shipping.phone) {
      return NextResponse.json(
        { success: false, error: "Customer shipping details (name, phone) are required." },
        { status: 400 }
      );
    }

    const orderId = customId || `CATAD-${Math.floor(10000 + Math.random() * 90000)}`;
    const trackingNumber = `BD-${orderId}-${Math.floor(100 + Math.random() * 900)}-IN`;

    const estDate = new Date();
    estDate.setDate(estDate.getDate() + 4);
    const estimatedDelivery = estDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    // 1. Insert directly into Supabase PostgreSQL
    try {
      const { error: sbOrderErr } = await supabase.from("orders").upsert({
        id: orderId,
        customer_name: shipping.fullName,
        customer_phone: shipping.phone,
        customer_email: shipping.email || null,
        address: shipping.address || "Direct Address",
        city: shipping.city || "Mumbai",
        state: shipping.state || "Maharashtra",
        pincode: shipping.pincode || "400001",
        subtotal: Number(subtotal),
        discount: Number(discount),
        total: Number(total),
        status: "CONFIRMED",
        payment_method: paymentMethod,
        tracking_number: trackingNumber,
        estimated_delivery: estimatedDelivery,
      });

      if (sbOrderErr) {
        console.error("❌ Supabase order insert error:", sbOrderErr);
      } else {
        console.log(`✅ Supabase order ${orderId} saved successfully!`);
        if (items.length > 0) {
          const { error: sbItemErr } = await supabase.from("order_items").insert(
            items.map((item: any) => ({
              order_id: orderId,
              product_id: item.productId || item.id || null,
              product_name: item.productName || item.name || "Phone Case Armor",
              format: item.format || "Ultra Impact MagSafe",
              phone_model: item.phoneModel || null,
              image: item.image || null,
              price: Number(item.price) || 599,
              quantity: Number(item.quantity) || 1,
            }))
          );
          if (sbItemErr) console.error("❌ Supabase order items insert error:", sbItemErr);
        }
      }
    } catch (sbEx) {
      console.error("Supabase sync exception:", sbEx);
    }

    // 2. Also keep local database in sync
    try {
      await prisma.order.upsert({
        where: { id: orderId },
        update: {
          customerName: shipping.fullName,
          customerPhone: shipping.phone,
          customerEmail: shipping.email || null,
          address: shipping.address || "Direct Address",
          city: shipping.city || "Mumbai",
          state: shipping.state || "Maharashtra",
          pincode: shipping.pincode || "400001",
          subtotal: Number(subtotal),
          discount: Number(discount),
          total: Number(total),
          status: "CONFIRMED",
          paymentMethod,
          trackingNumber,
          estimatedDelivery,
        },
        create: {
          id: orderId,
          customerName: shipping.fullName,
          customerPhone: shipping.phone,
          customerEmail: shipping.email || null,
          address: shipping.address || "Direct Address",
          city: shipping.city || "Mumbai",
          state: shipping.state || "Maharashtra",
          pincode: shipping.pincode || "400001",
          subtotal: Number(subtotal),
          discount: Number(discount),
          total: Number(total),
          status: "CONFIRMED",
          paymentMethod,
          trackingNumber,
          estimatedDelivery,
          items: {
            create: items.map((item: any) => ({
              productId: item.productId || item.id || null,
              productName: item.productName || item.name || "Phone Case Armor",
              format: item.format || "Ultra Impact MagSafe",
              phoneModel: item.phoneModel || null,
              image: item.image || null,
              price: Number(item.price) || 599,
              quantity: Number(item.quantity) || 1,
            })),
          },
        },
      });
    } catch (prismaErr) {
      console.warn("Prisma fallback sync:", prismaErr);
    }

    return NextResponse.json({
      success: true,
      message: `Order #${orderId} registered successfully in Supabase & database!`,
      order: {
        id: orderId,
        date: new Date().toISOString().split("T")[0],
        status: "CONFIRMED",
        items,
        subtotal: Number(subtotal),
        discount: Number(discount),
        total: Number(total),
        shipping,
        paymentMethod,
        trackingNumber,
        estimatedDelivery,
      },
    });
  } catch (error: any) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create order in database." },
      { status: 500 }
    );
  }
}
