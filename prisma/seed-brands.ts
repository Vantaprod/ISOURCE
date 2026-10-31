import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const BRANDS = [
  { name: "Litharv", slug: "litharv", desc: "Powering Your Future", logo: "/images/placeholder.svg", featured: true },
  { name: "Huihang", slug: "huihang", desc: "Smart Energy Solutions", logo: "/images/placeholder.svg", featured: true },
  { name: "Lura Energy", slug: "lura-energy", desc: "Your Energy Partner", logo: "/images/placeholder.svg", featured: true },
  { name: "Vestwoods by Hier", slug: "vestwoods", desc: "Premium Energy Storage", logo: null, featured: false },
  { name: "KEP", slug: "kep", desc: "Industrial Power Solutions", logo: null, featured: false },
];

async function main() {
  console.log("Seeding brands...");
  for (const b of BRANDS) {
    // Create a user for the brand owner
    const user = await prisma.user.upsert({
      where: { email: `${b.slug}@brands.isource.local` },
      update: {},
      create: { email: `${b.slug}@brands.isource.local`, name: b.name, role: "BRAND" },
    });

    // Upsert the brand
    await prisma.brand.upsert({
      where: { slug: b.slug },
      update: {
        description: b.desc,
        logoUrl: b.logo,
        isFeatured: b.featured,
        status: "APPROVED",
      },
      create: {
        name: b.name,
        slug: b.slug,
        description: b.desc,
        logoUrl: b.logo,
        isFeatured: b.featured,
        status: "APPROVED",
        ownerId: user.id,
      },
    });
  }
  console.log("✅ Brands seeded successfully.");
}

main().then(() => prisma.$disconnect()).catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });