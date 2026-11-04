import { prisma } from "../src/lib/prisma";

const PLACEMENTS = [
  { slug: "search-top", name: "Search Results — Top", location: "SEARCH_RESULTS", pricingModel: "CPC", minBidKobo: 50, maxBidKobo: 50000, maxSlots: 4, requiresApproval: false },
  { slug: "category-top", name: "Category Page — Top", location: "CATEGORY_TOP", pricingModel: "CPC", minBidKobo: 50, maxBidKobo: 50000, maxSlots: 4, requiresApproval: false },
  { slug: "homepage-hero", name: "Homepage — Hero Carousel", location: "HOMEPAGE_HERO", pricingModel: "FIXED", minBidKobo: 0, maxBidKobo: 0, fixedRateKobo: 5000000, maxSlots: 3, requiresApproval: true },
  { slug: "homepage-featured", name: "Homepage — Featured Products", location: "HOMEPAGE_FEATURED", pricingModel: "CPC", minBidKobo: 75, maxBidKobo: 75000, maxSlots: 8, requiresApproval: true },
  { slug: "related-products", name: "Related Products Strip", location: "RELATED_PRODUCTS", pricingModel: "CPC", minBidKobo: 40, maxBidKobo: 40000, maxSlots: 4, requiresApproval: false },
  { slug: "banner-homepage", name: "Homepage — Banner", location: "HOMEPAGE_BANNER", pricingModel: "CPM", minBidKobo: 0, maxBidKobo: 0, cpmRateKobo: 250000, maxSlots: 2, requiresApproval: true },
];

async function main() {
  console.log("Seeding SponsoredPlacements...");
  for (const p of PLACEMENTS) {
    const row = await prisma.sponsoredPlacement.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name, location: p.location, pricingModel: p.pricingModel,
        minBidKobo: p.minBidKobo, maxBidKobo: p.maxBidKobo, maxSlots: p.maxSlots,
        requiresApproval: p.requiresApproval,
        cpmRateKobo: (p as any).cpmRateKobo || 0,
        fixedRateKobo: (p as any).fixedRateKobo || 0,
      },
      create: {
        slug: p.slug, name: p.name, location: p.location, pricingModel: p.pricingModel,
        minBidKobo: p.minBidKobo, maxBidKobo: p.maxBidKobo, maxSlots: p.maxSlots,
        requiresApproval: p.requiresApproval,
        cpmRateKobo: (p as any).cpmRateKobo || 0,
        fixedRateKobo: (p as any).fixedRateKobo || 0,
      },
    });
    console.log(`  ✓ ${row.slug}`);
  }

  console.log("Creating empty advertising wallets for existing vendors...");
  const vendors = await prisma.vendor.findMany({ select: { id: true } });
  for (const v of vendors) {
    await prisma.advertisingWallet.upsert({
      where: { vendorId: v.id },
      update: {},
      create: { vendorId: v.id, availableKobo: BigInt(0), reservedKobo: BigInt(0), lifetimeSpentKobo: BigInt(0) },
    });
  }
  console.log(`  ✓ ${vendors.length} vendor wallets ensured`);

  console.log("Done.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { /* shared client — don't disconnect */ });