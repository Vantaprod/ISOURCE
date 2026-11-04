import { setServers } from "node:dns";
setServers(["8.8.8.8"]);

import { prisma } from "../src/lib/prisma";

(async () => {
  const vendors = await prisma.vendor.findMany({ take: 1, select: { id: true, name: true } });
  if (vendors.length === 0) { console.error("No vendors found"); process.exit(1); }
  const v = vendors[0];
  const wallet = await prisma.advertisingWallet.upsert({
    where: { vendorId: v.id },
    update: {},
    create: { vendorId: v.id, availableKobo: BigInt(0), reservedKobo: BigInt(0), lifetimeSpentKobo: BigInt(0) },
  });
  const newBal = wallet.availableKobo + BigInt(5_000_000);
  const updated = await prisma.advertisingWallet.update({
    where: { id: wallet.id },
    data: { availableKobo: newBal },
  });
  await prisma.advertisingWalletTransaction.create({
    data: {
      walletId: wallet.id,
      type: "FUNDING",
      amountKobo: BigInt(5_000_000),
      balanceAfterKobo: updated.availableKobo,
      reference: `TEST-SEED-${Date.now()}`,
      metadata: { source: "test_seed" },
    },
  });
  console.log(`Pre-funded ${v.name} (${v.id}) with ₦50,000`);
  console.log(`New available balance: ₦${(Number(updated.availableKobo) / 100).toLocaleString()}`);
  process.exit(0);
})();