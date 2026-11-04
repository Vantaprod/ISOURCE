"use server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { calculateCommission } from "@/modules/commissions/commission.service";
import { getShippingQuote } from "@/app/actions/shipping";
import { createHash } from "node:crypto";

interface CartItemInput {
  productId: string;
  quantity: number;
  unitPriceKobo: number;
}

export async function createCheckout(
  items: CartItemInput[],
  customerState: string,
  isPickup: boolean,
  pickupStationId: string | null
) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const customer = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!customer) throw new Error("User not found");

  // Fetch real vendorId + categoryId from DB — never trust frontend
  const productIds = items.map(i => i.productId);
  const dbProducts = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, vendorId: true, categoryId: true, weightGrams: true, lengthCm: true, widthCm: true, heightCm: true, name: true }
  });
  const pMap = new Map(dbProducts.map(p => [p.id, p]));

  // Group by real vendor
  const byVendor = new Map<string, CartItemInput[]>();
  for (const item of items) {
    const prod = pMap.get(item.productId);
    if (!prod) throw new Error(`Product ${item.productId} not found`);
    const arr = byVendor.get(prod.vendorId) || [];
    arr.push(item);
    byVendor.set(prod.vendorId, arr);
  }

  let totalProductKobo = 0n;
  let totalShippingKobo = 0n;
  const vendorPlan: any[] = [];

  for (const [vendorId, vItems] of byVendor.entries()) {
    const subtotal = vItems.reduce((s, i) => s + BigInt(i.unitPriceKobo) * BigInt(i.quantity), 0n);
    const shipItems = vItems.map(i => ({
      productId: i.productId,
      quantity: i.quantity,
      weightGrams: pMap.get(i.productId)?.weightGrams ?? 500,
      lengthCm: pMap.get(i.productId)?.lengthCm ?? 10,
      widthCm: pMap.get(i.productId)?.widthCm ?? 10,
      heightCm: pMap.get(i.productId)?.heightCm ?? 10,
    }));
    const quote = await getShippingQuote({ items: shipItems, customerState, isPickup });
    if ("error" in quote) throw new Error(`Shipping for ${vendorId}: ${quote.error}`);
    const shipFee = BigInt(quote.quote.feeKobo);
    totalProductKobo += subtotal;
    totalShippingKobo += shipFee;
    vendorPlan.push({ vendorId, items: vItems, subtotal, shipFee });
  }

  const grandTotal = totalProductKobo + totalShippingKobo;
  const paymentRef = `ISRC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const orderId = `ORD-${Date.now()}`;

  await prisma.financePayment.create({
    data: {
      orderId,
      customerId: customer.id,
      provider: "PAYSTACK",
      status: "PENDING",
      reference: paymentRef,
      amountKobo: grandTotal,
      currency: "NGN",
    },
  });

  for (const vp of vendorPlan) {
    const vo = await prisma.financeVendorOrder.create({
      data: {
        orderId,
        vendorId: vp.vendorId,
        orderNumber: `VO-${Date.now()}-${vp.vendorId.slice(0, 4)}`,
        status: "PENDING",
        subtotalKobo: vp.subtotal,
        totalKobo: vp.subtotal + vp.shipFee,
        shippingFeeKobo: vp.shipFee,
        deliveryMethod: isPickup ? "PICKUP" : "HOME_DELIVERY",
        pickupStationId: isPickup ? pickupStationId : null,
        vendorNetKobo: 0n,
      },
    });

    for (const item of vp.items) {
      const prod = pMap.get(item.productId)!;
      const itemSubtotal = BigInt(item.unitPriceKobo) * BigInt(item.quantity);
      const { rateBps, commissionKobo } = await calculateCommission(prod.categoryId, itemSubtotal);
      await prisma.financeOrderItem.create({
        data: {
          vendorOrderId: vo.id,
          productId: item.productId,
          categoryId: prod.categoryId,
          productName: prod.name,
          quantity: item.quantity,
          unitPriceKobo: BigInt(item.unitPriceKobo),
          subtotalKobo: itemSubtotal,
          commissionRateBps: rateBps,
          commissionKobo,
        },
      });
    }
  }

  // Record policy acceptance
  await prisma.shippingPolicyAcceptance.create({
    data: {
      orderId,
      userId: customer.id,
      version: "1.0",
      ipHash: createHash("sha256").update(customer.id + orderId).digest("hex").slice(0, 16),
    },
  });

  return { ok: true as const, paymentRef, orderId, grandTotalKobo: Number(grandTotal) };
}