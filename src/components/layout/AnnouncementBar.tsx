import Link from "next/link";
export function AnnouncementBar() {
  return (
    <div className="bg-primary text-white text-xs md:text-sm">
      <div className="mx-auto max-w-[1440px] px-4 h-9 flex items-center justify-between gap-4">
        <p className="truncate">Free delivery on orders above <span className="font-semibold">₦50,000</span><span className="mx-2 hidden md:inline">|</span><span className="hidden md:inline">Shop now, pay later with Paystack &amp; Flutterwave</span></p>
        <div className="flex items-center gap-4 flex-shrink-0"><Link href="/orders/track" className="hover:underline hidden sm:inline">Track Order</Link><Link href="/help" className="hover:underline hidden sm:inline">Help</Link></div>
      </div>
    </div>
  );
}