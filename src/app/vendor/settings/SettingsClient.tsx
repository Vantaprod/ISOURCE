"use client";

import { useActionState } from "react";
import { updateVendorProfile, updateVendorPassword } from "@/app/actions/vendor-settings";

export function SettingsClient({ initialData }: { initialData: any }) {
  const [profileState, profileAction, isProfilePending] = useActionState(updateVendorProfile, null);
  const [passwordState, passwordAction, isPasswordPending] = useActionState(updateVendorPassword, null);

  return (
    <div className="space-y-8">
      {/* Profile Section */}
      <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-surface/50">
          <h2 className="text-lg font-bold text-charcoal">Business Profile</h2>
          <p className="text-sm text-muted">This information appears on your public storefront.</p>
        </div>
        
        <form action={profileAction} className="p-6 space-y-4">
          {profileState?.error && (
            <div className="p-3 bg-danger/10 border border-danger/20 text-danger text-sm rounded-lg">{profileState.error}</div>
          )}
          {profileState?.success && (
            <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-700 text-sm rounded-lg">{profileState.success}</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal mb-1">Store Name *</label>
              <input 
                name="name" 
                defaultValue={initialData.name} 
                required 
                className="h-10 w-full rounded-lg border border-border px-3 text-sm focus:border-primary outline-none" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal mb-1">Contact Email</label>
              <input 
                defaultValue={initialData.email} 
                disabled 
                className="h-10 w-full rounded-lg border border-border px-3 text-sm bg-surface text-muted cursor-not-allowed" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal mb-1">After-Sales / Emergency Phone</label>
            <input 
              name="afterSalesPhone" 
              defaultValue={initialData.afterSalesPhone} 
              placeholder="e.g. 08012345678" 
              className="h-10 w-full rounded-lg border border-border px-3 text-sm focus:border-primary outline-none" 
            />
            <p className="text-xs text-muted mt-1">Displayed on product pages so buyers can contact you for warranty claims.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal mb-1">Store Description</label>
            <textarea 
              name="description" 
              defaultValue={initialData.description} 
              rows={4} 
              placeholder="Tell customers about your business..."
              className="w-full rounded-lg border border-border p-3 text-sm focus:border-primary outline-none resize-none" 
            />
          </div>

          <button 
            type="submit" 
            disabled={isProfilePending}
            className="h-10 px-6 rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary-hover disabled:opacity-50"
          >
            {isProfilePending ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>

      {/* Security Section */}
      <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-surface/50">
          <h2 className="text-lg font-bold text-charcoal">Change Password</h2>
          <p className="text-sm text-muted">Ensure your account is using a long, random password to stay secure.</p>
        </div>
        
        <form action={passwordAction} className="p-6 space-y-4">
          {passwordState?.error && (
            <div className="p-3 bg-danger/10 border border-danger/20 text-danger text-sm rounded-lg">{passwordState.error}</div>
          )}
          {passwordState?.success && (
            <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-700 text-sm rounded-lg">{passwordState.success}</div>
          )}

          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-bold text-charcoal mb-1">Current Password</label>
              <input 
                name="currentPassword" 
                type="password" 
                required 
                className="h-10 w-full rounded-lg border border-border px-3 text-sm focus:border-primary outline-none" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal mb-1">New Password</label>
              <input 
                name="newPassword" 
                type="password" 
                required 
                className="h-10 w-full rounded-lg border border-border px-3 text-sm focus:border-primary outline-none" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal mb-1">Confirm New Password</label>
              <input 
                name="confirmPassword" 
                type="password" 
                required 
                className="h-10 w-full rounded-lg border border-border px-3 text-sm focus:border-primary outline-none" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isPasswordPending}
            className="h-10 px-6 rounded-lg bg-charcoal text-white font-bold text-sm hover:bg-black disabled:opacity-50"
          >
            {isPasswordPending ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}