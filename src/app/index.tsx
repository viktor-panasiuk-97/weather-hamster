import { CitiesWeatherList } from "@/components/cities-weather-list";
import { SearchCities } from "@/components/search-cities";
import { ImageBackground, StyleSheet } from "react-native";

export default function Index() {
  return (
    <ImageBackground
      source={require("@/assets/images/bg.jpg")}
      style={styles.container}
      resizeMode="repeat"
    >
      <SearchCities style={{ paddingTop: 16 }} />
      <CitiesWeatherList style={styles.list} />
    </ImageBackground>
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
