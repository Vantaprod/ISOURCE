"use server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function getVendorFinanceData() {
  const session = await getSession();
  if (!session || session.role !== "VENDOR") throw new Error("Unauthorized");

  const vendor = await prisma.vendor.findUnique({ where: { userId: session.userId } });
  if (!vendor) throw new Error("Vendor not found");

  // Fetch all vendor orders
  const orders = await prisma.financeVendorOrder.findMany({
    where: { vendorId: vendor.id },
    include: { items: true, delivery: true },
    orderBy: { createdAt: "desc" },
  });

  // Fetch successful settlements
  const settlements = await prisma.vendorSettlement.findMany({
    where: { financeAccount: { vendorId: vendor.id }, status: "SUCCESSFUL" },
  });

  // Calculate Balances
  let pendingKobo = 0n;
  let availableKobo = 0n;
  let totalCommissionKobo = 0n;
  let totalSalesKobo = 0n;

  orders.forEach(order => {
    totalSalesKobo += order.subtotalKobo;
    totalCommissionKobo += order.commissionKobo;

    if (["PENDING", "CONFIRMED", "PROCESSING", "READY_FOR_DISPATCH", "DISPATCHED"].includes(order.status)) {
      pendingKobo += order.vendorNetKobo;
    } else if (["DELIVERED", "COMPLETED"].includes(order.status)) {
      // Check if this order has already been paid out or is in an active settlement
      const isSettled = settlements.some(s => s.reference.includes(order.id));
      if (!isSettled) {
        availableKobo += order.vendorNetKobo;
      }
    }
  });

  const totalPaidKobo = settlements.reduce((sum, s) => sum + s.amountKobo, 0n);

  return {
    vendorId: vendor.id,
    pendingKobo,
    availableKobo,
    totalSalesKobo,
    totalCommissionKobo,
    totalPaidKobo,
    orders,
    settlements
  };
}

export async function requestWithdrawal(amountKobo: number) {
  const session = await getSession();
  if (!session || session.role !== "VENDOR") throw new Error("Unauthorized");

  const vendor = await prisma.vendor.findUnique({ 
    where: { userId: session.userId },
    include: { financeAccount: { include: { bankAccount: true } } }
  });
  
  if (!vendor) throw new Error("Vendor not found");
  if (!vendor.financeAccount?.bankAccount?.verified) {
    return { success: false, message: "Please add and verify a bank account first." };
  }

  const amount = BigInt(amountKobo);
  if (amount <= 0n) return { success: false, message: "Invalid amount" };

  // 1. Create Finance Account if it doesn't exist
  let financeAccount = vendor.financeAccount;
  if (!financeAccount) {
    financeAccount = await prisma.vendorFinanceAccount.create({
      data: { vendorId: vendor.id, currency: "NGN" }
    });
  }

  // 2. Create Settlement Request
  const settlement = await prisma.vendorSettlement.create({
    data: {
      financeAccountId: financeAccount.id,
      reference: `STL-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: "REQUESTED",
      payoutMode: "VENDOR_REQUEST",
      amountKobo: amount,
      currency: "NGN",
      bankAccountId: vendor.financeAccount.bankAccount.id,
      provider: "PAYSTACK",
      requestedAt: new Date(),
    }
  });

  revalidatePath("/vendor/finance");
  return { success: true, message: "Withdrawal requested successfully. Admin review pending." };
}