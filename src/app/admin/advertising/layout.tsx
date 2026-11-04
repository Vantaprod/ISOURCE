import Link from "next/link";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

const TABS = [
  { href: "/admin/advertising", label: "Overview" },
  { href: "/admin/advertising/campaigns", label: "Campaigns" },
  { href: "/admin/advertising/placements", label: "Placements & Pricing" },
  { href: "/admin/advertising/featured", label: "Featured Placements" },
];

export default async function AdminAdvertisingLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-charcoal">Advertising Control Centre</h1>
          <p className="text-sm text-muted mt-1">Manage revenue, campaigns, and placement pricing.</p>
        </div>
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