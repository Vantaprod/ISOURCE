"use server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { paystackTransfer } from "@/modules/providers/paystack/paystack-transfer.adapter";
import { postJournal } from "@/modules/ledger/ledger.service";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized: Admin access required");
  return session;
}

// ─────────────────────────────────────────────────────────────
// OVERVIEW STATS
// ─────────────────────────────────────────────────────────────
export async function getAdminFinanceOverview() {
  await requireAdmin();

  const [payments, settlements, orderItems, refunds] = await Promise.all([
    prisma.financePayment.findMany({ where: { status: "SUCCESSFUL" } }),
    prisma.vendorSettlement.findMany(),
    prisma.financeOrderItem.findMany(),
    prisma.financeRefund.findMany(),
  ]);

  let totalVolumeKobo = 0n;
  payments.forEach(p => { totalVolumeKobo += p.amountPaidKobo; });

  let totalCommissionKobo = 0n;
  orderItems.forEach(i => { totalCommissionKobo += i.commissionKobo; });

  let pendingLiabilityKobo = 0n;
  let availableLiabilityKobo = 0n;
  let totalPaidKobo = 0n;

  const vendorOrders = await prisma.financeVendorOrder.findMany();
  vendorOrders.forEach(o => {
    if (["PENDING", "CONFIRMED", "PROCESSING", "DISPATCHED"].includes(o.status)) {
      pendingLiabilityKobo += o.vendorNetKobo;
    } else if (["DELIVERED", "COMPLETED"].includes(o.status)) {
      availableLiabilityKobo += o.vendorNetKobo;
    }
  });

  settlements.forEach(s => {
    if (s.status === "SUCCESSFUL") {
      totalPaidKobo += s.amountKobo;
      availableLiabilityKobo -= s.amountKobo;
    }
  });

  let totalRefundsKobo = 0n;
  refunds.forEach(r => {
    if (r.status === "SUCCESSFUL") totalRefundsKobo += r.amountKobo;
  });

  const pendingSettlementsCount = settlements.filter(s => ["REQUESTED", "APPROVED"].includes(s.status)).length;

  return {
    totalVolumeKobo,
    totalCommissionKobo,
    pendingLiabilityKobo,
    availableLiabilityKobo: availableLiabilityKobo < 0n ? 0n : availableLiabilityKobo,
    totalPaidKobo,
    totalRefundsKobo,
    pendingSettlementsCount,
    successfulPaymentsCount: payments.length,
  };
}

// ─────────────────────────────────────────────────────────────
// SETTLEMENTS MANAGEMENT
// ─────────────────────────────────────────────────────────────
export async function getPendingSettlements() {
  await requireAdmin();

  return prisma.vendorSettlement.findMany({
    where: { status: { in: ["REQUESTED", "APPROVED", "PROCESSING"] } },
    include: {
      financeAccount: {
        include: {
          bankAccount: true,
        }
      }
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function approveSettlement(settlementId: string) {
  const session = await requireAdmin();

  await prisma.vendorSettlement.update({
    where: { id: settlementId },
    data: {
      status: "APPROVED",
      approvedAt: new Date(),
      approvedBy: session.userId,
    }
  });

  revalidatePath("/admin/finance/settlements");
  return { success: true, message: "Settlement approved. Ready to process." };
}

export async function rejectSettlement(settlementId: string) {
  await requireAdmin();

  await prisma.vendorSettlement.update({
    where: { id: settlementId },
    data: {
      status: "FAILED",
      failureReason: "Rejected by admin",
    }
  });

  revalidatePath("/admin/finance/settlements");
  return { success: true, message: "Settlement rejected." };
}

// ─────────────────────────────────────────────────────────────
// PROCESS PAYOUT (Triggers actual Paystack transfer)
// ─────────────────────────────────────────────────────────────
export async function processSettlement(settlementId: string) {
  await requireAdmin();

  const settlement = await prisma.vendorSettlement.findUnique({
    where: { id: settlementId },
    include: {
      financeAccount: { include: { bankAccount: true } }
    }
  });

  if (!settlement) throw new Error("Settlement not found");
  if (settlement.status !== "APPROVED") throw new Error("Only approved settlements can be processed");
  if (!settlement.financeAccount.bankAccount) throw new Error("Vendor has no bank account");

  const bank = settlement.financeAccount.bankAccount;

  // 1. Get or create Paystack recipient
  let recipientCode = bank.providerRecipient;
  if (!recipientCode) {
    // For sandbox testing, we simulate. In real life, decrypt account number first.
    recipientCode = await paystackTransfer.createRecipient(
      bank.bankCode,
      "0000000000", // In production: decrypt bank.accountNumberEnc
      bank.accountName
    );
    await prisma.vendorBankAccount.update({
      where: { id: bank.id },
      data: { providerRecipient: recipientCode }
    });
  }

  // 2. Mark as PROCESSING first (prevents double-trigger)
  await prisma.vendorSettlement.update({
    where: { id: settlementId },
    data: { status: "PROCESSING", processedAt: new Date() }
  });

  // 3. Initiate Paystack transfer
  try {
    const transfer = await paystackTransfer.initiateTransfer(
      recipientCode,
      settlement.amountKobo,
      settlement.reference,
      `Isource payout to vendor`
    );

    await prisma.vendorSettlement.update({
      where: { id: settlementId },
      data: { providerReference: transfer.providerReference }
    });

    // 4. Post ledger journal: move liability from Available to In Transit
    const accounts = await prisma.ledgerAccount.findMany({
      where: { code: { in: ["2010", "2020"] } }
    });
    const availableAcc = accounts.find(a => a.code === "2010")!;
    const inTransitAcc = accounts.find(a => a.code === "2020")!;

    await postJournal({
      reference: `JRN-PAYOUT-${settlement.reference}`,
      idempotencyKey: `PAYOUT-${settlement.id}`,
      sourceType: "VENDOR_SETTLEMENT",
      sourceId: settlement.id,
      description: `Vendor payout: ${settlement.reference}`,
      entries: [
        { accountId: availableAcc.id, direction: "DEBIT", amountKobo: settlement.amountKobo },
        { accountId: inTransitAcc.id, direction: "CREDIT", amountKobo: settlement.amountKobo },
      ]
    });

    revalidatePath("/admin/finance/settlements");
    return { success: true, message: "Payout initiated with Paystack." };
  } catch (err: any) {
    await prisma.vendorSettlement.update({
      where: { id: settlementId },
      data: { status: "FAILED", failureReason: err.message }
    });
    return { success: false, message: err.message };
  }
}