import type { GeoLocation } from "@/api/weather-api";

export const getLocalizedCityName = (city: GeoLocation, language: string): string =>
  city.local_names?.[language] ?? city.name;
