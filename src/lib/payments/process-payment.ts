import { prisma } from "@/lib/prisma";
import { PaystackProvider } from "@/modules/providers/paystack/paystack.adapter";
import { postJournal } from "@/modules/ledger/ledger.service";

const paystack = new PaystackProvider();

export async function processSuccessfulPayment(reference: string) {
  // 1. Find the payment record
  const payment = await prisma.financePayment.findUnique({
    where: { reference },
    include: {
      allocations: true,
    }
  });

  if (!payment) throw new Error(`Payment not found: ${reference}`);
  
  // Idempotency check: If already successful, exit early
  if (payment.status === "SUCCESSFUL") {
    return { success: true, message: "Payment already processed" };
  }

  // 2. Verify with Paystack (Never trust the webhook payload directly)
  const verification = await paystack.verifyPayment(reference);

  if (verification.status !== "SUCCESS") {
    await prisma.financePayment.update({
      where: { id: payment.id },
      data: { status: "FAILED" }
    });
    throw new Error("Payment verification failed");
  }

  // 3. Ensure amounts match perfectly
  if (verification.amountKobo !== payment.amountKobo) {
    throw new Error(`Amount mismatch: expected ${payment.amountKobo}, got ${verification.amountKobo}`);
  }

  // 4. Fetch all vendor orders for this checkout
  const vendorOrders = await prisma.financeVendorOrder.findMany({
    where: { orderId: payment.orderId },
    include: { items: true }
  });

  if (vendorOrders.length === 0) throw new Error("No vendor orders found for this payment");

  // 5. Calculate totals for Ledger Posting
  let totalCommissionKobo = 0n;
  let totalVendorNetKobo = 0n;

  const vendorOrderUpdates = [];
  const paymentAllocations = [];

  for (const vo of vendorOrders) {
    let voCommission = 0n;
    
    // Sum commission from items
    for (const item of vo.items) {
      voCommission += item.commissionKobo;
    }

    const voNet = vo.totalKobo - voCommission;
    totalCommissionKobo += voCommission;
    totalVendorNetKobo += voNet;

    // Prepare updates for Vendor Order
    vendorOrderUpdates.push(
      prisma.financeVendorOrder.update({
        where: { id: vo.id },
        data: {
          status: "CONFIRMED",
          commissionKobo: voCommission,
          vendorNetKobo: voNet,
        }
      })
    );

    // Prepare Payment Allocations
    paymentAllocations.push({
      paymentId: payment.id,
      vendorOrderId: vo.id,
      amountKobo: vo.totalKobo,
      currency: "NGN",
    });
  }

  // 6. Fetch Ledger Accounts
  const accounts = await prisma.ledgerAccount.findMany({
    where: { code: { in: ["1000", "2000", "4000"] } }
  });
  const clearingAcc = accounts.find(a => a.code === "1000")!;
  const pendingLiabilityAcc = accounts.find(a => a.code === "2000")!;
  const revenueAcc = accounts.find(a => a.code === "4000")!;

  // 7. Execute database transaction
  await prisma.$transaction([
    // Update Payment
    prisma.financePayment.update({
      where: { id: payment.id },
      data: {
        status: "SUCCESSFUL",
        amountPaidKobo: verification.amountKobo,
        paidAt: verification.paidAt,
        providerReference: verification.providerReference,
      }
    }),
    // Create Allocations
    prisma.paymentAllocation.createMany({
      data: paymentAllocations,
      skipDuplicates: true,
    }),
    // Update Vendor Orders
    ...vendorOrderUpdates
  ]);

  // 8. Post Double-Entry Ledger
  await postJournal({
    reference: `JRN-PAY-${reference}`,
    idempotencyKey: `PAY-${reference}`,
    sourceType: "FINANCE_PAYMENT",
    sourceId: payment.id,
    description: `Payment capture for order ${payment.orderId}`,
    entries: [
      { accountId: clearingAcc.id, direction: "DEBIT", amountKobo: payment.amountKobo },
      { accountId: pendingLiabilityAcc.id, direction: "CREDIT", amountKobo: totalVendorNetKobo },
      { accountId: revenueAcc.id, direction: "CREDIT", amountKobo: totalCommissionKobo },
    ]
  });

  return { success: true, message: "Payment processed and ledger posted" };
}