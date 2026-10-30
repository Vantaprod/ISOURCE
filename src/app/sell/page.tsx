"use client";
import Link from "next/link";
import { useState } from "react";
import { Store, TrendingUp, ShieldCheck, Truck, ArrowRight, CheckCircle2 } from "lucide-react";
import { applyToSell } from "@/app/actions/vendor-onboarding";

export default function SellPage() {
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await applyToSell(formData);
    if (result.success) setSubmitted(true);
    else alert(result.error);
  }

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-charcoal text-white py-16 md:py-24 px-4 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Grow your business on Isource</h1>
          <p className="text-base md:text-lg text-white/80 mb-8">Reach millions of customers across Nigeria. Join a marketplace built for trusted vendors.</p>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-[1440px] px-4 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            { icon: Store, title: "Zero Setup Fees", desc: "Create your storefront for free." },
            { icon: TrendingUp, title: "Wide Reach", desc: "Access customers nationwide." },
            { icon: ShieldCheck, title: "Secure Payments", desc: "Guaranteed payouts." },
            { icon: Truck, title: "Logistics Support", desc: "Use our delivery network." }
          ].map((item) => (
            <div key={item.title} className="p-6 rounded-xl border border-border">
              <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4"><item.icon size={28} /></div>
              <h3 className="font-bold text-charcoal mb-2">{item.title}</h3>
              <p className="text-sm text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Application Form */}
      <section className="bg-surface py-16 px-4">
        <div className="mx-auto max-w-xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-charcoal">Apply to become a vendor</h2>
            <p className="text-sm text-muted mt-2">Tell us about your business. Our team reviews applications within 48 hours.</p>
          </div>

          {submitted ? (
            <div className="rounded-xl border border-success/30 bg-success/5 p-8 text-center">
              <CheckCircle2 size={48} className="mx-auto text-success mb-4" />
              <h3 className="text-xl font-bold text-charcoal">Application Received!</h3>
              <p className="text-sm text-muted mt-2">Your application is pending review. We will notify you once approved.</p>
              <Link href="/account" className="inline-block mt-6 h-10 px-6 leading-10 rounded-md bg-primary text-white font-semibold text-sm hover:bg-primary-hover">Go to Account</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-white p-6 md:p-8 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Store Name *</label>
                <input name="storeName" required className="h-10 w-full rounded border border-border px-3 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Store Description *</label>
                <textarea name="description" required rows={3} className="w-full rounded border border-border px-3 py-2 text-sm outline-none focus:border-primary resize-none" placeholder="What do you sell?" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Business Location *</label>
                <input name="location" required placeholder="e.g. Lagos, Nigeria" className="h-10 w-full rounded border border-border px-3 text-sm outline-none focus:border-primary" />
              </div>
              <button type="submit" className="w-full h-11 mt-4 rounded bg-primary text-white text-sm font-semibold hover:bg-primary-hover flex items-center justify-center gap-2">
                Submit Application <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}