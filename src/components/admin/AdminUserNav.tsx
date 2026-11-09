"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, LogOut, User, Store } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";

export function AdminUserNav({ name, email, role }: { name: string; email: string; role: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const initials = name ? name.substring(0, 2).toUpperCase() : "AD";

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center gap-2 hover:bg-surface p-1.5 rounded-lg transition-colors"
      >
        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
          {initials}
        </div>
        <div className="text-left hidden md:block">
          <p className="text-sm font-bold text-charcoal leading-tight">{name || "Admin"}</p>
          <p className="text-xs text-muted leading-tight">{role === "ADMIN" ? "Super Admin" : role}</p>
        </div>
        <ChevronDown size={14} className="text-muted hidden md:block" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 bg-white border border-border rounded-md shadow-lg py-1 z-50">
            <div className="px-4 py-2 border-b border-border">
              <p className="text-sm font-bold text-charcoal truncate">{name}</p>
              <p className="text-xs text-muted truncate">{email}</p>
            </div>
            
            <Link href="/admin" className="block px-4 py-2 text-sm text-charcoal hover:bg-surface hover:text-primary">
              Admin Dashboard
            </Link>
            
            <Link href="/" className="block px-4 py-2 text-sm text-charcoal hover:bg-surface hover:text-primary flex items-center gap-2">
              <Store size={14} /> Exit to Storefront
            </Link>

            <div className="border-t border-border mt-1">
              <form action={logoutAction}>
                <button type="submit" className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-danger/10 flex items-center gap-2">
                  <LogOut size={14} /> Log out
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}