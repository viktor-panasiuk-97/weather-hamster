# SearchCities

## Purpose
A reusable component that lets a user search for a city. It wraps the `SearchInput` UI component (`src/components/ui/search-input.tsx`). As the user types, a debounced lookup against the city geocoding API returns results, which are shown in a list below the input.

## Location
Lives in `src/components/search-cities/`, with `SearchCities` as its main export (e.g. `src/components/search-cities/search-cities.tsx`, or an `index.tsx` re-export). Subcomponents (see below) are colocated in this directory rather than in `src/components/ui/`, since they are internal implementation details of `SearchCities`, not shared UI primitives.

## Inputs
- `style?: StyleProp<ViewStyle>` — optional style override for the component's root container.
- No other props are exposed. The component is self-contained: it owns its own query state, its own search results, and its own selection handling internally (not exposed to the consumer via props).

## Output / Behavior
- Renders `SearchInput` in its normal (closed) state, `position: relative` (in normal document flow), when the text field is empty and not focused.
- **Focus/typing trigger:** as soon as the user focuses the input or types a non-empty query (per implementer's discretion — but must trigger on first keystroke at the latest), the same `SearchInput` switches to `position: fixed`, pinned to the top of the screen. A dark (black or black, semi-transparent) fullscreen backdrop appears behind it, and the results area (list or `Not Found` message) becomes visible below the input.
  - There is only ever one `SearchInput` instance — it does not get duplicated inside a separate overlay component.
  - A close button is shown in the top-right corner, using a text/emoji icon (e.g. "✕") — no new icon library or package install.
  - The results area appears below the input and is scrollable when showing a list.
  - Each list item is a pressable button (e.g. `Pressable`/`TouchableOpacity`), not static text.
- **Searching:** on `onChangeText`, the query is debounced 250ms using `debounce` (`src/utils/debounce.ts`), then `geoCordinatesByCityName(query)` (`src/api/weather-api.ts`) is called to fetch matches.
  - If the call resolves with one or more results, render them as pressable `city, country` options (from `GeoLocation.name` and `GeoLocation.country`).
  - If the call resolves with zero results, render a `Not Found` message in place of the list.
- **Selecting an option:** tapping an option handles the selection internally (exact downstream action, e.g. navigation or state update, is an implementation detail not exposed via props) and closes the search (returns `SearchInput` to relative position), clearing the query.
- **Closing the search:** tapping the close button closes the search (returns `SearchInput` to relative position), clears the query, and returns to the normal (closed) state, without triggering a selection.
- Use plain default/inline styling (no new styling library) consistent with the minimal styling already used in `SearchInput` (borders, padding, font sizes) — no visual design system needed beyond sensible defaults.

## Subcomponents
`SearchCities` is composed of the following internal subcomponents (not exported/exposed to consumers — implementation detail of this component, can live in the same file or colocated files):

- **`Overlay`** — the dark fullscreen backdrop shown behind the fixed-position `SearchInput` while open. Covers the entire screen, black or black semi-transparent background. Purely presentational; closing/selecting is handled by its siblings (`CloseButton`, `Option`), not by tapping the backdrop itself unless the implementer chooses to also wire that up.
- **`Option`** — a single pressable result row (`Pressable`/`TouchableOpacity`), rendering one `city, country` label (from `GeoLocation.name`/`.country`) for a search result. Calls the internal selection handler on press. The results list is these rendered in sequence inside a scrollable container.
- **`NotFound`** — the "Not Found" message shown in place of the results list when the debounced lookup resolves with zero results. Plain text, styled consistently with the minimal styling used elsewhere (no new styling library).
- **`CloseButton`** — the "✕" close control shown in the top-right corner while the search is open. Plain text/emoji glyph, pressable, calls the internal close handler (clears query, returns to closed/relative state) without triggering a selection.

These are internal building blocks for organizing the component's styling and behavior (overlay backdrop, list/option styling, not-found styling, close button styling) — they are not part of `SearchCities`'s public API and take no props beyond what's needed to wire them together internally.

## Edge Cases
- Query resolves to zero results: show the `Not Found` message instead of the list.
- Clearing the query text (but not closing) while in the focused/fixed state: state stays open (fixed), pending a new debounced lookup once a non-empty query is typed again.
- Rapid typing: lookups are debounced 250ms; since responses can arrive out of order, only the results for the latest query should be shown (e.g. track the in-flight query and ignore stale responses) — a note for the implementer, not enforced by the debounce utility itself.
- API errors (e.g. `WeatherApiError` thrown by `geoCordinatesByCityName`): handling is an implementation detail — treating it the same as a "not found" result is a reasonable default, but not required by this spec.
- Selecting an option should immediately close the search (no dangling open state).

## Acceptance Criteria
- [ ] `SearchCities` renders a closed (`position: relative`) `SearchInput` by default, with only an optional `style` prop accepted.
- [ ] Focusing or typing in the input switches it to `position: fixed`, pinned to the top of the screen, with a fullscreen dark backdrop behind it.
- [ ] A close ("✕") button appears at the top-right corner while in the fixed state.
- [ ] Tapping close returns the input to its relative/closed state, clears the query, and does not trigger a selection.
- [ ] Typing debounces 250ms (via `debounce` from `src/utils/debounce.ts`) before calling `geoCordinatesByCityName` with the current query.
- [ ] When results are returned, they are listed below the input as pressable `city, country` buttons.
- [ ] When no results are returned, a `Not Found` message is shown instead of the list.
- [ ] Tapping an option triggers the internal selection handling and returns the input to its closed/relative state.
- [ ] No new packages/icon libraries are installed; the close icon uses a plain text/emoji glyph.
- [ ] No props other than an optional `style` are exposed by the component.
