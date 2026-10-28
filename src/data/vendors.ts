import type { Vendor } from "@/types/catalog";
export const VENDORS: Vendor[] = [
  { slug: "isource-official", name: "Isource Official", isIsource: true, location: "Lagos, NG" },
  { slug: "aurora-tech", name: "Aurora Tech Store", isIsource: false, location: "Lagos, NG" },
  { slug: "voltedge", name: "VoltEdge Power", isIsource: false, location: "Abuja, NG" },
  { slug: "homenest", name: "HomeNest Living", isIsource: false, location: "Port Harcourt, NG" },
  { slug: "driveline", name: "DriveLine Auto", isIsource: false, location: "Ibadan, NG" },
  { slug: "freshcart", name: "FreshCart Grocers", isIsource: false, location: "Lagos, NG" },
  { slug: "glowco", name: "GlowCo Beauty", isIsource: false, location: "Lagos, NG" },
  { slug: "urban-thread", name: "Urban Thread", isIsource: false, location: "Abuja, NG" },
];
export function getVendor(slug: string): Vendor | undefined { return VENDORS.find((v) => v.slug === slug); }