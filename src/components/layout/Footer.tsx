import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-charcoal text-white/70 mt-12">
      <div className="mx-auto max-w-[1440px] px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image 
                src="/images/logo-white.png" 
                alt="ISOURCE" 
                width={220} 
                height={64} 
                className="h-16 w-auto object-contain -my-2" 
              />
            </Link>
            <p className="text-sm mb-4 max-w-xs">Nigeria&apos;s trusted marketplace for quality products and reliable service.</p>
          </div>

          {/* Links Columns */}
          <div className="col-span-1">
            <h4 className="font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/faqs" className="hover:text-white transition-colors">FAQs</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="font-bold text-white mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/track-order" className="hover:text-white transition-colors">Track Order</Link></li>
              <li><Link href="/returns" className="hover:text-white transition-colors">Returns & Refunds</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping Info</Link></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1 mt-4 md:mt-0">
            <h4 className="font-bold text-white mb-4">Shop With Us</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/sell" className="hover:text-white transition-colors">Sell on Isource</Link></li>
              <li><Link href="/brands" className="hover:text-white transition-colors">Brand Stores</Link></li>
              <li><Link href="/become-partner" className="hover:text-white transition-colors">Become a Partner</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1440px] px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-center md:text-left">© {new Date().getFullYear()} Isource. All rights reserved.</p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link> <Link href="/login" className="hover:text-white transition-colors font-bold text-primary ml-4">Staff Login</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookie Notice</Link>
          </div>
          
          {/* Payment Icons */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="h-6 w-auto min-w-[40px] px-2 bg-white rounded flex items-center justify-center text-[8px] font-bold text-blue-900">VISA</div>
            <div className="h-6 w-10 bg-white rounded flex items-center justify-center">
              <div className="h-3 w-3 bg-red-500 rounded-full mr-[-4px] z-10"></div>
              <div className="h-3 w-3 bg-orange-400 rounded-full"></div>
            </div>
            <div className="h-6 w-auto min-w-[40px] px-2 bg-white rounded flex items-center justify-center text-[8px] font-bold text-blue-700">Verve</div>
            <div className="h-6 w-auto min-w-[40px] px-2 bg-white rounded flex items-center justify-center text-[8px] font-bold text-blue-500">Paystack</div>
            <div className="h-6 w-auto min-w-[40px] px-2 bg-white rounded flex items-center justify-center text-[8px] font-bold text-orange-500">Flutterwave</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
