## What this is

A weather app built with Expo (SDK 57) + Expo Router + React Native.

## Structure

- `src` - all project files placed here.
- `src/app/` — Expo Router screens only. `_layout.tsx` defines the root
  `<Stack>` navigator; `index.tsx` is the current (placeholder) home screen.
- `specs/` — written specs for API functions, components e.g.
  `specs/api/weather-api/geo-cordinates-by-city-name.md`.
- Path aliases: `@/*` → `src/*`, `@/assets/*` → `assets/*`.

## Conventions

- TypeScript `strict` mode is on — no implicit `any`.
- No manual `useMemo`/`useCallback` — `reactCompiler` is enabled, write
  compiler-friendly code instead.
- Keep non-route code (components, hooks, api clients, utils) out of  
  `src/app/`.

Do not add useless comments if not asked!