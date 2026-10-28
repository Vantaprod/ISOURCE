import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { CategoryStrip } from "@/components/home/CategoryStrip";
import { FlashDealsSection } from "@/components/home/FlashDealsSection";
import { PromotionBanner } from "@/components/home/PromotionBanner";
import { CategoryBanner } from "@/components/home/CategoryBanner";
import { TrustBar } from "@/components/home/TrustBar";
import { Newsletter } from "@/components/home/Newsletter";
import { ProductCard } from "@/components/product/ProductCard";
import { getProductsByTag, getProductsByCategory } from "@/lib/catalog";
export default function HomePage() {
  const flashDeals = getProductsByTag("flash-deal"); const bestSellers = getProductsByTag("best-seller"); const electronics = getProductsByCategory("electronics"); const home = getProductsByCategory("home-kitchen");
  return (
    <>
      <Hero />
      <CategoryStrip />
      <FlashDealsSection products={flashDeals} />
      <section className="mx-auto max-w-[1440px] px-4 py-6 md:py-8"><div className="flex items-end justify-between mb-4"><h2 className="text-lg md:text-xl font-bold">Best Selling Products</h2><Link href="/category/electronics" className="text-sm font-medium text-primary hover:underline">View All →</Link></div><div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">{bestSellers.slice(0, 5).map((p) => (<ProductCard key={p.id} product={p} />))}</div></section>
      <section className="mx-auto max-w-[1440px] px-4 py-6 md:py-8"><div className="grid md:grid-cols-2 gap-3 md:gap-4"><PromotionBanner title="Big Discounts on Electronics" subtitle="Top brands. Great prices." href="/category/electronics" tone="orange" /><PromotionBanner title="Upgrade Your Home" subtitle="Quality kitchen & home essentials" href="/category/home-kitchen" tone="cream" /></div></section>
      <section className="mx-auto max-w-[1440px] px-4 pb-6 md:pb-8"><div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4"><CategoryBanner title="Solar & Power" subtitle="Stay powered, always" href="/category/solar-power" /><CategoryBanner title="Fashion & Lifestyle" subtitle="Look good, feel great" href="/category/fashion" /><CategoryBanner title="Groceries" subtitle="Freshness delivered" href="/category/groceries" /></div></section>
      {electronics.length > 0 && (<section className="mx-auto max-w-[1440px] px-4 py-6 md:py-8"><div className="flex items-end justify-between mb-4"><h2 className="text-lg md:text-xl font-bold">Electronics</h2><Link href="/category/electronics" className="text-sm font-medium text-primary hover:underline">View All →</Link></div><div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">{electronics.slice(0, 5).map((p) => (<ProductCard key={p.id} product={p} />))}</div></section>)}
      {home.length > 0 && (<section className="mx-auto max-w-[1440px] px-4 pb-6 md:pb-8"><div className="flex items-end justify-between mb-4"><h2 className="text-lg md:text-xl font-bold">Home &amp; Kitchen</h2><Link href="/category/home-kitchen" className="text-sm font-medium text-primary hover:underline">View All →</Link></div><div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">{home.slice(0, 5).map((p) => (<ProductCard key={p.id} product={p} />))}</div></section>)}
      <TrustBar />
      <Newsletter />
    </>
  );
}