# AnalogTerraX Constitution

Non-negotiable principles. Every spec, plan and task must satisfy them. If a feature needs to break one, amend this file first (with the reason and date), then write the spec.

| ID | Principle | Rule | Why |
|---|---|---|---|
| P1 | Data-driven | Sites, targets, scores and feature comparisons come only from the backend API through the generated `@/client` SDK (never edited by hand). Adding or removing a site needs no frontend code change. | The data team updates results in the backend without touching the frontend. |
| P2 | Honest results | "Different in" and the Earth limits note are always visible. Every site is a "candidate analog to evaluate", never "official". A "Demo data" banner shows while `NEXT_PUBLIC_DEMO_DATA` is on, and placeholder numbers are never presented as real. | Credibility with judges and scientists. |
| P3 | Resilient demo | No accounts or frontend database. API responses for the demo path are cached on the client, and an unreachable backend shows a clear error state, never a blank screen. `npm run build` builds in one command. | Venue internet may fail during the demo. |
| P4 | Backend scoring | The backend computes every score. The frontend sends weights and filters to `POST /api/v1/analogs/search` and only renders the result; it never computes or re-weights geoscience. Slider changes re-query (debounced). | A single source of truth for scores. |
| P5 | Clean architecture + MVVM | Code follows the layering and dependency rule in [coding guidelines](../../docs/coding-guidelines.md). | Parallel work in a 48 h hackathon without collisions. |
| P6 | Accessible | WCAG 2.1 AA contrast, keyboard navigable, real buttons and labels, scores always shown as numbers (never color alone). | Inclusive and projector-legible. |
| P7 | Lean | YAGNI. The core demo flow ships first; secondary views only after it works end to end. | 48 h deadline. |
| P8 | Consistent UI | Visual decisions follow [design guidelines](../../docs/design-guidelines.md). All UI strings live in the i18n catalog. | One look, Spanish later. |

## Governance

- Workflow: constitution → `specs/NNN-feature/spec.md` → `plan.md` → `tasks.md` → implement. Templates are in `.specify/templates/`.
- Each `plan.md` has a "Constitution check" that lists P1–P8 as pass or justified exception.
- Version: 1.1.0 (2026-11-14). Changed P1, P3 and P4 to the team's backend-driven architecture (FastAPI + generated OpenAPI client).
