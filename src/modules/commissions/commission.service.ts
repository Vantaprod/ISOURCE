import { prisma } from "@/lib/prisma";

export async function calculateCommission(categoryId: string, eligibleSalesKobo: bigint) {
  // Fetch the active rule for this category
  const rule = await prisma.categoryCommissionRule.findFirst({
    where: {
      categoryId,
      active: true,
      effectiveFrom: { lte: new Date() },
      OR: [
        { effectiveUntil: null },
        { effectiveUntil: { gt: new Date() } }
      ]
    },
    orderBy: { effectiveFrom: "desc" }
  });

  // Default to 5% (500 bps) if no rule is found for this category
  const rateBps = rule ? rule.rateBps : 500;

  // Calculate using BigInt. Adding 5000n for rounding.
  const commissionKobo = (eligibleSalesKobo * BigInt(rateBps) + 5000n) / 10000n;
  
  return {
    rateBps,
    commissionKobo,
    vendorNetKobo: eligibleSalesKobo - commissionKobo
  };
}