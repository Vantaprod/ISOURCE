import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
export const metadata: Metadata = { title: { default: "Isource — Nigeria's multi-vendor marketplace", template: "%s · Isource" }, description: "Shop electronics, phones, solar, home, groceries, fashion and more on Isource — Nigeria's trusted multi-vendor marketplace." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en" className={inter.variable}><body className="min-h-screen flex flex-col bg-white"><CartProvider><Header /><main className="flex-1">{children}</main><Footer /></CartProvider></body></html>);
}