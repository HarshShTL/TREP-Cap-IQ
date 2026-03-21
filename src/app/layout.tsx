import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";
import { AppProviders } from "@/components/app-providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "TREP Cap IQ",
  description: "Investor relations platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("theme", inter.variable)} suppressHydrationWarning>
      <body className={cn("min-h-screen font-sans antialiased")}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
