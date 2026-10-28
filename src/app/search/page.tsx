import type { Metadata } from "next";
import Link from "next/link";
import { searchProducts } from "@/lib/catalog";
import type { SortKey } from "@/types/catalog";
import { ProductGrid } from "@/components/product/ProductGrid";
import { cn } from "@/lib/cn";

interface Props { searchParams: Promise<Record<string, string | string[] | undefined>>; }
function firstString(v: string | string[] | undefined): string | undefined { return Array.isArray(v) ? v[0] : v; }

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams; const q = firstString(sp.q);
  return { title: q ? `Search: ${q}` : "Search", description: "Search products on Isource" };
}

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "relevance", label: "Relevance" }, { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" }, { key: "newest", label: "Newest" }, { key: "popular", label: "Popular" },
];

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = firstString(sp.q)?.trim() ?? "";
  const sort = (firstString(sp.sort) as SortKey | undefined) ?? "relevance";
  const page = Number(firstString(sp.page) ?? "1") || 1;
  const inStockOnly = firstString(sp.inStock) === "1";
  const result = searchProducts({ q, sort, page, pageSize: 12, inStockOnly });

  function buildHref(overrides: Record<string, string | undefined>) {
    const merged = { ...(sp as Record<string, string | undefined>), ...overrides };
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(merged)) if (v) qs.set(k, v);
    return `/search${qs.toString() ? `?${qs.toString()}` : ""}`;
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 md:py-8">
      <nav className="text-xs text-muted mb-3"><Link href="/" className="hover:text-primary">Home</Link><span className="mx-1">/</span><span className="text-charcoal">Search</span></nav>

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">{q ? `Results for "${q}"` : "All products"}</h1>
        <p className="text-sm text-muted mt-1">{result.total} product{result.total === 1 ? "" : "s"} found</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <form action="/search" method="get" className="flex flex-wrap items-center gap-2">
          <input name="q" defaultValue={q} placeholder="Search products" className="h-9 rounded border border-border px-3 text-sm w-64" aria-label="Search" />
          {inStockOnly && <input type="hidden" name="inStock" value="1" />}
          <select name="sort" defaultValue={sort} className="h-9 rounded border border-border bg-white px-2 text-sm">
            {SORT_OPTIONS.map((o) => (<option key={o.key} value={o.key}>{o.label}</option>))}
          </select>
          <button type="submit" className="h-9 px-4 rounded bg-primary text-white text-sm font-medium hover:bg-primary-hover">Apply</button>
        </form>
        {inStockOnly && <span className="rounded-full bg-surface px-2 py-0.5 text-xs">In stock only · <Link href={buildHref({ inStock: undefined })} className="text-primary">clear</Link></span>}
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
  );
}