import { prisma } from "@/lib/prisma";
import { FeaturedBrandsClient } from "./FeaturedBrandsClient";

export async function FeaturedBrands() {
  let brands = [];
  try {
    brands = await prisma.brand.findMany({
      where: { status: "APPROVED", isFeatured: true },
      take: 6,
    });
  } catch (error) {
    console.error("Failed to load featured brands:", error);
  }

  if (brands.length === 0) return null;

  return (
    <section className="py-8 md:py-12 mx-auto max-w-[1440px] px-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-extrabold text-charcoal">Featured Brand Stores</h2>
        {/* See All Button has been deleted */}
      </div>
      <FeaturedBrandsClient brands={brands} />
    </section>
  );
}