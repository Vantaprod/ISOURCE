"use client";
import { useState } from "react";
import type { ProductReview, ProductSpec } from "@/types/catalog";

type Tab = "description" | "specs" | "reviews";

export function ProductTabs({
  description,
  specs,
  sku,
  reviews,
}: {
  description: string;
  specs: ProductSpec[];
  sku: string;
  reviews: ProductReview[];
}) {
  const [tab, setTab] = useState<Tab>("description");
  const tabs: { key: Tab; label: string }[] = [
    { key: "description", label: "Description" },
    { key: "specs", label: "Specifications" },
    { key: "reviews", label: `Reviews (${reviews.length})` },
  ];
  return (
    <section className="mt-10 rounded-lg border border-border overflow-hidden">
      <div role="tablist" aria-label="Product information" className="flex border-b border-border bg-surface overflow-x-auto no-scrollbar">
        {tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 md:px-6 h-11 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
              tab === t.key ? "border-primary text-primary bg-white" : "border-transparent text-charcoal/70 hover:text-charcoal"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-4 md:p-6">
        {tab === "description" && (<p className="text-sm leading-relaxed text-charcoal/90">{description}</p>)}

        {tab === "specs" && (
          <dl className="divide-y divide-border">
            {specs.map((s) => (
              <div key={s.label} className="grid grid-cols-2 gap-4 py-2 text-sm">
                <dt className="text-muted">{s.label}</dt>
                <dd className="text-charcoal">{s.value}</dd>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-4 py-2 text-sm">
              <dt className="text-muted">SKU</dt>
              <dd className="text-charcoal">{sku}</dd>
            </div>
          </dl>
        )}

        {tab === "reviews" && (
          reviews.length === 0 ? (
            <p className="text-sm text-muted">No reviews yet. Be the first to review this product after purchase.</p>
          ) : (
            <ul className="space-y-3">
              {reviews.map((r) => (
                <li key={r.id} className="rounded border border-border p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{r.title}</p>
                    <span className="text-xs text-warning">{"★".repeat(r.rating)}<span className="text-border">{"★".repeat(5 - r.rating)}</span></span>
                  </div>
                  <p className="text-sm text-charcoal/80 mt-1">{r.body}</p>
                  <p className="text-xs text-muted mt-2">— {r.author}</p>
                </li>
              ))}
            </ul>
          )
        )}
      </div>
    </section>
  );
}