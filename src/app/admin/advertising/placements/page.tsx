import { getAllPlacements, updatePlacement } from "@/app/actions/admin-advertising";

export const dynamic = "force-dynamic";

function naira(kobo: number) { return "₦" + (kobo / 100).toLocaleString("en-NG", { maximumFractionDigits: 0 }); }

export default async function AdminPlacementsPage() {
  const placements = await getAllPlacements();

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-white overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-surface text-xs uppercase text-muted">
            <tr>
              <th className="px-5 py-3 font-semibold">Placement Name</th>
              <th className="px-5 py-3 font-semibold">Pricing Model</th>
              <th className="px-5 py-3 font-semibold text-right">Min Bid (CPC)</th>
              <th className="px-5 py-3 font-semibold text-right">Max Bid (CPC)</th>
              <th className="px-5 py-3 font-semibold text-right">Slots</th>
              <th className="px-5 py-3 font-semibold text-right">Status</th>
              <th className="px-5 py-3 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {placements.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-5 py-3 font-medium text-charcoal">{p.name}</td>
                <td className="px-5 py-3 text-xs">{p.pricingModel}</td>
                <td className="px-5 py-3 text-right">{naira(p.minBidKobo)}</td>
                <td className="px-5 py-3 text-right">{naira(p.maxBidKobo)}</td>
                <td className="px-5 py-3 text-right">{p.maxSlots}</td>
                <td className="px-5 py-3 text-right">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${p.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {p.isActive ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <form action={updatePlacement} className="flex items-center justify-end gap-2">
                    <input type="hidden" name="id" value={p.id} />
                    <input type="number" name="minBidKobo" defaultValue={p.minBidKobo} className="w-16 h-7 border rounded px-1 text-xs" title="Min Bid (Kobo)" />
                    <input type="number" name="maxBidKobo" defaultValue={p.maxBidKobo} className="w-16 h-7 border rounded px-1 text-xs" title="Max Bid (Kobo)" />
                    <input type="number" name="maxSlots" defaultValue={p.maxSlots} className="w-10 h-7 border rounded px-1 text-xs" title="Slots" />
                    <input type="checkbox" name="isActive" defaultChecked={p.isActive} title="Active" />
                    <button type="submit" className="h-7 px-2 rounded bg-charcoal text-white text-xs font-bold hover:bg-black">Save</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}