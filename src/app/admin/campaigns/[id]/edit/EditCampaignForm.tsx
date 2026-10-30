"use client";
import { useState, useTransition } from "react";
import { updateCampaign } from "../../actions";

export function EditCampaignForm({ campaign, banners }: { campaign: { id: string; name: string; description: string | null; themeColor: string; bannerId: string | null; startDate: string; endDate: string; isActive: boolean }; banners: { id: string; title: string }[] }) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => { await updateCampaign(campaign.id, fd); setSaved(true); });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-white p-5 space-y-3">
      {saved && <p className="text-sm text-success bg-success/5 p-2 rounded border border-success/20">Saved.</p>}
      <input name="name" required defaultValue={campaign.name} className="h-10 w-full rounded border border-border px-3 text-sm" />
      <input name="description" defaultValue={campaign.description || ""} className="h-10 w-full rounded border border-border px-3 text-sm" />
      <div className="grid md:grid-cols-3 gap-3">
        <input name="themeColor" defaultValue={campaign.themeColor} className="h-10 rounded border border-border px-3 text-sm" />
        <input name="startDate" type="date" required defaultValue={campaign.startDate} className="h-10 rounded border border-border px-3 text-sm" />
        <input name="endDate" type="date" required defaultValue={campaign.endDate} className="h-10 rounded border border-border px-3 text-sm" />
      </div>
      <select name="bannerId" defaultValue={campaign.bannerId || ""} className="h-10 w-full rounded border border-border px-3 text-sm bg-white">
        <option value="">No banner</option>
        {banners.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
      </select>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isActive" defaultChecked={campaign.isActive} /> Active</label>
      <button type="submit" disabled={isPending} className="h-10 px-5 rounded bg-primary text-white text-sm font-bold">{isPending ? "Saving..." : "Save Changes"}</button>
    </form>
  );
}