import type { CurrentWeatherData } from "@/api/weather-api";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("cities.db");

db.execSync(`
  CREATE TABLE IF NOT EXISTS current_weather_in_cities (
    city_name TEXT PRIMARY KEY NOT NULL,
    latest_update_timestamp INTEGER NOT NULL,
    data TEXT NOT NULL
  );
`);

export async function setCityWeather(
  cityName: string,
  data: CurrentWeatherData,
  latestUpdateTimeStamp: number,
) {
  await db.runAsync(
    `INSERT INTO current_weather_in_cities (city_name, latest_update_timestamp, data)
     VALUES (?, ?, ?)
     ON CONFLICT(city_name) DO UPDATE SET
       latest_update_timestamp = excluded.latest_update_timestamp,
       data = excluded.data`,
    cityName,
    latestUpdateTimeStamp,
    JSON.stringify(data),
  );
}

export async function getCitiesWeather(
  cityNames: string[],
): Promise<Record<string, { latestUpdateTimeStamp: number; data: CurrentWeatherData }>> {
  if (cityNames.length === 0) {
    return {};
  }

  const placeholders = cityNames.map(() => "?").join(", ");
  const rows = await db.getAllAsync<{
    city_name: string;
    latest_update_timestamp: number;
    data: string;
  }>(
    `SELECT city_name, latest_update_timestamp, data
     FROM current_weather_in_cities
     WHERE city_name IN (${placeholders})`,
    cityNames,
  );

  const result: Record<string, { latestUpdateTimeStamp: number; data: CurrentWeatherData }> = {};

  for (const row of rows) {
    result[row.city_name] = {
      latestUpdateTimeStamp: row.latest_update_timestamp,
      data: JSON.parse(row.data) as CurrentWeatherData,
    };
  }


  return result;
}
