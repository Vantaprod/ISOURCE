import { prisma } from "@/lib/prisma";
import { HeroSlider } from "./HeroSlider";
import type { HeroBanner, Category, Brand } from "@prisma/client";

export async function Hero() {
  let manualBanners: HeroBanner[] = [];
  let categories: Category[] = [];
  let brands: Brand[] = [];

  try {
    const [fetchedBanners, fetchedCategories, fetchedBrands] = await Promise.all([
      prisma.heroBanner.findMany({
        where: { isActive: true, OR: [{ endDate: null }, { endDate: { gte: new Date() } }] },
        orderBy: { position: "asc" },
      }),
      prisma.category.findMany({
        orderBy: { sortOrder: "asc" },
      }),
      prisma.brand.findMany({
        where: { isFeatured: true, status: "APPROVED" },
      }),
    ]);

    manualBanners = fetchedBanners;
    categories = fetchedCategories;
    brands = fetchedBrands;
  } catch (error) {
    console.error("Failed to load hero data (DB might be asleep):", error);
  }

  const categorySlides: HeroBanner[] = categories.map((c, idx) => ({
    id: `cat-${c.id}`,
    title: `Shop ${c.name}`,
    subtitle: `Explore our Top ${c.shortName}`,
    description: c.description || `Discover the best deals in ${c.name}.`,
    imageUrl: "/images/placeholder.svg",
    ctaLabel: `Shop ${c.shortName}`,
    ctaUrl: `/category/${c.slug}`,
    position: 100 + idx,
    isActive: true, startDate: null, endDate: null, createdAt: new Date(), updatedAt: new Date(),
  }));

  const brandSlides: HeroBanner[] = brands.map((b, idx) => ({
    id: `brand-${b.id}`,
    title: `${b.name}`,
    subtitle: `Official Brand Store`,
    description: b.description || `Discover authentic products from ${b.name}.`,
    imageUrl: b.logoUrl || "/images/placeholder.svg",
    ctaLabel: `Visit ${b.name}`,
    ctaUrl: `/search?q=${encodeURIComponent(b.name)}`,
    position: 200 + idx,
    isActive: true, startDate: null, endDate: null, createdAt: new Date(), updatedAt: new Date(),
  }));

  let allSlides = [...manualBanners, ...categorySlides, ...brandSlides];

  if (allSlides.length === 0) {
    allSlides = [{
      id: "fallback",
      title: "Reliable Solar Solutions for Every Home & Business",
      subtitle: "Powering a Brighter Tomorrow",
      description: "Premium solar panels, inverters, batteries and accessories from trusted brands.",
      imageUrl: "/images/placeholder.svg",
      ctaLabel: "Shop Solar Now",
      ctaUrl: "/category/solar-power",
      position: 0,
      isActive: true, startDate: null, endDate: null, createdAt: new Date(), updatedAt: new Date(),
    }];
  }

  return <HeroSlider banners={allSlides} />;
}