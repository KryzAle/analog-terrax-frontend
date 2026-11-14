# Implementation plan: [NNN] [Feature name]

**Spec:** [./spec.md](./spec.md)

Describes **how** the spec is built.

## Technical context

- **Stack:** [frameworks and libraries; new dependencies justified]
- **Data:** [JSON files read, schemas touched]
- **Performance goals:** [from success criteria]

## Constitution check

| Principle | Status | Note |
|---|---|---|
| P1 Data-driven | pass / exception | |
| P2 Honest results | | |
| P3 Static and offline | | |
| P4 Client-only scoring | | |
| P5 Clean architecture + MVVM | | |
| P6 Accessible | | |
| P7 Lean | | |
| P8 Consistent UI | | |

## Layer breakdown

| Layer | Files | Responsibility |
|---|---|---|
| Domain | `domain/...` | Entities, use cases, repository interfaces |
| Data | `data/...` | Schemas, repositories, mappers |
| View models | `presentation/view-models/...` | State, actions, derived data |
| Views | `presentation/views/...` | Stateless rendering |

## Risks and decisions

- [Decision]: [reason]
