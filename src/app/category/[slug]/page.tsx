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
  { label: "₦500,000+", min: 500_001, max: undefined as number | undefined },
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
  const outOfStockOnly = firstString(sp.outOfStock) === "1";
  const page = Number(firstString(sp.page) ?? "1") || 1;
  const minNaira = Number(firstString(sp.min) ?? "0") || 0;
  const maxNaira = Number(firstString(sp.max) ?? "0") || 0;
  const brandSlugs = (firstString(sp.brands) ?? "").split(",").filter(Boolean);
  const brandVendors = brandSlugs.map((s) => VENDORS.find((v) => v.slug === s)?.name ?? s);

  let result = searchProducts({ q, category: cat.slug as CategorySlug, sort, page, pageSize: 12, inStockOnly, minKobo: minNaira > 0 ? minNaira * 100 : undefined, maxKobo: maxNaira > 0 ? maxNaira * 100 : undefined });
  if (brandVendors.length > 0) {
    const filtered = result.items.filter((p) => brandVendors.includes(p.vendor.name));
    const total = filtered.length;
    const pageCount = Math.max(1, Math.ceil(total / 12));
    result = { items: filtered.slice((page - 1) * 12, page * 12), total, page, pageSize: 12, pageCount };
  }
  if (outOfStockOnly) {
    const filtered = result.items.filter((p) => p.stock <= 0);
    result = { items: filtered, total: filtered.length, page: 1, pageSize: 12, pageCount: 1 };
  }

  function buildHref(overrides: Record<string, string | undefined>) {
    const merged = { ...(sp as Record<string, string | undefined>), ...overrides };
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(merged)) if (v) qs.set(k, v);
    return `/category/${slug}${qs.toString() ? `?${qs.toString()}` : ""}`;
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 md:py-8">
      <nav className="text-xs text-muted mb-3"><Link href="/" className="hover:text-primary">Home</Link><span className="mx-1">/</span><span className="text-charcoal">{cat.name}</span></nav>

      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold">{cat.name}</h1>
        <p className="text-sm text-muted mt-1">{result.total} product{result.total === 1 ? "" : "s"} · {cat.description}</p>
      </div>

      <div className="grid md:grid-cols-[240px_1fr] gap-6">
        <aside className="hidden md:block">
          <div className="rounded-lg border border-border p-4 space-y-5 sticky top-24">
            <h2 className="text-sm font-bold">Filters</h2>

            {/* Category */}
            <div>
              <h3 className="text-xs uppercase tracking-wide text-muted mb-2">Category</h3>
              <ul className="space-y-1.5 text-sm">
                {CATEGORIES.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/category/${c.slug}`}
                      className={cn("block rounded px-2 py-1 hover:bg-surface", c.slug === slug ? "text-primary font-semibold" : "text-charcoal")}
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-xs uppercase tracking-wide text-muted mb-2">Price</h3>
              <ul className="space-y-1.5 text-sm">
                {PRICE_RANGES.map((r) => {
                  const active = minNaira === r.min && (r.max === undefined ? maxNaira === 0 : maxNaira === r.max);
                  const href = active ? buildHref({ min: undefined, max: undefined, page: undefined }) : buildHref({ min: String(r.min), max: r.max ? String(r.max) : undefined, page: undefined });
                  return (
                    <li key={r.label}>
                      <Link href={href} className={cn("flex items-center gap-2 rounded px-2 py-1 hover:bg-surface", active ? "text-primary font-semibold" : "text-charcoal")}>
                        <span className={cn("h-3 w-3 rounded-full border", active ? "border-primary bg-primary" : "border-border")} />
                        {r.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Brand */}
            <div>
              <h3 className="text-xs uppercase tracking-wide text-muted mb-2">Brand</h3>
              <ul className="space-y-1.5 text-sm">
                {VENDORS.slice(0, 6).map((v) => {
                  const active = brandSlugs.includes(v.slug);
                  const nextBrands = active ? brandSlugs.filter((x) => x !== v.slug) : [...brandSlugs, v.slug];
                  return (
                    <li key={v.slug}>
                      <Link
                        href={buildHref({ brands: nextBrands.length > 0 ? nextBrands.join(",") : undefined, page: undefined })}
                        className="flex items-center gap-2 rounded px-2 py-1 hover:bg-surface"
                      >
                        <span className={cn("h-3 w-3 rounded border flex-shrink-0", active ? "border-primary bg-primary" : "border-border")} />
                        <span className={active ? "text-primary font-semibold" : "text-charcoal"}>{v.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Availability */}
            <div>
              <h3 className="text-xs uppercase tracking-wide text-muted mb-2">Availability</h3>
              <ul className="space-y-1.5 text-sm">
                <li>
                  <Link href={buildHref({ inStock: inStockOnly ? undefined : "1", outOfStock: undefined, page: undefined })} className="flex items-center gap-2 rounded px-2 py-1 hover:bg-surface">
                    <span className={cn("h-3 w-3 rounded border flex-shrink-0", inStockOnly ? "border-primary bg-primary" : "border-border")} />
                    <span className={inStockOnly ? "text-primary font-semibold" : "text-charcoal"}>In stock</span>
                  </Link>
                </li>
                <li>
                  <Link href={buildHref({ outOfStock: outOfStockOnly ? undefined : "1", inStock: undefined, page: undefined })} className="flex items-center gap-2 rounded px-2 py-1 hover:bg-surface">
                    <span className={cn("h-3 w-3 rounded border flex-shrink-0", outOfStockOnly ? "border-primary bg-primary" : "border-border")} />
                    <span className={outOfStockOnly ? "text-primary font-semibold" : "text-charcoal"}>Out of stock</span>
                  </Link>
                </li>
              </ul>
            </div>

            <Link href={`/category/${slug}`} className="block text-center text-xs text-muted hover:text-primary">Reset all filters</Link>
          </div>
        </aside>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              {q && <span className="rounded-full bg-surface px-2 py-0.5">Search: <b>{q}</b> · <Link href={buildHref({ q: undefined, page: undefined })} className="text-primary">clear</Link></span>}
              {inStockOnly && <span className="rounded-full bg-surface px-2 py-0.5">In stock · <Link href={buildHref({ inStock: undefined, page: undefined })} className="text-primary">clear</Link></span>}
              {outOfStockOnly && <span className="rounded-full bg-surface px-2 py-0.5">Out of stock · <Link href={buildHref({ outOfStock: undefined, page: undefined })} className="text-primary">clear</Link></span>}
              {brandVendors.length > 0 && <span className="rounded-full bg-surface px-2 py-0.5">{brandVendors.length} brand{brandVendors.length === 1 ? "" : "s"} · <Link href={buildHref({ brands: undefined, page: undefined })} className="text-primary">clear</Link></span>}
            </div>
            <form action={`/category/${slug}`} method="get" className="flex items-center gap-2">
              {q && <input type="hidden" name="q" value={q} />}
              {inStockOnly && <input type="hidden" name="inStock" value="1" />}
              {outOfStockOnly && <input type="hidden" name="outOfStock" value="1" />}
              {brandSlugs.length > 0 && <input type="hidden" name="brands" value={brandSlugs.join(",")} />}
              {minNaira > 0 && <input type="hidden" name="min" value={minNaira} />}
              {maxNaira > 0 && <input type="hidden" name="max" value={maxNaira} />}
              <label htmlFor="sort-select" className="text-xs text-muted hidden sm:inline">Sort by</label>
              <select id="sort-select" name="sort" defaultValue={sort} className="h-9 rounded border border-border bg-white px-2 text-sm">
                {SORT_OPTIONS.map((o) => (<option key={o.key} value={o.key}>{o.label}</option>))}
              </select>
              <button type="submit" className="h-9 px-3 rounded bg-charcoal text-white text-xs font-medium hover:bg-charcoal/90">Apply</button>
            </form>
          </div>

          <ProductGrid products={result.items} />

          {result.pageCount > 1 && (
            <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
              {Array.from({ length: result.pageCount }, (_, i) => i + 1).map((n) => (
                <Link key={n} href={buildHref({ page: String(n) })}
                  className={cn("min-w-[36px] h-9 px-3 inline-flex items-center justify-center rounded border text-sm",
                    n === result.page ? "bg-primary text-white border-primary" : "border-border text-charcoal hover:border-primary")}>
                  {n}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}