import { CitiesWeatherList } from "@/components/cities-weather-list";
import { SearchCities } from "@/components/search-cities";
import { StyleSheet, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <SearchCities style={{ paddingTop: 16 }} />
      <CitiesWeatherList style={styles.list} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 16,
  },
  list: {
    marginTop: 16,
  },
});
