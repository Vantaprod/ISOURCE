import { prisma } from "@/lib/prisma";

export const DEFAULT_WEIGHTS = {
  relevanceWeight: 30,
  salesWeight: 25,
  conversionWeight: 10,
  ratingWeight: 15,
  stockWeight: 10,
  deliveryWeight: 5,
  completenessWeight: 5,
};

export async function getRankingConfig() {
  const config = await prisma.rankingConfig.findUnique({ where: { id: "singleton" } });
  if (config) return config;
  return prisma.rankingConfig.create({ data: { id: "singleton", ...DEFAULT_WEIGHTS } });
}

export interface ScoreInputs {
  relevance: number;      // 0-1 (1 = perfect text match, 0.5 = partial, 0 = no match)
  sales: number;          // 0-1 (normalized across result set)
  conversion: number;     // 0-1 (approx by reviewCount / 100)
  rating: number;         // 0-1 (rating / 5)
  stock: number;          // 0 or 1
  delivery: number;       // 0-1 (default 1)
  completeness: number;   // 0-1
}

export function computeRankScore(inputs: ScoreInputs, weights: typeof DEFAULT_WEIGHTS): number {
  const total =
    inputs.relevance * weights.relevanceWeight +
    inputs.sales * weights.salesWeight +
    inputs.conversion * weights.conversionWeight +
    inputs.rating * weights.ratingWeight +
    inputs.stock * weights.stockWeight +
    inputs.delivery * weights.deliveryWeight +
    inputs.completeness * weights.completenessWeight;
  return Math.round(total * 100) / 100;
}

export function computeRelevance(productName: string, productDescription: string, query?: string): number {
  if (!query || !query.trim()) return 1;
  const q = query.toLowerCase().trim();
  const name = productName.toLowerCase();
  const desc = (productDescription || "").toLowerCase();
  if (name === q) return 1;
  if (name.startsWith(q)) return 0.95;
  if (name.includes(q)) return 0.85;
  if (desc.includes(q)) return 0.6;
  // word-level match
  const words = q.split(/\s+/);
  const matches = words.filter(w => name.includes(w) || desc.includes(w)).length;
  return matches / words.length * 0.5;
}

export function computeCompleteness(product: { images: { length: number } | unknown[]; specs: unknown; description: string }): number {
  const imageCount = Array.isArray(product.images) ? product.images.length : 0;
  const specCount = Array.isArray(product.specs) ? product.specs.length : 0;
  const descLen = product.description?.length || 0;
  return (
    (imageCount >= 1 ? 0.33 : 0) +
    (specCount >= 1 ? 0.33 : 0) +
    (descLen >= 50 ? 0.34 : 0)
  );
}