import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Truck, ShieldCheck, RefreshCcw } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { CategoryStrip } from "@/components/home/CategoryStrip";
import { FlashDealsSection } from "@/components/home/FlashDealsSection";
import { ProductCard } from "@/components/product/ProductCard";
import { getProductsByTag, getProductsByCategory } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [banners, sections] = await Promise.all([
    prisma.heroBanner.findMany({
      where: { isActive: true, OR: [{ endDate: null }, { endDate: { gte: new Date() } }] },
      orderBy: { position: "asc" },
      take: 1,
    }),
    prisma.homepageSection.findMany({
      where: { isVisible: true, OR: [{ endDate: null }, { endDate: { gte: new Date() } }] },
      orderBy: { position: "asc" },
    }),
  ]);

  const hero = banners[0];
  // Active campaign (theme banner)
  const activeCampaign = await prisma.campaign.findFirst({
    where: { isActive: true, startDate: { lte: new Date() }, endDate: { gte: new Date() } },
    include: { banner: true },
    orderBy: { startDate: "desc" },
  });
  const flashDeals = await getProductsByTag("flash-deal");
  const bestSellers = await getProductsByTag("best-seller");
  const solarProducts = await getProductsByCategory("solar-power");

  return (
    <>
      {/* Dynamic Hero or fallback */}
            {activeCampaign && (
        <div className="bg-charcoal text-white text-center py-2 text-xs font-semibold" style={{ background: activeCampaign.themeColor }}>
          🎉 {activeCampaign.name} {activeCampaign.description && `— ${activeCampaign.description}`}
        </div>
      )}<section className="bg-white">
        <div className="mx-auto max-w-[1440px] px-4 pt-4 md:pt-6">
          <div className="grid lg:grid-cols-[1fr_300px] gap-4">
            <div className="relative rounded-xl overflow-hidden bg-cream flex flex-col md:flex-row items-center border border-border">
              <div className="p-8 md:p-12 md:w-1/2 z-10">
                <p className="text-primary font-bold text-sm mb-2 uppercase tracking-wide">{hero?.subtitle || "Powering a Brighter Tomorrow"}</p>
                <h1 className="text-3xl md:text-5xl font-extrabold text-charcoal leading-[1.1] tracking-tight mb-4">{hero?.title || "Reliable Solar Solutions for Every Home & Business"}</h1>
                <p className="text-charcoal/70 mb-6">{hero?.description || "Premium solar panels, inverters, batteries and accessories from trusted brands."}</p>
                <Link href={hero?.ctaUrl || "/category/solar-power"} className="inline-flex items-center gap-2 h-11 px-6 rounded-md bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors">
                  {hero?.ctaLabel || "Shop Solar Now"} <ArrowRight size={16} />
                </Link>
              </div>
              <div className="relative md:w-1/2 h-[250px] md:h-[400px] w-full">
                <div className="absolute inset-0 bg-gradient-to-r from-cream via-transparent to-transparent z-10 hidden md:block" />
                <div className="absolute top-0 right-0 w-[120%] h-full bg-primary rounded-l-[100px] transform translate-x-1/4 skew-x-[-15deg] z-0" />
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <Image src={hero?.imageUrl || "/images/placeholder.svg"} alt="Hero" fill className="object-contain p-8 drop-shadow-2xl" />
                </div>
              </div>
            </div>
            <div className="hidden lg:flex flex-col gap-3">
              <div className="flex-1 rounded-xl border border-border bg-white p-5 flex flex-col justify-center gap-6">
                <div className="flex gap-4 items-start"><CheckCircle2 className="text-primary flex-shrink-0" size={24} /><div><h3 className="font-bold text-sm">Genuine Products</h3><p className="text-xs text-muted">From verified sellers</p></div></div>
                <div className="flex gap-4 items-start"><Truck className="text-primary flex-shrink-0" size={24} /><div><h3 className="font-bold text-sm">Fast Delivery</h3><p className="text-xs text-muted">Across Nigeria</p></div></div>
                <div className="flex gap-4 items-start"><ShieldCheck className="text-primary flex-shrink-0" size={24} /><div><h3 className="font-bold text-sm">Secure Payments</h3><p className="text-xs text-muted">Paystack & Flutterwave</p></div></div>
                <div className="flex gap-4 items-start"><RefreshCcw className="text-primary flex-shrink-0" size={24} /><div><h3 className="font-bold text-sm">Easy Returns</h3><p className="text-xs text-muted">Hassle-free</p></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CategoryStrip />

      {/* Render dynamic sections if configured, else fallback */}
      {sections.length === 0 ? (
        <>
          <FlashDealsSection products={flashDeals} />
          <section className="mx-auto max-w-[1440px] px-4 py-6 md:py-8">
            <div className="flex items-end justify-between mb-4"><h2 className="text-xl font-bold">Best Sellers</h2><Link href="/search" className="text-sm text-primary hover:underline">View All â†’</Link></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">{bestSellers.slice(0, 5).map(p => <ProductCard key={p.id} product={p} />)}</div>
          </section>
          <section className="mx-auto max-w-[1440px] px-4 py-6 md:py-8">
            <div className="flex items-end justify-between mb-4"><h2 className="text-xl font-bold">Top Solar & Power</h2><Link href="/category/solar-power" className="text-sm text-primary hover:underline">View All â†’</Link></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">{solarProducts.slice(0, 5).map(p => <ProductCard key={p.id} product={p} />)}</div>
          </section>
        </>
      ) : (
        await Promise.all(sections.map(async (s) => {
          if (s.type === "FLASH_DEALS") return <FlashDealsSection key={s.id} products={flashDeals} />;
          if (s.type === "BEST_SELLERS") {
            return (
              <section key={s.id} className="mx-auto max-w-[1440px] px-4 py-6 md:py-8">
                <div className="flex items-end justify-between mb-4"><div><h2 className="text-xl font-bold">{s.title}</h2>{s.subtitle && <p className="text-sm text-muted">{s.subtitle}</p>}</div><Link href="/search" className="text-sm text-primary hover:underline">View All â†’</Link></div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">{bestSellers.slice(0, 5).map(p => <ProductCard key={p.id} product={p} />)}</div>
              </section>
            );
          }
          if (s.type === "TRENDING" || s.type === "RECENT") {
            return (
              <section key={s.id} className="mx-auto max-w-[1440px] px-4 py-6 md:py-8">
                <div className="flex items-end justify-between mb-4"><div><h2 className="text-xl font-bold">{s.title}</h2>{s.subtitle && <p className="text-sm text-muted">{s.subtitle}</p>}</div></div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">{solarProducts.slice(0, 5).map(p => <ProductCard key={p.id} product={p} />)}</div>
              </section>
            );
          }
          return null;
        }))
      )}
    </>
  );
}