import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getActiveCampaign } from "@/lib/campaign";

export async function OccasionOffersSection() {
  const campaign = await getActiveCampaign();
  if (!campaign) return null;

  // Fetch categories to display as slides
  const categories = await prisma.category.findMany({
    take: 4,
    orderBy: { sortOrder: "asc" }
  });

  const href = `/search?q=${encodeURIComponent(campaign.name)}`;

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-6">
      <div 
        className="relative rounded-2xl overflow-hidden flex flex-col lg:flex-row items-center justify-between p-6 md:p-10 min-h-[220px] gap-6"
        style={{ backgroundColor: campaign.themeColor }}
      >
        {/* Decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full transform translate-x-1/3 -translate-y-1/3 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full transform -translate-x-1/4 translate-y-1/4 blur-xl pointer-events-none" />

        {/* Left Text Area */}
        <div className="relative z-10 max-w-lg text-white flex-shrink-0">
          <p className="text-white/80 font-bold uppercase tracking-wider text-sm mb-1">
            {campaign.isAuto ? "Upcoming Event" : "Limited Time Offer"}
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-2 drop-shadow-sm leading-tight">
            {campaign.name}
          </h2>
          <p className="text-white/90 text-sm md:text-base mb-5 line-clamp-2">
            {campaign.description}
          </p>
          <Link 
            href={href} 
            className="inline-flex items-center gap-2 h-10 px-6 rounded-md bg-white text-charcoal text-sm font-bold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Shop All Deals <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        {/* Right Category Slides */}
        <div className="relative z-10 w-full lg:w-auto overflow-hidden">
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 snap-x">
            {categories.map((c) => (
              <Link 
                key={c.id} 
                href={`/category/${c.slug}`} 
                className="snap-start flex-shrink-0 w-32 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 flex flex-col items-center justify-center text-center hover:bg-white/20 transition-colors group"
              >
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Image src="/images/placeholder.svg" alt={c.name} width={20} height={20} className="opacity-80" />
                </div>
                <span className="text-white text-xs font-bold leading-tight line-clamp-2">{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}