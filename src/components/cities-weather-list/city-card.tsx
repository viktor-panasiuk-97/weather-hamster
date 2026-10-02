import type { CurrentWeatherData, GeoLocation } from "@/api/weather-api";
import { SwipeToDelete } from "@/components/cities-weather-list/swipe-to-delete";
import { WeatherHamsterIcon } from "@/components/weather-hamster-icon";
import { getHamsterVariant, getLocalizedCityName, getLocalizedWeatherDescription } from "@/utils";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

export const CARD_GRADIENT = ["#ffc285", "#f07b1f"] as const;

export function CityCard({
  city,
  data,
  locationKey,
  onDelete,
}: {
  city: GeoLocation;
  data: CurrentWeatherData;
  locationKey: string;
  onDelete: () => void;
}) {
  const { t, i18n } = useTranslation();

  return (
    <SwipeToDelete onDelete={onDelete}>
      <Link
        href={{
          pathname: "/city-weather",
          params: { locationKey },
        }}
        asChild
      >
        <Pressable onLongPress={onDelete}>
          <LinearGradient
            colors={CARD_GRADIENT}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={cardStyles.card}
          >
            <View style={styles.leftColumn}>
              <Text style={cardStyles.cityName}>
                {getLocalizedCityName(city, i18n.language)}, {city.country}
              </Text>
              <Text style={cardStyles.description} numberOfLines={1}>
                {getLocalizedWeatherDescription(data.weather[0], t)}
              </Text>
            </View>
            <View style={styles.icon}>
              <WeatherHamsterIcon variant={getHamsterVariant(data.weather[0]?.icon)} size={72} />
            </View>
            <View style={styles.rightColumn}>
              <Text style={styles.currentTemp}>{Math.round(data.main.temp)}°</Text>
              <Text style={styles.minMax}>
                {t("cityWeather.highLow", {
                  max: Math.round(data.main.temp_max),
                  min: Math.round(data.main.temp_min),
                })}
              </Text>
            </View>
          </LinearGradient>
        </Pressable>
      </Link>
    </SwipeToDelete>
  );
}

// Shared with CityPlaceholderCard so both cards look the same.
export const cardStyles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 14,
    padding: 12,
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
  },
  cityName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#e5e5e7",
  },
  description: {
    fontSize: 13,
    color: "#d1d1d6",
  },
});

const styles = StyleSheet.create({
  leftColumn: {
    flex: 1,
    justifyContent: "space-between",
  },
  icon: {
    alignSelf: "center",
    marginHorizontal: 12,
  },
  rightColumn: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  currentTemp: {
    fontSize: 40,
    fontWeight: "300",
    color: "#e5e5e7",
  },
  minMax: {
    fontSize: 13,
    color: "#d1d1d6",
  },
});
