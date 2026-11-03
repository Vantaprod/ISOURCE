export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { MapPin, Plus } from "lucide-react";
import Link from "next/link";

export default async function AddressesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const addresses = await prisma.address.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">My Addresses</h1>
          <p className="text-sm text-muted">Manage your delivery locations.</p>
        </div>
        <button className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-hover">
          <Plus size={16} /> Add New Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-white p-12 text-center">
          <MapPin size={40} className="mx-auto text-muted mb-4" />
          <h2 className="text-lg font-bold text-charcoal mb-2">No addresses saved</h2>
          <p className="text-sm text-muted mb-4">Add an address to speed up your checkout process.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((addr) => (
            <div key={addr.id} className="rounded-xl border border-border bg-white p-5 relative">
              {addr.isDefault && (
                <span className="absolute top-4 right-4 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                  Default
                </span>
              )}
              <h3 className="font-bold text-charcoal mb-2">{addr.firstName} {addr.lastName}</h3>
              <p className="text-sm text-muted mb-1">{addr.street}</p>
              <p className="text-sm text-muted mb-4">{addr.city}, {addr.state}</p>
              <p className="text-sm font-medium text-charcoal mb-4">{addr.phone}</p>
              
              <div className="flex gap-3 border-t border-border pt-4">
                <button className="text-sm font-bold text-primary hover:underline">Edit</button>
                <button className="text-sm font-bold text-danger hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}