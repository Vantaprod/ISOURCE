import { PrismaClient, type Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { CATEGORIES } from "../src/data/categories";
import { VENDORS } from "../src/data/vendors";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// Manual Data to match Layer 1 Reference
const PRODUCTS = [
  { id: "p-solar-1", slug: "litharv-5kva-inverter", name: "Litharv 5KVA Pure Sine Wave Inverter", shortDescription: "Premium inverter for home and office.", description: "Litharv 5KVA inverter with pure sine wave output.", category: "solar-power", vendorSlug: "litharv", sku: "LT-INV-5K", priceKobo: 58000000, originalPriceKobo: 65000000, stock: 12, specs: [{label:"Rating", value:"5KVA"}], tags: ["flash-deal", "best-seller"], rating: 4.8, reviewCount: 45 },
  { id: "p-solar-2", slug: "huihang-200ah-lithium", name: "Huihang 200Ah Lithium Battery", shortDescription: "Long-life lithium battery.", description: "Huihang deep cycle lithium battery.", category: "solar-power", vendorSlug: "huihang", sku: "HH-LT-200", priceKobo: 45000000, originalPriceKobo: 50000000, stock: 20, specs: [{label:"Capacity", value:"200Ah"}], tags: ["flash-deal", "best-seller"], rating: 4.9, reviewCount: 32 },
  { id: "p-solar-3", slug: "lura-400w-panel", name: "Lura Energy 400W Solar Panel", shortDescription: "High-efficiency solar panel.", description: "Monocrystalline solar panel.", category: "solar-power", vendorSlug: "lura-energy", sku: "LE-PNL-400", priceKobo: 18500000, originalPriceKobo: 22000000, stock: 30, specs: [{label:"Rating", value:"400W"}], tags: ["flash-deal"], rating: 4.7, reviewCount: 58 },
  { id: "p-1", slug: "samsung-galaxy-a26-5g", name: "Samsung Galaxy A26 5G 6.7\" 6GB RAM 128GB", shortDescription: "6.7\" display, 5G, 128GB.", description: "Samsung Galaxy A26 5G smartphone.", category: "phones-accessories", vendorSlug: "isource-official", sku: "SAM-A26-5G", priceKobo: 28371600, originalPriceKobo: 50000000, stock: 15, specs: [{label:"RAM", value:"6GB"}], tags: ["flash-deal"], rating: 4.4, reviewCount: 22 },
  { id: "p-2", slug: "royal-65-qled-tv", name: "Royal COMBO OFFER - 65\" QLED Google TV", shortDescription: "65-inch QLED Smart TV.", description: "Royal 65-inch QLED TV.", category: "electronics", vendorSlug: "isource-official", sku: "ROY-Tv-65", priceKobo: 81182800, originalPriceKobo: 150000000, stock: 8, specs: [{label:"Size", value:"65\""}], tags: ["flash-deal"], rating: 4.3, reviewCount: 151 },
  { id: "p-3", slug: "cyfaza-wardrobe", name: "CYFAZA Wardrobe for Clothes", shortDescription: "Portable closet.", description: "Durable wardrobe.", category: "home-kitchen", vendorSlug: "isource-official", sku: "CYF-WRD-01", priceKobo: 2324800, originalPriceKobo: 3326800, stock: 40, specs: [{label:"Type", value:"Portable"}], tags: ["flash-deal"], rating: 3.7, reviewCount: 1023 },
  { id: "p-4", slug: "qcwolves-blender", name: "QCOWLVES 2L Industrial Food Crusher Blender", shortDescription: "Heavy-duty blender.", description: "Powerful 2L blender.", category: "home-kitchen", vendorSlug: "isource-official", sku: "QCW-BLD-02", priceKobo: 2250000, originalPriceKobo: 7542700, stock: 55, specs: [{label:"Capacity", value:"2L"}], tags: ["flash-deal"], rating: 3.8, reviewCount: 271 },
  { id: "p-5", slug: "tcl-65-qled-tv", name: "TCL 65\" QLED Google Smart TV", shortDescription: "65-inch QLED TV.", description: "TCL 65-inch QLED.", category: "electronics", vendorSlug: "isource-official", sku: "TCL-Tv-65", priceKobo: 73599900, originalPriceKobo: 109999900, stock: 10, specs: [{label:"Size", value:"65\""}], tags: ["flash-deal"], rating: 4.6, reviewCount: 304 },
];

async function main() {
  // 1. Categories
  for (let i = 0; i < CATEGORIES.length; i++) {
    const c = CATEGORIES[i];
    await prisma.category.upsert({ where: { slug: c.slug }, update: { name: c.name, shortName: c.shortName, description: c.description, icon: c.icon, sortOrder: i }, create: { slug: c.slug, name: c.name, shortName: c.shortName, description: c.description, icon: c.icon, sortOrder: i } });
  }

  // 2. Vendors
  for (const v of VENDORS) {
    const vendorUser = await prisma.user.upsert({ where: { email: `${v.slug}@vendors.isource.local` }, update: {}, create: { email: `${v.slug}@vendors.isource.local`, name: v.name, role: "VENDOR", emailVerified: new Date() } });
    await prisma.vendor.upsert({ where: { slug: v.slug }, update: { name: v.name, location: v.location, isIsource: v.isIsource, status: "APPROVED" }, create: { slug: v.slug, name: v.name, location: v.location, isIsource: v.isIsource, status: "APPROVED", userId: vendorUser.id } });
  }

  // 3. Products
  for (const p of PRODUCTS) {
    const category = await prisma.category.findUnique({ where: { slug: p.category } });
    const vendor = await prisma.vendor.findUnique({ where: { slug: p.vendorSlug } });
    if (!category || !vendor) continue;

    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        id: p.id, slug: p.slug, name: p.name, shortDescription: p.shortDescription, description: p.description,
        categoryId: category.id, vendorId: vendor.id, sku: p.sku, priceKobo: p.priceKobo, originalPriceKobo: p.originalPriceKobo,
        stock: p.stock, specs: p.specs as unknown as Prisma.InputJsonValue, tags: p.tags, rating: p.rating, reviewCount: p.reviewCount,
        isActive: true, isFeatured: true,
        images: { create: [{ url: "/images/placeholder.svg", sortOrder: 0 }] },
      },
    });
  }

  console.log("✓ Seed complete. Run `npx prisma db seed` to update the database.");
}

main().then(() => prisma.$disconnect()).catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });