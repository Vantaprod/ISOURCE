"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

async function getVendor() {
  const session = await getSession();
  if (!session || session.role !== "VENDOR") throw new Error("Unauthorized");
  const v = await prisma.vendor.findUnique({ where: { userId: session.userId } });
  if (!v) throw new Error("Vendor not found");
  return v;
}

export async function listMyProductsForAdvertising() {
  const v = await getVendor();
  return prisma.product.findMany({
    where: { vendorId: v.id, approvalStatus: "APPROVED", isActive: true },
    select: {
      id: true,
      name: true,
      slug: true,
      priceKobo: true,
      images: { take: 1, select: { url: true } },
    },
    take: 100,
    orderBy: { createdAt: "desc" },
  });
}

export async function listMyCampaigns() {
  const v = await getVendor();
  return prisma.sponsoredCampaign.findMany({
    where: { vendorId: v.id },
    include: {
      product: { select: { name: true, slug: true, images: { take: 1 } } },
      placement: { select: { name: true, slug: true, pricingModel: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function createSponsoredProductCampaign(formData: FormData) {
  try {
    const v = await getVendor();
    const productId = String(formData.get("productId") || "");
    const placementSlug = String(formData.get("placementSlug") || "search-top");
    const cpcNaira = Number(formData.get("cpcNaira") || 0);
    const dailyBudgetNaira = Number(formData.get("dailyBudgetNaira") || 0);
    const totalBudgetNaira = Number(formData.get("totalBudgetNaira") || 0);
    const startDateStr = String(formData.get("startDate") || "");
    const endDateStr = String(formData.get("endDate") || "");

    if (!productId) return { error: "Select a product" };
    if (!Number.isFinite(cpcNaira) || cpcNaira < 50) return { error: "Minimum CPC is ₦50" };
    if (!Number.isFinite(dailyBudgetNaira) || dailyBudgetNaira < 500) return { error: "Minimum daily budget is ₦500" };
    if (!Number.isFinite(totalBudgetNaira) || totalBudgetNaira < 1000) return { error: "Minimum total budget is ₦1,000" };
    if (totalBudgetNaira < dailyBudgetNaira) return { error: "Total budget must be at least daily budget" };

    const product = await prisma.product.findFirst({
      where: { id: productId, vendorId: v.id, approvalStatus: "APPROVED", isActive: true },
      select: { id: true },
    });
    if (!product) return { error: "Product not found or not eligible" };

    const placement = await prisma.sponsoredPlacement.findUnique({ where: { slug: placementSlug } });
    if (!placement) return { error: "Placement not found" };
    if (!placement.isActive) return { error: "Placement is not active" };

    const cpcKobo = Math.round(cpcNaira * 100);
    const dailyBudgetKobo = Math.round(dailyBudgetNaira * 100);
    const totalBudgetKobo = Math.round(totalBudgetNaira * 100);

    if (cpcKobo < placement.minBidKobo || cpcKobo > placement.maxBidKobo) {
      return { error: `CPC must be ₦${(placement.minBidKobo / 100).toFixed(0)}–₦${(placement.maxBidKobo / 100).toFixed(0)} for this placement` };
    }

    const wallet = await prisma.advertisingWallet.findUnique({ where: { vendorId: v.id } });
    if (!wallet) return { error: "Advertising wallet missing — contact support" };
    if (wallet.availableKobo < BigInt(dailyBudgetKobo)) {
      return { error: "Please fund your advertising wallet — available balance is below daily budget" };
    }

    const startDate = startDateStr ? new Date(startDateStr) : new Date();
    const endDate = endDateStr ? new Date(endDateStr) : new Date(Date.now() + 30 * 86400000);
    if (endDate <= startDate) return { error: "End date must be after start date" };

    const status = placement.requiresApproval ? "PENDING" : "ACTIVE";
    const isActive = status === "ACTIVE";

    const campaign = await prisma.sponsoredCampaign.create({
      data: {
        productId,
        vendorId: v.id,
        placementId: placement.id,
        campaignType: "SPONSORED_PRODUCT",
        status,
        budgetKobo: totalBudgetKobo,
        dailyBudgetKobo,
        costPerClickKobo: cpcKobo,
        startDate,
        endDate,
        isActive,
        priority: 0,
      },
    });

    revalidatePath("/vendor/advertising");
    revalidatePath("/vendor/advertising/campaigns");
    return { ok: true as const, campaignId: campaign.id };
  } catch (e: any) {
    console.error("[createSponsoredProductCampaign]", e);
    return { error: e.message || "Failed to create campaign" };
  }
}

export async function pauseCampaign(id: string) {
  const v = await getVendor();
  await prisma.sponsoredCampaign.updateMany({
    where: { id, vendorId: v.id },
    data: { isActive: false, status: "PAUSED" },
  });
  revalidatePath("/vendor/advertising/campaigns");
  revalidatePath("/vendor/advertising");
}

export async function resumeCampaign(id: string) {
  const v = await getVendor();
  await prisma.sponsoredCampaign.updateMany({
    where: { id, vendorId: v.id },
    data: { isActive: true, status: "ACTIVE" },
  });
  revalidatePath("/vendor/advertising/campaigns");
  revalidatePath("/vendor/advertising");
}

export async function endCampaign(id: string) {
  const v = await getVendor();
  await prisma.sponsoredCampaign.updateMany({
    where: { id, vendorId: v.id },
    data: { isActive: false, status: "ENDED", endDate: new Date() },
  });
  revalidatePath("/vendor/advertising/campaigns");
  revalidatePath("/vendor/advertising");
}

export async function getMyAdvertisingOverview() {
  const v = await getVendor();
  const campaigns = await prisma.sponsoredCampaign.findMany({
    where: { vendorId: v.id },
    select: { id: true, spendKobo: true, impressions: true, clicks: true, status: true },
  });

  const totalSpend = campaigns.reduce((s, c) => s + c.spendKobo, 0);
  const totalImpressions = campaigns.reduce((s, c) => s + c.impressions, 0);
  const totalClicks = campaigns.reduce((s, c) => s + c.clicks, 0);
  const activeCount = campaigns.filter((c) => c.status === "ACTIVE").length;
  const pendingCount = campaigns.filter((c) => c.status === "PENDING").length;
  const avgCpc = totalClicks > 0 ? Math.round(totalSpend / totalClicks) : 0;
  const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

  const wallet = await prisma.advertisingWallet.findUnique({ where: { vendorId: v.id } });

  return {
    totalSpendKobo: totalSpend,
    totalImpressions,
    totalClicks,
    avgCpcKobo: avgCpc,
    ctr: Number(ctr.toFixed(2)),
    activeCampaigns: activeCount,
    pendingCampaigns: pendingCount,
    walletAvailableKobo: wallet?.availableKobo.toString() || "0",
  };
}