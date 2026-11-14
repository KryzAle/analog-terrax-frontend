# Tasks: [NNN] [Feature name]

**Plan:** [./plan.md](./plan.md)

Format: `- [ ] T### [P] [USn] Description (path)`. `[P]` means the task can run in parallel with other `[P]` tasks in the same phase (different files, no dependency).

## Phase 1: Setup

- [ ] T001 ...

## Phase 2: Foundation (blocks all stories)

- [ ] T010 ...

## Phase 3: US1 — [Title] (P1)

- [ ] T020 [US1] ...

## Phase N: Polish

- [ ] T090 Run `npm run typecheck`, `npm run build`, `npx react-doctor@latest`
