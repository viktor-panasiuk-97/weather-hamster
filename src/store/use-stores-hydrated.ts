import { useCitiesStore } from "@/store/cities";
import { useCurrentWeatherStore } from "@/store/current-weather-in-cities";
import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  const unsubscribeCities = useCitiesStore.persist.onFinishHydration(onChange);
  const unsubscribeWeather = useCurrentWeatherStore.persist.onFinishHydration(onChange);

  return () => {
    unsubscribeCities();
    unsubscribeWeather();
  };
}

function getSnapshot() {
  return useCitiesStore.persist.hasHydrated() && useCurrentWeatherStore.persist.hasHydrated();
}

// Persisted stores load from AsyncStorage asynchronously; writing before hydration
// finishes would be overwritten by the stale persisted state.
export function useStoresHydrated() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
