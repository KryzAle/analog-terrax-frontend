# AnalogTerraX — Frontend

Earth analogs for the Moon base and Mars sites. NASA Space Apps Challenge 2026.

Next.js 15 (App Router, TypeScript, Tailwind CSS v4) dashboard on Vercel, backed by the FastAPI service [`analog-terrax-backend`](https://analog-terrax-backend.vercel.app) through an OpenAPI-generated client in `src/client/`.

## Docs

- [Constitution](.specify/memory/constitution.md): project principles
- [Design guidelines](docs/design-guidelines.md)
- [Coding guidelines](docs/coding-guidelines.md): clean architecture + MVVM
- [Spec 001: Analog finder](specs/001-analog-finder/spec.md)

## Local development

```bash
cp .env.example .env.local
make install
make dev        # http://localhost:3000, expects the backend on http://localhost:8000
make api        # regenerate src/client from the running backend
```

Or in Docker (development only):

```bash
make up         # http://localhost:3000, hot reload; reaches a host backend at host.docker.internal:8000
make logs
make down
make rebuild    # after changing package.json
```

Run `make` to list all targets. `make check` runs typecheck, build and react-doctor.

## Environment

| Variable | Default | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Backend base URL |
| `NEXT_PUBLIC_DEMO_DATA` | `true` | Shows the "Demo data" banner while the backend serves placeholder data |

## Deploying to Vercel

Pushes to `main` deploy through CI. Manually:

```bash
vercel link --yes --project analog-terrax-frontend
vercel env add NEXT_PUBLIC_API_URL production
vercel deploy --prod
```
