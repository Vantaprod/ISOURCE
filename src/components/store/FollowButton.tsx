"use client";
import { useState } from "react";
import { toggleFollowStore } from "@/app/actions/store-follow";
import { Heart, Loader2 } from "lucide-react";

export function FollowButton({
  vendorId,
  vendorSlug,
  initialFollowing,
}: {
  vendorId: string;
  vendorSlug: string;
  initialFollowing: boolean;
}) {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const res = await toggleFollowStore(vendorId, vendorSlug);
    if (res.success) setFollowing(res.followed ?? false);
    setLoading(false);
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`h-10 px-5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${
        following
          ? "bg-surface border border-border text-charcoal hover:bg-border/50"
          : "bg-charcoal text-white hover:bg-black"
      }`}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Heart size={16} className={following ? "fill-primary text-primary" : ""} />
      )}
      {following ? "Following" : "Follow Store"}
    </button>
  );
}