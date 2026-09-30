import type { GeoLocation } from "@/api/weather-api";

export const getCityKey = (city: GeoLocation): string =>
  `${city.name}_${city.state}_${city.country}`;
