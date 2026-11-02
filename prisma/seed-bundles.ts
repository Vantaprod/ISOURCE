import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const BUNDLE_DEFS = [
  { slug: "solar-starter-kit", title: "Solar Starter Kit (1kVA)",
    description: "Perfect for lighting, fans, TV and charging. Includes solar panel, inverter, battery and cables.",
    category: "solar-power", priceKobo: 45000000, originalPriceKobo: 52000000, vendorSlug: "lura-energy" },
  { slug: "solar-home-kit", title: "Solar Home Kit (3kVA)",
    description: "Power your fridge, TV and fans. Includes multiple solar panels, a hybrid inverter, lithium batteries and mounting rails.",
    category: "solar-power", priceKobo: 125000000, originalPriceKobo: 140000000, vendorSlug: "litharv" },
  { slug: "solar-business-kit", title: "Solar Business Kit (5kVA)",
    description: "Heavy-duty power for small businesses. Includes solar panels, a 5kVA inverter, batteries and installation cables.",
    category: "solar-power", priceKobo: 245000000, originalPriceKobo: 280000000, vendorSlug: "huihang" },
];

async function main() {
  console.log("Seeding Bundles (Bundle model)...");
  for (const def of BUNDLE_DEFS) {
    const vendor = await prisma.vendor.findUnique({ where: { slug: def.vendorSlug } });
    if (!vendor) { console.warn(`⚠️  Skip ${def.title}: vendor "${def.vendorSlug}" not found`); continue; }
    const products = await prisma.product.findMany({
      where: { vendorId: vendor.id, isActive: true },
      take: 3, orderBy: { createdAt: "desc" },
    });
    if (products.length === 0) { console.warn(`⚠️  Skip ${def.title}: no products for vendor`); continue; }
    const existing = await prisma.bundle.findUnique({ where: { slug: def.slug } });
    if (existing) { console.log(`✓ ${def.title} already exists, skipping`); continue; }
    await prisma.bundle.create({
      data: {
        slug: def.slug, title: def.title, description: def.description,
        category: def.category, priceKobo: def.priceKobo, originalPriceKobo: def.originalPriceKobo,
        vendorId: vendor.id, isActive: true,
        items: { create: products.map((p, i) => ({ productId: p.id, qty: i === 0 ? 2 : 1 })) },
      },
    });
    console.log(`✓ Created: ${def.title} (${products.length} items)`);
  }
  const promo = await prisma.promoBanner.findFirst({ where: { title: "Solar Bundle Deals" } });
  if (promo && promo.ctaUrl !== "/bundles") {
    await prisma.promoBanner.update({ where: { id: promo.id }, data: { ctaUrl: "/bundles" } });
    console.log("✓ Promo banner ctaUrl → /bundles");
  }
  console.log(`\n✅ Total bundles in DB: ${await prisma.bundle.count()}`);
}
main().then(() => prisma.$disconnect()).catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });