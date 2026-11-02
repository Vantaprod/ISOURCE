import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  adapter: PrismaPg | undefined;
};

// Optimized for Neon Free Tier & Next.js Hot Reloading
const adapter =
  globalForPrisma.adapter ??
  new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
    max: 3, // Strictly limit connections to prevent Neon blocking us
    idleTimeoutMillis: 5000, // Drop idle connections in 5s to free up the pool
    connectionTimeoutMillis: 30000, // Wait up to 30s for a connection
  });

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.adapter = adapter;
}