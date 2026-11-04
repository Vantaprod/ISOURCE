import { prisma } from "@/lib/prisma";
import { AuctionCandidate, AuctionContext, rankCandidates, AuctionResult } from "./auction";

const DEFAULT_SLOT_COUNT = 2;

export type SponsoredHit = {
  campaignId: string;
  productId: string;
  productSlug: string;
  productName: string;
  priceKobo: number;
  imageUrl: string | null;
  vendorName: string | null;
  score: number;
};

/**
 * Pulls every eligible sponsored campaign for a placement + context, ranks via auction,
 * returns the top N. Never throws — returns empty array on any error.
 */
export async function selectSponsoredForPlacement(args: {
  placementSlug: string;
  categoryId?: string | null;
  keywords?: string[];
  limit?: number;
}): Promise<SponsoredHit[]> {
  const limit = Math.min(args.limit ?? DEFAULT_SLOT_COUNT, 8);
  const now = new Date();

  try {
    const placement = await prisma.sponsoredPlacement.findUnique({
      where: { slug: args.placementSlug },
      select: { id: true, maxSlots: true },
    });
    if (!placement) return [];

    const effectiveLimit = Math.min(limit, placement.maxSlots);

    const rows = await prisma.sponsoredCampaign.findMany({
      where: {
        placementId: placement.id,
        isActive: true,
        status: "ACTIVE",
        startDate: { lte: now },
        endDate: { gte: now },
        // budget remaining OR no budget cap
        OR: [{ budgetKobo: 0 }, { spendKobo: { lt: 999999999 } }],
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            priceKobo: true,
            isActive: true,
            approvalStatus: true,
            description: true,
            categoryId: true,
            images: { take: 1, select: { url: true } },
            vendor: { select: { name: true, status: true } },
          },
        },
      },
      take: 200,
    });

    const candidates: AuctionCandidate[] = [];
    for (const r of rows) {
      if (!r.product) continue;
      if (!r.product.isActive) continue;
      if (r.product.approvalStatus !== "APPROVED") continue;
      // budget check
      if (r.budgetKobo > 0 && r.spendKobo >= r.budgetKobo) continue;

      candidates.push({
        campaignId: r.id,
        productId: r.productId,
        vendorId: r.vendorId,
        maxBidKobo: r.costPerClickKobo,
        priority: r.priority,
        productCategoryIds: r.product.categoryId ? [r.product.categoryId] : [],
        productKeywords: [
          r.product.name || "",
          r.product.description || "",
        ].join(" ").split(/\s+/).filter(Boolean),
        productHasImages: (r.product.images?.length ?? 0) >= 1,
        productHasDescription: !!r.product.description && r.product.description.length > 40,
        vendorApproved: r.product.vendor?.status === "APPROVED",
      });
    }

    const ctx: AuctionContext = {
      categoryId: args.categoryId ?? null,
      keywords: args.keywords ?? [],
    };
    const ranked: AuctionResult[] = rankCandidates(candidates, ctx, effectiveLimit);

    // Map back to product details
    const byCampaign = new Map(rows.map((r) => [r.id, r]));
    const hits: SponsoredHit[] = [];
    for (const rk of ranked) {
      const row = byCampaign.get(rk.campaignId);
      if (!row || !row.product) continue;
      hits.push({
        campaignId: rk.campaignId,
        productId: row.product.id,
        productSlug: row.product.slug,
        productName: row.product.name,
        priceKobo: row.product.priceKobo,
        imageUrl: row.product.images?.[0]?.url ?? null,
        vendorName: row.product.vendor?.name ?? null,
        score: rk.score,
      });
    }
    return hits;
  } catch (e) {
    console.error("[selectSponsoredForPlacement]", e);
    return [];
  }
}