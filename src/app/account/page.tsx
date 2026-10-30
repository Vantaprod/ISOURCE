import Link from "next/link";
import { Package, User, MapPin, Settings, LogOut } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatNairaShort } from "@/lib/format";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";

type OrderWithItems = Awaited<ReturnType<typeof prisma.order.findMany<{ include: { items: true } }>>>[number];

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  let userOrders: OrderWithItems[] = [];
  try {
    userOrders = await prisma.order.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });
  } catch (e) {
    console.error("Failed to fetch user orders:", e);
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 md:py-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">My Account</h1>

      <div className="grid md:grid-cols-[240px_1fr] gap-6">
        <aside>
          <nav className="rounded-lg border border-border bg-white overflow-hidden">
            <div className="w-full flex items-center gap-2 px-4 py-3 text-sm text-left border-l-2 border-primary bg-primary/5 text-primary font-semibold">
              <Package size={16} /> Orders
            </div>
            <div className="w-full flex items-center gap-2 px-4 py-3 text-sm text-left border-l-2 border-transparent text-charcoal hover:bg-surface cursor-not-allowed opacity-50">
              <User size={16} /> Profile (coming soon)
            </div>
            <div className="w-full flex items-center gap-2 px-4 py-3 text-sm text-left border-l-2 border-transparent text-charcoal hover:bg-surface cursor-not-allowed opacity-50">
              <MapPin size={16} /> Addresses
            </div>
            <div className="w-full flex items-center gap-2 px-4 py-3 text-sm text-left border-l-2 border-transparent text-charcoal hover:bg-surface cursor-not-allowed opacity-50">
              <Settings size={16} /> Settings
            </div>
            <div className="border-t border-border mt-2 pt-2">
              <Link href="/wishlist" className="w-full flex items-center gap-2 px-4 py-3 text-sm text-left text-charcoal hover:bg-surface">
                My Wishlist
              </Link>
              <form action={logoutAction}>
                <button type="submit" className="w-full flex items-center gap-2 px-4 py-3 text-sm text-left text-danger hover:bg-danger/5">
                  <LogOut size={16} /> Log out
                </button>
              </form>
            </div>
          </nav>
        </aside>

        <main className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent Orders</h2>
            <p className="text-sm text-muted">{session.email}</p>
          </div>
          
          {userOrders.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-10 text-center">
              <Package className="mx-auto text-muted mb-3" size={32} />
              <p className="text-charcoal font-medium">No orders yet</p>
              <p className="text-sm text-muted mt-1">Orders placed through checkout will appear here.</p>
              <Link href="/" className="inline-block mt-4 h-10 px-4 leading-10 rounded bg-primary text-white text-sm font-medium hover:bg-primary-hover">Start shopping</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {userOrders.map((order) => (
                <div key={order.id} className="rounded-lg border border-border bg-white overflow-hidden">
                  <div className="p-4 border-b border-border flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-mono font-semibold text-charcoal text-sm">#{order.orderNumber}</p>
                      <p className="text-xs text-muted mt-0.5">{order.createdAt.toLocaleDateString("en-NG", { dateStyle: "medium", timeStyle: "short" })}</p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-warning/10 text-warning px-2.5 py-1 text-xs font-semibold">Not paid (demo)</span>
                  </div>
                  <ul className="divide-y divide-border">
                    {order.items.map((it) => (
                      <li key={it.id} className="flex items-center justify-between gap-3 p-3 text-sm">
                        <div className="min-w-0">
                          <p className="text-charcoal line-clamp-1">{it.productName}</p>
                          <p className="text-xs text-muted">Qty {it.qty}{it.variantLabel ? ` · ${it.variantLabel}` : ""}</p>
                        </div>
                        <p className="font-semibold whitespace-nowrap">{formatNairaShort(it.lineTotalKobo)}</p>
                      </li>
                    ))}
                  </ul>
                  <div className="p-4 border-t border-border flex flex-wrap items-center justify-between text-sm font-semibold bg-surface">
                    <span>Total</span>
                    <div className="flex items-center gap-4">
                      <span>{formatNairaShort(order.totalKobo)}</span>
                      <Link href={`/checkout/confirmation/${order.orderNumber}`} className="text-primary hover:underline text-xs font-medium">View receipt</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}