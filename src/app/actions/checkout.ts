"use server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { PaystackProvider } from "@/modules/providers/paystack/paystack.adapter";
import { calculateCommission } from "@/modules/commissions/commission.service";
import { redirect } from "next/navigation";

const paystack = new PaystackProvider();

// The frontend will send an array of cart items
interface CartItemInput {
  productId: string;
  quantity: number;
  vendorId: string;
  unitPriceKobo: number;
  categoryId: string;
}

export async function createCheckout(items: CartItemInput[]) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const customer = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!customer) throw new Error("User not found");

  // 1. Calculate total payment amount
  let totalAmountKobo = 0n;
  items.forEach(item => {
    totalAmountKobo += BigInt(item.unitPriceKobo) * BigInt(item.quantity);
  });

  // 2. Generate unique payment reference
  const paymentReference = `ISRC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const orderId = `ORD-${Date.now()}`; // In a real app, create the main Order record here

  // 3. Create the FinancePayment record
  const payment = await prisma.financePayment.create({
    data: {
      orderId,
      customerId: customer.id,
      provider: "PAYSTACK",
      status: "PENDING",
      reference: paymentReference,
      amountKobo: totalAmountKobo,
      currency: "NGN",
    }
  });

  // 4. Group items by vendor to create Vendor Orders
  const vendors = [...new Set(items.map(i => i.vendorId))];

  for (const vendorId of vendors) {
    const vendorItems = items.filter(i => i.vendorId === vendorId);
    let vendorSubtotalKobo = 0n;

    // Calculate vendor subtotal
    vendorItems.forEach(item => {
      vendorSubtotalKobo += BigInt(item.unitPriceKobo) * BigInt(item.quantity);
    });

    // Create the FinanceVendorOrder
    const vendorOrder = await prisma.financeVendorOrder.create({
      data: {
        orderId,
        vendorId,
        orderNumber: `VO-${Date.now()}-${vendorId.slice(0,4)}`,
        status: "PENDING",
        subtotalKobo: vendorSubtotalKobo,
        totalKobo: vendorSubtotalKobo,
        vendorNetKobo: 0n, // Will be updated after payment verification
      }
    });

    // Create individual OrderItems and calculate commission
    for (const item of vendorItems) {
      const itemSubtotal = BigInt(item.unitPriceKobo) * BigInt(item.quantity);
      const { rateBps, commissionKobo } = await calculateCommission(item.categoryId, itemSubtotal);

      await prisma.financeOrderItem.create({
        data: {
          vendorOrderId: vendorOrder.id,
          productId: item.productId,
          categoryId: item.categoryId,
          productName: "Product", // Ideally fetch actual name from DB
          quantity: item.quantity,
          unitPriceKobo: BigInt(item.unitPriceKobo),
          subtotalKobo: itemSubtotal,
          commissionRateBps: rateBps,
          commissionKobo: commissionKobo,
        }
      });
    }
  }

  // 5. Initialize Paystack
  const init = await paystack.initializePayment({
    amountKobo: totalAmountKobo,
    customerEmail: customer.email,
    customerName: customer.name || "Customer",
    reference: paymentReference,
    description: `Isource Order ${orderId}`
  });

  // 6. Save the checkout URL to the payment record
  await prisma.financePayment.update({
    where: { id: payment.id },
    data: { 
      checkoutUrl: init.checkoutUrl,
      providerReference: init.providerReference
    }
  });

  // Return the URL to the frontend so it can redirect the user
  return { success: true, checkoutUrl: init.checkoutUrl };
}