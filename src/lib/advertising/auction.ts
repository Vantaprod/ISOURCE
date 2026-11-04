/**
 * ISOURCE ADVERTISING AUCTION — Phase 6
 *
 * BILLING MODEL: First-price, pay-your-bid.
 * When a sponsored campaign wins a slot and a valid click occurs,
 * the seller is charged exactly their configured `costPerClickKobo`.
 * Documented publicly in /vendor/advertising/create.
 *
 * RANKING MODEL: score = maxBidKobo × relevanceMultiplier
 * Higher score wins the slot. Relevance factors:
 *   - Category match        → +0.4
 *   - Keyword match         → +0.3 per keyword (cap 0.6)
 *   - Seller quality signal → +0.1 if vendor approved
 *   - Listing completeness  → +0.1 if product has ≥3 images + description
 *   - Priority boost        → + priority × 0.001 (admin-only tie-break)
 *
 * Weights are configurable constants below. Change them here, not in UI.
 */

export type AuctionCandidate = {
  campaignId: string;
  productId: string;
  vendorId: string | null;
  maxBidKobo: number;
  priority: number;
  // relevance signals
  productCategoryIds: string[];
  productKeywords: string[];
  productHasImages: boolean;
  productHasDescription: boolean;
  vendorApproved: boolean;
};

export type AuctionContext = {
  categoryId?: string | null;
  keywords?: string[];
};

export type AuctionResult = {
  campaignId: string;
  productId: string;
  score: number;
  maxBidKobo: number;
  relevance: number;
};

const WEIGHTS = {
  categoryMatch: 0.4,
  keywordMatch: 0.3,
  keywordCap: 0.6,
  vendorApproved: 0.1,
  listingComplete: 0.1,
  priorityScale: 0.001,
} as const;

export function computeRelevance(c: AuctionCandidate, ctx: AuctionContext): number {
  let r = 0.0;

  if (ctx.categoryId && c.productCategoryIds.includes(ctx.categoryId)) {
    r += WEIGHTS.categoryMatch;
  }

  if (ctx.keywords && ctx.keywords.length > 0) {
    const haystack = c.productKeywords.join(" ").toLowerCase();
    let kwScore = 0;
    for (const kw of ctx.keywords) {
      if (!kw) continue;
      if (haystack.includes(kw.toLowerCase())) kwScore += WEIGHTS.keywordMatch;
    }
    r += Math.min(kwScore, WEIGHTS.keywordCap);
  }

  if (c.vendorApproved) r += WEIGHTS.vendorApproved;
  if (c.productHasImages && c.productHasDescription) r += WEIGHTS.listingComplete;

  return Math.min(r, 1.0);
}

export function scoreCandidate(c: AuctionCandidate, ctx: AuctionContext): AuctionResult {
  const relevance = computeRelevance(c, ctx);
  // Base = bid. Multiplier floor is 0.5 so a very-high bid can still win even with no relevance,
  // but a highly relevant low bidder can beat it. Priority is a small admin-only tiebreak.
  const multiplier = 0.5 + relevance;
  const score = c.maxBidKobo * multiplier + c.priority * WEIGHTS.priorityScale;

  return {
    campaignId: c.campaignId,
    productId: c.productId,
    score,
    maxBidKobo: c.maxBidKobo,
    relevance,
  };
}

export function rankCandidates(
  candidates: AuctionCandidate[],
  ctx: AuctionContext,
  limit: number,
): AuctionResult[] {
  return candidates
    .map((c) => scoreCandidate(c, ctx))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}