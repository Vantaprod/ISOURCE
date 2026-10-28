"use client";
import Link from "next/link";
import { useState } from "react";
import { Lock, Mail, User, Phone, AlertTriangle } from "lucide-react";
import { registerSchema, type RegisterFormData } from "@/lib/auth-schema";

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterFormData>({ firstName: "", lastName: "", email: "", phone: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [boundaryHit, setBoundaryHit] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = registerSchema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "_form");
        if (!errs[key]) errs[key] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setBoundaryHit(true);
  }

  return (
    <div className="mx-auto max-w-[420px] px-4 py-12 md:py-20">
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Create an account</h1>
        <p className="text-sm text-muted mt-1">Join Isource to start shopping</p>
      </div>

      <div className="rounded-md border border-warning/30 bg-warning/10 p-3 mb-6 text-xs text-charcoal flex gap-2">
        <AlertTriangle size={16} className="text-warning flex-shrink-0 mt-0.5" />
        <div><strong className="text-warning">Demo UI:</strong> Auth backend is not configured. Submitting will not create an account.</div>
      </div>

      {boundaryHit && (
        <div className="rounded-md border border-primary/30 bg-primary/5 p-4 mb-6 text-sm text-charcoal">
          <p className="font-semibold text-primary mb-1">Registration boundary reached</p>
          <p className="text-xs">Form validated successfully. To enable real registration, configure the database and authentication provider.</p>
        </div>
      )}

      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1">First name</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className={`h-10 w-full rounded border pl-9 pr-3 text-sm bg-white outline-none focus:border-primary ${errors.firstName ? "border-danger" : "border-border"}`} />
            </div>
            {errors.firstName && <p className="text-xs text-danger mt-1">{errors.firstName}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Last name</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className={`h-10 w-full rounded border pl-9 pr-3 text-sm bg-white outline-none focus:border-primary ${errors.lastName ? "border-danger" : "border-border"}`} />
            </div>
            {errors.lastName && <p className="text-xs text-danger mt-1">{errors.lastName}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">Email</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={`h-10 w-full rounded border pl-9 pr-3 text-sm bg-white outline-none focus:border-primary ${errors.email ? "border-danger" : "border-border"}`} placeholder="you@example.com" />
          </div>
          {errors.email && <p className="text-xs text-danger mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">Phone number</label>
          <div className="relative">
            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={`h-10 w-full rounded border pl-9 pr-3 text-sm bg-white outline-none focus:border-primary ${errors.phone ? "border-danger" : "border-border"}`} placeholder="08012345678" />
          </div>
          {errors.phone && <p className="text-xs text-danger mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={`h-10 w-full rounded border pl-9 pr-3 text-sm bg-white outline-none focus:border-primary ${errors.password ? "border-danger" : "border-border"}`} placeholder="At least 8 characters" />
          </div>
          {errors.password && <p className="text-xs text-danger mt-1">{errors.password}</p>}
        </div>

        <button type="submit" className="w-full h-11 rounded bg-primary text-white text-sm font-semibold hover:bg-primary-hover">
          Create account
        </button>

        <p className="text-center text-xs text-muted pt-2">
          Already have an account? <Link href="/login" className="text-primary hover:underline font-medium">Log in</Link>
        </p>
      </form>
    </div>
  );
}