import { DaysForecast } from "@/components/days-forecast";
import { DismissibleScreen } from "@/components/dismissible-screen";
import { WeatherHeadline } from "@/components/weather-headline";
import { WeatherTable } from "@/components/weather-table";
import { useCitiesStore } from "@/store/cities";
import { useCurrentWeatherStore } from "@/store/current-weather-in-cities";
import { getCityKey } from "@/utils";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text } from "react-native";

const goHome = () => {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace("/");
  }
};

/**
 * Detail screen for a single city: looks up its stored current weather and renders the headline,
 * details table and multi-day forecast inside a swipe-down-to-dismiss container.
 */
export default function CityForecast() {
  const { locationKey } = useLocalSearchParams<{ locationKey: string }>();
  const weather = useCurrentWeatherStore((state) => state.weatherByCity[locationKey]);
  const city = useCitiesStore((state) =>
    state.cities.find((c) => getCityKey(c) === locationKey),
  );
  const { t } = useTranslation();

  return (
    <DismissibleScreen onDismiss={goHome}>
      {weather ? (
        <>
          <WeatherHeadline data={weather.data} city={city} />
          <WeatherTable data={weather.data} latestUpdateTimeStamp={weather.latestUpdateTimeStamp} />
          <DaysForecast lat={weather.data.coord.lat} lon={weather.data.coord.lon} />
        </>
      ) : (
        <Text style={styles.loading}>{t("cityWeather.loading")}</Text>
      )}
    </DismissibleScreen>
  );
}

const styles = StyleSheet.create({
  loading: {
    color: "#1c1c1e",
    textAlign: "center",
    marginTop: 24,
  },
});
