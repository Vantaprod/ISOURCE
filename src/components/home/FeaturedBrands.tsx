import Link from "next/link";
import { ArrowRight } from "lucide-react";

const BRANDS = [
  { name: "Litharv", tagline: "Powering Your Future", color: "bg-red-50 text-red-600", slug: "litharv" },
  { name: "Huihang", tagline: "Smart Energy Solutions", color: "bg-blue-50 text-blue-600", slug: "huihang" },
  { name: "Lura Energy", tagline: "Your Energy Partner", color: "bg-green-50 text-green-600", slug: "lura-energy" },
];

export function FeaturedBrands() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="text-primary">⚙️</span> Featured Brand Stores
        </h2>
        <Link href="/vendors" className="text-sm font-medium text-primary hover:underline">See All →</Link>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {BRANDS.map((b) => (
          <div key={b.slug} className="rounded-xl border border-border bg-white p-6 relative overflow-hidden flex flex-col justify-between min-h-[160px] hover:shadow-md transition-shadow">
            <div className="relative z-10">
              <h3 className={`text-2xl font-extrabold ${b.color.split(" ")[1]}`}>{b.name}</h3>
              <p className="text-sm text-muted mt-1 mb-4">{b.tagline}</p>
              <Link href={`/search?q=${b.name}`} className="inline-flex items-center gap-2 h-9 px-4 rounded bg-primary text-white text-xs font-semibold hover:bg-primary-hover">
                Visit Store <ArrowRight size={14} />
              </Link>
            </div>
            <div className="absolute right-0 bottom-0 w-32 h-32 opacity-20 bg-primary rounded-tl-full" />
          </div>
        ))}
      </div>
    </section>
  );
}