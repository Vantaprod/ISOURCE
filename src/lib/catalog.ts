import { prisma } from "./prisma";
import type { CategorySlug, Product, SortKey, Vendor, ProductSpec, ProductTag } from "@/types/catalog";
import { Prisma } from "@prisma/client";
import { getRankingConfig, computeRankScore, computeRelevance, computeCompleteness } from "./ranking";

export interface ProductWithVendor extends Product { vendor: Vendor; isSponsored?: boolean; sponsoredCampaignId?: string; }

const includeRelations = {
  images: { orderBy: { sortOrder: "asc" as const } },
  variants: true,
  vendor: true,
  category: true,
  reviews: { include: { user: true } },
} satisfies Prisma.ProductInclude;

type ProductWithRelations = Prisma.ProductGetPayload<{ include: typeof includeRelations }>;

function mapProduct(p: ProductWithRelations, sponsored?: { campaignId: string }): ProductWithVendor {
  return {
    id: p.id, slug: p.slug, name: p.name,
    shortDescription: p.shortDescription, description: p.description,
    category: p.category.slug as CategorySlug, vendorSlug: p.vendor.slug,
    sku: p.sku, priceKobo: p.priceKobo, originalPriceKobo: p.originalPriceKobo ?? undefined,
    stock: p.stock, images: p.images.map(i => i.url),
    specs: p.specs as unknown as ProductSpec[],
    variants: p.variants.map(v => ({ id: v.id, label: v.label, sku: v.sku, stock: v.stock, priceKobo: v.priceKobo })),
    tags: p.tags as ProductTag[], rating: p.rating, reviewCount: p.reviewCount,
    reviews: p.reviews.map(r => ({ id: r.id, author: r.user?.name || "Customer", rating: r.rating as 1|2|3|4|5, title: r.title, body: r.body, createdAt: r.createdAt.toISOString() })),
    isActive: p.isActive, isFeatured: p.isFeatured,
    createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString(),
    vendor: { slug: p.vendor.slug, name: p.vendor.name, isIsource: p.vendor.isIsource, location: p.vendor.location || "" },
    isSponsored: !!sponsored, sponsoredCampaignId: sponsored?.campaignId,
  };
}

export async function getAllProducts(): Promise<ProductWithVendor[]> {
  const products = await prisma.product.findMany({ where: { isActive: true, approvalStatus: "APPROVED" }, include: includeRelations });
  return products.map(p => mapProduct(p));
}

export async function getProductBySlug(slug: string): Promise<ProductWithVendor | undefined> {
  const p = await prisma.product.findUnique({ where: { slug }, include: includeRelations });
  if (!p || !p.isActive) return undefined;
  return mapProduct(p);
}

export async function getProductsByCategory(category: CategorySlug): Promise<ProductWithVendor[]> {
  const products = await prisma.product.findMany({ where: { category: { slug: category }, isActive: true, approvalStatus: "APPROVED" }, include: includeRelations });
  return products.map(p => mapProduct(p));
}

export async function getProductsByTag(tag: string): Promise<ProductWithVendor[]> {
  const products = await prisma.product.findMany({ where: { tags: { has: tag }, isActive: true, approvalStatus: "APPROVED" }, include: includeRelations });
  return products.map(p => mapProduct(p));
}

export async function getFeatured(): Promise<ProductWithVendor[]> {
  const products = await prisma.product.findMany({ where: { isFeatured: true, isActive: true, approvalStatus: "APPROVED" }, include: includeRelations });
  return products.map(p => mapProduct(p));
}

export async function getRelated(product: ProductWithVendor, limit = 4): Promise<ProductWithVendor[]> {
  const products = await prisma.product.findMany({
    where: { category: { slug: product.category }, isActive: true, approvalStatus: "APPROVED", id: { not: product.id } },
    include: includeRelations, take: limit,
  });
  return products.map(p => mapProduct(p));
}

