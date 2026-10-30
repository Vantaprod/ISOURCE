import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getSession, type SessionPayload } from "@/lib/session";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

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

  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Isource",
              url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
              logo: `${process.env.NEXT_PUBLIC_SITE_URL}/images/logo.png`,
              sameAs: [
                "https://facebook.com/isource",
                "https://twitter.com/isource",
                "https://instagram.com/isource"
              ]
            }),
          }}
        />
        <CartProvider>
          <WishlistProvider>
            <Header user={session} />
            <main className="flex-1">{children}</main>
            <Footer />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}