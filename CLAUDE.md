# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Product: AnalogTerraX

Earth analogs for the Moon base and Mars sites. Built for the NASA Space Apps Challenge 2026 ("Identify Earth Locations that Analog the Permanent Moon Base Locations and Mars"), by a team in Riobamba, Ecuador. The hackathon runs 48 hours (14–15 Nov 2026), so keep everything fast, simple and ready to demo.

A one-page dashboard. The user picks a world (Moon/Mars), a target location and an activity, and gets ranked Earth analog sites. Each result says why the site is similar and where the analogy breaks down. The analysis covers **only topography, geology and mineralogy**. Similarity comes from data (slope, roughness, rock type, minerals), never from "looks similar".

### User flow

1. World toggle: Moon / Mars.
2. Target location, chosen from a list (a Moon/Mars map is optional). The list comes from the backend (`planetaryListBodySites`), never hardcoded.
   - Moon (south pole, Artemis candidates): Shackleton connecting ridge, Malapert Massif, Haworth, Mons Mouton, Nobile Rim, de Gerlache Rim.
   - Mars: Jezero crater, Amazonis Planitia, Gale crater.
   - The deployed backend serves a different set today (6 Moon, 6 Mars, 14 Earth, no Ecuador sites): see "Backend findings" in spec 001. The UI shows whatever the API returns.
3. Activity (dropdown or icon cards): rover mobility, drilling/sampling, construction/regolith, EVA field ops, instrument testing, landing/hazard assessment.
4. Results:
   - An Earth map with markers for the top N sites (default 5), colored by score.
   - A ranked list of cards: name, country, overall score 0–100 and T/G/M sub-scores.
   - Clicking a card or marker opens the Detail panel.
5. Optional: three weight sliders (T/G/M), with defaults from the activity. Moving a slider re-queries the backend (debounced).

### Scoring (backend)

The FastAPI backend computes all scores. The frontend sends weights to `POST /api/v1/analogs/search` (`analogsSearchEarthAnalogs`) and renders `ScoreBreakdown` (`overall_pct`, `topography_score`, `geology_score`, `mineralogy_score`). It never computes or re-weights geoscience itself. Default weights per activity live in frontend config until the backend exposes activities:

| Activity | T | G | M |
|---|---|---|---|
| rover | 0.6 | 0.3 | 0.1 |
| drilling | 0.1 | 0.4 | 0.5 |
| construction | 0.3 | 0.4 | 0.3 |
| eva | 0.5 | 0.3 | 0.2 |
| instruments | 0.1 | 0.3 | 0.6 |
| landing | 0.7 | 0.2 | 0.1 |

### Analog Detail panel (the most important view)

- Header: name, country, coordinates, elevation, overall score and a confidence badge (High/Medium/Low).
- Radar or bar chart of T/G/M. Sub-metrics are optional: slope, roughness, rock-type match, silica index, iron oxides, clays.
- "Similar in" and **"Different in"** bullets, derived from `top_contributing_features[].closeness_pct`. "Different in" is always visible and never collapsed.
- "What you could test here": test ideas for the selected activity (frontend activity config).
- Earth image (left) beside the Moon/Mars image (right) at the same scale, with a `scale_label`. Show a placeholder if an image is missing.
- Data sources with links (NASADEM, ASTER GED, EMIT, LOLA, Diviner, MOLA, CRISM…).
- A fixed **"Earth limits"** note, always shown: Earth can't reproduce reduced gravity, the lunar vacuum, the thin Martian atmosphere or space radiation.
- Wording: every site is a **"candidate analog to evaluate"**, never an "official analog".

### Secondary views (only if time allows, in this order)

1. "Known analogs" toggle: grey markers for Atacama, Haughton crater, Death Valley, Iceland, Hawaii and the Antarctic Dry Valleys (`site.is_known_analog`).
2. "New opportunities" filter: high score plus high `novelty`.
3. Andes case study tab: sites near Riobamba (Arenal del Chimborazo, Palmira dunes, Tungurahua/Sangay ash, Chimborazo glaciers, Galápagos lava tubes), with field photos.
4. KML/KMZ/GeoJSON upload, shown on the map only, with no scoring (togeojson + JSZip).
5. Export a site card as an image or PDF.

### Data contract: backend API

`src/client/` (`sdk.gen.ts`, `types.gen.ts`) is generated from the backend OpenAPI spec (`npm run generate:api`). Never edit it by hand. Endpoints used:

| SDK function | Endpoint | Use |
|---|---|---|
| `planetaryListBodySites(body)` | `GET /api/v1/bodies/{body}/sites` | Target and Earth site lists (`PlanetarySite`) |
| `analogsSearchEarthAnalogs(req)` | `POST /api/v1/analogs/search` | Ranked matches with weights, filters, `k` |
| `analogsGetEarthAnalogHeatmap(params)` | `GET /api/v1/analogs/heatmap` | Global score layer |
| `analogsGetLaserProfileComparison(cell, target)` | `GET /api/v1/analogs/{cell}/profile` | ICESat-2 vs LOLA/MOLA profiles |
| `planetaryGetTaxonomy()` | `GET /api/v1/taxonomy` | Feature and lithology labels |
| `systemGetHealth()` | `GET /api/v1/health` | Available in the SDK; not shown in the UI |

