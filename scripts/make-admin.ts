import { PrismaClient, type UserRole } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.argv[2];
  const roleArg = process.argv[3]?.toUpperCase() || "ADMIN";

  if (!email) {
    console.error("❌ Please provide an email address.");
    console.log("Usage: npx tsx scripts/make-admin.ts <email> [ADMIN|VENDOR]");
    process.exit(1);
  }

  const validRoles: UserRole[] = ["CUSTOMER", "VENDOR", "ADMIN"];
  const role = roleArg as UserRole;
  if (!validRoles.includes(role)) {
    console.error(`❌ Invalid role: ${role}. Use ADMIN, VENDOR, or CUSTOMER.`);
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`❌ User not found: ${email}`);
    process.exit(1);
  }

  await prisma.user.update({ where: { email }, data: { role } });

  if (role === "VENDOR") {
    const existingVendor = await prisma.vendor.findUnique({ where: { userId: user.id } });
    if (!existingVendor) {
      await prisma.vendor.create({
        data: {
          userId: user.id,
          slug: `${user.name?.toLowerCase().replace(/[^a-z0-9]/g, "-") || "vendor"}-${Date.now().toString().slice(-4)}`,
          name: user.name || "My Store",
          status: "APPROVED",
        },
      });
      console.log(`✅ Upgraded ${email} to VENDOR and created a store profile.`);
    } else {
      console.log(`✅ Upgraded ${email} to VENDOR (store profile already exists).`);
    }
  } else {
    console.log(`✅ Upgraded ${email} to ${role}.`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });