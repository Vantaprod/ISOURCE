import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const VisaIcon = () => (<svg viewBox="0 0 100 32" className="h-4 w-auto"><text x="50" y="24" fill="#1A1F71" fontSize="28" fontWeight="900" fontStyle="italic" textAnchor="middle" fontFamily="Arial">VISA</text></svg>);
const MastercardIcon = () => (<svg viewBox="0 0 24 16" className="h-5 w-auto"><circle cx="7.5" cy="8" r="7.5" fill="#EB001B"/><circle cx="16.5" cy="8" r="7.5" fill="#F79E1B"/><path d="M12 2.5C10 3.8 8.8 5.8 8.8 8C8.8 10.2 10 12.2 12 13.5C14 12.2 15.2 10.2 15.2 8C15.2 5.8 14 3.8 12 2.5Z" fill="#FF5F00"/></svg>);
const VerveIcon = () => (<svg viewBox="0 0 80 20" className="h-5 w-auto"><text x="0" y="15" fill="#004B87" fontSize="18" fontWeight="900" fontFamily="system-ui">Verve</text></svg>);
const PaystackIcon = () => (<svg viewBox="0 0 60 16" className="h-4 w-auto"><rect width="60" height="16" rx="2" fill="#00C3F7"/><path d="M10 4H5V6H10V4Z" fill="white"/><path d="M10 7H5V9H10V7Z" fill="white"/><path d="M10 10H5V12H10V10Z" fill="white"/><text x="13" y="12" fill="white" fontSize="9" fontWeight="bold">Paystack</text></svg>);
const FlutterwaveIcon = () => (<svg viewBox="0 0 80 16" className="h-4 w-auto"><path d="M4 14L8 2H11L7 14H4Z" fill="#FBB040"/><path d="M9 14L13 2H16L12 14H9Z" fill="#FBB040"/><text x="18" y="12" fill="#FBB040" fontSize="11" fontWeight="bold">Flutterwave</text></svg>);

export function Footer() {
  return (
    <footer className="bg-charcoal-deep text-white/70">
      <div className="mx-auto max-w-[1440px] px-4 py-12">
        <div className="grid gap-8 md:gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image src="/images/logo-white.png" alt="Isource" width={140} height={40} className="h-10 w-auto object-contain" />
            </Link>
            <p className="text-sm mb-4">{"Nigeria's trusted marketplace for quality products and reliable service."}</p>
            <div className="flex items-center gap-4">
              <Link href="#" className="hover:text-primary"><Facebook size={20} /></Link>
              <Link href="#" className="hover:text-primary"><Twitter size={20} /></Link>
              <Link href="#" className="hover:text-primary"><Instagram size={20} /></Link>
              <Link href="#" className="hover:text-primary"><Youtube size={20} /></Link>
              <Link href="#" className="hover:text-primary"><TikTokIcon /></Link>
            </div>
          </div>

          <div>
            <h4 className="text-white text-sm font-bold mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
              <li><Link href="/help" className="hover:text-primary">How It Works</Link></li>
              <li><Link href="/help/faqs" className="hover:text-primary">FAQs</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-bold mb-4">Customer Service</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/help" className="hover:text-primary">Help Center</Link></li>
              <li><Link href="/orders/track" className="hover:text-primary">Track Order</Link></li>
              <li><Link href="/returns" className="hover:text-primary">Returns & Refunds</Link></li>
              <li><Link href="/delivery" className="hover:text-primary">Shipping Info</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-bold mb-4">Shop With Us</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/sell" className="hover:text-primary">Sell on Isource</Link></li>
              <li><Link href="/vendors" className="hover:text-primary">Brand Stores</Link></li>
              <li><Link href="/sell" className="hover:text-primary">Become a Partner</Link></li>
              <li><Link href="/about" className="hover:text-primary">Careers</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1440px] px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>&copy; {new Date().getFullYear()} Isource. All rights reserved.</p>
          <div className="flex items-center gap-4 text-white/50">
            <Link href="/terms" className="hover:text-white">Terms & Conditions</Link>
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/cookies" className="hover:text-white">Cookie Notice</Link>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 items-center justify-center rounded bg-white px-2"><VisaIcon /></span>
            <span className="inline-flex h-7 items-center justify-center rounded bg-white px-2"><MastercardIcon /></span>
            <span className="inline-flex h-7 items-center justify-center rounded bg-white px-2"><VerveIcon /></span>
            <span className="inline-flex h-7 items-center justify-center rounded bg-white px-2"><PaystackIcon /></span>
            <span className="inline-flex h-7 items-center justify-center rounded bg-white px-2"><FlutterwaveIcon /></span>
          </div>
        </div>
      </div>
    </footer>
  );
}