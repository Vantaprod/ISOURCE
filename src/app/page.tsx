import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { CategoryStrip } from "@/components/home/CategoryStrip";
import { SolarSubCategories } from "@/components/home/SolarSubCategories";
import { FeaturedBrands } from "@/components/home/FeaturedBrands";
import { FlashDealsSection } from "@/components/home/FlashDealsSection";
import { PromoBanners } from "@/components/home/PromoBanners";
import { TrustBar } from "@/components/home/TrustBar";
import { Newsletter } from "@/components/home/Newsletter";
import { ProductCard } from "@/components/product/ProductCard";
import { getProductsByTag, getProductsByCategory } from "@/lib/catalog";

export default async function HomePage() {
  const flashDeals = await getProductsByTag("flash-deal");
  const bestSellers = await getProductsByTag("best-seller");
  const solarProducts = await getProductsByCategory("solar-power");
  const electronics = await getProductsByCategory("electronics");

  return (
    <>
      <Hero />
      <CategoryStrip />
      <SolarSubCategories />
      <FeaturedBrands />
      
      {/* Flash Deals */}
      <FlashDealsSection products={flashDeals} />

      <PromoBanners />

      {/* Best Sellers (General) */}
      <section className="mx-auto max-w-[1440px] px-4 py-6 md:py-8">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-xl font-bold">Best Selling Products</h2>
          <Link href="/search" className="text-sm font-medium text-primary hover:underline">View All →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {bestSellers.slice(0, 5).map((p) => (<ProductCard key={p.id} product={p} />))}
        </div>
      </section>

      {/* Solar Products Collection */}
      <section className="mx-auto max-w-[1440px] px-4 py-6 md:py-8">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-xl font-bold">Top Solar & Power</h2>
          <Link href="/category/solar-power" className="text-sm font-medium text-primary hover:underline">View All →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {solarProducts.slice(0, 5).map((p) => (<ProductCard key={p.id} product={p} />))}
        </div>
      </section>

      {/* Electronics */}
      {electronics.length > 0 && (
        <section className="mx-auto max-w-[1440px] px-4 py-6 md:py-8">
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-xl font-bold">Electronics & Tech</h2>
            <Link href="/category/electronics" className="text-sm font-medium text-primary hover:underline">View All →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {electronics.slice(0, 5).map((p) => (<ProductCard key={p.id} product={p} />))}
          </div>
        </section>
      )}

      <TrustBar />
      <Newsletter />
    </>
  );
}