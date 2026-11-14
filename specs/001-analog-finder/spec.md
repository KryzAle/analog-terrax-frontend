# Feature spec: 001 Analog finder dashboard

**Status:** Ready
**Created:** 2026-11-14
**Updated:** 2026-11-14 (aligned with the backend-driven architecture)

A one-page dashboard where a user picks a Moon or Mars target location and an activity, and sees the best Earth candidate analog sites, ranked by the backend on topography, geology and mineralogy similarity, with an honest explanation of what matches and what does not.

## User stories

### US1 — Find Earth analogs for a target and activity (Priority: P1)

As a mission planner, I want to choose a world, a target location and an activity so that I see which Earth sites are the best places to test that activity.

**Independent test:** Select Moon → Shackleton Crater Rim → Rover mobility and see a ranked list and map markers.

**Acceptance scenarios**

1. **Given** the app is open and the backend is reachable, **When** I select Moon, Shackleton Crater Rim and Rover mobility, **Then** the top 5 Earth sites appear as ranked cards and as score-colored map markers.
2. **Given** results for a Moon target, **When** I switch to Mars → Arcadia Planitia → Instrument testing, **Then** the target list shows only Mars locations and the ranking updates.
3. **Given** results are shown, **When** I look at any card, **Then** I see name, region, overall score 0–100 and T/G/M sub-scores as numbers.

### US2 — Understand one analog in detail (Priority: P1)

As a scientist, I want to open one Earth site to see why it is similar, where the analogy breaks down and what I could test there.

**Independent test:** Open the top-ranked card and check every detail section.

**Acceptance scenarios**

1. **Given** results are shown, **When** I click a card or its map marker, **Then** a detail drawer opens with a header (name, region, coordinates, elevation, overall score), a T/G/M radar chart, "Similar in", "Different in", "What you could test here" for the selected activity, the laser profile comparison, data sources and the Earth limits note.
2. **Given** a field is not provided by the API (images, confidence, sources), **When** the drawer opens, **Then** a placeholder is shown for that field only.
3. **Given** the drawer is open, **When** I press `Esc`, **Then** it closes and focus returns to the card.

### US3 — Adjust aspect weights (Priority: P2)

As an expert user, I want to change the topography, geology and mineralogy weights so that the ranking reflects my priorities.

**Acceptance scenarios**

1. **Given** an activity is selected, **When** I open the weights panel, **Then** the three sliders show that activity's default weights.
2. **When** I move a slider, **Then** the backend is re-queried (debounced) and the ranking updates without a page reload.
3. **When** I click "Reset", **Then** the weights return to the activity defaults.

### US4 — Compare with known analogs (Priority: P3)

As a judge, I want to see well-known analog sites on the map so that I can trust that the method also finds them.

**Acceptance scenarios**

1. **When** I turn on "Known analogs", **Then** sites with `is_known_analog: true` appear as grey markers with their scores.

### US5 — Survive a flaky network (Priority: P3)

As a presenter, I want the demo to keep working when the venue internet is unreliable.

**Acceptance scenarios**

1. **Given** the demo path was loaded once, **When** the network drops, **Then** previously loaded results are still shown from the client cache.
2. **Given** the backend is unreachable and nothing is cached, **When** I make a selection, **Then** a clear error state with a retry action is shown.

## Functional requirements

