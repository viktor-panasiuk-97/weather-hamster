# SearchInput

A text input styled for search use: a bordered, rounded field with a search
glyph on the right side. Forwards every native `TextInput` prop unmodified,
so it drops into any screen exactly like a plain `TextInput` would.

## Client contract

Implemented as `SearchInput` in `src/components/ui/search-input.tsx`.
Export from `src/components/ui/input.tsx` file as a `SearchInput`.

```ts
function SearchInput(props: TextInputProps): JSX.Element
```

- Accepts every prop `TextInput` (from `react-native`) accepts — no custom
  props are added.
- All received props are spread directly onto the underlying `TextInput`;
  the component does not intercept or transform any of them (`onChangeText`,
  `value`, `placeholder`, `keyboardType`, `autoFocus`, `editable`, etc. all
  pass through as-is).
- A caller-supplied `style` prop is merged onto the inner `TextInput`'s
  style, not the outer container.

### Rendering

- Outer `View` (container): row layout, items centered, bordered, rounded
  corners, horizontal padding.
- Inner `TextInput`: `flex: 1`, no border of its own (the border lives on
  the container), vertical padding, base font size.
- Trailing `Text`: renders the `🔍` glyph, small left margin, font size
  roughly matching the input text.

## Styling

No theme/design-token system exists in this project yet, so styling is
fixed default values (via `StyleSheet.create`), not tokens:

| Element   | Properties |
| --------- | ---------- |
| Container | `flexDirection: "row"`, `alignItems: "center"`, `borderWidth`, `borderRadius`, `borderColor`, horizontal `padding` |
| Input     | `flex: 1`, vertical `paddingVertical`, base `fontSize`, no border |
| Icon      | `marginLeft`, `fontSize` matched to input text |

## Notes

- Importable via the project's path alias:
  `import { SearchInput } from "@/components/ui/search-input";`.
