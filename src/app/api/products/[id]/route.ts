import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...product,
        formats: product.formats.split(","),
        supportedBrands: product.supportedBrands.split(","),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const data: any = { ...body };
    if (Array.isArray(data.formats)) data.formats = data.formats.join(",");
    if (Array.isArray(data.supportedBrands)) data.supportedBrands = data.supportedBrands.join(",");

    const updated = await prisma.product.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

import { deleteLocalCustomProduct } from "../route";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    deleteLocalCustomProduct(id);
    try {
      await prisma.product.delete({
        where: { id },
      });
    } catch (dbErr: any) {
      // Preset catalog items or already deleted records won't throw 500
      console.warn(`Product ${id} was not in DB or already deleted:`, dbErr?.message);
    }

    return NextResponse.json({ success: true, message: `Product ${id} deleted successfully` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
