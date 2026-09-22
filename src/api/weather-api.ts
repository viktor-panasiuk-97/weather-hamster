import { APP_ID } from "@/constants/env";

const GEO_BASE_URL = "https://api.openweathermap.org/geo/1.0/direct";

export type GeoLocation = {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
};

export class WeatherApiError extends Error {
  status: number;
  statusText: string;
  body: string;

  constructor(status: number, statusText: string, body: string) {
    super(`Weather API error ${status} ${statusText}`);
    this.name = "WeatherApiError";
    this.status = status;
    this.statusText = statusText;
    this.body = body;
  }
}

export async function geoCordinatesByCityName(
  cityName: string,
  limit: number = 10,
): Promise<GeoLocation[]> {
  if (!APP_ID) {
    throw new Error(
      "EXPO_PUBLIC_OPENWEATHERMAP_APP_ID is not set — copy .env.example to .env",
    );
  }

  const params = new URLSearchParams({
    q: cityName,
    limit: String(limit),
    appid: APP_ID,
  });
  console.log(`${GEO_BASE_URL}?${params.toString()}`)

  const response = await fetch(`${GEO_BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    const body = await response.text();
    throw new WeatherApiError(response.status, response.statusText, body);
  }

  return response.json() as Promise<GeoLocation[]>;
}
