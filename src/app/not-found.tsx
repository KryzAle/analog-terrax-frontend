import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <h2 className="text-2xl font-bold text-slate-100">404 — Route Not Found</h2>
      <p className="mt-2 text-sm text-slate-400">
        The requested resource could not be found.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-500"
      >
        Return Home
      </Link>
    </div>
  );
}
