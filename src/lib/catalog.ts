import { PRODUCTS } from "@/data/products";
import { getVendor } from "@/data/vendors";
import type { CategorySlug, Product, SortKey, Vendor } from "@/types/catalog";
export interface ProductWithVendor extends Product { vendor: Vendor; }
function attachVendor(p: Product): ProductWithVendor { const v = getVendor(p.vendorSlug); if (!v) throw new Error("Vendor missing"); return { ...p, vendor: v }; }
export function getAllProducts(): ProductWithVendor[] { return PRODUCTS.filter((p) => p.isActive).map(attachVendor); }
export function getProductBySlug(slug: string): ProductWithVendor | undefined { const p = PRODUCTS.find((x) => x.slug === slug && x.isActive); return p ? attachVendor(p) : undefined; }
export function getProductsByCategory(category: CategorySlug): ProductWithVendor[] { return getAllProducts().filter((p) => p.category === category); }
export function getProductsByTag(tag: Product["tags"][number]): ProductWithVendor[] { return getAllProducts().filter((p) => p.tags.includes(tag)); }
export function getFeatured(): ProductWithVendor[] { return getAllProducts().filter((p) => p.isFeatured); }
export function getRelated(product: ProductWithVendor, limit = 4): ProductWithVendor[] { return getAllProducts().filter((p) => p.category === product.category && p.id !== product.id).slice(0, limit); }
export interface SearchParams { q?: string; category?: CategorySlug; minKobo?: number; maxKobo?: number; inStockOnly?: boolean; sort?: SortKey; page?: number; pageSize?: number; }
export interface SearchResult { items: ProductWithVendor[]; total: number; page: number; pageSize: number; pageCount: number; }
export function searchProducts(params: SearchParams): SearchResult {
  const { q, category, minKobo, maxKobo, inStockOnly, sort = "relevance", page = 1, pageSize = 12 } = params;
  const term = q?.trim().toLowerCase();
  const list = getAllProducts().filter((p) => {
    if (category && p.category !== category) return false;
    if (inStockOnly && p.stock <= 0) return false;
    if (typeof minKobo === "number" && p.priceKobo < minKobo) return false;
    if (typeof maxKobo === "number" && p.priceKobo > maxKobo) return false;
    if (term) { const haystack = `${p.name} ${p.shortDescription}`.toLowerCase(); if (!haystack.includes(term)) return false; }
    return true;
  });
  switch (sort) { case "price-asc": list.sort((a, b) => a.priceKobo - b.priceKobo); break; case "price-desc": list.sort((a, b) => b.priceKobo - a.priceKobo); break; case "newest": list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)); break; case "popular": list.sort((a, b) => b.reviewCount - a.reviewCount); break; }
  const total = list.length; const pageCount = Math.max(1, Math.ceil(total / pageSize)); const safePage = Math.min(Math.max(1, page), pageCount);
  return { items: list.slice((safePage - 1) * pageSize, safePage * pageSize), total, page: safePage, pageSize, pageCount };
}