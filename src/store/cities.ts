import type { GeoLocation } from "@/api/weather-api";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("cities.db");

db.execSync(`
  CREATE TABLE IF NOT EXISTS cities (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    local_names TEXT,
    lat REAL NOT NULL,
    lon REAL NOT NULL,
    country TEXT NOT NULL,
    state TEXT
  );
`);

export async function addCities(cities: GeoLocation[]) {
  for (const city of cities) {
    await db.runAsync(
      "INSERT INTO cities (name, local_names, lat, lon, country, state) VALUES (?, ?, ?, ?, ?, ?)",
      city.name,
      city.local_names ? JSON.stringify(city.local_names) : null,
      city.lat,
      city.lon,
      city.country,
      city.state ?? null,
    );
  }
}

export async function removeCities(cities: GeoLocation[]) {
  for (const city of cities) {
    await db.runAsync(
      "DELETE FROM cities WHERE lat = ? AND lon = ?",
      city.lat,
      city.lon,
    );
  }
}

export async function getCities(): Promise<GeoLocation[]> {
  const rows = await db.getAllAsync<{
    name: string;
    local_names: string | null;
    lat: number;
    lon: number;
    country: string;
    state: string | null;
  }>("SELECT name, local_names, lat, lon, country, state FROM cities");

  return rows.map((row) => ({
    name: row.name,
    local_names: row.local_names
      ? (JSON.parse(row.local_names) as Record<string, string>)
      : undefined,
    lat: row.lat,
    lon: row.lon,
    country: row.country,
    state: row.state ?? undefined,
  }));
}
