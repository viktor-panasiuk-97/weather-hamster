# debounce

Location: `src/utils/debounce.ts`, re-exported from `src/utils/index.ts`.

## Purpose
Delays invoking a function until `delayMs` has elapsed since the last time the debounced function was called. Trailing-edge only.

## Inputs
- `fn: Function` — the function to debounce.
- `delayMs: number` — delay in milliseconds.

## Output
A debounced function with the same call signature as `fn`. Each call resets the pending timer.

## Behavior
- Only the last call within a burst (calls spaced less than `delayMs` apart) results in `fn` executing.
- Preserves arguments and `this` context from the most recent call.
- No leading-edge/immediate execution.

## Edge Cases
- `delayMs = 0`: still deferred at least one tick, not synchronous.
- Rapid repeated calls: timer resets on every call; only final call's arguments are used.
- `fn` never called (debounced function never invoked): no execution, no timers left running.
- Multiple independent debounced instances of the same underlying `fn` do not interfere with each other.

## Acceptance Criteria
- Multiple calls within `delayMs` of each other → exactly one call to `fn`, using the last call's arguments.
- A single call → exactly one call to `fn` after `delayMs`.
- No call to `fn` occurs before `delayMs` has elapsed since the last invocation of the debounced function.
