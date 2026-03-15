# Voidspire Planner

Voidspire Planner is a lightweight, frontend-first raid planning app for **The Voidspire** (World of Warcraft: Midnight, Heroic). It supports boss-specific planning maps, encounter steps, drawable planning objects, and read-only shared plan views.

## Stack

- **Vite + React + TypeScript**: fast dev/build and typed code.
- **Tailwind CSS**: compact, dark, game-adjacent UI styling.
- **Zustand**: local-first planner state with persistence.
- **Konva / react-konva**: high-performance interactive map canvas.
- **React Router**: route-level planner/public flows.
- **localStorage**: saved user plan library + UI state.
- **Zod**: typed schema definitions for planner entities.

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Routes

- `/` landing page and boss selector
- `/planner/:bossSlug` editable encounter planner
- `/plan/:planId` read-only/public presentation view (supports `?data=` encoded plan override)
- `/about` short product/about page

## Data model

Core entities:

- `Raid`
- `BossEncounter`
- `Plan`
- `Step`
- `DrawableObject`

`Plan` includes `id`, `name`, `bossSlug`, `difficulty`, timestamps, `canvasBackground`, and `steps[]`.

`Step` includes `id`, `name`, `notes`, `objects[]`, plus optional `timer`, `phase`, and `bossHealthRange`.

`DrawableObject` supports markers, shapes, arrows, labels, zones, and callouts with transform/style properties (`x/y`, size, rotation, color/fill, opacity, locking, visibility mode, etc.).

## Seeded plans and bosses

The app includes all Heroic Voidspire bosses:

- Imperator Averzian
- Vorasius
- Fallen-King Salhadaar
- Vaelgor & Ezzorak
- Lightblinded Vanguard
- Chimaerus the Undreamt God

Seeded plans are bundled as JSON in `src/data/plans/*.json`, with a registry in `src/data/plans/index.ts` and schematic SVG arena backgrounds in `src/data/backgrounds/arenaSvgs.ts`.

## Add a new boss

1. Add a `BossEncounter` entry in `src/data/bosses.ts`.
2. Add a matching arena SVG/background in `src/data/backgrounds/arenaSvgs.ts`.
3. Add a seeded JSON plan file under `src/data/plans/`.
4. Register the JSON plan in `src/data/plans/index.ts`.

## Assumptions

- Encounter flow and seeded callouts are practical starter strategies inferred from public references and generalized Heroic-style mechanic pacing.
- Seeded strategy steps were refined from public encounter summaries and are intentionally original wording/structure.
- Arena backgrounds are intentionally schematic/original for lawful usage (not extracted game assets).

## Known limitations

- No backend/collaboration layer; storage is browser-local.
- Mobile uses the same 3-column layout and is best on tablets/desktop currently.
- Encoded URL sharing is Base64 JSON (not compressed).

## Legal note

This project is an original implementation inspired by raid planning workflows. It is **not affiliated with**, endorsed by, or copied from raidplan.io, Blizzard Entertainment, or any proprietary product.
