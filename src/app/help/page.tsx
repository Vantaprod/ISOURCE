"use client";
import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";

const faqs = [
  { q: "How long does delivery take?", a: "Deliveries to Lagos, Abuja, and Port Harcourt take 1–3 working days. Other states typically take 3–7 working days." },
  { q: "Can I pay on delivery?", a: "Yes, pay on delivery is available in Lagos, Abuja, and Port Harcourt for eligible items." },
  { q: "How do I return an item?", a: "You can request a return within 7 days of delivery via your Account → Orders page. Items must be in their original condition." },
  { q: "Are the products original?", a: "We work only with verified vendors. If you suspect a counterfeit item, please contact support immediately for a full refund." },
  { q: "What payment methods do you accept?", a: "We accept Paystack (cards, bank, USSD), Flutterwave, direct bank transfer, and pay on delivery." },
  { q: "How do I contact support?", a: "You can reach us via the Contact Us page, email support@isource.ng, or call +234 800 000 0000 during business hours." },
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-12 md:py-16">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-charcoal mb-4">Help Center</h1>
        <p className="text-muted mb-6">Find answers to common questions about shopping on Isource.</p>
        <div className="relative max-w-md mx-auto">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input type="search" placeholder="Search for help..." className="h-12 w-full rounded-lg border border-border bg-surface pl-10 pr-4 text-sm outline-none focus:border-primary focus:bg-white transition-colors" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-lg border border-border bg-white overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-4 text-left font-medium text-charcoal hover:bg-surface transition-colors"
              >
                {faq.q}
                <ChevronDown size={18} className={`text-muted transition-transform ${openIndex === idx ? "rotate-180" : ""}`} />
              </button>
              {openIndex === idx && (
                <div className="px-4 pb-4 text-sm text-charcoal/80 leading-relaxed border-t border-border pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl bg-primary/5 border border-primary/20 p-6 text-center">
          <h3 className="font-bold text-charcoal mb-1">Still need help?</h3>
          <p className="text-sm text-muted mb-4">Our support team is ready to assist you.</p>
          <a href="/contact" className="inline-block h-10 px-6 leading-10 rounded bg-primary text-white text-sm font-semibold hover:bg-primary-hover">Contact Support</a>
        </div>
      </div>
    </div>
  );
}