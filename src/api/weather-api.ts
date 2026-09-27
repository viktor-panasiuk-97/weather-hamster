import { requireAppId } from "@/constants/env";

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

/**
 * Looks up locations matching a city name via the OpenWeatherMap Geocoding API.
 *
 * @param cityName City name, optionally with state/country code (e.g. "London,GB").
 * @param limit Maximum number of matches to return.
 * @throws {WeatherApiError} If the API responds with a non-2xx status.
 */
export async function geoCordinatesByCityName(
  cityName: string,
  limit: number = 10,
): Promise<GeoLocation[]> {
  const params = new URLSearchParams({
    q: cityName,
    limit: String(limit),
    appid: requireAppId(),
  });

  const response = await fetch(`${GEO_BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    const body = await response.text();
    throw new WeatherApiError(response.status, response.statusText, body);
  }

  return response.json() as Promise<GeoLocation[]>;
}

/**
 * Fetches current weather conditions for the given coordinates.
 *
 * @param lat Latitude.
 * @param lon Longitude.
 * @param units Unit system for temperature and wind speed.
 * @throws {WeatherApiError} If the API responds with a non-2xx status.
 */
export async function getCurrentWeatherData(
  lat: number,
  lon: number,
  units: "standard" | "metric" | "imperial" = "metric",
): Promise<CurrentWeatherData> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    units,
    appid: requireAppId(),
  });

  const response = await fetch(`${CURRENT_WEATHER_BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    const body = await response.text();
    throw new WeatherApiError(response.status, response.statusText, body);
  }

  return response.json() as Promise<CurrentWeatherData>;
}

/**
 * Fetches the 5-day forecast (3-hour steps) for the given coordinates.
 *
 * @param lat Latitude.
 * @param lon Longitude.
 * @param count Number of 3-hour timestamps to return (max 40).
 * @param units Unit system for temperature and wind speed.
 * @throws {WeatherApiError} If the API responds with a non-2xx status.
 */
export async function getForecastByCoordinates(
  lat: number,
  lon: number,
  count: number = 16,
  units: "standard" | "metric" | "imperial" = "metric",
): Promise<ForecastData> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    cnt: String(count),
    units,
    appid: requireAppId(),
  });

  const response = await fetch(`${FORECAST_BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    const body = await response.text();
    throw new WeatherApiError(response.status, response.statusText, body);
  }

  return response.json() as Promise<ForecastData>;
}
