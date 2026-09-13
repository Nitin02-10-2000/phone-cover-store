import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany();
    return NextResponse.json({ success: true, coupons });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const code = (body.code || "").toUpperCase().trim();

    if (!code) {
      return NextResponse.json({ success: false, error: "Coupon code is required" }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon) {
      return NextResponse.json(
        { success: false, valid: false, message: "Invalid promo code. Try 'TADKA10'." },
        { status: 404 }
      );
    }

    // Check expiration if validUntil is set
    if (coupon.validUntil && new Date(coupon.validUntil) < new Date()) {
      return NextResponse.json(
        { success: false, valid: false, message: "This coupon code has expired." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      valid: true,
      code: coupon.code,
      discount: coupon.discount,
      type: coupon.type,
      message: `Promo code ${coupon.code} applied successfully!`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
