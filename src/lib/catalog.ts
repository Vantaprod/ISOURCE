import { prisma } from "./prisma";
import type { CategorySlug, Product, SortKey, Vendor, ProductSpec, ProductTag } from "@/types/catalog";
import { Prisma } from "@prisma/client";

export interface ProductWithVendor extends Product { vendor: Vendor; }

const includeRelations = {
  images: { orderBy: { sortOrder: "asc" as const } },
  variants: true,
  vendor: true,
  category: true,
  reviews: { include: { user: true } },
} satisfies Prisma.ProductInclude;

type ProductWithRelations = Prisma.ProductGetPayload<{ include: typeof includeRelations }>;

function mapProduct(p: ProductWithRelations): ProductWithVendor {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    shortDescription: p.shortDescription,
    description: p.description,
    category: p.category.slug as CategorySlug,
    vendorSlug: p.vendor.slug,
    sku: p.sku,
    priceKobo: p.priceKobo,
    originalPriceKobo: p.originalPriceKobo ?? undefined,
    stock: p.stock,
    images: p.images.map((img) => img.url),
    specs: p.specs as unknown as ProductSpec[],
    variants: p.variants.map((v) => ({
      id: v.id,
      label: v.label,
      sku: v.sku,
      stock: v.stock,
      priceKobo: v.priceKobo
    })),
    tags: p.tags as ProductTag[],
    rating: p.rating,
    reviewCount: p.reviewCount,
    reviews: p.reviews.map((r) => ({
      id: r.id,
      author: r.user?.name || "Customer",
      rating: r.rating as 1 | 2 | 3 | 4 | 5,
      title: r.title,
      body: r.body,
      createdAt: r.createdAt.toISOString()
    })),
    isActive: p.isActive,
    isFeatured: p.isFeatured,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    vendor: {
      slug: p.vendor.slug,
      name: p.vendor.name,
      isIsource: p.vendor.isIsource,
      location: p.vendor.location || "",
    }
  };
}

export async function getAllProducts(): Promise<ProductWithVendor[]> {
  const products = await prisma.product.findMany({ where: { isActive: true }, include: includeRelations });
  return products.map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<ProductWithVendor | undefined> {
  const p = await prisma.product.findUnique({ where: { slug }, include: includeRelations });
  if (!p || !p.isActive) return undefined;
  return mapProduct(p);
}

export async function getProductsByCategory(category: CategorySlug): Promise<ProductWithVendor[]> {
  const products = await prisma.product.findMany({ where: { category: { slug: category }, isActive: true }, include: includeRelations });
  return products.map(mapProduct);
}

export async function getProductsByTag(tag: string): Promise<ProductWithVendor[]> {
  const products = await prisma.product.findMany({ where: { tags: { has: tag }, isActive: true }, include: includeRelations });
  return products.map(mapProduct);
}

export async function getFeatured(): Promise<ProductWithVendor[]> {
  const products = await prisma.product.findMany({ where: { isFeatured: true, isActive: true }, include: includeRelations });
  return products.map(mapProduct);
}

export async function getRelated(product: ProductWithVendor, limit = 4): Promise<ProductWithVendor[]> {
  const products = await prisma.product.findMany({
    where: { category: { slug: product.category }, isActive: true, id: { not: product.id } },
    include: includeRelations,
    take: limit,
  });
  return products.map(mapProduct);
}

export interface SearchParams {
  q?: string;
  category?: CategorySlug;
  minKobo?: number;
  maxKobo?: number;
  inStockOnly?: boolean;
  sort?: SortKey;
  page?: number;
  pageSize?: number;
}

export interface SearchResult {
  items: ProductWithVendor[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

export async function searchProducts(params: SearchParams): Promise<SearchResult> {
  const { q, category, minKobo, maxKobo, inStockOnly, sort = "relevance", page = 1, pageSize = 12 } = params;
  const where: Prisma.ProductWhereInput = { isActive: true };
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
  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { priceKobo: "asc" };
  if (sort === "price-desc") orderBy = { priceKobo: "desc" };
  if (sort === "newest") orderBy = { createdAt: "desc" };
  if (sort === "popular") orderBy = { reviewCount: "desc" };

  const total = await prisma.product.count({ where });
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), pageCount);

  const products = await prisma.product.findMany({
    where,
    include: includeRelations,
    orderBy,
    skip: (safePage - 1) * pageSize,
    take: pageSize,
  });

  return { items: products.map(mapProduct), total, page: safePage, pageSize, pageCount };
}