"use server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { paystackTransfer } from "@/modules/providers/paystack/paystack-transfer.adapter";
import { encrypt } from "@/lib/encryption";
import { revalidatePath } from "next/cache";

export async function fetchBankList() {
  return paystackTransfer.listBanks();
}

export async function verifyAndSaveBankAccount(bankCode: string, accountNumber: string) {
  const session = await getSession();
  if (!session || session.role !== "VENDOR") throw new Error("Unauthorized");

  const vendor = await prisma.vendor.findUnique({ where: { userId: session.userId } });
  if (!vendor) throw new Error("Vendor not found");

  // 1. Verify with Paystack
  const resolved = await paystackTransfer.resolveBankAccount(bankCode, accountNumber);

  // 2. Find bank name from list
  const banks = await paystackTransfer.listBanks();
  const bankName = banks.find((b) => b.code === bankCode)?.name || "Unknown Bank";

  // 3. Deactivate any existing bank accounts
  await prisma.vendorBankAccount.updateMany({
    where: { vendorId: vendor.id },
    data: { active: false },
  });

  // 4. Encrypt the account number and save
  const encrypted = encrypt(accountNumber);
  const last4 = accountNumber.slice(-4);

  const bank = await prisma.vendorBankAccount.create({
    data: {
      vendorId: vendor.id,
      bankCode, bankName,
      accountNumberEnc: encrypted,
      accountLast4: last4,
      accountName: resolved.accountName,
      verified: true,
      verifiedAt: new Date(),
      active: true,
    },
  });

  // 5. Ensure Vendor Finance Account exists and points to this bank
  const existing = await prisma.vendorFinanceAccount.findUnique({ where: { vendorId: vendor.id } });
  if (existing) {
    await prisma.vendorFinanceAccount.update({
      where: { vendorId: vendor.id },
      data: { bankAccountId: bank.id },
    });
  } else {
    await prisma.vendorFinanceAccount.create({
      data: { vendorId: vendor.id, currency: "NGN", bankAccountId: bank.id },
    });
  }

  revalidatePath("/vendor/finance/bank-account");
  revalidatePath("/vendor/finance");
  return { success: true, accountName: resolved.accountName, bankName, last4 };
}

export async function getVendorBankAccount() {
  const session = await getSession();
  if (!session || session.role !== "VENDOR") throw new Error("Unauthorized");

  const vendor = await prisma.vendor.findUnique({ where: { userId: session.userId } });
  if (!vendor) throw new Error("Vendor not found");

  return prisma.vendorBankAccount.findFirst({
    where: { vendorId: vendor.id, active: true, verified: true },
  });
}