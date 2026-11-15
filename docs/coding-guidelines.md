# AnalogTerraX Coding Guidelines

Clean architecture with MVVM in the presentation layer, on Next.js 15 (App Router), React 19, TypeScript strict and Tailwind v4.

## 1. Layers

Each feature is a vertical slice in `src/features/<feature>/` with four layers:

```
src/features/analog-finder/
├── domain/                     # Pure TypeScript: no React, no fetch, no Next
│   ├── entities/               # Target, Activity, EarthSite, Match, AspectScores, Weights
│   ├── use-cases/              # splitSimilarDifferent, ...
│   └── repositories/           # Interfaces: SiteRepository, AnalogSearchRepository, ...
├── data/                       # Adapters to the outside world
│   ├── mappers/                # API DTO (@/client types) → entity
│   └── repositories/           # Implementations of domain interfaces wrapping the @/client SDK
├── presentation/
│   ├── view-models/            # use-*-view-model.ts: state, actions, derived data
│   └── views/                  # *.view.tsx: stateless rendering
└── di.ts                       # Composition root: wires implementations to interfaces
```

Shared code that is not owned by a feature:

```
src/shared/
├── ui/        # Design-system components (GlassCard, ScorePill, RingGauge, ...)
├── i18n/      # String catalog (en.ts) and the t() helper
├── lib/       # cn() and other generic helpers
└── config/    # App config (demo-data flag, top-N default)
```

`src/app/` stays a thin routing layer: pages import a feature's top-level view and nothing else.

### Dependency rule

```
views ──▶ view-models ──▶ domain ◀── data
                 │                     ▲
                 └──── di.ts ──────────┘
```

- `domain` imports nothing from `data`, `presentation`, React or Next.
- `data` implements `domain` interfaces; it is the only layer that imports `@/client` (the generated SDK, never edited by hand).
- View models depend on domain interfaces and use cases, receiving implementations from `di.ts`.
- Views import only their view model's types and `src/shared/ui`.
- Features never import from each other's internals; shared code moves to `src/shared/`.

## 2. MVVM responsibilities

| Role | File | Owns | Never does |
|---|---|---|---|
| **Model** | `domain/**` | Entities, business rules that are not scoring (classifying, filtering, formatting rules) | Rendering, fetching, state |
| **ViewModel** | `use-*-view-model.ts` | Selection state, query/caching, calling use cases, formatting for display, exposing actions | JSX, styling |
| **View** | `*.view.tsx` | Layout, styling, accessibility, wiring events to view-model actions | Business logic, fetching, `useState` for domain data |

```ts
// domain/use-cases/split-similar-different.ts
export const splitSimilarDifferent = (
  features: readonly FeatureComparison[],
  { similarFrom, differentBelow }: ClosenessThresholds,
) => ({
  similar: features.filter((feature) => feature.closenessPct >= similarFrom),
  different: features.filter((feature) => feature.closenessPct < differentBelow),
});
```

```ts
// data/repositories/api-analog-search.repository.ts
export const apiAnalogSearchRepository: AnalogSearchRepository = {
  search: async (query) =>
    (await analogsSearchEarthAnalogs(toSearchRequest(query))).matches.map(toAnalogMatch),
};
```

```ts
// presentation/view-models/use-analog-results-view-model.ts
export const useAnalogResultsViewModel = (selection: Selection) => {
  const { data = [], isPending, isError, refetch } = useQuery({
    queryKey: ["analogs", "search", selection],
    queryFn: () => analogSearchRepository.search(selection),
    enabled: Boolean(selection.targetId),
  });
  return { ranked: data, isPending, isError, retry: refetch, isEmpty: data.length === 0 };
};
```

```tsx
// presentation/views/analog-results.view.tsx
export const AnalogResultsView = ({ ranked, onSelect }: AnalogResultsViewProps) => (
  <ul>
    {ranked.map((item) => (
      <AnalogCard key={item.siteId} {...item} onSelect={onSelect} />
    ))}
  </ul>
);
```

A thin container (e.g. `analog-finder.screen.tsx`) calls the view models and passes their output to the views, so views stay pure and easy to preview.

## 3. SOLID in this codebase

| Principle | Concrete rule |
|---|---|
| **S**ingle responsibility | One component, hook or use case per file. A view model per screen area, not per app. |
| **O**pen/closed | Behavior comes from data: sites come from the API; activities, weights, test ideas and icons from config. No `switch (activity.id)`. Icons resolve through a lookup map with a fallback. |
| **L**iskov | Any repository implementation (API, in-memory fake for previews) is a drop-in replacement. |
| **I**nterface segregation | Small interfaces: e.g. `SiteRepository`, `AnalogSearchRepository`, `ProfileRepository` instead of one large data service. |
| **D**ependency inversion | View models depend on interfaces; `di.ts` provides the API implementations. |

## 4. Design patterns

- **Repository:** hides where data comes from (the FastAPI backend today).
- **Adapter / Mapper:** converts API DTOs (snake_case, nullable) into domain entities (camelCase, explicit defaults).
- **Strategy:** weights are a strategy chosen by the activity, overridable by sliders, and sent to the backend.
- **Composition root:** `di.ts` is the only place that creates concrete implementations.
- **Container / Presentational:** screens connect view models to pure views.

## 5. Code style

- **Components:** arrow functions only, named exports, props typed with a `XxxProps` type.
  ```tsx
  export const ScorePill = ({ label, value }: ScorePillProps) => ( ... );
  ```
- **Functional style:** `map` / `filter` / `reduce` / `toSorted` instead of loops; no mutation of arrays or objects; derive data instead of syncing it with effects.
- **TypeScript:** strict, no `any`, no non-null assertions on API data (handle `null` in mappers). Prefer `type` over `interface` except for repository contracts.
- **Naming:** kebab-case files. Suffixes: `*.view.tsx`, `*.screen.tsx`, `use-*-view-model.ts`, `*.repository.ts`, `*.mapper.ts`. Booleans start with `is` / `has`.
- **Strings:** every user-facing string comes from `src/shared/i18n`; never inline English in views.
- **Styling:** Tailwind utilities with design tokens from [design guidelines](./design-guidelines.md); combine classes with `cn()`; no raw hex in components.
- **Comments:** none by default. Names explain intent; a comment only explains a non-obvious *why*.
- **Size limits (refactor triggers):** view > ~150 lines, view model > ~100 lines, function > ~30 lines, or any logic inside a view → extract.
- **Imports:** `@/` alias; no relative imports across layers deeper than `../`.

## 6. Data and validation

- The backend OpenAPI spec is the contract. `src/client/` is regenerated with `make api`; never edit it by hand.
- `@/client` types are DTOs: they stay in the data layer and never reach views.
- The frontend never computes or re-weights scores; it sends weights to the backend.
- API failures surface as `ApiClientError` (status + request ID) and become an error state in the view model, never an unhandled rejection.
- Config (`apiUrl`, `demoData`, `topN`, activities) lives in `src/shared/config` and reads env through `src/env.ts` (Zod-validated).

## 7. Quality gates

Run before every PR:

```bash
npm run typecheck
npm run build
npx react-doctor@latest
```

Domain use cases with branching logic (scoring, ranking, filtering) keep one small runnable check next to them (`*.check.ts`, assert-based) until a test runner is added.

## 8. Refactoring process

1. Make it work in the right layer (domain logic in domain, never in a view).
2. Extract when a refactor trigger hits (section 5).
3. Move shared code to `src/shared/` only when a second feature needs it.
4. Keep diffs small; one refactor per commit, separate from behavior changes.
