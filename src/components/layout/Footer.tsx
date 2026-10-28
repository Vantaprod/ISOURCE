import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { CATEGORIES } from "@/data/categories";
const QUICK_LINKS = [{ label: "Home", href: "/" }, { label: "About Us", href: "/about" }, { label: "Contact Us", href: "/contact" }, { label: "Help Center", href: "/help" }];
const CUSTOMER_SERVICE = [{ label: "Track Order", href: "/orders/track" }, { label: "Returns & Refund Policy", href: "/returns" }, { label: "Shipping Policy", href: "/delivery" }, { label: "FAQs", href: "/help/faqs" }];
export function Footer() {
  return (
    <footer className="bg-charcoal-deep text-white/75">
      <div className="mx-auto max-w-[1440px] px-4 py-10 md:py-12">
        <div className="grid gap-8 md:gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
          <div><Link href="/" className="inline-block text-2xl font-extrabold leading-none mb-3"><span className="text-primary">i</span><span className="text-white">source</span></Link><p className="text-sm">More Choices. Better Living.</p></div>
          <div><h4 className="text-white text-sm font-semibold mb-3">Quick Links</h4><ul className="space-y-2 text-sm">{QUICK_LINKS.map((l) => (<li key={l.href}><Link href={l.href} className="hover:text-primary">{l.label}</Link></li>))}</ul></div>
          <div><h4 className="text-white text-sm font-semibold mb-3">Categories</h4><ul className="space-y-2 text-sm">{CATEGORIES.slice(0, 6).map((c) => (<li key={c.slug}><Link href={`/category/${c.slug}`} className="hover:text-primary">{c.name}</Link></li>))}</ul></div>
          <div><h4 className="text-white text-sm font-semibold mb-3">Customer Service</h4><ul className="space-y-2 text-sm">{CUSTOMER_SERVICE.map((l) => (<li key={l.href}><Link href={l.href} className="hover:text-primary">{l.label}</Link></li>))}</ul></div>
          <div><h4 className="text-white text-sm font-semibold mb-3">Follow Us</h4><div className="flex items-center gap-3"><Link href="#" aria-label="Facebook" className="hover:text-primary"><Facebook size={18} /></Link><Link href="#" aria-label="Twitter / X" className="hover:text-primary"><Twitter size={18} /></Link><Link href="#" aria-label="Instagram" className="hover:text-primary"><Instagram size={18} /></Link><Link href="#" aria-label="YouTube" className="hover:text-primary"><Youtube size={18} /></Link></div></div>
        </div>
      </div>
      <div className="border-t border-white/10"><div className="mx-auto max-w-[1440px] px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/50"><p>© {new Date().getFullYear()} Isource. All rights reserved.</p><div className="flex items-center gap-3"><span className="text-[10px] uppercase tracking-wide text-white/40">We accept</span><PaymentPill label="VISA" /><PaymentPill label="Mastercard" /><PaymentPill label="Paystack" /><PaymentPill label="Flutterwave" /></div></div></div>
    </footer>
  );
}
function PaymentPill({ label }: { label: string }) { return <span className="inline-flex h-6 items-center rounded bg-white/10 px-2 text-[10px] font-semibold tracking-wide text-white/80">{label}</span>; }