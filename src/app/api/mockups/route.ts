import { NextResponse } from "next/server";
import { DEFAULT_MOCKUP_MODELS, MockupConfig } from "@/lib/mockupData";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // 1. Try Supabase
    try {
      const { data, error } = await supabase
        .from("phone_models")
        .select("*")
        .order("created_at", { ascending: true });

      if (!error && data && data.length > 0) {
        const mapped: MockupConfig[] = data.map((d: any) => ({
          id: d.id,
          name: d.name,
          brand: d.brand,
          slug: d.slug,
          active: Boolean(d.active),
          archetype: d.archetype || "iphone-triple",
          templateUrl: d.mockup_url || d.template_url || "/mockups/templates/iphone_16_pro_max.png",
          overlayUrl: d.overlay_url || undefined,
          shadowUrl: d.shadow_url || undefined,
          highlightUrl: d.highlight_url || undefined,
          canvasWidth: Number(d.canvas_width || 1058),
          canvasHeight: Number(d.canvas_height || 1255),
          printableX: Number(d.printable_x || 350),
          printableY: Number(d.printable_y || 250),
          printableWidth: Number(d.printable_width || 359),
          printableHeight: Number(d.printable_height || 756),
          printableRadius: Number(d.printable_radius || 40),
          cameraX: Number(d.camera_x || 362),
          cameraY: Number(d.camera_y || 262),
          cameraWidth: Number(d.camera_width || 140),
          cameraHeight: Number(d.camera_height || 150),
          cameraRadius: Number(d.camera_radius || 36),
          printWidthMm: Number(d.print_width_mm || 77.6),
          printHeightMm: Number(d.print_height_mm || 163.0),
          dpi: Number(d.dpi || 300),
          caseTypes: Array.isArray(d.case_types)
            ? d.case_types
            : typeof d.case_types === "string"
            ? d.case_types.split(",")
            : ["9H Tempered Glass", "Ultra Impact MagSafe", "Matte Slim"],
        }));
        return NextResponse.json({ success: true, models: mapped });
      }
    } catch (e) {
      console.warn("Supabase fetch failed, serving default PSD mockup models:", e);
    }

    return NextResponse.json({ success: true, models: DEFAULT_MOCKUP_MODELS });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message, models: DEFAULT_MOCKUP_MODELS },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { model } = body;
    if (!model || !model.name || !model.slug) {
      return NextResponse.json(
        { success: false, error: "Invalid model specification" },
        { status: 400 }
      );
    }

    try {
      const { error } = await supabase.from("phone_models").upsert({
        id: model.id,
        name: model.name,
        brand: model.brand,
        slug: model.slug,
        active: model.active,
        archetype: model.archetype,
        mockup_url: model.templateUrl,
        canvas_width: model.canvasWidth,
        canvas_height: model.canvasHeight,
        printable_x: model.printableX,
        printable_y: model.printableY,
        printable_width: model.printableWidth,
        printable_height: model.printableHeight,
        printable_radius: model.printableRadius,
        camera_x: model.cameraX,
        camera_y: model.cameraY,
        camera_width: model.cameraWidth,
        camera_height: model.cameraHeight,
        camera_radius: model.cameraRadius,
        print_width_mm: model.printWidthMm,
        print_height_mm: model.printHeightMm,
        dpi: model.dpi,
        case_types: model.caseTypes?.join(","),
        updated_at: new Date().toISOString(),
      });
      if (!error) {
        return NextResponse.json({ success: true, model });
      }
    } catch (e) {
      console.warn("Supabase upsert failed:", e);
    }

    return NextResponse.json({ success: true, model, localOnly: true });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
