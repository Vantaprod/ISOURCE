import Link from "next/link";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

const TABS = [
  { href: "/vendor/advertising", label: "Overview" },
  { href: "/vendor/advertising/campaigns", label: "Campaigns" },
  { href: "/vendor/advertising/create", label: "Create" },
  { href: "/vendor/advertising/wallet", label: "Wallet" },
  { href: "/vendor/advertising/reports", label: "Reports" },
];

export default async function AdvertisingLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.role !== "VENDOR") redirect("/login");

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-charcoal">Advertising Centre</h1>
        <p className="text-sm text-muted mt-1">Promote products, grow visibility, track performance.</p>
      </div>

      <nav className="border-b border-border mb-6 flex gap-1 overflow-x-auto">
        {TABS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="px-4 py-2.5 text-sm font-semibold text-charcoal hover:text-primary hover:border-primary border-b-2 border-transparent transition-colors whitespace-nowrap"
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {children}
    </div>
  );
}