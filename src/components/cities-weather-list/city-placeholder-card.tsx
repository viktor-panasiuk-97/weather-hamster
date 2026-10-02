import type { GeoLocation } from "@/api/weather-api";
import { CARD_GRADIENT, cardStyles } from "@/components/cities-weather-list/city-card";
import { SwipeToDelete } from "@/components/cities-weather-list/swipe-to-delete";
import { getLocalizedCityName } from "@/utils";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
  city: GeoLocation;
  failed: boolean;
  onRetry: () => void;
  onDelete: () => void;
};

// Shown for a saved city that has no weather data yet: either still loading or failed to load.
export function CityPlaceholderCard({ city, failed, onRetry, onDelete }: Props) {
  const { t, i18n } = useTranslation();

  return (
    <SwipeToDelete onDelete={onDelete}>
      <Pressable onPress={failed ? onRetry : undefined} onLongPress={onDelete}>
        <LinearGradient
          colors={CARD_GRADIENT}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[cardStyles.card, styles.card]}
        >
          <Text style={cardStyles.cityName}>
            {getLocalizedCityName(city, i18n.language)}, {city.country}
          </Text>
          <Text style={cardStyles.description} numberOfLines={1}>
            {failed ? t("common.cityLoadError") : t("cityWeather.loading")}
          </Text>
        </LinearGradient>
      </Pressable>
    </SwipeToDelete>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    gap: 6,
  },
});
