import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { headers } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Isource Marketplace",
  description: "Nigeria's trusted marketplace.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  
  // Hide public header/footer on dashboards
  const isDashboard = host.startsWith('admin.') || host.startsWith('logistics.') || host.startsWith('sellers.');

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {!isDashboard && <Header />}
          <main className="min-h-screen">{children}</main>
          {!isDashboard && <Footer />}
        </Providers>
      </body>
    </html>
  );
}