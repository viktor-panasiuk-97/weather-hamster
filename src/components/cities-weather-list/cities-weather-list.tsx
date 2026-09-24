import { getCurrentWeatherData, type CurrentWeatherData, type GeoLocation } from "@/api/weather-api";
import { getCities } from "@/store/cities";
import { getCitiesWeather, setCityWeather } from "@/store/current-weather-in-cities";
import { useEffect, useState } from "react";
import { ScrollView, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

const FIVE_MINUTES_MS = 5 * 60 * 1000;

function cityKey(city: GeoLocation) {
  return `${city.name}_${city.state}`;
}

type CitiesWeatherListProps = {
  style?: StyleProp<ViewStyle>;
};

function CityRow({ city, data }: { city: GeoLocation; data: CurrentWeatherData }) {
  return (
    <View style={styles.row}>
      <Text style={styles.cityName}>
        {city.name}, {city.country}
      </Text>
      <Text style={styles.temperature}>{Math.round(data.main.temp)}°</Text>
    </View>
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

        return data ? <CityRow key={cityKey(city)} city={city} data={data} /> : null;
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: 8,
    backgroundColor: "#121212",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#1c1c1e",
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2c",
  },
  cityName: {
    fontSize: 16,
    color: "#e5e5e7",
  },
  temperature: {
    fontSize: 16,
    color: "#8e8e93",
    fontWeight: "600",
  },
});
