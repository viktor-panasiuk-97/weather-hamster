import type { CurrentWeatherData } from "@/api/weather-api";
import { WeatherHamster } from "@/components/weather-hamster";
import { getCitiesWeather } from "@/store/current-weather-in-cities";
import { getHamsterVariant } from "@/utils";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState, } from "react";
import { ImageBackground, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

function goHome() {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace("/");
  }
}

function formatTime(unixSeconds: number) {
  return new Date(unixSeconds * 1000).toLocaleTimeString([], {
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

/* Response example
 {"data": {"base": "stations", "clouds": {"all": 49}, "cod": 200, "coord": {"lat": 50.7451, "lon": 25.3201}, "dt": 1790245559, "id": 702569, "main": {"feels_like": 13.49, "grnd_level": 990, "humidity": 55, "pressure": 1014, "sea_level": 1014, "temp": 14.54, "temp_max": 14.54, "temp_min": 14.54}, "name": "Lutsk", "sys": {"country": "UA", "sunrise": 1790222854, "sunset": 1790266447}, "timezone": 10800, "visibility": 10000, "weather": [[Object]], "wind": {"deg": 287, "gust": 12.03, "speed": 6.2}}, "latestUpdateTimeStamp": 1790246036287}
*/

function WeatherTable({
  data,
  latestUpdateTimeStamp,
}: {
  data: CurrentWeatherData;
  latestUpdateTimeStamp: number;
}) {
  const weather = data.weather[0];

  return (
    <View style={styles.table}>
      <TableRow label="Humidity" value={`${data.main.humidity}%`} />
      <TableRow label="Pressure" value={`${data.main.pressure} hPa`} />
      <TableRow label="Wind" value={`${data.wind.speed} m/s, ${data.wind.deg}°`} />
      <TableRow label="Clouds" value={`${data.clouds.all}%`} />
      <TableRow label="Visibility" value={`${data.visibility} m`} />
      <TableRow label="Sunrise" value={formatTime(data.sys.sunrise)} />
      <TableRow label="Sunset" value={formatTime(data.sys.sunset)} />
      <TableRow label="Updated" value={new Date(latestUpdateTimeStamp).toLocaleTimeString()} />
    </View>
  );
}

export default function CityWeather() {
  const { locationKey } = useLocalSearchParams<{ locationKey: string }>();
  const [weather, setWeather] = useState<{
    data: CurrentWeatherData;
    latestUpdateTimeStamp: number;
  } | null>(null);

  useEffect(() => {
    if (!locationKey) {
      return;
    }

    getCitiesWeather([locationKey]).then((weather) => {
      setWeather(weather[locationKey] ?? null);
    });
  }, [locationKey]);

  const { height } = useWindowDimensions();
  const translateY = useSharedValue(0);

  const pan = Gesture.Pan()
    .activeOffsetY(10)
    .failOffsetX([-10, 10])
    .onUpdate((e) => {
      translateY.value = Math.max(0, e.translationY);
    })
    .onEnd((e) => {
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
      {weather ? (
        <>
          <Text style={styles.cityName}>{weather.data.name}</Text>

          <View style={styles.hamster}>
            <WeatherHamster variant={getHamsterVariant(weather.data.weather[0]?.icon)} size={150} />
          </View>
          <View style={styles.headline}>
            <Text style={styles.condition}>{weather.data.weather[0]?.description ?? "—"}</Text>
            <Text style={styles.currentTemp}>{Math.round(weather.data.main.temp)}°C</Text>
            <Text style={styles.subInfo}>
              Feels like {Math.round(weather.data.main.feels_like)}°C | Min {Math.round(weather.data.main.temp_min)}° / Max {Math.round(weather.data.main.temp_max)}°
            </Text>
          </View>
          <WeatherTable data={weather.data} latestUpdateTimeStamp={weather.latestUpdateTimeStamp} />
        </>
      ) : (
        <Text style={styles.loading}>Loading…</Text>
      )}
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
