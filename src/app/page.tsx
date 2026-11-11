import { FeaturedProducts, SponsoredBanner } from "@/components/advertising/FeaturedAndBanner";
import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { CategoryStrip } from "@/components/home/CategoryStrip";
import { InfiniteProductFeed } from "@/components/home/InfiniteProductFeed";
import { FlashDealsSection } from "@/components/home/FlashDealsSection";
import { FeaturedBrands } from "@/components/home/FeaturedBrands";
import { OccasionOffersSection } from "@/components/home/OccasionOffersSection";
import { TrustBar } from "@/components/home/TrustBar";
import { Newsletter } from "@/components/home/Newsletter";
import { PromoBanners } from "@/components/home/PromoBanners";
import { ProductCard } from "@/components/product/ProductCard";
import { getProductsByTag } from "@/lib/catalog";
import type { ProductWithVendor } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let flashDeals: ProductWithVendor[] = [];
  let bestSellers: ProductWithVendor[] = [];

  try {
    flashDeals = await getProductsByTag("flash-deal");
    bestSellers = await getProductsByTag("best-seller");
  } catch (error) {
    console.error("Failed to load products:", error);
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4">
      {/* 1. Main Hero Slider */}
      <Hero />
      
      {/* 2. Category Icons */}
      <CategoryStrip />

      {/* 3. Sponsored Banner (Ad) */}
      <SponsoredBanner />

      {/* 4. Event Banners (Black Friday, Christmas, etc.) */}
      <OccasionOffersSection />

      {/* 5. Infinite Feed (Mobile Only) */}
      <InfiniteProductFeed />

      {/* 6. The rest of the desktop homepage */}
      <div className="hidden md:block">
        
        {/* Featured Products (Fixed-Fee Ads) */}
        <FeaturedProducts />

        <FlashDealsSection />
        <FeaturedBrands />
        <PromoBanners />
        
        <section className="px-4 py-6">
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-xl font-bold text-charcoal">Best Sellers</h2>
            <Link href="/search" className="text-sm font-semibold text-primary hover:underline">View All →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {bestSellers.slice(0, 5).map(p => <ProductCard key={p.id} product={p as any} />)}
          </div>
        </section>
      </div>

      {/* 7. Footer Blocks */}
      <div className="px-4">
        <TrustBar />
        <Newsletter />
      </div>
    </div>
  );
}