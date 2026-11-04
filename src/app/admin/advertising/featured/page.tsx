import { getPendingFeatured, approveFeatured, rejectFeatured } from "@/app/actions/admin-advertising";

export const dynamic = "force-dynamic";

function naira(kobo: bigint) { return "₦" + (Number(kobo) / 100).toLocaleString("en-NG", { maximumFractionDigits: 0 }); }

export default async function AdminFeaturedPage() {
  const bookings = await getPendingFeatured();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-extrabold text-charcoal mb-4">Pending Featured Placements</h2>
      <div className="rounded-lg border border-border bg-white overflow-hidden">
        {bookings.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted">No pending featured bookings.</div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-surface text-xs uppercase text-muted">
              <tr>
                <th className="px-5 py-3 font-semibold">Placement</th>
                <th className="px-5 py-3 font-semibold">Product ID</th>
                <th className="px-5 py-3 font-semibold text-right">Fee</th>
                <th className="px-5 py-3 font-semibold text-right">Dates</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-t border-border">
                  <td className="px-5 py-3 font-medium">{b.placement.name}</td>
                  <td className="px-5 py-3 text-xs text-muted">{b.productId}</td>
                  <td className="px-5 py-3 text-right font-bold">{naira(b.feeKobo)}</td>
                  <td className="px-5 py-3 text-right text-xs">
                    {b.startAt.toLocaleDateString()} - {b.endAt.toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3 text-right flex justify-end gap-2">
                    <form action={async () => { "use server"; await approveFeatured(b.id); }}>
                      <button className="h-7 px-3 rounded bg-primary text-white text-xs font-bold hover:bg-primary-hover">Approve</button>
                    </form>
                    <form action={async () => { "use server"; await rejectFeatured(b.id); }}>
                      <button className="h-7 px-3 rounded border border-danger text-danger text-xs font-bold hover:bg-danger hover:text-white">Reject & Refund</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}