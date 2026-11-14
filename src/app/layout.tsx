import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { RootProviders } from "@/providers";
import { t } from "@/shared/i18n";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: t.app.name,
  description: t.app.tagline,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className="min-h-screen font-sans text-slate-100 antialiased">
        <RootProviders>
          <AppHeader />
          <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
        </RootProviders>
      </body>
    </html>
  );
}
