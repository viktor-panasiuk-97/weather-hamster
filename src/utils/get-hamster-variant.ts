import type { WeatherHamsterVariant } from "@/components/weather-hamster";

const ICONS_MAP: Record<string, WeatherHamsterVariant> = {
  "01d": "clear sky",
  "02d": "few clouds",
  "03d": "scattered clouds",
  "04d": "broken clouds",
  "09d": "shower rain",
  "10d": "rain",
  "11d": "thunderstorm",
  "13d": "snow",
  "50d": "mist",
  "01n": "clear sky",
  "02n": "few clouds",
  "03n": "scattered clouds",
  "04n": "broken clouds",
  "09n": "shower rain",
  "10n": "rain",
  "11n": "thunderstorm",
  "13n": "snow",
  "50n": "mist",
};

export function getHamsterVariant(icon: string | undefined): WeatherHamsterVariant {
  return (typeof icon !== "undefined" ? ICONS_MAP[icon] : undefined) ?? "sleep";
}
