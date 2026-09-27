import { APP_ID } from "@/constants/env";

const GEO_BASE_URL = "https://api.openweathermap.org/geo/1.0/direct";
const CURRENT_WEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_BASE_URL = "https://api.openweathermap.org/data/2.5/forecast";

export type GeoLocation = {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
};

export type CurrentWeatherData = {
  coord: { lon: number; lat: number };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: { speed: number; deg: number; gust?: number };
  clouds: { all: number };
  rain?: { "1h"?: number; "3h"?: number };
  snow?: { "1h"?: number; "3h"?: number };
  dt: number;
  sys: {
    type?: number;
    id?: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
};

export type ForecastItem = {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
    temp_kf?: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: { all: number };
  wind: { speed: number; deg: number; gust?: number };
  visibility: number;
  pop: number;
  rain?: { "3h"?: number };
  snow?: { "3h"?: number };
  sys: { pod: "d" | "n" };
  dt_txt: string;
};

export type ForecastData = {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: {
    id: number;
    name: string;
    coord: { lat: number; lon: number };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
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

  const response = await fetch(`${GEO_BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    const body = await response.text();
    throw new WeatherApiError(response.status, response.statusText, body);
  }

  return response.json() as Promise<GeoLocation[]>;
}

export async function getCurrentWeatherData(
  lat: number,
  lon: number,
  units: "standard" | "metric" | "imperial" = "metric",
): Promise<CurrentWeatherData> {
  if (!APP_ID) {
    throw new Error(
      "EXPO_PUBLIC_OPENWEATHERMAP_APP_ID is not set — copy .env.example to .env",
    );
  }

  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    units,
    appid: APP_ID,
  });

  const response = await fetch(`${CURRENT_WEATHER_BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    const body = await response.text();
    throw new WeatherApiError(response.status, response.statusText, body);
  }

  return response.json() as Promise<CurrentWeatherData>;
}

export async function getForecastByCoordinates(
  lat: number,
  lon: number,
  count: number = 16,
  units: "standard" | "metric" | "imperial" = "metric",
): Promise<ForecastData> {
  if (!APP_ID) {
    throw new Error(
      "EXPO_PUBLIC_OPENWEATHERMAP_APP_ID is not set — copy .env.example to .env",
    );
  }

  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    cnt: String(count),
    units,
    appid: APP_ID,
  });

  const response = await fetch(`${FORECAST_BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    const body = await response.text();
    throw new WeatherApiError(response.status, response.statusText, body);
  }

  return response.json() as Promise<ForecastData>;
}
