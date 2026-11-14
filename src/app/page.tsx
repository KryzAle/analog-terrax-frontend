import { ApiStatusBadge } from "@/features/system-status/components/api-status-badge";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-sky-400">
          System Foundation Ready
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
          Analog Terrax Platform Infrastructure
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-400">
          Multi-repository architecture connecting Next.js App Router on Vercel
          with a stateless FastAPI service via auto-generated OpenAPI TypeScript
          contracts.
        </p>
      </section>

      <ApiStatusBadge />
    </div>
  );
}
