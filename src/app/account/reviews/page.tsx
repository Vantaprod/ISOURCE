import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Star, Package } from "lucide-react";
import Link from "next/link";

export default async function ReviewsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const reviews = await prisma.productReview.findMany({
    where: { userId: session.userId },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">My Reviews</h1>
        <p className="text-sm text-muted">Products you have reviewed.</p>
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-white p-12 text-center">
          <Star size={40} className="mx-auto text-muted mb-4" />
          <h2 className="text-lg font-bold text-charcoal mb-2">No reviews yet</h2>
          <p className="text-sm text-muted mb-4">When you buy and review products, they will appear here.</p>
          <Link href="/" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-bold text-white hover:bg-primary-hover">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-xl border border-border bg-white p-5">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-md bg-surface flex items-center justify-center flex-shrink-0">
                  <Package className="text-muted" size={24} />
                </div>
                <div className="flex-1">
                  <Link href={`/product/${review.product.slug}`} className="font-bold text-charcoal hover:text-primary">
                    {review.product.name}
                  </Link>
                  <div className="flex items-center gap-1 mt-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < review.rating ? "fill-primary text-primary" : "fill-border text-border"} />
                    ))}
                    <span className="text-xs text-muted ml-2">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-charcoal/80">{review.body || "No written review."}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}