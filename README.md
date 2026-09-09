# Metrone

A minimal Svelte 5 + TypeScript + Vite metronome starter.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite.

## Commands

- `npm run check` — Svelte and TypeScript diagnostics.
- `npm run build` — production assets in `dist/`.
- `npm run preview` — preview the production build.
- `npx playwright install chromium` — install the browser for tests.
- `npm test` — browser interaction and mobile layout checks.

## Structure

- `src/App.svelte` — page, tempo controls, beat display, and Web Audio scheduler.
- `src/app.css` — responsive styling and theme variables.
- `src/main.ts` — Svelte entry point.
- `tests/` — Playwright browser tests.

## Included

Adjustable 30–240 BPM, start/stop playback, fixed 4/4 quarter notes,
accented downbeat, and visual beat indicators. Audio starts only after a
user gesture. A short look-ahead scheduler uses the Web Audio clock rather
than relying solely on JavaScript timer precision.

DM Sans loads from Google Fonts with a local Segoe UI fallback. No backend,
accounts, analytics, or audio assets are required. Background tabs and device
sleep can throttle browser timers; keep the page foregrounded for practice.

Time-signature selection, subdivisions, tap tempo, and persistence are left
out intentionally to keep this boilerplate small.
