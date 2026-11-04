"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { paystackInit, paystackVerify } from "@/lib/advertising/paystack";
import { randomBytes } from "node:crypto";

async function getVendor() {
  const session = await getSession();
  if (!session || session.role !== "VENDOR") throw new Error("Unauthorized");
  const v = await prisma.vendor.findUnique({ where: { userId: session.userId } });
  if (!v) throw new Error("Vendor not found");
  return { vendor: v, session };
}

export async function getWalletSummary() {
  const { vendor } = await getVendor();
  const wallet = await prisma.advertisingWallet.upsert({
    where: { vendorId: vendor.id },
    update: {},
    create: { vendorId: vendor.id, availableKobo: BigInt(0), reservedKobo: BigInt(0), lifetimeSpentKobo: BigInt(0) },
  });
  return {
    availableKobo: wallet.availableKobo.toString(),
    reservedKobo: wallet.reservedKobo.toString(),
    lifetimeSpentKobo: wallet.lifetimeSpentKobo.toString(),
  };
}

export async function getWalletTransactions(limit = 50) {
  const { vendor } = await getVendor();
  const wallet = await prisma.advertisingWallet.findUnique({ where: { vendorId: vendor.id } });
  if (!wallet) return [];
  const txs = await prisma.advertisingWalletTransaction.findMany({
    where: { walletId: wallet.id },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return txs.map((t) => ({
    id: t.id,
    type: t.type,
    amountKobo: t.amountKobo.toString(),
    balanceAfterKobo: t.balanceAfterKobo.toString(),
    reference: t.reference,
    campaignId: t.campaignId,
    createdAt: t.createdAt.toISOString(),
  }));
}

export async function initializeFunding(amountNaira: number) {
  try {
    if (!Number.isFinite(amountNaira) || amountNaira < 500) {
      return { error: "Minimum funding is ₦500" };
    }
    if (amountNaira > 5_000_000) {
      return { error: "Maximum single funding is ₦5,000,000" };
    }

    const { vendor, session } = await getVendor();
    const amountKobo = Math.round(amountNaira * 100);

    const reference = `ADV-${vendor.id.slice(0, 8)}-${Date.now()}-${randomBytes(4).toString("hex")}`;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const callbackUrl = `${baseUrl}/vendor/advertising/wallet/callback`;

    const init = await paystackInit({
      email: session.email,
      amountKobo,
      reference,
      callbackUrl,
      metadata: {
        product: "advertising",
        vendorId: vendor.id,
        userId: session.userId,
      },
    });

    return { ok: true as const, authorizationUrl: init.authorization_url, reference: init.reference };
  } catch (err: any) {
    console.error("[initializeFunding]", err);
    return { error: err.message || "Failed to initialize funding" };
  }
}

export async function verifyAndCreditFunding(paystackReference: string) {
  try {
    const { vendor } = await getVendor();

    const v = await paystackVerify(paystackReference);
    if (v.status !== "success") {
      return { error: `Payment not successful (${v.status})` };
    }
    if (!v.metadata || v.metadata.product !== "advertising") {
      return { error: "Not an advertising funding payment" };
    }
    if (v.metadata.vendorId !== vendor.id) {
      return { error: "Payment does not belong to this vendor" };
    }

    const wallet = await prisma.advertisingWallet.upsert({
      where: { vendorId: vendor.id },
      update: {},
      create: { vendorId: vendor.id, availableKobo: BigInt(0), reservedKobo: BigInt(0), lifetimeSpentKobo: BigInt(0) },
    });

    try {
      await prisma.$transaction(async (tx) => {
        const existing = await tx.advertisingWalletTransaction.findUnique({
          where: { reference_type: { reference: paystackReference, type: "FUNDING" } },
        });
        if (existing) return;

        const updated = await tx.advertisingWallet.update({
          where: { id: wallet.id },
          data: { availableKobo: { increment: BigInt(v.amount) } },
        });

        await tx.advertisingWalletTransaction.create({
          data: {
            walletId: wallet.id,
            type: "FUNDING",
            amountKobo: BigInt(v.amount),
            balanceAfterKobo: updated.availableKobo,
            reference: paystackReference,
            metadata: { source: "paystack_callback", paystackAmountKobo: v.amount },
          },
        });
      });
    } catch (e: any) {
      if (e?.code === "P2002") {
        // already credited — fine
      } else {
        throw e;
      }
    }

    revalidatePath("/vendor/advertising/wallet");
    return { ok: true as const };
  } catch (err: any) {
    console.error("[verifyAndCreditFunding]", err);
    return { error: err.message || "Failed to verify payment" };
  }
}