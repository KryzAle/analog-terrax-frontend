"use client";

import { t } from "@/shared/i18n";
import "./globals.css";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const GlobalError = ({ error, reset }: GlobalErrorProps) => (
  <html lang="en">
    <body className="flex min-h-screen items-center justify-center p-6">
      <div className="max-w-md rounded-card border border-danger/40 bg-surface-solid p-6">
        <h2 className="text-lg font-semibold text-danger">{t.errors.criticalTitle}</h2>
        <p className="mt-2 text-sm text-text-muted">{error.message}</p>
        <button
          type="button"
          onClick={reset}
          className="mt-4 rounded-full bg-lime px-4 py-2 text-xs font-semibold text-space"
        >
          {t.errors.reload}
        </button>
      </div>
    </body>
  </html>
);

export default GlobalError;
