import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES, getCategory } from "@/data/categories";
import { VENDORS } from "@/data/vendors";
import { searchProducts } from "@/lib/catalog";
import type { CategorySlug, SortKey } from "@/types/catalog";
import { ProductGrid } from "@/components/product/ProductGrid";
import { cn } from "@/lib/cn";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "relevance", label: "Relevance" }, { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" }, { key: "newest", label: "Newest" }, { key: "popular", label: "Popular" },
];
const PRICE_RANGES = [
  { label: "₦0 – ₦50,000", min: 0, max: 50_000 },
  { label: "₦50,001 – ₦100,000", min: 50_001, max: 100_000 },
  { label: "₦100,001 – ₦200,000", min: 100_001, max: 200_000 },
  { label: "₦200,001 – ₦500,000", min: 200_001, max: 500_000 },
  { label: "₦500,000+", min: 500_001, max: undefined },
];

interface Props { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>>; }
export async function generateStaticParams() { return CATEGORIES.map((c) => ({ slug: c.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { slug } = await params; const cat = getCategory(slug); if (!cat) return {}; return { title: cat.name, description: cat.description }; }
function firstString(v: string | string[] | undefined): string | undefined { return Array.isArray(v) ? v[0] : v; }

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const cat = getCategory(slug);
  if (!cat) notFound();

  const q = firstString(sp.q);
  const sort = (firstString(sp.sort) as SortKey | undefined) ?? "relevance";
  const inStockOnly = firstString(sp.inStock) === "1";
  const page = Number(firstString(sp.page) ?? "1") || 1;
  const minNaira = Number(firstString(sp.min) ?? "0") || 0;
  const maxNaira = Number(firstString(sp.max) ?? "0") || 0;
  const brandSlugs = (firstString(sp.brands) ?? "").split(",").filter(Boolean);
  const brandVendors = brandSlugs.map((s) => VENDORS.find((v) => v.slug === s)?.name ?? s);

  let result = await searchProducts({ q, category: cat.slug as CategorySlug, sort, page, pageSize: 15, inStockOnly, minKobo: minNaira > 0 ? minNaira * 100 : undefined, maxKobo: maxNaira > 0 ? maxNaira * 100 : undefined });
  if (brandVendors.length > 0) {
    const filtered = result.items.filter((p) => brandVendors.includes(p.vendor.name));
    result = { items: filtered, total: filtered.length, page: 1, pageSize: 15, pageCount: 1 };
  }

  function buildHref(overrides: Record<string, string | undefined>) {
    const merged = { ...(sp as Record<string, string | undefined>), ...overrides };
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(merged)) if (v) qs.set(k, v);
    return `/category/${slug}${qs.toString() ? `?${qs.toString()}` : ""}`;
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8">
      <nav className="text-xs text-muted mb-4 flex gap-2"><Link href="/" className="hover:text-primary">Home</Link><span>/</span><span className="text-charcoal font-medium">{cat.name}</span></nav>
      
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-charcoal">{cat.name}</h1>
        <p className="text-sm text-muted mt-2 max-w-2xl">{cat.description}</p>
      </div>

      <div className="grid md:grid-cols-[260px_1fr] gap-8">
        {/* Sidebar */}
        <aside className="hidden md:block">
          <div className="rounded-xl border border-border p-5 space-y-8 sticky top-24 bg-white">
            {/* Category Filter */}
            <div>
              <h3 className="text-sm font-bold text-charcoal mb-3">Category</h3>
              <ul className="space-y-2 text-sm">
                {CATEGORIES.map((c) => (
                  <li key={c.slug}><Link href={`/category/${c.slug}`} className={cn("block hover:text-primary transition-colors", c.slug === slug ? "text-primary font-semibold" : "text-charcoal/80")}>{c.name}</Link></li>
                ))}
              </ul>
            </div>
            
            {/* Price Filter */}
            <div>
              <h3 className="text-sm font-bold text-charcoal mb-3">Price Range</h3>
              <ul className="space-y-2 text-sm">
                {PRICE_RANGES.map((r) => {
                  const active = minNaira === r.min && (r.max === undefined ? maxNaira === 0 : maxNaira === r.max);
                  const href = active ? buildHref({ min: undefined, max: undefined, page: undefined }) : buildHref({ min: String(r.min), max: r.max ? String(r.max) : undefined, page: undefined });
                  return (
                    <li key={r.label}>
                      <Link href={href} className={cn("flex items-center gap-2.5 hover:text-primary transition-colors", active ? "text-primary font-semibold" : "text-charcoal/80")}>
                        <div className={cn("h-4 w-4 rounded border flex items-center justify-center transition-colors", active ? "border-primary bg-primary" : "border-border bg-white")}>
                          {active && <div className="h-2 w-2 bg-white rounded-sm" />}
                        </div>
                        {r.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Brand Filter */}
            <div>
              <h3 className="text-sm font-bold text-charcoal mb-3">Brand</h3>
              <ul className="space-y-2 text-sm">
                {VENDORS.slice(0, 6).map((v) => {
                  const active = brandSlugs.includes(v.slug);
                  const nextBrands = active ? brandSlugs.filter((x) => x !== v.slug) : [...brandSlugs, v.slug];
                  return (
                    <li key={v.slug}>
                      <Link href={buildHref({ brands: nextBrands.length > 0 ? nextBrands.join(",") : undefined, page: undefined })} className={cn("flex items-center gap-2.5 hover:text-primary transition-colors", active ? "text-primary font-semibold" : "text-charcoal/80")}>
                        <div className={cn("h-4 w-4 rounded border flex items-center justify-center transition-colors", active ? "border-primary bg-primary" : "border-border bg-white")}>
                          {active && <div className="h-2 w-2 bg-white rounded-sm" />}
                        </div>
                        {v.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <Link href={`/category/${slug}`} className="block text-center text-xs text-primary font-medium hover:underline">Reset all filters</Link>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <span className="text-sm text-muted font-medium">{result.total} product{result.total === 1 ? "" : "s"} found</span>
            
            <form action={`/category/${slug}`} method="get" className="flex items-center gap-3">
              {q && <input type="hidden" name="q" value={q} />}
              {inStockOnly && <input type="hidden" name="inStock" value="1" />}
              {brandSlugs.length > 0 && <input type="hidden" name="brands" value={brandSlugs.join(",")} />}
              {minNaira > 0 && <input type="hidden" name="min" value={minNaira} />}
              {maxNaira > 0 && <input type="hidden" name="max" value={maxNaira} />}
              
              <select name="sort" defaultValue={sort} className="h-10 rounded-md border border-border bg-white px-3 text-sm outline-none focus:border-primary">
                {SORT_OPTIONS.map((o) => (<option key={o.key} value={o.key}>{o.label}</option>))}
              </select>
              <button type="submit" className="h-10 px-4 rounded-md bg-charcoal text-white text-sm font-medium hover:bg-charcoal/90">Apply</button>
            </form>
          </div>

          <ProductGrid products={result.items} />

          {result.pageCount > 1 && (
            <nav className="mt-10 flex items-center justify-center gap-2">
              {Array.from({ length: result.pageCount }, (_, i) => i + 1).map((n) => (
                <Link key={n} href={buildHref({ page: String(n) })} className={cn("min-w-[40px] h-10 px-4 inline-flex items-center justify-center rounded-md border text-sm font-medium transition-colors", n === result.page ? "bg-primary text-white border-primary" : "border-border text-charcoal hover:border-primary hover:text-primary")}>{n}</Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}