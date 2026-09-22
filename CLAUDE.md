# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npx expo start --web       # run in browser (npm run web)
npx expo start --ios       # run in iOS simulator (npm run ios)
npx expo start --android   # run in Android emulator (npm run android)
```

There is no test suite configured in this repo.

## Architecture

- Entry point is `expo-router/entry` (see `package.json`), which boots `src/app/_layout.tsx` as the root `<Stack>` navigator.
- Path aliases (`tsconfig.json`): `@/*` → `src/*`, `@/assets/*` → `assets/*`. TypeScript `strict` mode is on.
- `experiments.typedRoutes` and `experiments.reactCompiler` are enabled in `app.json` — routes get generated types, and components should be written compiler-friendly (no manual `useMemo`/`useCallback` needed for the compiler's sake).
- The project was just stripped down from the default `create-expo-app` tabs template: the example tab navigator, themed components, and hooks (`app-tabs`, `themed-text`, `themed-view`, `use-color-scheme`, etc.) have been deleted. `src/app/` currently contains only a blank `_layout.tsx` and `index.tsx` placeholder screen — treat this as a fresh slate for the actual weather app UI, not an existing structure to preserve.


# Important
- For requests explicitly described as generic or standalone, do not scan the project for conventions unless asked.

- After each task show total spend of tokens!
- You should not implement or update tests.