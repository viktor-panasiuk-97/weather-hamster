import type { CurrentWeatherData, GeoLocation } from "@/api/weather-api";
import { WeatherHamster } from "@/components/weather-hamster";
import { getHamsterVariant, getLocalizedCityName, getLocalizedWeatherDescription } from "@/utils";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

export function WeatherHeadline({ data, city }: { data: CurrentWeatherData; city?: GeoLocation }) {
  const { t, i18n } = useTranslation();

  return (
    <>
      <Text style={styles.cityName}>{city ? getLocalizedCityName(city, i18n.language) : data.name}</Text>

      <View style={styles.hamster}>
        <WeatherHamster variant={getHamsterVariant(data.weather[0]?.icon)} size={150} />
      </View>
      <View style={styles.headline}>
        <Text style={styles.condition}>{getLocalizedWeatherDescription(data.weather[0], t)}</Text>
        <Text style={styles.currentTemp}>{Math.round(data.main.temp)}°C</Text>
        <Text style={styles.subInfo}>
          {t("cityWeather.summary", {
            feelsLike: Math.round(data.main.feels_like),
            min: Math.round(data.main.temp_min),
            max: Math.round(data.main.temp_max),
          })}
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  hamster: {
    alignItems: "center",
    marginBottom: 16,
  },
  headline: {
    alignItems: "center",
    marginBottom: 16,
  },
  cityName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1c1c1e",
    textAlign: "center",
  },
  condition: {
    fontSize: 16,
    color: "#3a3a3c",
    marginTop: 4,
  },
  currentTemp: {
    fontSize: 48,
    fontWeight: "600",
    color: "#1c1c1e",
    marginTop: 4,
  },
  subInfo: {
    fontSize: 15,
    color: "#3a3a3c",
    marginTop: 4,
  },
});
