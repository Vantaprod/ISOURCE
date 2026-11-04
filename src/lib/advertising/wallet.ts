import { prisma } from "@/lib/prisma";

type ChargeResult =
  | { ok: true; eventId: string; chargedKobo: number }
  | { ok: false; reason: string };

class RollbackError extends Error {
  constructor(public reason: string) {
    super(reason);
  }
}

export async function chargeClick(args: {
  campaignId: string;
  sessionId: string;
  ipHash: string;
  uaHash: string;
  idempotencyKey: string;
  productId: string | null;
}): Promise<ChargeResult> {
  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Create event FIRST — unique constraint is the dedup gate.
      //    If duplicate, Prisma throws P2002 and everything rolls back.
      const event = await tx.sponsoredEvent.create({
        data: {
          campaignId: args.campaignId,
          productId: args.productId,
          eventType: "CLICK",
          sessionId: args.sessionId,
          ipHash: args.ipHash,
          uaHash: args.uaHash,
          idempotencyKey: args.idempotencyKey,
          validated: true,
          billed: false,
          billableKobo: BigInt(0),
        },
      });

      // 2. Fresh read of campaign
      const c = await tx.sponsoredCampaign.findUnique({ where: { id: args.campaignId } });
      if (!c) throw new RollbackError("campaign_not_found");
      if (!c.isActive) throw new RollbackError("campaign_inactive");
      if (c.status !== "ACTIVE") throw new RollbackError(`campaign_status_${c.status}`);

      const now = new Date();
      if (now < c.startDate) throw new RollbackError("not_started");
      if (now > c.endDate) throw new RollbackError("ended");
      if (c.budgetKobo > 0 && c.spendKobo >= c.budgetKobo) throw new RollbackError("budget_exhausted");
      if (!c.vendorId) throw new RollbackError("no_vendor");

      const cpc = c.costPerClickKobo;
      if (cpc <= 0) throw new RollbackError("invalid_cpc");

      // 3. Atomic wallet deduction — count=0 means race lost
      const wallet = await tx.advertisingWallet.findUnique({ where: { vendorId: c.vendorId } });
      if (!wallet) throw new RollbackError("no_wallet");
      if (wallet.availableKobo < BigInt(cpc)) throw new RollbackError("insufficient_funds");

      const deduct = await tx.advertisingWallet.updateMany({
        where: { id: wallet.id, availableKobo: { gte: BigInt(cpc) } },
        data: {
          availableKobo: { decrement: BigInt(cpc) },
          lifetimeSpentKobo: { increment: BigInt(cpc) },
        },
      });
      if (deduct.count === 0) throw new RollbackError("insufficient_funds_race");

      // 4. Atomic campaign spend increment — guarded on remaining budget
      const campaignWhere: any = { id: c.id };
      if (c.budgetKobo > 0) {
        campaignWhere.spendKobo = { lte: c.budgetKobo - cpc };
      }
      const campaignUpdate = await tx.sponsoredCampaign.updateMany({
        where: campaignWhere,
        data: { spendKobo: { increment: cpc }, clicks: { increment: 1 } },
      });
      if (campaignUpdate.count === 0) throw new RollbackError("budget_exhausted_race");

      // 5. Mark event as billed
      await tx.sponsoredEvent.update({
        where: { id: event.id },
        data: { billed: true, billableKobo: BigInt(cpc) },
      });

      // 6. Append immutable wallet transaction
      await tx.advertisingWalletTransaction.create({
        data: {
          walletId: wallet.id,
          type: "CLICK_CHARGE",
          amountKobo: BigInt(-cpc),
          balanceAfterKobo: wallet.availableKobo - BigInt(cpc),
          reference: args.idempotencyKey,
          campaignId: c.id,
          metadata: { eventId: event.id },
        },
      });

      return { ok: true as const, eventId: event.id, chargedKobo: cpc };
    });
  } catch (e: any) {
    if (e instanceof RollbackError) return { ok: false, reason: e.reason };
    if (e?.code === "P2002") return { ok: false, reason: "duplicate" };
    console.error("[chargeClick] unexpected:", e);
    return { ok: false, reason: "internal_error" };
  }
}

export async function recordImpression(args: {
  campaignId: string;
  sessionId: string;
  ipHash: string;
  uaHash: string;
  idempotencyKey: string;
  productId: string | null;
}): Promise<{ ok: boolean; reason?: string }> {
  try {
    await prisma.sponsoredEvent.create({
      data: {
        campaignId: args.campaignId,
        productId: args.productId,
        eventType: "IMPRESSION",
        sessionId: args.sessionId,
        ipHash: args.ipHash,
        uaHash: args.uaHash,
        idempotencyKey: args.idempotencyKey,
        validated: true,
        billed: false,
        billableKobo: BigInt(0),
      },
    });
    await prisma.sponsoredCampaign
      .update({ where: { id: args.campaignId }, data: { impressions: { increment: 1 } } })
      .catch(() => {});
    return { ok: true };
  } catch (e: any) {
    if (e?.code === "P2002") return { ok: false, reason: "duplicate" };
    return { ok: false, reason: "internal_error" };
  }
}

export async function recordConversion(args: {
  campaignId: string;
  sessionId: string;
  ipHash: string;
  uaHash: string;
  idempotencyKey: string;
  productId: string | null;
  revenueKobo: number;
}): Promise<{ ok: boolean; reason?: string }> {
  try {
    await prisma.sponsoredEvent.create({
      data: {
        campaignId: args.campaignId,
        productId: args.productId,
        eventType: "CONVERSION",
        sessionId: args.sessionId,
        ipHash: args.ipHash,
        uaHash: args.uaHash,
        idempotencyKey: args.idempotencyKey,
        validated: true,
        billed: false,
        billableKobo: BigInt(args.revenueKobo),
      },
    });
    return { ok: true };
  } catch (e: any) {
    if (e?.code === "P2002") return { ok: false, reason: "duplicate" };
    return { ok: false, reason: "internal_error" };
  }
}