"use server";
import { prisma } from "@/lib/prisma";

export async function getTrafficStats() {
  const now = new Date();

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);
  const monthStart = new Date(now);
  monthStart.setMonth(now.getMonth() - 1);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  const [total, today, week, month, year] = await Promise.all([
    prisma.pageVisit.count(),
    prisma.pageVisit.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.pageVisit.count({ where: { createdAt: { gte: weekStart } } }),
    prisma.pageVisit.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.pageVisit.count({ where: { createdAt: { gte: yearStart } } }),
  ]);

  // Unique visitors today (by hashed IP)
  const uniqueGroups = await prisma.pageVisit.groupBy({
    by: ["ipHash"],
    where: { createdAt: { gte: todayStart }, ipHash: { not: null } },
  });

  // Last 7 days daily breakdown for chart
  const dailyBreakdown: { date: string; visits: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const dayStart = new Date(todayStart);
    dayStart.setDate(todayStart.getDate() - i);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayStart.getDate() + 1);

    const count = await prisma.pageVisit.count({
      where: { createdAt: { gte: dayStart, lt: dayEnd } },
    });

    dailyBreakdown.push({
      date: dayStart.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      visits: count,
    });
  }

  return {
    total,
    today,
    week,
    month,
    year,
    uniqueToday: uniqueGroups.length,
    dailyBreakdown,
  };
}