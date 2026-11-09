import { setServers } from "node:dns";
setServers(["8.8.8.8"]);
import { prisma } from "../src/lib/prisma";
import { hash } from "bcryptjs";

(async () => {
  const email = "macksonolivia31@gmail.com";
  const password = "2026Isource";
  const name = "Mackson";

  console.log("Connecting to database...");
  const passwordHash = await hash(password, 10);

  try {
    // Create or update the Admin account
    const admin = await prisma.user.upsert({
      where: { email },
      update: { passwordHash, name, role: "ADMIN" },
      create: { email, passwordHash, name, role: "ADMIN" },
    });

    console.log("\n✅ SUCCESS! Admin account created/updated.");
    console.log(`Name: ${admin.name}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Role: ${admin.role}\n`);

    // Fetch the total count of admins
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { name: true, email: true }
    });

    console.log(`════════ ADMIN ACCOUNT SUMMARY ════════`);
    console.log(`Total Admins in database: ${admins.length}\n`);
    admins.forEach((a, i) => console.log(`${i + 1}. ${a.name} (${a.email})`));

  } catch (err) {
    console.error("❌ Failed:", err);
  } finally {
    process.exit(0);
  }
})();