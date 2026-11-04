"use server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const DAY = 24 * 60 * 60 * 1000;

export async function getStoreAnalytics() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const vendor = await prisma.vendor.findUnique({ where: { userId: session.userId } });
  if (!vendor) throw new Error("Vendor not found");

  const storePath = `/brand/${vendor.slug}`;
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const last7 = new Date(now.getTime() - 7 * DAY);
  const last30Start = new Date(startOfToday.getTime() - 29 * DAY);

  // ─── Core counts (parallel for speed) ───
  const [
    totalViews,
    views7,
    views30,
    uniqueGroupRows,
    followers,
    orderCount,
    revenueAgg,
    recentVisits,
    referrers,
  ] = await Promise.all([
    prisma.pageVisit.count({ where: { path: storePath } }),
    prisma.pageVisit.count({ where: { path: storePath, createdAt: { gte: last7 } } }),
    prisma.pageVisit.count({ where: { path: storePath, createdAt: { gte: last30Start } } }),
    prisma.pageVisit.groupBy({
      by: ["ipHash"],
      where: { path: storePath, ipHash: { not: null } },
    }),
    prisma.storeFollower.count({ where: { vendorId: vendor.id } }),
    prisma.financeVendorOrder.count({ where: { vendorId: vendor.id } }),
    prisma.financeVendorOrder.aggregate({
      where: { vendorId: vendor.id },
      _sum: { vendorNetKobo: true },
    }),
    prisma.pageVisit.findMany({
      where: { path: storePath, createdAt: { gte: last30Start } },
      select: { createdAt: true },
    }),
    prisma.pageVisit.groupBy({
      by: ["referrer"],
      where: { path: storePath, referrer: { not: null } },
      _count: { referrer: true },
      orderBy: { _count: { referrer: "desc" } },
      take: 5,
    }),
  ]);

  // ─── Build 30-day daily buckets from single query ───
  const daily: { date: string; label: string; count: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const dayStart = new Date(startOfToday.getTime() - i * DAY);
    const dayEnd = new Date(dayStart.getTime() + DAY);
    const count = recentVisits.filter(
      (v) => v.createdAt >= dayStart && v.createdAt < dayEnd
    ).length;
    daily.push({
      date: dayStart.toISOString().slice(0, 10),
      label: dayStart.toLocaleDateString("en-NG", { month: "short", day: "numeric" }),
      count,
    });
  }

  return {
    vendorName: vendor.name,
    storeSlug: vendor.slug,
    totalViews,
    views7,
    views30,
    uniqueVisitors: uniqueGroupRows.length,
    followers,
    orderCount,
    revenueKobo: Number(revenueAgg._sum.vendorNetKobo || 0n),
    daily,
    referrers: referrers.map((r) => ({
      source: r.referrer || "Direct",
      count: r._count.referrer,
    })),
  };
}