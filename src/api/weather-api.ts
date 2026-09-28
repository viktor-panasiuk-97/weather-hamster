import { FetchHttpClient, HttpError, type HttpClient, type QueryParams } from "@/api/http-client";
import type { CurrentWeatherData, ForecastData, GeoLocation } from "@/api/weather-api.types";
import { requireAppId } from "@/constants/env";

export type { CurrentWeatherData, ForecastData, ForecastItem, GeoLocation } from "@/api/weather-api.types";

const GEO_BASE_URL = "https://api.openweathermap.org/geo/1.0/direct";
const CURRENT_WEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_BASE_URL = "https://api.openweathermap.org/data/2.5/forecast";

export class WeatherApiError extends HttpError {
  constructor(status: number, statusText: string, body: string) {
    super(status, statusText, body, `Weather API error ${status} ${statusText}`);
    this.name = "WeatherApiError";
  }
}

let httpClient: HttpClient = new FetchHttpClient();

/**
 * Replaces the HTTP adapter used for all weather API requests (e.g. for mocks or another transport).
 */
export function setWeatherHttpClient(client: HttpClient): void {
  httpClient = client;
}

async function request<T>(url: string, params: QueryParams): Promise<T> {
  try {
    return await httpClient.get<T>(url, { ...params, appid: requireAppId() });
  } catch (error) {
    if (error instanceof HttpError) {
      throw new WeatherApiError(error.status, error.statusText, error.body);
    }
    throw error;
  }
}

/**
 * Looks up locations matching a city name.
 *
 * @param cityName City name, optionally with state/country code (e.g. "London,GB").
 * @param limit Maximum number of matches to return.
 * @throws {WeatherApiError} If the API responds with a non-2xx status.
 */
export async function geoCordinatesByCityName(
  cityName: string,
  limit: number = 10,
): Promise<GeoLocation[]> {
  return request<GeoLocation[]>(GEO_BASE_URL, { q: cityName, limit });
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
  return request<CurrentWeatherData>(CURRENT_WEATHER_BASE_URL, { lat, lon, units });
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
  return request<ForecastData>(FORECAST_BASE_URL, { lat, lon, cnt: count, units });
}
