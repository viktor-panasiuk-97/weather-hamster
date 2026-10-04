import { getCurrentWeatherData, type GeoLocation } from "@/api/weather-api";
import { CityCard } from "@/components/cities-weather-list/city-card";
import { CityPlaceholderCard } from "@/components/cities-weather-list/city-placeholder-card";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useLoader } from "@/context/loader";
import { useCitiesStore } from "@/store/cities";
import { useCurrentWeatherStore } from "@/store/current-weather-in-cities";
import { useErrorBarStore } from "@/store/error-bar";
import { useStoresHydrated } from "@/store/use-stores-hydrated";
import { getCityKey, getLocalizedCityName } from "@/utils";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleProp, StyleSheet, ViewStyle } from "react-native";

const FIVE_MINUTES_MS = 5 * 60 * 1000;

// Fetches weather for cities with missing or stale data. Returns the keys of cities that failed.
async function refreshStaleWeather(cities: GeoLocation[]): Promise<string[]> {
  const { weatherByCity, setCityWeather } = useCurrentWeatherStore.getState();

  const results = await Promise.allSettled(
    cities.map(async (city) => {
      const cityName = getCityKey(city);
      const existing = weatherByCity[cityName];

      if (existing && Date.now() - existing.latestUpdateTimeStamp < FIVE_MINUTES_MS) {
        return;
      }

      const data = await getCurrentWeatherData(city.lat, city.lon);
      setCityWeather(cityName, data, Date.now());
    }),
  );

  return cities
    .filter((_, index) => results[index].status === "rejected")
    .map((city) => getCityKey(city));
}

// Loads one city's weather without the full-screen loader; its placeholder card shows meanwhile.
function loadCityWeather(city: GeoLocation, setFailedKeys: Dispatch<SetStateAction<string[]>>) {
  const key = getCityKey(city);
  setFailedKeys((keys) => keys.filter((k) => k !== key));

  refreshStaleWeather([city]).then((failed) => {
    if (failed.length > 0) {
      setFailedKeys((keys) => [...keys, key]);
    }
  });
}

type CitiesWeatherListProps = {
  style?: StyleProp<ViewStyle>;
};

export function CitiesWeatherList({ style }: CitiesWeatherListProps) {
  const cities = useCitiesStore((state) => state.cities);
  const removeCity = useCitiesStore((state) => state.removeCity);
  const weatherByCity = useCurrentWeatherStore((state) => state.weatherByCity);
  const [cityToDelete, setCityToDelete] = useState<GeoLocation | null>(null);
  // Not persisted: whether a city failed is decided again on every refresh.
  const [failedKeys, setFailedKeys] = useState<string[]>([]);
  const { t, i18n } = useTranslation();
  const hydrated = useStoresHydrated();
  const { showLoader, hideLoader } = useLoader();
  const showErrorBar = useErrorBarStore((state) => state.showErrorBar);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const refresh = () => {
      showLoader();

      // Read the latest cities so a retry skips cities removed in the meantime.
      refreshStaleWeather(useCitiesStore.getState().cities)
        .then((failed) => {
          setFailedKeys(failed);
          if (failed.length > 0) {
            showErrorBar({ message: i18n.t("common.weatherLoadError"), onRetry: refresh });
          }
        })
        .finally(hideLoader);
    };

    refresh();

    // After the initial refresh, only added cities need weather; removing a city fetches nothing.
    return useCitiesStore.subscribe((state, prev) => {
      const prevKeys = new Set(prev.cities.map(getCityKey));
      state.cities.forEach((city) => {
        if (!prevKeys.has(getCityKey(city))) {
          loadCityWeather(city, setFailedKeys);
        }
      });
    });
  }, [hydrated, showLoader, hideLoader, showErrorBar, i18n]);

  // Retries a single city from its placeholder card.
  const retryCity = (city: GeoLocation) => loadCityWeather(city, setFailedKeys);

  return (
    <>
      <ScrollView style={style} contentContainerStyle={styles.content}>
        {cities.map((city) => {
          const key = getCityKey(city);
          const data = weatherByCity[key]?.data;

          return data ? (
            <CityCard
              key={key}
              city={city}
              data={data}
              locationKey={key}
              onDelete={() => setCityToDelete(city)}
            />
          ) : (
            <CityPlaceholderCard
              key={key}
              city={city}
              failed={failedKeys.includes(key)}
              onRetry={() => retryCity(city)}
              onDelete={() => setCityToDelete(city)}
            />
          );
        })}
      </ScrollView>
      <ConfirmDialog
        visible={cityToDelete !== null}
        title={t("common.deleteCityTitle")}
        message={t("common.deleteCityMessage", {
          city: cityToDelete ? getLocalizedCityName(cityToDelete, i18n.language) : "",
        })}
        confirmLabel={t("common.remove")}
        cancelLabel={t("common.cancel")}
        onConfirm={() => {
          if (cityToDelete) {
            removeCity(cityToDelete);
          }
          setCityToDelete(null);
        }}
        onCancel={() => setCityToDelete(null)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: 8,
  },
});
