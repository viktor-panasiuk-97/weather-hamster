import { getCurrentWeatherData, type CurrentWeatherData, type GeoLocation } from "@/api/weather-api";
import { WeatherHamsterIcon } from "@/components/weather-hamster-icon";
import { getCities } from "@/store/cities";
import { getCitiesWeather, setCityWeather } from "@/store/current-weather-in-cities";
import { getHamsterVariant } from "@/utils";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

const FIVE_MINUTES_MS = 5 * 60 * 1000;

function cityKey(city: GeoLocation) {
  return `${city.name}_${city.state}_${city.country}`;
}

type CitiesWeatherListProps = {
  style?: StyleProp<ViewStyle>;
};

function CityCard({ city, data }: { city: GeoLocation; data: CurrentWeatherData }) {
  return (
    <Link
      href={{
        pathname: "/city-weather",
        params: { locationKey: cityKey(city) },
      }}
      asChild
    >
      <Pressable style={styles.cardWrapper}>
        <LinearGradient
          colors={["#ffc285", "#f07b1f"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={styles.leftColumn}>
            <Text style={styles.cityName}>
              {city.name}, {city.country}
            </Text>
            <Text style={styles.description} numberOfLines={1}>
              {data.weather[0]?.description}
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
  );
}

export function CitiesWeatherList({ style }: CitiesWeatherListProps) {
  const [cities, setCities] = useState<GeoLocation[]>([]);
  const [weatherByCity, setWeatherByCity] = useState<Record<string, CurrentWeatherData>>({});

  useEffect(() => {
    getCities().then(async (cities) => {
      setCities(cities);

      const cityNames = cities.map(cityKey);
      const citiesWeather = await getCitiesWeather(cityNames);

      setWeatherByCity(
        Object.fromEntries(
          Object.entries(citiesWeather).map(([name, { data }]) => [name, data]),
        ),
      );

      cities.forEach((city) => {
        const cityName = cityKey(city);
        const existing = citiesWeather[cityName];

        if (existing && Date.now() - existing.latestUpdateTimeStamp < FIVE_MINUTES_MS) {
          return;
        }

        getCurrentWeatherData(city.lat, city.lon).then((data) => {
          setCityWeather(cityName, data, Date.now());
          setWeatherByCity((prev) => ({ ...prev, [cityName]: data }));
        });
      });
    });
  }, []);

  return (
    <ScrollView style={style} contentContainerStyle={styles.content}>
      {cities.map((city) => {
        const data = weatherByCity[cityKey(city)];

        return data ? <CityCard key={cityKey(city)} city={city} data={data} /> : null;
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: 8,
  },
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
    textTransform: "capitalize",
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
