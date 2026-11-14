"use client";

import { t } from "@/shared/i18n";

type ErrorBoundaryProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const ErrorBoundary = ({ error, reset }: ErrorBoundaryProps) => (
  <main className="mx-auto max-w-md px-6 py-16">
    <div className="rounded-card border border-danger/40 bg-surface p-6 backdrop-blur-xl">
      <h2 className="text-lg font-semibold text-danger">{t.errors.title}</h2>
      <p className="mt-1 text-sm text-text-muted">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 rounded-full bg-lime px-4 py-2 text-xs font-semibold text-space"
      >
        {t.errors.retry}
      </button>
    </div>
  </main>
);

export default ErrorBoundary;
