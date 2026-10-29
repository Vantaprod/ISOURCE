import { PrismaClient, type Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { PRODUCTS } from "../src/data/products";
import { CATEGORIES } from "../src/data/categories";
import { VENDORS } from "../src/data/vendors";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("→ Seeding categories...");
  for (let i = 0; i < CATEGORIES.length; i++) {
    const c = CATEGORIES[i];
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, shortName: c.shortName, description: c.description, icon: c.icon, sortOrder: i },
      create: { slug: c.slug, name: c.name, shortName: c.shortName, description: c.description, icon: c.icon, sortOrder: i },
    });
  }

  console.log("→ Seeding vendors...");
  for (const v of VENDORS) {
    const vendorUser = await prisma.user.upsert({
      where: { email: `${v.slug}@vendors.isource.local` },
      update: {},
      create: { email: `${v.slug}@vendors.isource.local`, name: v.name, role: "VENDOR", emailVerified: new Date() },
    });
    await prisma.vendor.upsert({
      where: { slug: v.slug },
      update: { name: v.name, location: v.location, isIsource: v.isIsource, status: "APPROVED" },
      create: { slug: v.slug, name: v.name, location: v.location, isIsource: v.isIsource, status: "APPROVED", userId: vendorUser.id },
    });
  }

  console.log("→ Seeding products...");
  for (const p of PRODUCTS) {
    const category = await prisma.category.findUnique({ where: { slug: p.category } });
    const vendor = await prisma.vendor.findUnique({ where: { slug: p.vendorSlug } });
    if (!category || !vendor) { console.warn(`  ⚠ skip ${p.slug}: missing category/vendor`); continue; }

    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        id: p.id, slug: p.slug, name: p.name,
        shortDescription: p.shortDescription, description: p.description,
        categoryId: category.id, vendorId: vendor.id, sku: p.sku,
        priceKobo: p.priceKobo, originalPriceKobo: p.originalPriceKobo ?? null,
        stock: p.stock, specs: p.specs as unknown as Prisma.InputJsonValue,
        tags: p.tags as string[], rating: p.rating, reviewCount: p.reviewCount,
        isActive: p.isActive, isFeatured: p.isFeatured,
        images: { create: p.images.map((url, i) => ({ url, sortOrder: i })) },
        variants: p.variants ? { create: p.variants.map((v) => ({ label: v.label, sku: v.sku, stock: v.stock, priceKobo: v.priceKobo })) } : undefined,
      },
    });
  }

  const counts = {
    categories: await prisma.category.count(),
    vendors: await prisma.vendor.count(),
    products: await prisma.product.count(),
    variants: await prisma.productVariant.count(),
    images: await prisma.productImage.count(),
  };
  console.log("\n✓ Seed complete:", counts);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });