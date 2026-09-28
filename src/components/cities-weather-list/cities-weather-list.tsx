import { getCurrentWeatherData, type CurrentWeatherData, type GeoLocation } from "@/api/weather-api";
import { CityCard } from "@/components/cities-weather-list/city-card";
import { useCities } from "@/context/cities";
import { useLoader } from "@/context/loader";
import { getCities, removeCities } from "@/store/cities";
import { getCitiesWeather, setCityWeather } from "@/store/current-weather-in-cities";
import { useEffect, useState } from "react";
import { ScrollView, StyleProp, StyleSheet, ViewStyle } from "react-native";

const FIVE_MINUTES_MS = 5 * 60 * 1000;

function cityKey(city: GeoLocation) {
  return `${city.name}_${city.state}_${city.country}`;
}

type CitiesWeatherListProps = {
  style?: StyleProp<ViewStyle>;
};

export function CitiesWeatherList({ style }: CitiesWeatherListProps) {
  const { cities, setCities } = useCities();
  const { showLoader, hideLoader } = useLoader();
  const [weatherByCity, setWeatherByCity] = useState<Record<string, CurrentWeatherData>>({});

  useEffect(() => {
    showLoader();

    getCities().then(async (cities) => {
      setCities(cities);

      const cityNames = cities.map(cityKey);
      const citiesWeather = await getCitiesWeather(cityNames);

      setWeatherByCity(
        Object.fromEntries(
          Object.entries(citiesWeather).map(([name, { data }]) => [name, data]),
        ),
      );

      await Promise.all(
        cities.map(async (city) => {
          const cityName = cityKey(city);
          const existing = citiesWeather[cityName];

          if (existing && Date.now() - existing.latestUpdateTimeStamp < FIVE_MINUTES_MS) {
            return;
          }

          const data = await getCurrentWeatherData(city.lat, city.lon);
          setCityWeather(cityName, data, Date.now());
          setWeatherByCity((prev) => ({ ...prev, [cityName]: data }));
        }),
      );
    })
    .finally(hideLoader);
  }, [cities.length, setCities, showLoader, hideLoader]);

  async function handleDelete(city: GeoLocation) {
    await removeCities([city]);
    setCities(cities.filter((c) => c.lat !== city.lat || c.lon !== city.lon));
  }

  return (
    <ScrollView style={style} contentContainerStyle={styles.content}>
      {cities.map((city) => {
        const key = cityKey(city);
        const data = weatherByCity[key];

        return data ? (
          <CityCard
            key={key}
            city={city}
            data={data}
            locationKey={key}
            onDelete={() => handleDelete(city)}
          />
        ) : null;
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: 8,
  },
});
