# Geocoding — coordinates by city name

OpenWeather Geocoding API. Converts a city name into geographic coordinates
(`lat`/`lon`), which the weather endpoints require.

## Endpoint

```
GET http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
```

## Parameters

| Name    | Required | Description |
| ------- | -------- | ----------- |
| `q`     | yes      | City name, state code (US only) and country code, comma-separated. Use [ISO 3166](https://www.iso.org/iso-3166-country-codes.html) country codes. |
| `appid` | yes      | API key (account page → "API key" tab). Stored as `EXPO_PUBLIC_OPENWEATHERMAP_APP_ID`, read via `APP_ID` in `src/constants/env.ts`. |
| `limit` | no       | Number of locations returned. Max 5. |

## Example

```
http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid={API key}
```

## Response

Array of matching locations (up to `limit`):

```json
[
  {
    "name": "London",
    "local_names": { "en": "London", "uk": "Лондон" },
    "lat": 51.5073219,
    "lon": -0.1276474,
    "country": "GB",
    "state": "England"
  }
]
```

| Field         | Type   | Description |
| ------------- | ------ | ----------- |
| `name`        | string | Name of the found location. |
| `local_names` | object | Optional map of language code → localized name. |
| `lat`         | number | Latitude. |
| `lon`         | number | Longitude. |
| `country`     | string | ISO 3166 country code. |
| `state`       | string | Optional. State, where available (US). |

An unknown city returns `200` with an empty array — not an error.

## Client contract

Implemented as `geoCordinatesByCityName` in `src/api/weather-api.ts`.

```ts
geoCordinatesByCityName(
  cityName: string,
  limit?: number, // 1..5, default 10
): Promise<GeoLocation[]>
```

- `appid` is never a parameter — it is read from `APP_ID` (`src/constants/env.ts`).
- `cityName` is sent URL-encoded as `q`; callers may pass `"London,GB"` or
  `"Austin,TX,US"` and the comma-separated form is preserved.
- `limit` is sent as-is, unvalidated.
- Base URL: `https://api.openweathermap.org/geo/1.0/direct` (HTTPS, see Notes).
- Resolves with `[]` for an unknown city (HTTP 200, empty array).
- Rejects with `WeatherApiError { status, statusText, body }` on any non-2xx
  response, and with a plain `Error` when `APP_ID` is missing.

```ts
type GeoLocation = {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
};
```

## Notes

- Docs: https://openweathermap.org/api/geocoding-api
