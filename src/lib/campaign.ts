import { prisma } from "./prisma";

export interface ActiveTheme {
  name: string;
  description: string;
  themeColor: string;
  isAuto: boolean;
}

// Note: Lunar holidays (Eid, Easter) shift dates every year. 
// Use the Admin Campaign panel to override these dates for precision.
const OCCASIONS = [
  { name: "New Year Deals", month: 0, day: 1, color: "#D4AF37", desc: "Start the new year with fresh deals and massive savings." },
  { name: "Valentine's Day", month: 1, day: 14, color: "#E11D48", desc: "Celebrate love with special offers on gifts and fashion." },
  { name: "Easter", month: 3, day: 5, color: "#8B5CF6", desc: "Fresh looks for the Easter weekend." },
  { name: "Eid al-Fitr", month: 2, day: 20, color: "#16A34A", desc: "Eid Mubarak! Celebrate with exclusive deals." }, // Approx date
  { name: "Mother's Day", month: 2, day: 8, color: "#F472B6", desc: "Show Mom how much she means to you." },
  { name: "Children's Day", month: 4, day: 27, color: "#F59E0B", desc: "Special deals for the little ones." },
  { name: "Eid al-Adha", month: 4, day: 27, color: "#059669", desc: "Eid Mubarak! Shop for the festival of sacrifice." }, // Approx date
  { name: "Father's Day", month: 5, day: 21, color: "#2563EB", desc: "Get the best gifts for Dad this Father's Day." },
  { name: "Democracy Day", month: 5, day: 12, color: "#15803D", desc: "Celebrating Nigeria's democracy." },
  { name: "Independence Day", month: 9, day: 1, color: "#16A34A", desc: "Happy Independence Day Nigeria!" },
  { name: "Black Friday", month: 10, day: 29, color: "#111827", desc: "The biggest discounts of the year." },
  { name: "Cyber Monday", month: 11, day: 2, color: "#06B6D4", desc: "Extend the savings online for Cyber Monday." },
  { name: "Christmas", month: 11, day: 25, color: "#DC2626", desc: "Season's greetings and holiday deals." },
  { name: "Boxing Day", month: 11, day: 26, color: "#B91C1C", desc: "End of year blowout sales." },
];

export async function getActiveCampaign(): Promise<ActiveTheme | null> {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // 1. Check for MANUAL campaigns in the database first
  try {
    const manualCampaign = await prisma.campaign.findFirst({
      where: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      orderBy: { startDate: "desc" },
    });

    if (manualCampaign) {
      return {
        name: manualCampaign.name,
        description: manualCampaign.description || "Shop our exclusive offers before they end!",
        themeColor: manualCampaign.themeColor,
        isAuto: false,
      };
    }
  } catch (error) {
    console.error("Failed to fetch manual campaign:", error);
  }

  // 2. If no manual campaign, check the AUTO-SENSING calendar (14 days out)
  for (const occasion of OCCASIONS) {
    let occasionDate = new Date(today.getFullYear(), occasion.month, occasion.day);
    
    // If the occasion has passed this year, check next year (for Dec/Jan rollover)
    if (occasionDate < today) {
       occasionDate = new Date(today.getFullYear() + 1, occasion.month, occasion.day);
    }

    const diffTime = occasionDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // If the occasion is within the next 14 days (0 to 14 days away)
    if (diffDays >= 0 && diffDays <= 14) {
      return {
        name: `${occasion.name} Deals`,
        description: occasion.desc,
        themeColor: occasion.color,
        isAuto: true,
      };
    }
  }

  // 3. If nothing is active or upcoming, return null
  return null;
}

export function darkenColor(hex: string, percent: number = 10): string {
  const num = parseInt(hex.replace("#", ""), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) - amt,
    B = ((num >> 8) & 0x00ff) - amt,
    G = (num & 0x0000ff) - amt;
  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100 +
      (G < 255 ? (G < 1 ? 0 : G) : 255)
    )
      .toString(16)
      .slice(1)
  );
}