# Implementation plan: 001 Analog finder dashboard

**Spec:** [./spec.md](./spec.md)

## Technical context

- **Stack:** Next.js 15 App Router on Vercel, React 19, TypeScript strict, Tailwind v4, `@tanstack/react-query`, `lucide-react`, Zod (env and config).
- **Backend:** FastAPI `analog-terrax-backend` (`https://analog-terrax-backend.vercel.app`), reached through the generated SDK in `src/client/` and `apiFetch` in `src/lib/api-client.ts`.
- **New dependencies:** `maplibre-gl` (Earth map, free basemap), `chart.js` + `react-chartjs-2` (radar). No others.
- **Existing code:** the team's `src/features/analog-explorer/` (a 655-line dashboard component, a laser profile chart and query hooks) and `src/features/system-status/` (health badge). They work today and are migrated into the MVVM layers below, not rewritten from scratch.
- **Performance goals:** results < 1 s with a warm backend; slider re-query debounced at ~300 ms.

## Constitution check

| Principle | Status | Note |
|---|---|---|
| P1 Data-driven | pass | Sites and scores from the API; activities from a config file |
| P2 Honest results | pass | "Different in" and Earth limits are fixed slots; Demo banner from env flag |
| P3 Resilient demo | pass | React Query cache (`gcTime` long, `retry: 1`) for the demo path; error state with retry |
| P4 Backend scoring | pass | Weights sent to `/analogs/search`; no client re-weighting |
| P5 Clean architecture + MVVM | pass | Layering below |
| P6 Accessible | pass | Ranked list is the keyboard equivalent of the map; native range inputs |
| P7 Lean | pass | US4/US5 only after US1–US3 work |
| P8 Consistent UI | pass | Tokens and components from design guidelines |

## API usage

| Need | SDK function | Notes |
|---|---|---|
| Target list per world | `planetaryListBodySites("moon" \| "mars")` | Cached for the session |
| Ranked analogs | `analogsSearchEarthAnalogs({ target_body, target_site_id, weights, k })` | Query key includes weights |
| Laser profile | `analogsGetLaserProfileComparison(earthCellId, targetSiteId)` | Loaded when the drawer opens |
| Feature labels | `planetaryGetTaxonomy()` | Labels and units for similar/different bullets |
| Backend status | `systemGetHealth()` | Existing badge |

## Layer breakdown

| Layer | Files (`src/features/analog-finder/`) | Responsibility |
|---|---|---|
| Domain | `domain/entities/*.ts` | `World`, `Target`, `EarthSite`, `Activity`, `Weights`, `AnalogMatch`, `FeatureComparison` |
| Domain | `domain/use-cases/split-similar-different.ts` (+ `.check.ts`) | Pure: classify features by `closeness_pct` thresholds |
| Domain | `domain/repositories/*.ts` | `SiteRepository`, `AnalogSearchRepository`, `ProfileRepository` interfaces |
| Data | `data/repositories/api-*.repository.ts` | Wrap `@/client` SDK functions |
| Data | `data/mappers/*.mapper.ts` | `PlanetarySite` / `AnalogMatchResult` → domain entities |
| Config | `src/shared/config/activities.ts` | Activities with default weights, icons and test ideas |
| DI | `di.ts` | Exports repository instances |
| View models | `presentation/view-models/use-selection-view-model.ts` | World, target, activity, weights; reset weights on activity change |
| View models | `use-targets-view-model.ts`, `use-analog-results-view-model.ts`, `use-analog-detail-view-model.ts` | Queries, derived display data, actions |
| Views | `presentation/views/*.view.tsx` | Selection panel, world rail, stat row, hero, analog list, map, weights panel, detail drawer |
| Screen | `presentation/analog-finder.screen.tsx` | Connects view models to views |
| Shared UI | `src/shared/ui/*.tsx` | GlassCard, StatTile, RingGauge, ScorePill, ConfidenceBadge, IconRail, RadarChart, ImageCompare, DemoBanner, EarthLimitsNote, SourceList |

The team's `analog-explorer` hooks become the data-layer repositories and view models; its laser profile chart moves to `views/` unchanged at first. `src/features/analog-explorer/` is deleted once the new screen covers everything it does.

## Decisions and risks

- **Map is client-only:** loaded with `dynamic(() => import(...), { ssr: false })`.
- **Backend availability:** the backend is a Vercel function; cold starts can exceed 1 s. Warm it before the demo (open the health badge).
- **API gaps** (confidence, images, sources, activities): see spec open questions Q1–Q4. The UI renders placeholders until the backend adds them; no fake values in the frontend.
- **Generated client:** `src/client/` is regenerated with `make api`; never edit it by hand.
