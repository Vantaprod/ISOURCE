# Isource — File Lock Manifest

**Purpose:** Files listed below are production-locked at the version shown.
Future changes must be full-file replacements with version bumps below.

## v1.0.0 — Foundation + Phase 2 storefront
- src/types/catalog.ts
- src/data/categories.ts, src/data/vendors.ts, src/data/products.ts
- src/lib/cn.ts, src/lib/format.ts, src/lib/catalog.ts
- src/context/CartContext.tsx
- src/components/ui/Button.tsx, Badge.tsx, Price.tsx, Countdown.tsx
- src/components/home/Hero.tsx, CategoryStrip.tsx, FlashDealsSection.tsx
- src/components/home/PromotionBanner.tsx, CategoryBanner.tsx, TrustBar.tsx, Newsletter.tsx
- src/components/layout/AnnouncementBar.tsx, CategoryNav.tsx, MobileMenu.tsx, Footer.tsx
- src/components/product/ProductGrid.tsx
- src/app/product/[slug]/AddToCart.tsx
- src/app/cart/page.tsx
- public/images/placeholder.svg

## v1.1.0 — Visual alignment to Isource reference
- src/app/globals.css
- src/app/page.tsx (superseded by v1.1.0 update)
- src/components/layout/AnnouncementBar.tsx, CategoryNav.tsx, Footer.tsx
- src/components/home/*.tsx
- src/components/product/ProductCard.tsx (superseded by v1.2.0)

## v1.2.0 — Product v2, Wishlist, Search, Category v2
- src/context/WishlistContext.tsx ............... NEW
- src/app/search/page.tsx ....................... NEW
- src/app/wishlist/page.tsx ..................... NEW
- src/app/product/[slug]/ProductGallery.tsx ...... NEW
- src/app/product/[slug]/ProductTabs.tsx ........ NEW
- src/app/product/[slug]/WishlistButton.tsx ..... NEW
- src/app/product/[slug]/page.tsx ............... REPLACED
- src/app/category/[slug]/page.tsx .............. REPLACED
- src/app/layout.tsx ............................ REPLACED
- src/components/layout/Header.tsx .............. REPLACED
- src/components/product/ProductCard.tsx ........ REPLACED

## v1.3.0 — Checkout UI + Demo boundary
- src/lib/checkout-schema.ts .................... NEW
- src/app/checkout/page.tsx ..................... NEW
- src/app/checkout/confirmation/page.tsx ........ NEW