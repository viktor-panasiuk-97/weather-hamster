import { en } from "@/i18n/locales/en";
import type { TFunction } from "i18next";

type WeatherConditionId = keyof typeof en.weatherConditions;

const isKnownConditionId = (id: string): id is WeatherConditionId => id in en.weatherConditions;

// Translates by condition id; falls back to the API text for ids missing from our dictionary.
export const getLocalizedWeatherDescription = (
  condition: { id: number; description: string } | undefined,
  t: TFunction,
): string => {
  if (!condition) {
    return "—";
  }
  const id = String(condition.id);
  return isKnownConditionId(id) ? t(`weatherConditions.${id}`) : condition.description;
};
