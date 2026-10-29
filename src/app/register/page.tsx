"use client";
import Link from "next/link";
import { useActionState } from "react";
import { Lock, Mail, User, Phone, AlertTriangle } from "lucide-react";
import { registerAction } from "@/app/actions/auth";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, null);

  return (
    <div className="mx-auto max-w-[420px] px-4 py-12 md:py-20">
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Create an account</h1>
        <p className="text-sm text-muted mt-1">Join Isource to start shopping</p>
      </div>

      {state?.error && (
        <div className="rounded-md border border-danger/30 bg-danger/10 p-3 mb-6 text-sm text-danger flex items-center gap-2">
          <AlertTriangle size={16} /> {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1">First name</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input name="firstName" type="text" required className="h-10 w-full rounded border border-border pl-9 pr-3 text-sm bg-white outline-none focus:border-primary" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Last name</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input name="lastName" type="text" required className="h-10 w-full rounded border border-border pl-9 pr-3 text-sm bg-white outline-none focus:border-primary" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">Email</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input name="email" type="email" required className="h-10 w-full rounded border border-border pl-9 pr-3 text-sm bg-white outline-none focus:border-primary" placeholder="you@example.com" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">Phone number</label>
          <div className="relative">
            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input name="phone" type="tel" required className="h-10 w-full rounded border border-border pl-9 pr-3 text-sm bg-white outline-none focus:border-primary" placeholder="08012345678" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input name="password" type="password" required className="h-10 w-full rounded border border-border pl-9 pr-3 text-sm bg-white outline-none focus:border-primary" placeholder="At least 8 characters" />
          </div>
        </div>

        <button type="submit" disabled={isPending} className="w-full h-11 rounded bg-primary text-white text-sm font-semibold hover:bg-primary-hover disabled:opacity-70 disabled:cursor-not-allowed">
          {isPending ? "Creating account..." : "Create account"}
        </button>

        <p className="text-center text-xs text-muted pt-2">
          Already have an account? <Link href="/login" className="text-primary hover:underline font-medium">Log in</Link>
        </p>
      </form>
    </div>
  );
}