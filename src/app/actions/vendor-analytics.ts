"use server";
import { prisma } from "@/lib/prisma";

const DAY = 24 * 60 * 60 * 1000;

export async function getVendorStats() {
  const now = new Date();
  const oneDayAgo    = new Date(now.getTime() - DAY);
  const oneWeekAgo   = new Date(now.getTime() - 7 * DAY);
  const oneMonthAgo  = new Date(now.getTime() - 30 * DAY);
  const oneYearAgo   = new Date(now.getTime() - 365 * DAY);

  // Fetch all vendors with just what we need
  const vendors = await prisma.vendor.findMany({
    include: {
      user: { select: { lastLoginAt: true } },
      products: {
        where: { isActive: true, approvalStatus: "APPROVED" },
        select: { id: true },
        take: 1,
      },
    },
  });

  let currentlySelling = 0;
  let activeVendors = 0;
  let inactiveVendors = 0;
  let previousVendors = 0;
  let newThisWeek = 0;
  let newThisMonth = 0;
  let newThisYear = 0;
  let newToday = 0;

  for (const v of vendors) {
    const anyV = v as any;
    const lastLogin = anyV.user?.lastLoginAt ? new Date(anyV.user.lastLoginAt) : null;
    const createdAt = anyV.createdAt ? new Date(anyV.createdAt) : null;
    const status = anyV.status as string | undefined;

    // Currently selling = has at least one live approved product
    if (anyV.products && anyV.products.length > 0) currentlySelling++;

    // Previous / left = suspended, rejected, or explicitly inactive
    const isInactiveStatus = status === "SUSPENDED" || status === "REJECTED" || status === "DEACTIVATED";
    const isInactiveFlag = anyV.isActive === false;
    if (isInactiveStatus || isInactiveFlag) {
      previousVendors++;
      continue; // don't count as active or inactive
    }

    // Active = logged in within 30 days
    if (lastLogin && lastLogin >= oneMonthAgo) {
      activeVendors++;
    }
    // Inactive = registered > 30 days ago AND no login in last 30 days
    else if (createdAt && createdAt < oneMonthAgo) {
      inactiveVendors++;
    }

    // New registrations
    if (createdAt) {
      if (createdAt >= oneDayAgo)   newToday++;
      if (createdAt >= oneWeekAgo)  newThisWeek++;
      if (createdAt >= oneMonthAgo) newThisMonth++;
      if (createdAt >= oneYearAgo)  newThisYear++;
    }
  }

  return {
    total: vendors.length,
    currentlySelling,
    activeVendors,
    inactiveVendors,
    previousVendors,
    newToday,
    newThisWeek,
    newThisMonth,
    newThisYear,
  };
}