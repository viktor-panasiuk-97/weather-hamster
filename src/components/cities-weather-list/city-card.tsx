import type { CurrentWeatherData, GeoLocation } from "@/api/weather-api";
import { RemoveCard } from "@/components/cities-weather-list/remove-card";
import { WeatherHamsterIcon } from "@/components/weather-hamster-icon";
import { getHamsterVariant, getLocalizedCityName, getLocalizedWeatherDescription } from "@/utils";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

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
  const translateX = useSharedValue(0);
  const cardWidth = useSharedValue(0);

  const pan = Gesture.Pan()
    .activeOffsetX(-10)
    .failOffsetY([-10, 10])
    .onUpdate((e) => {
      translateX.value = Math.min(0, e.translationX);
    })
    .onEnd(() => {
      if (-translateX.value > cardWidth.value / 2) {
        scheduleOnRN(onDelete);
      }
      translateX.value = withSpring(0);
    });

  const removeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-40, 0], [1, 0], Extrapolation.CLAMP),
  }));

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      style={styles.cardWrapper}
      onLayout={(e) => {
        cardWidth.value = e.nativeEvent.layout.width;
      }}
    >
      <Animated.View style={[StyleSheet.absoluteFill, removeStyle]}>
        <RemoveCard />
      </Animated.View>
      <GestureDetector gesture={pan}>
        <Animated.View style={cardStyle}>
          <Link
            href={{
              pathname: "/city-weather",
              params: { locationKey },
            }}
            asChild
          >
            <Pressable>
              <LinearGradient
                colors={["#ffc285", "#f07b1f"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
              >
                <View style={styles.leftColumn}>
                  <Text style={styles.cityName}>
                    {getLocalizedCityName(city, i18n.language)}, {city.country}
                  </Text>
                  <Text style={styles.description} numberOfLines={1}>
                    {getLocalizedWeatherDescription(data.weather[0], t)}
                  </Text>
                </View>
                <View style={styles.icon}>
                  <WeatherHamsterIcon variant={getHamsterVariant(data.weather[0]?.icon)} size={72} />
                </View>
                <View style={styles.rightColumn}>
                  <Text style={styles.currentTemp}>{Math.round(data.main.temp)}°</Text>
                  <Text style={styles.minMax}>
                    H: {Math.round(data.main.temp_max)}°  L: {Math.round(data.main.temp_min)}°
                  </Text>
                </View>
              </LinearGradient>
            </Pressable>
          </Link>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: 16,
    marginVertical: 5,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 14,
    padding: 12,
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
  },
  leftColumn: {
    flex: 1,
    justifyContent: "space-between",
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
