# Analog Terrax — Frontend (`analog-terrax-frontend`)

Scalable Next.js 15 (App Router, TypeScript, Tailwind CSS v4) frontend infrastructure for **Analog Terrax** (NASA Space Apps Challenge), configured for **Vercel (Fluid Compute)**.

## Architecture Highlights
- **`src/app/`**: Thin routing & error boundary layer (`layout.tsx`, `page.tsx`, `error.tsx`, `global-error.tsx`, `not-found.tsx`).
- **`src/features/`**: Feature-sliced domain modules so multiple teammates can build features concurrently without merge conflicts.
- **`src/client/`**: Auto-generated OpenAPI TypeScript SDK synced directly from `analog-terrax-backend`'s `/openapi.json`.
- **`src/providers/`**: SSR-safe `@tanstack/react-query` provider.
- **`src/env.ts`**: Runtime/build-time Zod environment configuration.

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env.local

# 3. Start Next.js development server on port 3000
npm run dev

# 4. Regenerate API client from Backend OpenAPI spec
npm run generate:api
```

## Deploying to Vercel

```bash
vercel link --yes --project analog-terrax-frontend
vercel env add NEXT_PUBLIC_API_URL production
vercel deploy --prod
```
