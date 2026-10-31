import Link from "next/link";
import Image from "next/image";

// Custom Premium Solar Icon
const SolarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="5" fill="#F07824" stroke="#242424" strokeWidth="1.5"/>
    <path d="M12 2V4M12 20V22M4 12H2M22 12H20M19.07 4.93L17.66 6.34M6.34 17.66L4.93 19.07M19.07 19.07L17.66 17.66M6.34 6.34L4.93 4.93" stroke="#F07824" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const SUBS = [
  { name: "Solar Panels", slug: "solar-panels", bg: "bg-[#FDF6ED]" },
  { name: "Inverters", slug: "inverters", bg: "bg-[#F4F5F7]" },
  { name: "Lithium Batteries", slug: "lithium-batteries", bg: "bg-[#F4F5F7]" },
  { name: "Solar Generators", slug: "solar-generators", bg: "bg-[#F4F5F7]" },
  { name: "Solar Accessories", slug: "solar-accessories", bg: "bg-[#F4F5F7]" },
  { name: "Complete Packages", slug: "complete-packages", bg: "bg-[#F4F5F7]" },
];

export function SolarSubCategories() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2 text-charcoal">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 shadow-sm border border-primary/20">
            <SolarIcon />
          </span>
          Solar & Energy
        </h2>
        <Link href="/category/solar-power" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">See All <span aria-hidden="true">&rarr;</span></Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {SUBS.map((sub) => (
          <Link key={sub.slug} href={`/category/solar-power?q=${encodeURIComponent(sub.name)}`} className="group flex flex-col rounded-xl border border-border bg-white overflow-hidden hover:border-primary transition-all">
            <div className={`relative aspect-[4/3] ${sub.bg} p-4 flex items-center justify-center`}>
               <Image src="/images/placeholder.svg" alt={sub.name} fill sizes="200px" className="object-contain p-4 group-hover:scale-105 transition-transform" />
            </div>
            <div className="p-4 text-center border-t border-border">
              <span className="text-sm font-bold text-charcoal">{sub.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}