import { getCurrentWeatherData, type GeoLocation } from "@/api/weather-api";
import { CityCard } from "@/components/cities-weather-list/city-card";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useLoader } from "@/context/loader";
import { useCitiesStore } from "@/store/cities";
import { useCurrentWeatherStore } from "@/store/current-weather-in-cities";
import { useStoresHydrated } from "@/store/use-stores-hydrated";
import { getCityKey, getLocalizedCityName } from "@/utils";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleProp, StyleSheet, ViewStyle } from "react-native";

const FIVE_MINUTES_MS = 5 * 60 * 1000;

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

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    showLoader();

    const { weatherByCity, setCityWeather } = useCurrentWeatherStore.getState();

    Promise.all(
      cities.map(async (city) => {
        const cityName = getCityKey(city);
        const existing = weatherByCity[cityName];

        if (existing && Date.now() - existing.latestUpdateTimeStamp < FIVE_MINUTES_MS) {
          return;
        }

        const data = await getCurrentWeatherData(city.lat, city.lon);
        setCityWeather(cityName, data, Date.now());
      }),
    ).finally(hideLoader);
  }, [hydrated, cities, showLoader, hideLoader]);

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
