import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const ACCOUNTS = [
  { code: "1000", name: "Gateway Clearing", type: "ASSET" },
  { code: "1010", name: "Marketplace Settlement Cash", type: "ASSET" },
  { code: "2000", name: "Vendor Pending Liability", type: "LIABILITY" },
  { code: "2010", name: "Vendor Available Liability", type: "LIABILITY" },
  { code: "2020", name: "Vendor Payout In Transit", type: "LIABILITY" },
  { code: "2100", name: "Customer Refund Liability", type: "LIABILITY" },
  { code: "4000", name: "Isource Commission Revenue", type: "REVENUE" },
  { code: "5000", name: "Gateway Processing Expense", type: "EXPENSE" },
  { code: "5100", name: "Refund and Chargeback Expense", type: "EXPENSE" },
];

async function main() {
  console.log("Seeding Chart of Accounts...");
  for (const acc of ACCOUNTS) {
    await prisma.ledgerAccount.upsert({
      where: { code: acc.code },
      update: {},
      create: {
        code: acc.code,
        name: acc.name,
        type: acc.type as any,
        currency: "NGN"
      }
    });
  }
  console.log("✅ Ledger accounts seeded.");
}
main().finally(() => prisma.$disconnect());