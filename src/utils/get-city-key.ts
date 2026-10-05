import type { GeoLocation } from "@/api/weather-api";

export const getCityKey = ({ lat, lon }: Pick<GeoLocation, "lat" | "lon">): string =>
  `${lat.toFixed(4)},${lon.toFixed(4)}`;
