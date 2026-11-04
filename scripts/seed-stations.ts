import { setServers } from "node:dns";
setServers(["8.8.8.8"]);
import { prisma } from "../src/lib/prisma";

(async () => {
  const zone = await prisma.shippingZone.findFirst({ where: { states: { has: "Lagos" } } });
  if (!zone) { console.error("Lagos zone missing"); process.exit(1); }

  const stations = [
    { name: "Ikeja City Mall", address: "Obafemi Awolowo Way, Alausa, Ikeja" },
    { name: "Yaba Tech Hub", address: "Herbert Macaulay Way, Yaba" },
    { name: "Lekki Phase 1 Pickup", address: "Admiralty Way, Lekki Phase 1" },
    { name: "Surulere Central", address: "Bode Thomas Street, Surulere" },
  ];

  for (const s of stations) {
    await prisma.pickupStation.upsert({
      where: { id: `ps_${s.name.toLowerCase().replace(/\s+/g, "_")}` },
      update: {},
      create: { id: `ps_${s.name.toLowerCase().replace(/\s+/g, "_")}`, zoneId: zone.id, name: s.name, address: s.address },
    });
  }
  console.log("✅ Seeded", stations.length, "pickup stations");
  process.exit(0);
})();