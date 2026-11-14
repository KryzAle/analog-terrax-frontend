import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { RootProviders } from "@/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Analog Terrax",
  description: "Scalable Next.js & FastAPI infrastructure for NASA Space Apps Challenge",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <RootProviders>
          <AppHeader />
          <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
        </RootProviders>
      </body>
    </html>
  );
}
