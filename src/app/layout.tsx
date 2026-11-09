export const dynamic = "force-dynamic";

import { headers } from "next/headers";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { headers } from "next/headers";
import { FestivalTeaser } from "@/components/layout/FestivalTeaser";
import { headers } from "next/headers";
import { VisitTracker } from "@/components/analytics/VisitTracker";
import type { Metadata } from "next";
import "./globals.css";
import { headers } from "next/headers";
import { CartProvider } from "@/context/CartContext";
import { headers } from "next/headers";
import { WishlistProvider } from "@/context/WishlistContext";
import { headers } from "next/headers";
import { ToastProvider } from "@/context/ToastContext";
import { headers } from "next/headers";
import { CampaignProvider } from "@/context/CampaignContext";
import { headers } from "next/headers";
import { Header } from "@/components/layout/Header";
import { headers } from "next/headers";
import { Footer } from "@/components/layout/Footer";
import { headers } from "next/headers";
import { getSession, type SessionPayload } from "@/lib/session";
import { headers } from "next/headers";
import { getActiveCampaign, darkenColor } from "@/lib/campaign";

export const metadata: Metadata = {
  
  title: { default: "Isource — Nigeria's multi-vendor marketplace", template: "%s · Isource" },
  description: "Shop electronics, phones, solar, home, groceries, fashion and more on Isource — Nigeria's trusted multi-vendor marketplace.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const isDashboard = host.startsWith('admin.') || host.startsWith('logistics.') || host.startsWith('sellers.');

  let session: SessionPayload | null = null;
  try {
    session = await getSession();
  } catch (e) {
    console.error("Session error in layout:", e);
  }

  const activeCampaign = await getActiveCampaign();
  const themeColor = activeCampaign?.themeColor || "#F07824";
  const themeColorHover = activeCampaign?.themeColor ? darkenColor(activeCampaign.themeColor) : "#DE6718";

  return (
    <html lang="en">
      <body 
        className="min-h-screen flex flex-col bg-white font-sans"
        style={{ 
          "--theme-cta": themeColor,
          "--theme-cta-hover": themeColorHover 
        } as React.CSSProperties}
      >
        <FestivalTeaser />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Isource",
              url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
            }),
          }}
        />
        <CampaignProvider campaign={activeCampaign}>
          <CartProvider>
            <WishlistProvider>
              <ToastProvider>
                <Header user={session} />
                <main className="grow">{children}</main>
                {!isDashboard && <Footer />}
              </ToastProvider>
            </WishlistProvider>
          </CartProvider>
        </CampaignProvider>
              
              <VisitTracker />
              <CookieConsent />
      </body>
    </html>
  );
}