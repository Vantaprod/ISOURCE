"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");
  return session;
}

export async function getAdvertisingOverview() {
  await requireAdmin();

  const [wallets, campaigns, events] = await Promise.all([
    prisma.advertisingWallet.aggregate({
      _sum: { lifetimeSpentKobo: true, availableKobo: true },
    }),
    prisma.sponsoredCampaign.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
    prisma.sponsoredEvent.groupBy({
      by: ["eventType"],
      _count: { id: true },
      where: { validated: true },
    }),
  ]);

  const activeCamps = campaigns.find((c) => c.status === "ACTIVE")?._count.id || 0;
  const pendingCamps = campaigns.find((c) => c.status === "PENDING")?._count.id || 0;
  const impressions = events.find((e) => e.eventType === "IMPRESSION")?._count.id || 0;
  const clicks = events.find((e) => e.eventType === "CLICK")?._count.id || 0;

  return {
    totalSpentKobo: Number(wallets._sum.lifetimeSpentKobo || 0),
    activeCampaigns: activeCamps,
    pendingCampaigns: pendingCamps,
    totalImpressions: impressions,
    totalClicks: clicks,
    ctr: impressions > 0 ? Number(((clicks / impressions) * 100).toFixed(2)) : 0,
  };
}

export async function getAllCampaigns() {
  await requireAdmin();
  return prisma.sponsoredCampaign.findMany({
    include: {
      product: { select: { name: true, images: { take: 1 } } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function approveCampaign(id: string) {
  const session = await requireAdmin();
  await prisma.sponsoredCampaign.update({
    where: { id },
    data: { status: "ACTIVE", isActive: true, approvedById: session.userId, approvedAt: new Date() },
  });
  await prisma.sponsoredApproval.create({
    data: { campaignId: id, action: "APPROVED", actorId: session.userId },
  });
  await logAudit("SPONSORED_APPROVED", "SponsoredCampaign", id, {});
  revalidatePath("/admin/advertising");
  revalidatePath("/admin/advertising/campaigns");
}

export async function rejectCampaign(id: string, note: string) {
  const session = await requireAdmin();
  await prisma.sponsoredCampaign.update({
    where: { id },
    data: { status: "REJECTED", isActive: false, moderationNote: note },
  });
  await prisma.sponsoredApproval.create({
    data: { campaignId: id, action: "REJECTED", actorId: session.userId, note },
  });
  await logAudit("SPONSORED_REJECTED", "SponsoredCampaign", id, { note });
  revalidatePath("/admin/advertising");
  revalidatePath("/admin/advertising/campaigns");
}

export async function getAllPlacements() {
  await requireAdmin();
  return prisma.sponsoredPlacement.findMany({
    orderBy: { slug: "asc" },
  });
}

export async function updatePlacement(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  const minBid = Number(formData.get("minBidKobo"));
  const maxBid = Number(formData.get("maxBidKobo"));
  const slots = Number(formData.get("maxSlots"));
  const isActive = formData.get("isActive") === "on";

  await prisma.sponsoredPlacement.update({
    where: { id },
    data: { minBidKobo: minBid, maxBidKobo: maxBid, maxSlots: slots, isActive },
  });
  revalidatePath("/admin/advertising/placements");
}

export async function getPendingFeatured() {
  await requireAdmin();
  return prisma.featuredPlacement.findMany({
    where: { status: "PENDING" },
    include: { placement: true },
    orderBy: { createdAt: "desc" }
  });
}

export async function approveFeatured(id: string) {
  const session = await requireAdmin();
  await prisma.featuredPlacement.update({
    where: { id },
    data: { status: "ACTIVE", approvedById: session.userId, approvedAt: new Date() },
  });
  await logAudit("FEATURED_APPROVED", "FeaturedPlacement", id, {});
  revalidatePath("/admin/advertising/featured");
}

export async function rejectFeatured(id: string) {
  const session = await requireAdmin();
  const fp = await prisma.featuredPlacement.update({
    where: { id },
    data: { status: "REJECTED", approvedById: session.userId, approvedAt: new Date() },
  });

  // Refund the fee
  const wallet = await prisma.advertisingWallet.findUnique({ where: { vendorId: fp.vendorId } });
  if (wallet) {
    await prisma.$transaction(async (tx) => {
      const updated = await tx.advertisingWallet.update({
        where: { id: wallet.id },
        data: { availableKobo: { increment: fp.feeKobo }, lifetimeSpentKobo: { decrement: fp.feeKobo } }
      });
      await tx.advertisingWalletTransaction.create({
        data: {
          walletId: wallet.id,
          type: "REFUND",
          amountKobo: fp.feeKobo,
          balanceAfterKobo: updated.availableKobo,
          reference: `REF-${Date.now()}`,
          metadata: { reason: "Featured placement rejected", placementId: fp.id }
        }
      });
    });
  }

  await logAudit("FEATURED_REJECTED", "FeaturedPlacement", id, {});
  revalidatePath("/admin/advertising/featured");
}