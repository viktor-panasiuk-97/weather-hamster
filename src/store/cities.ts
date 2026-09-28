import type { GeoLocation } from "@/api/weather-api";
import { zustandStorage } from "@/store/storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type CitiesState = {
  cities: GeoLocation[];
  addCity: (city: GeoLocation) => void;
  removeCity: (city: GeoLocation) => void;
};

export const useCitiesStore = create<CitiesState>()(
  persist(
    (set) => ({
      cities: [],
      addCity: (city) => set((state) => ({ cities: [...state.cities, city] })),
      removeCity: (city) =>
        set((state) => ({
          cities: state.cities.filter((c) => c.lat !== city.lat || c.lon !== city.lon),
        })),
    }),
    { name: "cities", storage: zustandStorage },
  ),
);
