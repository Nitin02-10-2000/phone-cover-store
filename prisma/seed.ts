import { PrismaClient } from "@prisma/client";
import { PRODUCTS } from "../src/data/products";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Case Tadka database...");

  // 1. Seed Products
  console.log(`📦 Seeding ${PRODUCTS.length} phone cases...`);
  for (const p of PRODUCTS) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {
        name: p.name,
        franchise: p.franchise,
        theme: p.theme || "anime",
        category: p.category || "case",
        tag: p.tag,
        price: p.price,
        originalPrice: p.originalPrice || 999,
        rating: p.rating || 5.0,
        reviewsCount: p.reviewsCount || 10,
        image: p.image,
        tiltedImage: p.tiltedImage || p.image,
        badge: p.badge || null,
        formats: p.formats.join(","),
        description: p.description || "",
        supportedBrands: (p.supportedBrands || ["Apple iPhone", "Samsung Galaxy", "OnePlus", "Google Pixel"]).join(","),
        dropProtection: p.dropProtection || "12ft Drop Tested",
      },
      create: {
        id: p.id,
        name: p.name,
        franchise: p.franchise,
        theme: p.theme || "anime",
        category: p.category || "case",
        tag: p.tag,
        price: p.price,
        originalPrice: p.originalPrice || 999,
        rating: p.rating || 5.0,
        reviewsCount: p.reviewsCount || 10,
        image: p.image,
        tiltedImage: p.tiltedImage || p.image,
        badge: p.badge || null,
        formats: p.formats.join(","),
        description: p.description || "",
        supportedBrands: (p.supportedBrands || ["Apple iPhone", "Samsung Galaxy", "OnePlus", "Google Pixel"]).join(","),
        dropProtection: p.dropProtection || "12ft Drop Tested",
      },
    });
  }

  // 2. Seed Coupons
  const coupons = [
    { code: "TADKA10", discount: 10, type: "percentage" },
    { code: "TADKA20", discount: 20, type: "percentage" },
    { code: "DROP20", discount: 20, type: "percentage" },
    { code: "SHINRA50", discount: 50, type: "fixed" },
  ];

  console.log(`🎟️ Seeding ${coupons.length} promotional coupons...`);
  for (const c of coupons) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: {
        discount: c.discount,
        type: c.type,
      },
      create: {
        code: c.code,
        discount: c.discount,
        type: c.type,
      },
    });
  }

  console.log("✅ Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
