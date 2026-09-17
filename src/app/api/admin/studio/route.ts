import { NextResponse } from "next/server";
import {
  DEFAULT_PRICING,
  DEFAULT_PRINT_SETTINGS,
  DEFAULT_FONTS,
  DEFAULT_ASSETS,
  DEFAULT_TEMPLATES,
  DEFAULT_3D_MODELS,
  buildDefaultPhoneModels,
} from "@/lib/studioStorage";

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      pricing: DEFAULT_PRICING,
      printSettings: DEFAULT_PRINT_SETTINGS,
      fonts: DEFAULT_FONTS,
      assets: DEFAULT_ASSETS,
      templates: DEFAULT_TEMPLATES,
      models3d: DEFAULT_3D_MODELS,
      phoneModels: buildDefaultPhoneModels(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load studio configuration" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return NextResponse.json({
      success: true,
      message: "Studio configuration updated successfully",
      data: body,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save studio configuration" },
      { status: 500 }
    );
  }
}
