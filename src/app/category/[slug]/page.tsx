import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES, getCategory } from "@/data/categories";
import { searchProducts } from "@/lib/catalog";
import type { CategorySlug, SortKey } from "@/types/catalog";
import { ProductGrid } from "@/components/product/ProductGrid";
import { cn } from "@/lib/cn";
const SORT_OPTIONS: { key: SortKey; label: string }[] = [{ key: "relevance", label: "Relevance" }, { key: "price-asc", label: "Price: low to high" }, { key: "price-desc", label: "Price: high to low" }, { key: "newest", label: "Newest" }, { key: "popular", label: "Popular" }];
interface Props { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>>; }
export async function generateStaticParams() { return CATEGORIES.map((c) => ({ slug: c.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { slug } = await params; const cat = getCategory(slug); if (!cat) return {}; return { title: cat.name, description: cat.description }; }
function firstString(v: string | string[] | undefined): string | undefined { return Array.isArray(v) ? v[0] : v; }
export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params; const sp = await searchParams; const cat = getCategory(slug); if (!cat) notFound();
  const q = firstString(sp.q); const sort = (firstString(sp.sort) as SortKey | undefined) ?? "relevance"; const inStockOnly = firstString(sp.inStock) === "1"; const page = Number(firstString(sp.page) ?? "1") || 1; const minNaira = Number(firstString(sp.min) ?? "0") || 0; const maxNaira = Number(firstString(sp.max) ?? "0") || 0;
  const result = searchProducts({ q, category: cat.slug as CategorySlug, sort, page, pageSize: 12, inStockOnly, minKobo: minNaira > 0 ? minNaira * 100 : undefined, maxKobo: maxNaira > 0 ? maxNaira * 100 : undefined });
  function buildHref(overrides: Record<string, string | undefined>) { const merged = { ...(sp as Record<string, string | undefined>), ...overrides }; const qs = new URLSearchParams(); for (const [k, v] of Object.entries(merged)) if (v) qs.set(k, v); const s = qs.toString(); return `/category/${slug}${s ? `?${s}` : ""}`; }
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 md:py-8">
      <nav className="text-xs text-muted mb-3"><Link href="/" className="hover:text-primary">Home</Link><span className="mx-1">/</span><span className="text-charcoal">{cat.name}</span></nav>
      <div className="mb-6"><h1 className="text-2xl md:text-3xl font-bold">{cat.name}</h1><p className="text-sm text-muted mt-1">{cat.description}</p></div>
      <div className="grid md:grid-cols-[240px_1fr] gap-6">
        <aside className="hidden md:block">
          <form action={`/category/${slug}`} method="get" className="rounded-lg border border-border p-4 space-y-5 sticky top-24">
            {q && <input type="hidden" name="q" value={q} />}
            <div><h3 className="text-sm font-semibold mb-2">Sort by</h3><select name="sort" defaultValue={sort} className="w-full h-10 rounded border border-border bg-white px-2 text-sm">{SORT_OPTIONS.map((o) => (<option key={o.key} value={o.key}>{o.label}</option>))}</select></div>
            <div><h3 className="text-sm font-semibold mb-2">Price (₦)</h3><div className="flex gap-2"><input name="min" type="number" min={0} defaultValue={minNaira || ""} placeholder="Min" className="w-full h-10 rounded border border-border px-2 text-sm" /><input name="max" type="number" min={0} defaultValue={maxNaira || ""} placeholder="Max" className="w-full h-10 rounded border border-border px-2 text-sm" /></div></div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="inStock" value="1" defaultChecked={inStockOnly} />In stock only</label>
            <button type="submit" className="w-full h-10 rounded bg-primary text-white text-sm font-medium hover:bg-primary-hover">Apply filters</button>
            <Link href={`/category/${slug}`} className="block text-center text-xs text-muted hover:text-primary">Reset</Link>
          </form>
        </aside>
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-4 text-sm"><span className="text-muted">{result.total} product{result.total === 1 ? "" : "s"}</span>{q && (<span className="rounded-full bg-surface px-2 py-0.5">Search: <b>{q}</b> · <Link href={buildHref({ q: undefined, page: undefined })} className="text-primary">clear</Link></span>)}{inStockOnly && (<span className="rounded-full bg-surface px-2 py-0.5">In stock only · <Link href={buildHref({ inStock: undefined, page: undefined })} className="text-primary">clear</Link></span>)}</div>
          <ProductGrid products={result.items} />
          {result.pageCount > 1 && (<nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">{Array.from({ length: result.pageCount }, (_, i) => i + 1).map((n) => (<Link key={n} href={buildHref({ page: String(n) })} className={cn("min-w-[36px] h-9 px-3 inline-flex items-center justify-center rounded border text-sm", n === result.page ? "bg-primary text-white border-primary" : "border-border text-charcoal hover:border-primary")}>{n}</Link>))}</nav>)}
        </div>
      </div>
    </div>
  );
}