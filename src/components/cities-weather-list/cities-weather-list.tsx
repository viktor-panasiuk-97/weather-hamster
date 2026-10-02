import { getCurrentWeatherData, type GeoLocation } from "@/api/weather-api";
import { CityCard } from "@/components/cities-weather-list/city-card";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useLoader } from "@/context/loader";
import { useCitiesStore } from "@/store/cities";
import { useCurrentWeatherStore } from "@/store/current-weather-in-cities";
import { useErrorBarStore } from "@/store/error-bar";
import { useStoresHydrated } from "@/store/use-stores-hydrated";
import { getCityKey, getLocalizedCityName } from "@/utils";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleProp, StyleSheet, ViewStyle } from "react-native";

const FIVE_MINUTES_MS = 5 * 60 * 1000;

// Fetches weather for cities with missing or stale data. Returns true if any request failed.
async function refreshStaleWeather(cities: GeoLocation[]): Promise<boolean> {
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

  return results.some((result) => result.status === "rejected");
}

type CitiesWeatherListProps = {
  style?: StyleProp<ViewStyle>;
};

export function CitiesWeatherList({ style }: CitiesWeatherListProps) {
  const cities = useCitiesStore((state) => state.cities);
  const removeCity = useCitiesStore((state) => state.removeCity);
  const weatherByCity = useCurrentWeatherStore((state) => state.weatherByCity);
  const [cityToDelete, setCityToDelete] = useState<GeoLocation | null>(null);
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
        .then((hasFailures) => {
          if (hasFailures) {
            showErrorBar({ message: i18n.t("common.weatherLoadError"), onRetry: refresh });
          }
        })
        .finally(hideLoader);
    };

    refresh();
  }, [hydrated, cities, showLoader, hideLoader, showErrorBar, i18n]);

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
          ) : null;
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
