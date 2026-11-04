import { setServers } from "node:dns";
setServers(["8.8.8.8"]);
import { prisma } from "../src/lib/prisma";

(async () => {
  console.log("Seeding Shipping Zones & Rates...");

  // Create Lagos Zone
  const lagos = await prisma.shippingZone.upsert({
    where: { id: "zone_lagos" },
    update: {},
    create: {
      id: "zone_lagos",
      name: "Lagos Mainland",
      states: ["Lagos"],
      cities: ["Ikeja", "Surulere", "Yaba", "Lekki", "Victoria Island"],
    }
  });

  // Create Isource Delivery
  const provider = await prisma.shippingProvider.upsert({
    where: { code: "ISOURCE_INTERNAL" },
    update: {},
    create: {
      name: "Isource Delivery",
      code: "ISOURCE_INTERNAL",
      isInternal: true,
      supportsHome: true,
      supportsPickup: true,
    }
  });

  // Create Rate Brackets
  await prisma.shippingRate.createMany({
    data: [
      { providerId: provider.id, zoneId: lagos.id, minWeightGrams: 0, maxWeightGrams: 1000, basePriceKobo: BigInt(150000), pricePerKgKobo: BigInt(0), pickupDiscountKobo: BigInt(20000) }, // 0-1kg: ₦1,500 Home / ₦1,300 Pickup
      { providerId: provider.id, zoneId: lagos.id, minWeightGrams: 1001, maxWeightGrams: 5000, basePriceKobo: BigInt(250000), pricePerKgKobo: BigInt(0), pickupDiscountKobo: BigInt(20000) }, // 1-5kg: ₦2,500 Home / ₦2,300 Pickup
      { providerId: provider.id, zoneId: lagos.id, minWeightGrams: 5001, maxWeightGrams: 20000, basePriceKobo: BigInt(400000), pricePerKgKobo: BigInt(10000), pickupDiscountKobo: BigInt(20000) }, // 5-20kg: ₦4,000 base + ₦100/kg
    ],
    skipDuplicates: true
  });

  console.log("✅ Seeded Lagos Zone & Rates");
  process.exit(0);
})();