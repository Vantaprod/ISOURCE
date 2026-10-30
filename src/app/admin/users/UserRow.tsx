"use client";
import { useState, useTransition } from "react";
import { updateUserRole } from "./actions";
import type { UserRole } from "@prisma/client";

const ROLES: UserRole[] = ["CUSTOMER", "VENDOR", "ADMIN"];

export function UserRow({ user }: { user: { id: string; name: string; email: string; joined: string; role: UserRole; hasVendorProfile: boolean } }) {
  const [isPending, startTransition] = useTransition();
  const [currentRole, setCurrentRole] = useState(user.role);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newRole = e.target.value as UserRole;
    setCurrentRole(newRole);
    startTransition(async () => {
      await updateUserRole(user.id, newRole);
    });
  }

  return (
    <tr className={`hover:bg-surface/30 transition-colors ${isPending ? "opacity-50" : ""}`}>
      <td className="px-5 py-4">
        <p className="font-semibold text-charcoal">{user.name}</p>
        {user.hasVendorProfile && <span className="text-[10px] text-primary font-bold">Has Store</span>}
      </td>
      <td className="px-5 py-4 text-muted">{user.email}</td>
      <td className="px-5 py-4 text-muted">{new Date(user.joined).toLocaleDateString("en-NG", { dateStyle: "medium" })}</td>
      <td className="px-5 py-4">
        <select
          value={currentRole}
          onChange={handleChange}
          disabled={isPending}
          className={`h-8 rounded border border-border px-2 text-xs font-bold ${
            currentRole === "ADMIN" ? "bg-charcoal text-white" :
            currentRole === "VENDOR" ? "bg-primary/10 text-primary border-primary/20" :
            "bg-surface text-charcoal"
          }`}
        >
          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </td>
    </tr>
  );
}