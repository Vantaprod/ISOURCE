# Isource — File Lock Manifest

**Purpose:** Files listed below are production-locked at the version shown.
Future changes must be full-file replacements with version bumps below.

## v1.0.0 — Foundation + Phase 2 storefront
- src/types/catalog.ts
- src/data/*.ts
- src/lib/cn.ts, format.ts, catalog.ts
- src/context/CartContext.tsx
- src/components/ui/*.tsx
- src/components/home/*.tsx
- src/components/layout/AnnouncementBar.tsx, CategoryNav.tsx, MobileMenu.tsx, Footer.tsx
- src/components/product/ProductGrid.tsx
- src/app/cart/page.tsx
- public/images/placeholder.svg

## v1.1.0 — Visual alignment to Isource reference
- src/app/globals.css
- src/app/page.tsx

## v1.2.0 — Product v2, Wishlist, Search, Category v2
- src/context/WishlistContext.tsx
- src/app/search/page.tsx
- src/app/wishlist/page.tsx
- src/app/product/[slug]/ProductGallery.tsx
- src/app/product/[slug]/ProductTabs.tsx
- src/app/product/[slug]/WishlistButton.tsx
- src/app/product/[slug]/page.tsx
- src/app/category/[slug]/page.tsx
- src/app/layout.tsx
- src/components/layout/Header.tsx
- src/components/product/ProductCard.tsx

## v1.3.0 — Checkout UI + Demo boundary
- src/lib/checkout-schema.ts
- src/app/checkout/page.tsx
- src/app/checkout/confirmation/page.tsx

## v1.4.0 — Customer Account & Auth UI
- src/lib/auth-schema.ts ........................ NEW
- src/app/login/page.tsx ........................ NEW
- src/app/register/page.tsx ..................... NEW
- src/app/account/page.tsx ...................... NEW