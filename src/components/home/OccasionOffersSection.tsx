import { getActiveCampaign } from "@/lib/campaign";
import Link from "next/link";

export async function OccasionOffersSection() {
  const campaign = await getActiveCampaign();
  
  if (!campaign) return null;

  const identifier = String(campaign.slug || campaign.name || "").toLowerCase();

  let bgClass = "bg-[#F97316]"; 
  let textClass = "text-white";
  let btnClass = "bg-white text-[#F97316]";
  let subTextClass = "text-orange-100";
  let borderClass = "border-orange-400/30 hover:border-white transition-colors";
  let badgeClass = "bg-white/20 text-white";

  if (identifier.includes("black-friday") || identifier.includes("black friday")) {
    bgClass = "bg-[#111111]";
    textClass = "text-white";
    btnClass = "bg-[#FBAF3C] text-black hover:bg-yellow-500";
    subTextClass = "text-gray-300";
    borderClass = "border-gray-700 hover:border-[#FBAF3C] transition-colors";
    badgeClass = "bg-[#FBAF3C] text-black";
  } else if (identifier.includes("christmas")) {
    bgClass = "bg-[#C0292E]";
    btnClass = "bg-white text-[#C0292E]";
    subTextClass = "text-red-100";
  } else if (identifier.includes("valentine")) {
    bgClass = "bg-[#D82C6B]";
    btnClass = "bg-white text-[#D82C6B]";
    subTextClass = "text-pink-100";
  } else if (identifier.includes("independence")) {
    bgClass = "bg-[#008751]";
    btnClass = "bg-white text-[#008751]";
    subTextClass = "text-green-100";
  }

  const CATEGORIES = [
    { name: "Solar & Power", slug: "solar-power" },
    { name: "Electronics", slug: "electronics" },
    { name: "Phones & Accessories", slug: "phones-accessories" },
    { name: "Computers", slug: "computers" }
  ];

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6">
      <div className={`relative overflow-hidden rounded-2xl ${bgClass} p-8 md:p-12 shadow-xl transition-colors duration-500`}>
        
        {/* Changed layout: flex-1 and justify-center spreads the items across the middle */}
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 w-full">
          
          {/* Left Side: Text and CTA */}
          <div className="max-w-sm w-full shrink-0 text-center lg:text-left">
            <span className={`inline-block font-extrabold text-[10px] md:text-xs px-3 py-1 rounded-full mb-4 uppercase tracking-wider ${badgeClass}`}>
              Limited Time Offer
            </span>
            <h2 className={`text-3xl md:text-5xl font-extrabold mb-3 ${textClass}`}>
              {campaign.name}
            </h2>
            <p className={`text-sm md:text-base mb-6 ${subTextClass}`}>
              {campaign.description || "Huge discounts. Limited time."}
            </p>
            <Link 
              href={`/search?q=deal`} 
              className={`inline-flex h-11 items-center justify-center rounded-md px-8 text-sm font-bold transition-colors ${btnClass}`}
            >
              Shop All Deals &rarr;
            </Link>
          </div>

          {/* Right Side: Categories spread out to fill the middle space */}
          <div className="flex md:grid md:grid-cols-4 gap-4 w-full overflow-x-auto no-scrollbar pb-2 md:pb-0 flex-1 md:justify-items-center">
            {CATEGORIES.map((cat, i) => (
              <Link 
                key={i} 
                href={`/category/${cat.slug}`}
                className={`flex flex-col items-center justify-center h-28 w-32 md:w-full md:max-w-[140px] shrink-0 rounded-xl border ${borderClass} bg-white/5 backdrop-blur-sm p-4 text-center cursor-pointer group`}
              >
                {/* PNG IMAGE PLACEHOLDER: You can replace this <div> with an <Image> component later */}
                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                   {/* Replace the emoji below with your actual PNG image */}
                   <span className="text-xl">🛒</span>
                </div>
                <span className={`text-[11px] font-bold leading-tight ${textClass}`}>{cat.name}</span>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}