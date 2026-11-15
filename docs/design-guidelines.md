# AnalogTerraX Design Guidelines

Visual direction: a dark, glassy mission-control dashboard. Reference: the "AstroPlus" Dribbble shot (dark space canvas, a large glowing planet, tinted glass stat tiles, ring gauges, an icon rail with a glowing active pill). The colors are AnalogTerraX's own: the brief's accents applied to the dark canvas.

## 1. Principles

1. **Data first, decoration second.** The planet, glow and starfield frame the data; they never compete with scores.
2. **Calm dark canvas, bright meaning.** Color appears where it carries meaning: the world, the score, the status.
3. **Projector-legible.** Large numbers, high contrast, nothing important under 12 px.
4. **Honest by design.** "Different in", the Earth limits note and the Demo data banner have their own visible slots in the layout and are never collapsible.

## 2. Color tokens

Defined once as CSS variables in `src/app/globals.css` (Tailwind v4 `@theme`) and used only through tokens, never raw hex in components.

### Canvas and surfaces

| Token | Value | Use |
|---|---|---|
| `--color-space` | `#05070D` | App background |
| `--color-surface` | `rgba(255,255,255,0.05)` | Glass cards (with `backdrop-blur-xl`) |
| `--color-surface-raised` | `rgba(255,255,255,0.08)` | Hover, drawers, popovers |
| `--color-surface-solid` | `#12151D` | Fallback when blur is unavailable; contrast reference |
| `--color-line` | `rgba(255,255,255,0.08)` | 1 px card borders, dividers, chart grid |
| `--color-text` | `#F5F7FA` | Primary text, big numbers |
| `--color-text-muted` | `#9AA3B2` | Labels, captions, secondary text |

### Brand and accents

