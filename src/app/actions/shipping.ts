"use server";

import { prisma } from "@/lib/prisma";
import { calculateShipmentWeightGrams, calculateRateKobo, type CartItemForShipping } from "@/lib/shipping/calculator";

export async function getShippingQuote(args: {
  items: { productId: string; quantity: number }[];
  customerState: string;
  isPickup: boolean;
}) {
  try {
    // 1. Find the Zone for the state
    const zone = await prisma.shippingZone.findFirst({
      where: {
        isActive: true,
        states: { has: args.customerState },
      },
    });

    if (!zone) {
      return { error: "We do not currently deliver to this state." };
    }

    // 2. Fetch product dimensions from DB
    const productIds = args.items.map(i => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, weightGrams: true, lengthCm: true, widthCm: true, heightCm: true }
    });
    const productMap = new Map(dbProducts.map(p => [p.id, p]));

    const shippingItems: CartItemForShipping[] = args.items.map(item => {
      const dbProd = productMap.get(item.productId);
      return {
        productId: item.productId,
        quantity: item.quantity,
        weightGrams: dbProd?.weightGrams ?? 500, // Fallback to 500g
        lengthCm: dbProd?.lengthCm ?? 10,
        widthCm: dbProd?.widthCm ?? 10,
        heightCm: dbProd?.heightCm ?? 10,
      };
    });

    // 3. Calculate weights
    const chargeableWeightGrams = calculateShipmentWeightGrams(shippingItems);

    // 4. Find eligible rates in this zone
    const rates = await prisma.shippingRate.findMany({
      where: {
        zoneId: zone.id,
        minWeightGrams: { lte: chargeableWeightGrams },
        maxWeightGrams: { gte: chargeableWeightGrams },
        provider: { isActive: true },
      },
      include: { provider: true },
      orderBy: { basePriceKobo: "asc" }, // Cheapest first
    });

    if (rates.length === 0) {
      return { error: "No shipping rates available for this weight." };
    }

    // 5. Calculate price for the cheapest eligible rate
    const bestRate = rates[0];
    const finalFeeKobo = calculateRateKobo(
      chargeableWeightGrams,
      bestRate.basePriceKobo,
      bestRate.pricePerKgKobo,
      bestRate.pickupDiscountKobo,
      args.isPickup
    );

    return {
      ok: true as const,
      quote: {
        providerName: bestRate.provider.name,
        providerCode: bestRate.provider.code,
        zoneName: zone.name,
        weightGrams: chargeableWeightGrams,
        feeKobo: Number(finalFeeKobo),
        isPickup: args.isPickup,
      }
    };
  } catch (e: any) {
    console.error("[getShippingQuote]", e);
    return { error: "Failed to calculate shipping." };
  }
}