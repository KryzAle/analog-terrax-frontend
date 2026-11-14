"use client";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-xl border border-rose-900/60 bg-rose-950/30 p-6">
      <h2 className="text-lg font-semibold text-rose-200">Something went wrong</h2>
      <p className="mt-1 text-sm text-rose-300/80">{error.message}</p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-4 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500"
      >
        Try again
      </button>
    </div>
  );
}
