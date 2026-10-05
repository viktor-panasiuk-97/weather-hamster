import type { CurrentWeatherData } from "@/api/weather-api";
import { zustandStorage } from "@/store/storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CityWeather = {
  latestUpdateTimeStamp: number;
  data: CurrentWeatherData;
};

type CurrentWeatherState = {
  weatherByCity: Record<string, CityWeather>;
  setCityWeather: (
    cityKey: string,
    data: CurrentWeatherData,
    latestUpdateTimeStamp: number,
  ) => void;
  removeCityWeather: (cityKey: string) => void;
};

export const useCurrentWeatherStore = create<CurrentWeatherState>()(
  persist(
    (set) => ({
      weatherByCity: {},
      setCityWeather: (cityKey, data, latestUpdateTimeStamp) =>
        set((state) => ({
          weatherByCity: {
            ...state.weatherByCity,
            [cityKey]: { latestUpdateTimeStamp, data },
          },
        })),
      removeCityWeather: (cityKey) =>
        set((state) => {
          const { [cityKey]: _removed, ...weatherByCity } = state.weatherByCity;

          return { weatherByCity };
        }),
    }),
    { name: "current-weather-in-cities", storage: zustandStorage },
  ),
);
