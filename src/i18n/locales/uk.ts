import type { TranslationResources } from "./en";

export const uk: TranslationResources = {
  common: {
    searchFieldPlaceholder: "Пошук міста",
  },
  cityWeather: {
    loading: "Завантаження…",
    summary: "Відчувається як {{feelsLike}}°C | Мін {{min}}° / Макс {{max}}°",
    humidity: "Вологість",
    pressure: "Тиск",
    wind: "Вітер",
    clouds: "Хмарність",
    visibility: "Видимість",
    sunrise: "Схід сонця",
    sunset: "Захід сонця",
    updated: "Оновлено",
    units: {
      pressure: "{{value}} гПа",
      wind: "{{speed}} м/с, {{deg}}°",
      visibility: "{{value}} м",
    },
  },
};