| Token | Value | Use |
|---|---|---|
| `--color-navy` | `#0B1D3A` | Tinted tiles, the drawer header gradient start |
| `--color-lime` | `#D9F24A` | Primary accent: active rail item, focus ring, primary button, key highlights. Text on lime uses `--color-space` |
| `--color-link` | `#4C8DFF` | Links and selected states (the brief's `#0B4DA2` lightened for the dark canvas) |

### Worlds

| Token | Value | Use |
|---|---|---|
| `--color-mars` | `#EB6834` | Mars hero glow, Mars chips, target image frame |
| `--color-earth` | `#2A78D6` | Earth fills and markers only (fails AA as small text) |
| `--color-earth-text` | `#5B9BEA` | Earth-colored text |
| `--color-moon` | `#B8BEC8` | Moon hero glow, Moon chips |

### Status and confidence

| Token | Value | Use |
|---|---|---|
| `--color-success` | `#3DD68C` | High confidence, high scores |
| `--color-warning` | `#F2B53A` | Medium confidence, Demo data banner |
| `--color-danger` | `#FF6B5B` | Low confidence, errors |
| `--color-known` | `#6B7280` | Known analog markers (grey) |

### Tinted tiles

### Score scale

Map markers, rings and bars use a continuous scale `danger (0) → warning (50) → success (100)`. The number is always shown next to the color.

### Verified contrast (WCAG AA ≥ 4.5:1)

| Foreground | on `#05070D` | on `#12151D` |
|---|---|---|
| text `#F5F7FA` | 18.8 | 17.0 |
| muted `#9AA3B2` | 7.9 | 7.2 |
| lime `#D9F24A` | 16.1 | 14.6 |
| link `#4C8DFF` | 6.3 | 5.7 |
| mars `#EB6834` | 6.3 | 5.7 |
| earth-text `#5B9BEA` | 7.0 | 6.4 |
| moon `#B8BEC8` | 10.8 | 9.8 |
| success `#3DD68C` | 10.7 | 9.7 |
| warning `#F2B53A` | 11.0 | 10.0 |
| danger `#FF6B5B` | 7.2 | 6.5 |
| space `#05070D` on lime | 16.1 | — |

`#2A78D6` (earth) scores 4.1 on surfaces, so it is not allowed as text.

## 3. Typography

- **Family:** Inter (via `next/font/google`), with `font-feature-settings: "tnum"` on all numbers.
- **Scale:**

| Role | Size / weight | Example |
|---|---|---|
| Hero | 88–112 px / 800, tracking -0.04em, line-height 0.9 | Target name ("Mars", "Shackleton") |
| Display number | 32–40 px / 600 | Overall score |
| Title | 18–20 px / 600 | Card and drawer titles |
| Body | 14–15 px / 400 | Bullets, descriptions |
| Label | 12–13 px / 500, muted | Tile labels, axis labels, captions |

- The hero subtitle sits under the name in muted body text (like "The 5th Planet Of The Solar System"), e.g. "Moon south pole · Artemis candidate region".

## 4. Layout

Desktop first (1280–1920 px, projector), responsive down to tablet (768 px).

```
┌────┬──────────────────────────────┬────────────────────┬────┐
│ I  │                              │                    │ W  │
│ c  │                              │  Ranked analog     │ o  │
│ o  │   Hero: world image + name   │  cards (top 5)     │ r  │
│ n  │   → Earth map with markers   │                    │ l  │
│    │     once results load        │  T / G / M rings   │ d  │
│ r  │                              │  + weight sliders  │    │
│ a  │                              │                    │ r  │
│ i  ├──────────────────────────────┴────────────────────┤ a  │
│ l  │  Earth limits note · Data sources · Demo banner   │ i  │
└────┴───────────────────────────────────────────────────┴────┘
                     Detail drawer slides in over the map →
```

- **Left icon rail** (72 px): world toggle (Moon/Mars), views (Results, Known analogs, Andes case study), settings. The active item is a filled glow pill with a label, like "Planets" in the reference.
- **Center:** before a selection, the hero (world image with glow + big name). After a selection, the Earth map takes the hero area; the target name stays as a compact glass chip in the bottom-left corner. It has a world-coloured left border and an 11px eyebrow above an 18px bold name on one line, truncated with the full name in a tooltip. Its width is at most 28rem or half the map, so it never covers markers or the attribution.
- **Right world rail** (64 px): target locations of the current world as round icon buttons with a tooltip, the selected one glowing in the world color. The left panel also has a full accessible list (the rail is a shortcut, not the only path).
- **Detail drawer:** 480–560 px from the right edge, over the map; `Esc` closes it and focus returns to the opening card.
- **Tablet:** the rails collapse into a top bar with segmented controls; the drawer goes full width.
- **Spacing:** 4 px base; cards use 20–24 px padding and 16 px gaps. Radii: cards 20 px, tiles 16 px, pills fully rounded. The app frame itself has 28 px radius, like the reference.

## 5. Components

| Component | Spec |
|---|---|
| `GlassCard` | `--color-surface`, 1 px `--color-line`, `backdrop-blur-xl`, radius 20, optional tint |
| `RingGauge` | Circular progress (stroke 6 px, track `--color-line`), value colored by score scale, number and label (T/G/M) **inside** the ring |
| `ScorePill` | Lime or world-colored capsule label on the left + big number on the right, like "Curiosity 137.4°". Used for the overall score in cards and the drawer header |
| `IconRail` / `RailItem` | 44 px hit area, muted icon; active = glow pill (`--color-lime` 15 % background, lime icon, label) |
| `AnalogCard` | Rank number, name, country, `ScorePill`, three mini bars T/G/M with numbers; selected state = lime 1 px border + glow |
| `ConfidenceBadge` | Pill with icon + text (High / Medium / Low), status colors |
| `RadarChart` | Chart.js radar: gradient fill from world color at 40 % to 0 %, dotted grid in `--color-line`, a tooltip bubble like "Ls = 1.192°" |
| `ImageCompare` | Earth image left, target image right, equal height, shared scale bar with label ("100 m"); placeholder = glass card with an icon and "Image not available" |
| `MapMarker` | Score-colored dot with white 2 px ring and score label on hover/focus; known analogs `--color-known`; selected = lime ring + pulse |
| `DemoBanner` | Thin warning strip at top of the app: "Demo data — not real results" |
| `EarthLimitsNote` | Always-visible glass note with an info icon at the bottom of the drawer and the results panel |
| `SourceList` | Small muted links with an external-link icon |

## 6. Effects and motion

- **Glow:** world-colored radial gradient behind the hero (`blur(80px)`, 35 % opacity); selected elements use `box-shadow: 0 0 24px` in their accent at 30 %.
- **Background:** `--color-space` with a sparse starfield (static CSS radial dots) and an optional faint 32 px grid at 3 % opacity, as in the reference.
- **Motion:** 150–250 ms `ease-out` for hover, select and drawer; result re-ranking animates position (≤ 200 ms). Everything is disabled under `prefers-reduced-motion`.

## 7. Iconography

Lucide only, 1.5 px stroke, 20 px default (16 px in labels). No emoji.

| Concept | Icon |
|---|---|
| Moon / Mars | `Moon`, `Orbit` |
| Rover mobility | `Car` |
| Drilling and sampling | `Drill` |
| Construction / regolith | `Shovel` |
| EVA operations | `PersonStanding` |
| Instrument testing | `ScanLine` |
| Landing / hazards | `PlaneLanding` |
| Topography / Geology / Mineralogy | `Mountain`, `Layers`, `Gem` |
| Sources | `ExternalLink` |
| Earth limits | `Info` |

Activity icons are keyed by the `icon` field in `activities.json`; unknown keys fall back to `CircleDot`.

## 8. Accessibility

- Focus ring: 2 px `--color-lime` with a 2 px offset on every interactive element.
- All rail buttons have `aria-label`; the world toggle is a `radiogroup`; sliders are native `<input type="range">` with visible values.
- The map has a keyboard-accessible equivalent: the ranked list. Markers are reachable by tab and announce name + score.
- Charts have a text alternative (the same T/G/M numbers rendered in the card).

## 9. Departures from the reference

- No 3D globe, VR mode or wireframe overlays (out of scope). The hero is a static world image.
- Numbers shown are only ones from the data files, never decorative telemetry.
- The reference's magenta is not used; lime is the single accent.
