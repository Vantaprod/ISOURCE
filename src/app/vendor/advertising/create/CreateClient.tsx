"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createSponsoredProductCampaign, listMyProductsForAdvertising } from "@/app/actions/advertising-campaign";
import { bookFeaturedPlacement, createBannerCampaign } from "@/app/actions/advertising-featured";
import { Package, Sparkles, Image as ImageIcon } from "lucide-react";

type Product = { id: string; name: string; slug: string; priceKobo: number; images: { url: string }[] };
type CampaignType = "SPONSORED_PRODUCT" | "FEATURED" | "BANNER" | null;

export function CreateClient() {
  const router = useRouter();
  const [step, setStep] = useState<"type" | "form">("type");
  const [type, setType] = useState<CampaignType>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (step === "form" && products.length === 0) {
      listMyProductsForAdvertising().then((p) => setProducts(p)).catch(() => setError("Failed to load products"));
    }
  }, [step, products.length]);

  const today = new Date().toISOString().slice(0, 10);
  const in30 = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      let r;
      if (type === "SPONSORED_PRODUCT") r = await createSponsoredProductCampaign(formData);
      else if (type === "FEATURED") r = await bookFeaturedPlacement(formData);
      else if (type === "BANNER") r = await createBannerCampaign(formData);
      
      if (r && "error" in r) { setError(r.error); return; }
      router.push("/vendor/advertising/campaigns");
    });
  }

  if (step === "type") {
    return (
      <div>
        <h2 className="text-xl font-extrabold text-charcoal mb-1">Create a new campaign</h2>
        <p className="text-sm text-muted mb-6">Choose the type of advertising you want to run.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button onClick={() => { setType("SPONSORED_PRODUCT"); setStep("form"); }} className="text-left rounded-lg border-2 border-primary bg-primary text-white p-5 hover:bg-primary-hover transition-colors">
            <Package size={28} />
            <h3 className="text-base font-bold mt-3">Sponsored Products</h3>
            <p className="text-xs opacity-90 mt-1">Pay per click. Appear in search & category results.</p>
          </button>
          <button onClick={() => { setType("FEATURED"); setStep("form"); }} className="text-left rounded-lg border-2 border-charcoal bg-white p-5 hover:border-primary transition-colors">
            <Sparkles size={28} className="text-charcoal" />
            <h3 className="text-base font-bold mt-3 text-charcoal">Featured Products</h3>
            <p className="text-xs text-muted mt-1">Fixed-fee homepage & category placements.</p>
          </button>
          <button onClick={() => { setType("BANNER"); setStep("form"); }} className="text-left rounded-lg border-2 border-charcoal bg-white p-5 hover:border-primary transition-colors">
            <ImageIcon size={28} className="text-charcoal" />
            <h3 className="text-base font-bold mt-3 text-charcoal">Banner Ads</h3>
            <p className="text-xs text-muted mt-1">Image placements across the marketplace.</p>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => setStep("type")} className="text-xs font-bold text-primary hover:underline mb-3">← Change campaign type</button>
      <h2 className="text-xl font-extrabold text-charcoal mb-1">
        {type === "SPONSORED_PRODUCT" ? "Sponsored Products" : type === "FEATURED" ? "Featured Placement" : "Banner Ad"}
      </h2>
      {error && <div className="rounded-md border border-danger/30 bg-danger/10 text-danger text-sm p-3 mb-4">{error}</div>}

      <form action={handleSubmit} className="space-y-4 max-w-2xl">
        {type !== "BANNER" && (
          <div>
            <label className="block text-xs font-bold text-charcoal mb-1">Product</label>
            <select name="productId" required className="h-10 w-full rounded border border-border px-3 text-sm bg-white">
              <option value="">— Select product —</option>
              {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        )}

        {type === "SPONSORED_PRODUCT" && (
          <>
            <input type="hidden" name="placementSlug" value="search-top" />
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-bold mb-1">Max CPC (₦)</label><input name="cpcNaira" type="number" min={50} defaultValue={100} required className="h-10 w-full rounded border px-3 text-sm" /></div>
              <div><label className="block text-xs font-bold mb-1">Daily Budget (₦)</label><input name="dailyBudgetNaira" type="number" min={500} defaultValue={2000} required className="h-10 w-full rounded border px-3 text-sm" /></div>
            </div>
            <div><label className="block text-xs font-bold mb-1">Total Budget (₦)</label><input name="totalBudgetNaira" type="number" min={1000} defaultValue={20000} required className="h-10 w-full rounded border px-3 text-sm" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-bold mb-1">Start Date</label><input name="startDate" type="date" defaultValue={today} required className="h-10 w-full rounded border px-3 text-sm" /></div>
              <div><label className="block text-xs font-bold mb-1">End Date</label><input name="endDate" type="date" defaultValue={in30} required className="h-10 w-full rounded border px-3 text-sm" /></div>
            </div>
          </>
        )}

        {type === "FEATURED" && (
          <>
            <input type="hidden" name="placementSlug" value="homepage-featured" />
            <div>
              <label className="block text-xs font-bold mb-1">Duration (Days)</label>
              <select name="days" className="h-10 w-full rounded border px-3 text-sm">
                <option value="7">7 Days</option>
                <option value="14">14 Days</option>
                <option value="30">30 Days</option>
              </select>
            </div>
            <div className="p-3 bg-surface border border-border rounded text-xs text-charcoal">
              Fee will be deducted from your advertising wallet immediately. Admin approval required.
            </div>
          </>
        )}

        {type === "BANNER" && (
          <>
            <div><label className="block text-xs font-bold mb-1">Campaign Title</label><input name="title" required className="h-10 w-full rounded border px-3 text-sm" /></div>
            <div><label className="block text-xs font-bold mb-1">Image URL</label><input name="imageUrl" placeholder="https://res.cloudinary.com/..." required className="h-10 w-full rounded border px-3 text-sm" /></div>
            <div><label className="block text-xs font-bold mb-1">Destination URL</label><input name="ctaUrl" placeholder="/product/my-product" required className="h-10 w-full rounded border px-3 text-sm" /></div>
            <div><label className="block text-xs font-bold mb-1">Total Budget (₦)</label><input name="budgetNaira" type="number" min={5000} defaultValue={10000} required className="h-10 w-full rounded border px-3 text-sm" /></div>
          </>
        )}

        <div className="flex items-start gap-2 pt-2 pb-2">
          <input type="checkbox" name="termsAccepted" required className="mt-1" />
          <label className="text-xs text-charcoal">
            I have read and agree to the <a href="/policies/advertising" target="_blank" className="text-primary hover:underline font-bold">Isource Advertising Policy</a>.
          </label>
        </div>
        <button type="submit" disabled={isPending} className="h-11 px-6 rounded bg-primary text-white text-sm font-bold hover:bg-primary-hover disabled:opacity-50">
          {isPending ? "Processing..." : "Submit Campaign"}
        </button>
      </form>
    </div>
  );
}