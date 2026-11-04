"use client";
import { useActionState, useState } from "react";
import { submitReview } from "@/app/actions/reviews";
import { Star, CheckCircle2 } from "lucide-react";

export function ReviewForm({ productId, productSlug }: { productId: string, productSlug: string }) {
  const [state, formAction, isPending] = useActionState(submitReview, null);
  const [rating, setRating] = useState(0);

  if (state?.success) {
    return (
      <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 flex items-center gap-2 text-sm font-bold">
        <CheckCircle2 size={18} /> Thank you! Your review has been published.
      </div>
    );
  }

  return (
    <form action={formAction} className="bg-white p-5 rounded-xl border border-border shadow-sm space-y-4">
      <h3 className="font-bold text-charcoal text-lg">Write a Review</h3>
      {state?.error && <p className="text-xs text-red-500 font-bold">{state.error}</p>}
      
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="productSlug" value={productSlug} />
      <input type="hidden" name="rating" value={rating} />

      <div>
        <label className="block text-sm font-bold text-charcoal mb-2">Your Rating *</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="p-1 hover:scale-110 transition-transform"
            >
              <Star 
                size={24} 
                className={star <= rating ? "fill-primary text-primary" : "fill-border text-border"} 
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-charcoal mb-1">Title *</label>
        <input name="title" required className="w-full h-10 rounded border border-border px-3 text-sm focus:border-primary outline-none" placeholder="e.g. Excellent battery life!" />
      </div>

      <div>
        <label className="block text-sm font-bold text-charcoal mb-1">Review (Optional)</label>
        <textarea name="body" rows={3} className="w-full rounded border border-border p-3 text-sm focus:border-primary outline-none resize-none" placeholder="Tell us what you liked or disliked..." />
      </div>

      <button type="submit" disabled={isPending || rating === 0} className="h-10 px-6 rounded-md bg-charcoal text-white text-sm font-bold hover:bg-black disabled:opacity-50 transition-colors">
        {isPending ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
