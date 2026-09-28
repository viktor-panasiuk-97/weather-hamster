import type { GeoLocation } from "@/api/weather-api";
import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction
} from "react";

type CitiesContextValue = {
  cities: GeoLocation[];
  isLoading: boolean;
  setCities: Dispatch<SetStateAction<GeoLocation[]>>;
};

const CitiesContext = createContext<CitiesContextValue | null>(null);

type CitiesProviderProps = {
  children: ReactNode;
};

export function CitiesProvider({ children }: CitiesProviderProps) {
  const [cities, setCities] = useState<GeoLocation[]>([]);
  const [isLoading] = useState(true);

  return (
    <CitiesContext value={{ cities, isLoading, setCities }}>
      {children}
    </CitiesContext>
  );
}

export function useCities() {
  const context = useContext(CitiesContext);

  if (!context) {
    throw new Error("useCities must be used within a CitiesProvider");
  }

  return context;
}
