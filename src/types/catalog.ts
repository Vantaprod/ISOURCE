export type CategorySlug = "electronics" | "phones-accessories" | "computers" | "home-kitchen" | "automotive" | "solar-power" | "groceries" | "beauty-personal-care" | "fashion";
export interface Category { slug: CategorySlug; name: string; shortName: string; description: string; icon: string; }
export interface Vendor { slug: string; name: string; isIsource: boolean; location: string; }
export interface ProductSpec { label: string; value: string; }
export interface ProductVariant { id: string; label: string; sku: string; stock: number; priceKobo: number; }
export interface ProductReview { id: string; author: string; rating: 1 | 2 | 3 | 4 | 5; title: string; body: string; createdAt: string; }
export type ProductTag = "flash-deal" | "best-seller" | "recommended" | "new" | "featured";
export interface Product { id: string; slug: string; name: string; shortDescription: string; description: string; category: CategorySlug; vendorSlug: string; sku: string; priceKobo: number; originalPriceKobo?: number; stock: number; images: string[]; specs: ProductSpec[]; variants?: ProductVariant[]; tags: ProductTag[]; rating: number; reviewCount: number; reviews: ProductReview[]; isActive: boolean; isFeatured: boolean; createdAt: string; updatedAt: string; }
export type SortKey = "relevance" | "price-asc" | "price-desc" | "newest" | "popular";