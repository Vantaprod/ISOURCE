export type CartItemForShipping = {
  productId: string;
  quantity: number;
  weightGrams: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
};

export function calculateVolumetricWeightGrams(lengthCm: number, widthCm: number, heightCm: number, qty: number = 1): number {
  // Standard divisor is 5000 for cm -> kg
  // We multiply by 1000 to keep everything in grams.
  const volWeightKg = (lengthCm * widthCm * heightCm) / 5000;
  return Math.ceil(volWeightKg * 1000) * qty;
}

export function calculateShipmentWeightGrams(items: CartItemForShipping[]): number {
  let totalActualGrams = 0;
  let totalVolumetricGrams = 0;

  for (const item of items) {
    // Fallback to 500g minimum if dimensions are zero
    const weight = item.weightGrams > 0 ? item.weightGrams : 500;
    const l = item.lengthCm > 0 ? item.lengthCm : 10;
    const w = item.widthCm > 0 ? item.widthCm : 10;
    const h = item.heightCm > 0 ? item.heightCm : 10;

    totalActualGrams += (weight * item.quantity);
    totalVolumetricGrams += calculateVolumetricWeightGrams(l, w, h, item.quantity);
  }

  return Math.max(totalActualGrams, totalVolumetricGrams);
}

export function calculateRateKobo(
  chargeableWeightGrams: number,
  basePriceKobo: bigint,
  pricePerKgKobo: bigint,
  pickupDiscountKobo: bigint,
  isPickup: boolean
): bigint {
  // Base price + (weight in kg * price per kg)
  const weightKg = chargeableWeightGrams / 1000;
  const weightCharge = BigInt(Math.ceil(weightKg * Number(pricePerKgKobo)));
  let total = basePriceKobo + weightCharge;

  if (isPickup) {
    total = total - pickupDiscountKobo;
  }

  return total < BigInt(0) ? BigInt(0) : total;
}