"use client";
import { useActionState, useState } from "react";

import { loginAction } from "@/app/actions/auth";
import Link from "next/link";
import { LogIn, Eye, EyeOff } from "lucide-react";

export function LoginForm() {
  
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);

  

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-border">
      <div className="p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-charcoal">Welcome Back</h1>
          <p className="text-sm text-muted mt-2">Sign in to your Isource account</p>
        </div>

        <form action={formAction} className="space-y-5">
          {state?.error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100 text-center">
              {state.error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-charcoal mb-2">Email Address</label>
            <input 
              name="email" 
              type="email" 
              required 
              className="w-full h-11 px-4 rounded-lg border border-border bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
              placeholder="you@example.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold text-charcoal">Password</label>
              <Link href="#" className="text-xs font-bold text-primary hover:underline">Forgot?</Link>
            </div>
            <div className="relative">
              <input 
                name="password" 
                type={showPassword ? "text" : "password"} 
                required 
                className="w-full h-11 px-4 pr-12 rounded-lg border border-border bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-charcoal transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            disabled={isPending} 
            type="submit" 
            className="w-full h-11 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover disabled:opacity-50 transition-colors flex items-center justify-center gap-2 mt-2"
          >
            {isPending ? "Signing In..." : <><LogIn size={18} /> Sign In</>}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Don't have an account? <Link href="/register" className="font-bold text-primary hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
}