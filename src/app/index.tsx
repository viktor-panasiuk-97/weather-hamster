import { CitiesWeatherList } from "@/components/cities-weather-list";
import { SearchCities } from "@/components/search-cities";
import { ImageBackground, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <ImageBackground
      source={require("@/assets/images/bg.jpg")}
      style={styles.background}
      resizeMode="repeat"
    >
      <SafeAreaView style={styles.container}>
        <SearchCities style={{ paddingTop: 16 }} />
        <CitiesWeatherList style={styles.list} />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 16,
  },
  list: {
    marginTop: 16,
  },
});