- **FR-001**: World toggle with Moon and Mars; target list filtered by world, loaded from `GET /api/v1/bodies/{body}/sites`.
- **FR-002**: All sites, scores and feature comparisons MUST come from the backend through the generated `@/client` SDK.
- **FR-003**: Ranking MUST come from `POST /api/v1/analogs/search` with the selected target, the activity's weights (or slider values) and `k` = top N (default 5). The frontend never computes or re-weights scores.
- **FR-004**: Activities (name, icon, default weights, test ideas) come from a frontend config file until the backend exposes them; adding one needs no component change.
- **FR-005**: Each result card shows name, region, `overall_pct` and T/G/M sub-scores as numbers.
- **FR-006**: "Similar in" and "Different in" are derived from the returned feature comparisons (`closeness_pct`) with thresholds kept in config. Both lists are always visible; "Different in" is never collapsed, and shows "No major differences in the compared features" when empty (see F6).
- **FR-007**: The detail drawer shows the laser profile comparison from `GET /api/v1/analogs/{cell}/profile`.
- **FR-008**: Every site is labeled "candidate analog to evaluate"; the word "official" never appears.
- **FR-009**: When `NEXT_PUBLIC_DEMO_DATA` is on, a "Demo data" banner is visible on every view.
- **FR-010**: Fields missing from the API show a placeholder; missing optional fields hide only that field.
- **FR-011**: API errors show an error state with retry, using the `ApiClientError` status and request ID.
- **FR-012**: All UI strings come from the i18n catalog (English).
- **FR-013**: Fully keyboard navigable; scores never conveyed by color alone.

## Key entities

- **Target / EarthSite**: `PlanetarySite` (site and cell IDs, body, name, region, coordinates, elevation, topography fingerprint, geology fractions, mineralogy, flags, known-analog flag).
- **Activity**: frontend config (id, name, icon, default weights, test ideas).
- **AnalogMatch**: `AnalogMatchResult` (rank, site, `ScoreBreakdown`, top contributing features).
- **LaserProfileComparison**: target and Earth profiles with roughness ratio and slope delta.

## Success criteria

- **SC-001**: With a warm backend, selecting world + target + activity shows results in under 1 s.
- **SC-002**: Slider changes update the ranking within 1 s of the last change.
- **SC-003**: A new site added in the backend shows up with no frontend code change.
- **SC-004**: The demo script runs end to end; with the network dropped after first load, previously loaded results stay visible.
- **SC-005**: No console errors; `npm run build` succeeds in one command.

## Demo script (must be supported end to end)

Uses the sites the deployed backend serves today (see F5).

1. Open the app → Moon → Shackleton Crater Rim → Rover mobility. The map shows top analogs; known analogs appear grey.
2. Switch to Mars → Arcadia Planitia Ice-Rich Plains → Instrument testing; the ranking changes.
3. Open the top Earth analog card: radar chart, "Similar in", "Different in", laser profile.
4. Point to the Earth limits note and the data sources.

## Backend findings (checked against https://analog-terrax-backend.vercel.app on 2026-11-14)

The live responses match the generated `@/client` types.

- **F1 Confidence:** not returned. The confidence badge stays hidden.
- **F2 Images:** not returned. The image comparison shows placeholders.
- **F3 Sources:** no source links per match; only the instrument name on laser profiles (e.g. "LRO LOLA"). A static source list per body (LOLA, Diviner, MOLA, CRISM, NASADEM, ASTER GED, EMIT, ICESat-2) is shown.
- **F4 Activities:** not in the API. Activities and their default weights stay in `src/shared/config/activities.ts`; weights are sent with each search.
- **F5 Sites differ from the brief:**
  - Moon (6): Shackleton Crater Rim, de Gerlache Rim 2, Marius Hills Skylight, Aristarchus Plateau, Mare Tranquillitatis Pit, Schrödinger Basin. Malapert Massif, Haworth, Mons Mouton and Nobile Rim are missing.
  - Mars (6): Jezero, Arcadia Planitia, Elysium Planitia, Mawrth Vallis, Arsia Mons pits, Melas Chasma. Amazonis Planitia and Gale crater are missing.
  - Earth (14 candidates, 10 known analogs). No Ecuador sites, so Arenal del Chimborazo and the Andes case study need backend data first.
- **F6 Similar / different:** each match returns `top_contributing_features` with `closeness_pct`. In the Shackleton sample all three top features score ≥ 99.9 %, so "Different in" needs features beyond the top ones; ask the backend to return all compared features or the lowest ones as well.
- **F7 Scale:** a search evaluates all 14 Earth candidates; the heatmap returns 134 Earth cells.

## Out of scope

User accounts, 3D globes, VR, satellite processing in the browser, Moon/Mars interactive maps (a list is enough), and calling any site "official". The "New opportunities" filter, Andes case study, KML upload and export are later specs.
