import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { RootProviders } from "@/providers";
import { t } from "@/shared/i18n";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: t.app.name,
  description: t.app.tagline,
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="en" className={inter.variable}>
    <body className="min-h-screen font-sans antialiased">
      <RootProviders>{children}</RootProviders>
      <Analytics />
    </body>
  </html>
);

export default RootLayout;
