"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-slate-100">
        <div className="max-w-md rounded-xl border border-rose-900/60 bg-slate-900 p-6">
          <h2 className="text-lg font-semibold text-rose-300">Critical Application Error</h2>
          <p className="mt-2 text-sm text-slate-400">{error.message}</p>
          <button
            type="button"
            onClick={() => reset()}
            className="mt-4 rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
