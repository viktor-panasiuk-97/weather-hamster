export const en = {
  common: {
    searchFieldPlaceholder: "Search for a city",
  },
  cityWeather: {
    loading: "Loading…",
    summary: "Feels like {{feelsLike}}°C | Min {{min}}° / Max {{max}}°",
    humidity: "Humidity",
    pressure: "Pressure",
    wind: "Wind",
    clouds: "Clouds",
    visibility: "Visibility",
    sunrise: "Sunrise",
    sunset: "Sunset",
    updated: "Updated",
    units: {
      pressure: "{{value}} hPa",
      wind: "{{speed}} m/s, {{deg}}°",
      visibility: "{{value}} m",
    },
  },
} as const;

type DeepStringRecord<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepStringRecord<T[K]>;
};

export type TranslationResources = DeepStringRecord<typeof en>;
