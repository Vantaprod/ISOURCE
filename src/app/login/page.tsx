"use client";
import Link from "next/link";
import { useActionState, useState } from "react";
import { Lock, Mail, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { loginAction } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mx-auto max-w-[420px] px-4 py-12 md:py-20">
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Welcome back</h1>
        <p className="text-sm text-muted mt-1">Log in to your Isource account</p>
      </div>

      {state?.error && (
        <div className="rounded-md border border-danger/30 bg-danger/10 p-3 mb-6 text-sm text-danger flex items-center gap-2">
          <AlertTriangle size={16} /> {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div>
          <label className="block text-xs font-medium mb-1">Email</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input name="email" type="email" required className="h-10 w-full rounded border border-border pl-9 pr-3 text-sm bg-white outline-none focus:border-primary" placeholder="you@example.com" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input 
              name="password" 
              type={showPassword ? "text" : "password"} 
              required 
              className="h-10 w-full rounded border border-border pl-9 pr-10 text-sm bg-white outline-none focus:border-primary" 
              placeholder="••••••••" 
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-charcoal focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-charcoal/80">
            <input type="checkbox" /> Remember me
          </label>
          <Link href="/forgot-password" className="text-primary hover:underline">Forgot password?</Link>
        </div>

        <button type="submit" disabled={isPending} className="w-full h-11 rounded bg-primary text-white text-sm font-semibold hover:bg-primary-hover disabled:opacity-70 disabled:cursor-not-allowed">
          {isPending ? "Logging in..." : "Log in"}
        </button>

        <p className="text-center text-xs text-muted pt-2">
          {"Don't have an account? "}
          <Link href="/register" className="text-primary hover:underline font-medium">Create one</Link>
        </p>
      </form>
    </div>
  );
}