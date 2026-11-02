import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const PROMOS = [
  {
    title: "Solar Bundle Deals",
    subtitle: "Complete solar kits for homes and businesses. Save more when you buy together.",
    ctaLabel: "Explore Bundles",
    ctaUrl: "/category/solar-power?q=bundle",
    imageUrl: "/images/placeholder.svg",
    theme: "charcoal",
    position: 0,
  },
  {
    title: "Need Help Choosing?",
    subtitle: "Our experts are here to guide you.",
    ctaLabel: "Talk to Us",
    ctaUrl: "/contact",
    imageUrl: "/images/placeholder.svg",
    theme: "cream",
    position: 1,
  },
];

async function main() {
  const count = await prisma.promoBanner.count();
  if (count > 0) {
    console.log("Promo banners already seeded. Skipping.");
    return;
  }
  
  console.log("Seeding Promo Banners...");
  for (const p of PROMOS) {
    await prisma.promoBanner.create({ data: p });
  }
  console.log("✅ Promo banners seeded.");
}

main().then(() => prisma.$disconnect()).catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });