"use client";
import { useState } from "react";
import type { ProductReview, ProductSpec } from "@/types/catalog";

type Tab = "description" | "specs" | "reviews";

export function ProductTabs({ description, specs, sku, reviews }: { description: string; specs: ProductSpec[]; sku: string; reviews: ProductReview[]; }) {
  const [tab, setTab] = useState<Tab>("description");
  const tabs: { key: Tab; label: string }[] = [
    { key: "description", label: "Description" },
    { key: "specs", label: "Specifications" },
    { key: "reviews", label: `Reviews (${reviews.length})` },
  ];
  
  return (
    <section className="mt-12 rounded-xl border border-border bg-white overflow-hidden">
      <div role="tablist" aria-label="Product information" className="flex border-b border-border bg-surface overflow-x-auto no-scrollbar">
        {tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`px-6 h-14 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors ${
              tab === t.key ? "border-primary text-primary bg-white" : "border-transparent text-charcoal/60 hover:text-charcoal"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-6 md:p-8">
        {tab === "description" && (<p className="text-sm leading-relaxed text-charcoal/80 whitespace-pre-line">{description}</p>)}
        {tab === "specs" && (
          <dl className="divide-y divide-border max-w-2xl">
            {specs.map((s) => (
              <div key={s.label} className="grid grid-cols-2 gap-4 py-3 text-sm">
                <dt className="text-muted">{s.label}</dt>
                <dd className="text-charcoal font-medium">{s.value}</dd>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-4 py-3 text-sm">
              <dt className="text-muted">SKU</dt>
              <dd className="text-charcoal font-medium">{sku}</dd>
            </div>
          </dl>
        )}
        {tab === "reviews" && (
          reviews.length === 0 ? (
            <p className="text-sm text-muted">No reviews yet. Be the first to review this product after purchase.</p>
          ) : (
            <ul className="space-y-4 max-w-3xl">
              {reviews.map((r) => (
                <li key={r.id} className="rounded-lg border border-border p-5">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-charcoal text-sm">{r.title}</p>
                    <span className="text-xs text-warning">{"★".repeat(r.rating)}<span className="text-border">{"★".repeat(5 - r.rating)}</span></span>
                  </div>
                  <p className="text-sm text-charcoal/80 mt-2">{r.body}</p>
                  <p className="text-xs text-muted mt-3 font-medium">— {r.author}</p>
                </li>
              ))}
            </ul>
          )
        )}
      </div>
    </section>
  );
}