- Adding a site or target is a backend data change; it needs **no frontend code change**.
- Not yet in the API (open questions in spec 001): confidence level, images with scale label, data source links, activities. Until then, activities come from frontend config and missing fields show placeholders.
- While the backend serves placeholder data, `NEXT_PUBLIC_DEMO_DATA` shows a **"Demo data" banner**. Never present placeholder numbers as real.

### Demo script the UI must support (~2 min)

1. Moon → Shackleton Crater Rim → Rover mobility: the top analogs appear on the map, with known analogs in grey.
2. Switch to Mars → Arcadia Planitia → Instrument testing: the ranking changes.
3. Open the top Earth analog card: radar chart, similar/different bullets, laser profile.
4. Point to the Earth limits note and the data sources.

### Acceptance criteria

- World + target + activity shows ranked results in under 1 s with a warm backend; slider changes re-query without a reload.
- Every result shows score, similar, different and sources (confidence once the API provides it).
- The demo survives a flaky network: cached responses for the demo path and a clear error state when the backend is unreachable.
- No console errors. `npm run build` builds in one command.

### Out of scope

User accounts, 3D globes, VR, satellite processing in the browser, and calling any site "official".

### Design

Dark, glassy mission-control look (deep-space canvas, glass cards, glowing world hero, ring gauges, icon rails) with lime `#D9F24A` as the single accent and world colors Mars `#EB6834`, Earth `#2A78D6`, Moon `#B8BEC8`. Inter, Lucide icons, no emoji, WCAG AA. Full tokens, layout and components: [docs/design-guidelines.md](docs/design-guidelines.md).

## Workflow (Spec-Driven Development)

GitHub Spec Kit layout. Every feature starts with a spec before code:

1. [.specify/memory/constitution.md](.specify/memory/constitution.md): non-negotiable principles (P1–P8). Read it first.
2. `specs/NNN-feature/spec.md`: what and why (user stories, FRs, success criteria), from `.specify/templates/spec-template.md`.
3. `specs/NNN-feature/plan.md`: how (layers, files, constitution check).
4. `specs/NNN-feature/tasks.md`: ordered `T###` tasks; tick them off as you implement.

Current feature: [specs/001-analog-finder/](specs/001-analog-finder/spec.md).

## Repo state

Next.js 15 (App Router, React 19, TS strict, Tailwind v4) on Vercel, backed by the FastAPI repo `analog-terrax-backend` (expected as a sibling directory, deployed at `https://analog-terrax-backend.vercel.app`). The dashboard is `src/features/analog-finder/` (MVVM, rendered by `src/app/page.tsx`); Dark tokens are in `src/app/globals.css`, strings in `src/shared/i18n`, config in `src/shared/config`.

## Commands

```bash
make             # list targets
make dev         # Next dev server (Turbopack) on :3000
make api         # regenerate src/client from the backend at localhost:8000 (npm run generate:api)
make build       # production build
make start       # build and serve locally
make typecheck   # tsc --noEmit
make domain      # run assert-based *.check.ts files (tsx)
make check       # typecheck + domain + build + react-doctor
make up | down | logs | shell | rebuild   # Docker dev container (Dockerfile.dev, compose.dev.yaml), development only
```

`npm run generate:api:file` regenerates from `../analog-terrax-backend/openapi.json` instead. The browser calls the API directly (not the Next server), so `NEXT_PUBLIC_API_URL` must be reachable from the browser, also when running in Docker. Backend CORS allows `http://localhost:3000` and `https://analog-terrax-frontend.vercel.app` (not `127.0.0.1`). `make rebuild` is needed after changing `package.json`, since the container keeps `node_modules` in a named volume. `npm run lint` needs ESLint, which is not installed. No test runner is configured; domain use cases get assert-based `*.check.ts` files. CI (`.github/workflows/ci.yml`, Node 22) runs `typecheck` and `build` on pushes/PRs to `main` and `develop`, and deploys to Vercel on pushes to `main`.

Env (validated in `src/env.ts`, exposed via `src/shared/config/app-config.ts`): `NEXT_PUBLIC_API_URL` (default `http://localhost:8000`) and `NEXT_PUBLIC_DEMO_DATA` (default `"true"`, shows the "Demo data" banner).

## Architecture

Clean architecture + MVVM, one vertical slice per feature. Full rules, naming and examples: [docs/coding-guidelines.md](docs/coding-guidelines.md).

- `src/features/<feature>/domain/`: entities, pure use cases (e.g. deriving similar/different from feature closeness), repository interfaces. No React or fetch.
- `src/features/<feature>/data/`: repositories that wrap the generated `@/client` SDK, and mappers from API DTOs to domain entities.
- `src/features/<feature>/presentation/`: `use-*-view-model.ts` (state, actions, derived data) and stateless `*.view.tsx`, connected by a `*.screen.tsx`.
- `src/features/<feature>/di.ts`: composition root. Dependency rule: views → view models → domain ← data.
- `src/shared/{ui,i18n,lib,config}`: design-system components, string catalog, `cn()` in `src/shared/lib/cn.ts`, app config. `src/lib/api-client.ts` is the `apiFetch` used by the generated client.
- `src/app/`: thin routing only. `src/providers/`: React Query `QueryClient` (created via `useState` for SSR safety).
- Arrow function components, functional style (no loops), TS strict without `any`, no comments unless essential, all UI strings via i18n.
- Path alias `@/*` → `src/*`. Env vars validated with Zod in `src/env.ts`.
- Quality gates: `npm run typecheck`, `npm run build`, `npx react-doctor@latest`.
