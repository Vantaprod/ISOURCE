import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EditCampaignForm } from "./EditCampaignForm";

export default async function EditCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [campaign, banners] = await Promise.all([
    prisma.campaign.findUnique({ where: { id } }),
    prisma.heroBanner.findMany({ where: { isActive: true } }),
  ]);
  if (!campaign) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Campaign</h1>
      <EditCampaignForm campaign={{ ...campaign, startDate: campaign.startDate.toISOString().slice(0,10), endDate: campaign.endDate.toISOString().slice(0,10) }} banners={banners.map(b => ({ id: b.id, title: b.title }))} />
    </div>
  );
}