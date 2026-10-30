"use server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function createPayout(vendorId: string, amountKobo: number, notes: string) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");
  if (amountKobo <= 0) throw new Error("Amount must be greater than zero");

  const entries = await prisma.vendorLedgerEntry.findMany({ where: { vendorId } });
  const balance = entries.reduce((sum, e) => sum + e.amountKobo, 0);
  if (amountKobo > balance) throw new Error("Payout exceeds vendor balance");

  const reference = `PAY-${Date.now().toString().slice(-8)}`;

  await prisma.$transaction(async (tx) => {
    const payout = await tx.payout.create({
      data: { vendorId, amountKobo, status: "PROCESSING", method: "bank_transfer", reference, notes, processedAt: new Date() },
    });
    await tx.vendorLedgerEntry.create({
      data: { vendorId, type: "PAYOUT", amountKobo: -amountKobo, description: `Payout ${reference}`, payoutId: payout.id },
    });
  });

  revalidatePath("/admin/payouts");
}

export async function markPayoutPaid(payoutId: string) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");
  await prisma.payout.update({ where: { id: payoutId }, data: { status: "PAID" } });
  revalidatePath("/admin/payouts");
}