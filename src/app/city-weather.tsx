import type { CurrentWeatherData } from "@/api/weather-api";
import { DaysForecast } from "@/components/days-forecast";
import { WeatherHamster } from "@/components/weather-hamster";
import { useCitiesStore } from "@/store/cities";
import { useCurrentWeatherStore } from "@/store/current-weather-in-cities";
import { getCityKey, getHamsterVariant, getLocalizedCityName } from "@/utils";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { ImageBackground, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";

function goHome() {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace("/");
  }
}

function formatTime(unixSeconds: number, locale: string) {
  return new Date(unixSeconds * 1000).toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function TableRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

function WeatherTable({
  data,
  latestUpdateTimeStamp,
}: {
  data: CurrentWeatherData;
  latestUpdateTimeStamp: number;
}) {
  const { t, i18n } = useTranslation();

  return (
    <View style={styles.table}>
      <TableRow label={t("cityWeather.humidity")} value={`${data.main.humidity}%`} />
      <TableRow
        label={t("cityWeather.pressure")}
        value={t("cityWeather.units.pressure", { value: data.main.pressure })}
      />
      <TableRow
        label={t("cityWeather.wind")}
        value={t("cityWeather.units.wind", { speed: data.wind.speed, deg: data.wind.deg })}
      />
      <TableRow label={t("cityWeather.clouds")} value={`${data.clouds.all}%`} />
      <TableRow
        label={t("cityWeather.visibility")}
        value={t("cityWeather.units.visibility", { value: data.visibility })}
      />
      <TableRow label={t("cityWeather.sunrise")} value={formatTime(data.sys.sunrise, i18n.language)} />
      <TableRow label={t("cityWeather.sunset")} value={formatTime(data.sys.sunset, i18n.language)} />
      <TableRow
        label={t("cityWeather.updated")}
        value={new Date(latestUpdateTimeStamp).toLocaleTimeString(i18n.language)}
      />
    </View>
  );
}

export default function CityWeather() {
  const { locationKey } = useLocalSearchParams<{ locationKey: string }>();
  const weather = useCurrentWeatherStore((state) => state.weatherByCity[locationKey]);
  const city = useCitiesStore((state) =>
    state.cities.find((c) => getCityKey(c) === locationKey),
  );
  const { t, i18n } = useTranslation();

  const { height } = useWindowDimensions();
  const translateY = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const startedAtTop = useSharedValue(false);

  const scrollHandler = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  const scroll = Gesture.Native();

  // Swipe-down dismiss only applies when the drag starts with the content scrolled to the top;
  // otherwise the drag belongs to the ScrollView.
  const pan = Gesture.Pan()
    .activeOffsetY(10)
    .failOffsetX([-10, 10])
    .simultaneousWithExternalGesture(scroll)
    .onStart(() => {
      startedAtTop.value = scrollY.value <= 0;
    })
    .onUpdate((e) => {
      if (startedAtTop.value) {
        translateY.value = Math.max(0, e.translationY);
      }
    })
    .onEnd((e) => {
      if (!startedAtTop.value) {
        return;
      }
      if (translateY.value > height * 0.25 || e.velocityY > 800) {
        scheduleOnRN(goHome);
      } else {
        translateY.value = withSpring(0);
      }
    });

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <GestureDetector gesture={pan}>
    <Animated.View style={[styles.container, containerStyle]}>
      <ImageBackground
        source={require("@/assets/images/bg.jpg")}
        style={styles.background}
        resizeMode="repeat"
      >
      <SafeAreaView style={styles.safeArea}>
      <GestureDetector gesture={scroll}>
      <Animated.ScrollView
        contentContainerStyle={styles.content}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        bounces={false}
        overScrollMode="never"
      >
      {weather ? (
        <>
          <Text style={styles.cityName}>
            {city ? getLocalizedCityName(city, i18n.language) : weather.data.name}
          </Text>

          <View style={styles.hamster}>
            <WeatherHamster variant={getHamsterVariant(weather.data.weather[0]?.icon)} size={150} />
          </View>
          <View style={styles.headline}>
            <Text style={styles.condition}>{weather.data.weather[0]?.description ?? "—"}</Text>
            <Text style={styles.currentTemp}>{Math.round(weather.data.main.temp)}°C</Text>
            <Text style={styles.subInfo}>
              {t("cityWeather.summary", {
                feelsLike: Math.round(weather.data.main.feels_like),
                min: Math.round(weather.data.main.temp_min),
                max: Math.round(weather.data.main.temp_max),
              })}
            </Text>
          </View>
          <WeatherTable data={weather.data} latestUpdateTimeStamp={weather.latestUpdateTimeStamp} />
          <DaysForecast lat={weather.data.coord.lat} lon={weather.data.coord.lon} />
        </>
      ) : (
        <Text style={styles.loading}>{t("cityWeather.loading")}</Text>
      )}
      </Animated.ScrollView>
      </GestureDetector>
      </SafeAreaView>
      </ImageBackground>
    </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  loading: {
    color: "#1c1c1e",
    textAlign: "center",
    marginTop: 24,
  },
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
    textTransform: "capitalize",
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
  table: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#1c1c1e",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2c",
  },
  label: {
    fontSize: 15,
    color: "#8e8e93",
  },
  value: {
    fontSize: 15,
    color: "#e5e5e7",
    fontWeight: "600",
  },
});
