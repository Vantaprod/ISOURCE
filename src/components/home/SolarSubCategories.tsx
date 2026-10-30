import Link from "next/link";
import Image from "next/image";

const SUBS = [
  { name: "Solar Panels", slug: "solar-panels" },
  { name: "Inverters", slug: "inverters" },
  { name: "Lithium Batteries", slug: "lithium-batteries" },
  { name: "Solar Generators", slug: "solar-generators" },
  { name: "Solar Accessories", slug: "solar-accessories" },
  { name: "Complete Packages", slug: "complete-packages" },
];

export function SolarSubCategories() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="text-primary text-2xl">⚡</span> Solar & Energy
        </h2>
        <Link href="/category/solar-power" className="text-sm font-medium text-primary hover:underline">See All →</Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {SUBS.map((sub) => (
          <Link key={sub.slug} href={`/category/solar-power?q=${encodeURIComponent(sub.name)}`} className="group flex flex-col rounded-lg border border-border bg-white overflow-hidden hover:border-primary transition-colors">
            <div className="relative aspect-[4/3] bg-surface">
               <Image src="/images/placeholder.svg" alt={sub.name} fill className="object-cover group-hover:scale-105 transition-transform" />
            </div>
            <div className="p-3 text-center">
              <span className="text-sm font-semibold text-charcoal">{sub.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}