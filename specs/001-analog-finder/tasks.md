# Tasks: 001 Analog finder dashboard

**Plan:** [./plan.md](./plan.md)

Format: `- [ ] T### [P] [USn] Description (path)`. `[P]` = can run in parallel with other `[P]` tasks in the same phase.

## Phase 1: Setup

- [x] T001 Keep the backend client and add `NEXT_PUBLIC_DEMO_DATA` next to `NEXT_PUBLIC_API_URL` (`src/env.ts`, `.env.example`)
- [x] T002 Makefile and development-only Docker setup (`Makefile`, `Dockerfile.dev`, `compose.dev.yaml`)
- [x] T003 [P] Dark design tokens, Inter font, starfield background (`src/app/globals.css`, `src/app/layout.tsx`)
- [x] T004 [P] i18n catalog (`src/shared/i18n/`)
- [x] T005 [P] App config with `apiUrl`, `demoData` and `topN` (`src/shared/config/app-config.ts`)
- [ ] T006 [P] Activities config with default weights, icons and test ideas (`src/shared/config/activities.ts`)
- [x] T007 Install `maplibre-gl`, `chart.js`, `react-chartjs-2`

## Phase 2: Foundation (blocks all stories)

- [ ] T010 [P] Domain entities (`domain/entities/`)
- [ ] T011 [P] `splitSimilarDifferent` + check (`domain/use-cases/`)
- [ ] T012 [P] Repository interfaces (`domain/repositories/`)
- [ ] T013 Mappers from API DTOs to entities (`data/mappers/`)
- [ ] T014 API repositories wrapping `@/client`, reusing the team's `analog-explorer` hooks logic (`data/repositories/`)
- [ ] T015 Composition root (`di.ts`)
- [ ] T016 [P] Shared UI: `GlassCard`, `StatTile`, `RingGauge`, `ScorePill`, `ConfidenceBadge`, `IconRail`, `DemoBanner`, `EarthLimitsNote`, `SourceList` (`src/shared/ui/`)

## Phase 3: US1 — Find Earth analogs (P1)

- [ ] T020 [US1] `useSelectionViewModel` (world, target, activity, weights)
- [ ] T021 [US1] `useTargetsViewModel` and `useAnalogResultsViewModel` (search query keyed by target + weights)
- [ ] T022 [P] [US1] Selection panel + world rail views (world radiogroup, target list, activity cards)
- [ ] T023 [P] [US1] Stat row + hero views
- [ ] T024 [P] [US1] Analog list view (ranked cards with T/G/M numbers)
- [ ] T025 [US1] Analog map view (MapLibre, client-only, score-colored markers, keyboard-focusable)
- [ ] T026 [US1] `analog-finder.screen.tsx` rendered from `src/app/page.tsx`

## Phase 4: US2 — Analog detail (P1)

- [ ] T030 [US2] `useAnalogDetailViewModel` (match, similar/different, test ideas, laser profile query)
- [ ] T031 [P] [US2] `RadarChart` and `ImageCompare` shared components (with placeholder)
- [ ] T032 [US2] Detail drawer view (all sections, team's laser profile chart, `Esc` closes, focus return)

## Phase 5: US3 — Weights (P2)

- [ ] T040 [US3] Weights panel view (three native range inputs + values + reset, debounced re-query)

## Phase 6: US4 — Known analogs (P3)

- [ ] T050 [US4] Known analogs toggle and grey markers

## Phase 7: US5 — Flaky network (P3)

- [ ] T060 [US5] Long-lived query cache for the demo path and error state with retry

## Phase 8: Polish

- [ ] T089 Remove `src/features/analog-explorer/` once the new screen covers it
- [ ] T090 Run the demo script end to end against the deployed backend
- [ ] T091 Keyboard-only pass and contrast check against the design guidelines
- [ ] T092 `npm run typecheck`, `npm run build`, `npx react-doctor@latest`; zero console errors
