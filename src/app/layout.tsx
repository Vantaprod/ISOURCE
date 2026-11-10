import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers"; // Assuming you have a Providers component

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Isource Marketplace",
  description: "Nigeria's trusted marketplace for quality products.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}