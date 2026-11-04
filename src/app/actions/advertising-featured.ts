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

export async function bookFeaturedPlacement(formData: FormData) {
  try {
    const v = await getVendor();
    const productId = String(formData.get("productId") || "");
    const placementSlug = String(formData.get("placementSlug") || "homepage-featured");
    const days = Number(formData.get("days")) || 7;

    if (!productId) return { error: "Select a product" };

    const placement = await prisma.sponsoredPlacement.findUnique({ where: { slug: placementSlug } });
    if (!placement) return { error: "Placement not found" };

    const feeKobo = Number(placement.fixedRateKobo);
    if (feeKobo <= 0) return { error: "This placement is not configured for fixed fees." };

    const wallet = await prisma.advertisingWallet.findUnique({ where: { vendorId: v.id } });
    if (!wallet || wallet.availableKobo < BigInt(feeKobo)) {
      return { error: "Insufficient advertising wallet balance. Please fund your wallet." };
    }

    await prisma.$transaction(async (tx) => {
      const updated = await tx.advertisingWallet.update({
        where: { id: wallet.id },
        data: { availableKobo: { decrement: BigInt(feeKobo) }, lifetimeSpentKobo: { increment: BigInt(feeKobo) } }
      });

      await tx.advertisingWalletTransaction.create({
        data: {
          walletId: wallet.id,
          type: "FIXED_FEE_CHARGE",
          amountKobo: BigInt(-feeKobo),
          balanceAfterKobo: updated.availableKobo,
          reference: `FEAT-${Date.now()}`,
          metadata: { productId, placementSlug }
        }
      });

      await tx.featuredPlacement.create({
        data: {
          vendorId: v.id,
          productId,
          placementId: placement.id,
          startAt: new Date(),
          endAt: new Date(Date.now() + days * 86400000),
          feeKobo: BigInt(feeKobo),
          status: "PENDING"
        }
      });
    });

    revalidatePath("/vendor/advertising/campaigns");
    return { ok: true };
  } catch (e: any) {
    console.error(e);
    return { error: e.message || "Failed to book featured placement" };
  }
}

export async function createBannerCampaign(formData: FormData) {
  try {
    const v = await getVendor();
    const title = String(formData.get("title") || "Sponsored Banner");
    const imageUrl = String(formData.get("imageUrl") || "");
    const ctaUrl = String(formData.get("ctaUrl") || "/");
    const budgetNaira = Number(formData.get("budgetNaira")) || 0;

    if (!imageUrl) return { error: "Image URL is required" };
    if (budgetNaira < 5000) return { error: "Minimum banner budget is ₦5,000" };

    const budgetKobo = Math.round(budgetNaira * 100);
    const wallet = await prisma.advertisingWallet.findUnique({ where: { vendorId: v.id } });
    if (!wallet || wallet.availableKobo < BigInt(budgetKobo)) {
      return { error: "Insufficient wallet balance for this budget." };
    }

    const placement = await prisma.sponsoredPlacement.findUnique({ where: { slug: "banner-homepage" } });
    if (!placement) return { error: "Banner placement not configured in DB." };

    const dummyProduct = await prisma.product.findFirst({ where: { vendorId: v.id } });
    if (!dummyProduct) return { error: "You must have at least one product to run a banner ad." };

    await prisma.sponsoredCampaign.create({
      data: {
        productId: dummyProduct.id,
        vendorId: v.id,
        placementId: placement.id,
        campaignType: "BANNER",
        status: "PENDING",
        budgetKobo,
        costPerClickKobo: 0,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 86400000),
        isActive: false,
        targeting: { title, imageUrl, ctaUrl }
      }
    });

    revalidatePath("/vendor/advertising/campaigns");
    return { ok: true };
  } catch (e: any) {
    return { error: e.message || "Failed to create banner" };
  }
}