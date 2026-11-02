import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ToastProvider } from "@/context/ToastContext";
import { CampaignProvider } from "@/context/CampaignContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getSession, type SessionPayload } from "@/lib/session";
import { getActiveCampaign, darkenColor } from "@/lib/campaign";

export const metadata: Metadata = {
  
  
  title: { default: "Isource — Nigeria's multi-vendor marketplace", template: "%s · Isource" },
  description: "Shop electronics, phones, solar, home, groceries, fashion and more on Isource — Nigeria's trusted multi-vendor marketplace.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
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
                <Footer />
              </ToastProvider>
            </WishlistProvider>
          </CartProvider>
        </CampaignProvider>
      </body>
    </html>
  );
}