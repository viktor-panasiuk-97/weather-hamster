import { geoCordinatesByCityName, type GeoLocation } from "@/api/weather-api";
import { useCitiesStore } from "@/store/cities";
import { debounce } from "@/utils/debounce";
import { useEffect, useRef, useState } from "react";

export function useCitySearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoLocation[]>([]);
  const latestQueryRef = useRef("");
  const runSearchRef = useRef<((searchQuery: string) => void) | null>(null);

  useEffect(() => {
    runSearchRef.current = debounce((searchQuery: string) => {
      geoCordinatesByCityName(searchQuery)
        .then((locations) => {
          if (latestQueryRef.current !== searchQuery) return;
          const { cities } = useCitiesStore.getState();
          setResults(
            locations.filter((l) => !cities.some((c) => c.lat === l.lat && c.lon === l.lon)),
          );
        })
        .catch(() => {
          if (latestQueryRef.current !== searchQuery) return;
          setResults([]);
        });
    }, 250);
  }, []);

  function search(text: string) {
    setQuery(text);
    latestQueryRef.current = text;

    if (text.trim().length === 0) {
      setResults([]);
      return;
    }

    runSearchRef.current?.(text);
  }

  function reset() {
    setQuery("");
    setResults([]);
    latestQueryRef.current = "";
  }

  return { query, results, search, reset };
}
