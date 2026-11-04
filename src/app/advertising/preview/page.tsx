import { SponsoredSlot } from "@/components/advertising/SponsoredSlot";

export const dynamic = "force-dynamic";

export default async function AdvertisingPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ placement?: string; keywords?: string; categoryId?: string }>;
}) {
  const params = await searchParams;
  const placement = params.placement || "search-top";
  const keywords = params.keywords ? params.keywords.split(",") : [];
  const categoryId = params.categoryId || null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-charcoal">Advertising Preview</h1>
        <p className="text-sm text-muted mt-1">
          Live auction output for a placement. Change query params to test different contexts.
        </p>
        <div className="mt-3 text-xs text-muted bg-surface border border-border rounded p-3 font-mono">
          <div>placement: {placement}</div>
          <div>keywords: {keywords.length ? keywords.join(", ") : "(none)"}</div>
          <div>categoryId: {categoryId || "(none)"}</div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">
          Organic Results Placeholder
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-lg border border-border bg-surface aspect-square flex items-center justify-center text-xs text-muted">
              Organic #{i}
            </div>
          ))}
        </div>

        <SponsoredSlot
          placementSlug={placement}
          keywords={keywords}
          categoryId={categoryId}
          limit={4}
        />
      </div>

      <div className="mt-4 text-xs text-muted">
        <p className="font-bold mb-1">Notes:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Sponsored cards carry a visible "Sponsored" badge — mandatory per Isource policy.</li>
          <li>Impressions fire on viewport visibility (IntersectionObserver).</li>
          <li>Clicks are tracked via /api/sponsored/click and charge the seller's wallet.</li>
          <li>If no eligible campaigns exist, this section renders nothing (no empty container).</li>
        </ul>
      </div>
    </div>
  );
}