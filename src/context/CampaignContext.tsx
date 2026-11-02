"use client";
import { createContext, useContext } from "react";
import type { ActiveTheme } from "@/lib/campaign";

const CampaignContext = createContext<ActiveTheme | null>(null);

export function CampaignProvider({ campaign, children }: { campaign: ActiveTheme | null, children: React.ReactNode }) {
  return <CampaignContext.Provider value={campaign}>{children}</CampaignContext.Provider>;
}

export function useCampaign() {
  return useContext(CampaignContext);
}