export interface SearchParams {
  q?: string; category?: CategorySlug; minKobo?: number; maxKobo?: number;
  inStockOnly?: boolean; sort?: SortKey; page?: number; pageSize?: number;
}

export interface SearchResult {
  items: ProductWithVendor[]; total: number; page: number; pageSize: number; pageCount: number;
}

export async function searchProducts(params: SearchParams): Promise<SearchResult> {
  const { q, category, minKobo, maxKobo, inStockOnly, sort = "relevance", page = 1, pageSize = 12 } = params;

  // If explicit sort is chosen (price, newest), skip organic ranking
  const useRanking = sort === "relevance" || sort === "popular";

  const where: Prisma.ProductWhereInput = { isActive: true, approvalStatus: "APPROVED" };
  if (category) where.category = { slug: category };
  if (inStockOnly) where.stock = { gt: 0 };
  if (typeof minKobo === "number" || typeof maxKobo === "number") {
    where.priceKobo = {};
    if (typeof minKobo === "number") where.priceKobo.gte = minKobo;
    if (typeof maxKobo === "number") where.priceKobo.lte = maxKobo;
  }
  if (q?.trim()) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { shortDescription: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  // Fetch all matching products (needed for scoring)
  let all = await prisma.product.findMany({ where, include: includeRelations });
  const total = all.length;

  // Fetch sales counts for scoring
  let salesMap = new Map<string, number>();
  if (useRanking && all.length > 0) {
    const salesData = await prisma.orderItem.groupBy({
      by: ["productId"],
      _count: true,
      where: { productId: { in: all.map(p => p.id) } },
    });
    const maxSales = Math.max(1, ...salesData.map(s => s._count));
    salesMap = new Map(salesData.map(s => [s.productId || "", s._count / maxSales]));
  }

  // Sort
  if (useRanking) {
    const weights = await getRankingConfig();
    const scored = all.map(p => {
      const relevance = computeRelevance(p.name, p.shortDescription, q);
      const sales = salesMap.get(p.id) || 0;
      const conversion = Math.min(1, p.reviewCount / 100);
      const rating = p.rating / 5;
      const stock = p.stock > 0 ? 1 : 0;
      const delivery = 1;
      const completeness = computeCompleteness({ images: p.images, specs: p.specs as unknown[], description: p.description });
      const score = computeRankScore({ relevance, sales, conversion, rating, stock, delivery, completeness }, weights);
      return { product: p, score };
    });
    scored.sort((a, b) => b.score - a.score);
    all = scored.map(s => s.product);
  } else if (sort === "price-asc") { all.sort((a, b) => a.priceKobo - b.priceKobo); }
  else if (sort === "price-desc") { all.sort((a, b) => b.priceKobo - a.priceKobo); }
  else if (sort === "newest") { all.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); }
  else if (sort === "popular") { all.sort((a, b) => b.reviewCount - a.reviewCount); }

  // Pagination
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), pageCount);
  const start = (safePage - 1) * pageSize;
  const paginated = all.slice(start, start + pageSize);

  // Fetch sponsored campaigns for this page (top 2)
  const now = new Date();
  const sponsoredRaw = await prisma.sponsoredCampaign.findMany({
    where: {
      isActive: true,
      startDate: { lte: now },
      endDate: { gte: now },
      productId: { notIn: paginated.map(p => p.id) },
    },
    include: { product: { include: includeRelations } },
    orderBy: { priority: "desc" },
    take: 2,
  });

  const sponsoredItems: ProductWithVendor[] = sponsoredRaw
    .filter(s => s.product.isActive && s.product.stock > 0 && s.product.approvalStatus === "APPROVED")
    .map(s => mapProduct(s.product, { campaignId: s.id }));

  // Merge: sponsored first, then organic (only on page 1)
  const items: ProductWithVendor[] = safePage === 1
    ? [...sponsoredItems, ...paginated.map(p => mapProduct(p))]
    : paginated.map(p => mapProduct(p));

  return { items, total, page: safePage, pageSize, pageCount };
}