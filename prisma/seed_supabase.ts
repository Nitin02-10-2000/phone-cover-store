import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { PRODUCTS } from "../src/data/products";

// Load .env.local if present
let supabaseUrl = "https://ssscjjrkytanpwrmabnv.supabase.co";
let supabaseKey = "sb_publishable_awOejfsGK5ozeEbQwGyJqg_37x1_GVM";

try {
  const envPath = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    content.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("NEXT_PUBLIC_SUPABASE_URL=")) {
        supabaseUrl = trimmed.replace("NEXT_PUBLIC_SUPABASE_URL=", "").trim();
      }
      if (trimmed.startsWith("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=")) {
        supabaseKey = trimmed.replace("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=", "").trim();
      }
    });
  }
} catch {
  // use defaults
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedSupabase() {
  console.log("⚡ Checking Supabase connection and tables...");
  console.log(`🌐 Target Supabase URL: ${supabaseUrl}`);

  const formatted = PRODUCTS.map((p) => ({
    id: p.id,
    name: p.name,
    franchise: p.franchise,
    theme: p.theme || "anime",
    category: p.category || "case",
    tag: p.tag,
    price: p.price,
    original_price: p.originalPrice || 999,
    rating: p.rating || 5.0,
    reviews_count: p.reviewsCount || 1,
    image: p.image,
    tilted_image: p.tiltedImage || p.image,
    badge: p.badge || null,
    formats: p.formats.join(","),
    description: p.description || "",
    supported_brands: (p.supportedBrands || ["Apple iPhone", "Samsung Galaxy", "OnePlus"]).join(","),
    drop_protection: p.dropProtection || "12ft Drop Tested",
    is_custom: false,
  }));

  const { data, error } = await supabase.from("products").upsert(formatted, { onConflict: "id" });

  if (error) {
    console.error("❌ Supabase table error:", error.message, error.code);
  } else {
    console.log(`🎉 SUCCESS: Seeded ${formatted.length} phone cases directly to Supabase table 'products'!`);
  }

  // Check count in Supabase
  const { count, error: countErr } = await supabase.from("products").select("*", { count: "exact", head: true });
  if (!countErr) {
    console.log(`📊 Live Products in Supabase database: ${count}`);
  }
}

seedSupabase();
