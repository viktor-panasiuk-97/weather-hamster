import { CitiesWeatherList } from "@/components/cities-weather-list";
import { LanguageSwitcher } from "@/components/language-switcher";
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
        <LanguageSwitcher style={styles.languageSwitcher} />
        <SearchCities style={styles.search} />
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
  languageSwitcher: {
    alignSelf: "flex-end",
    marginTop: 16,
  },
  search: {
    marginTop: 12,
  },
  list: {
    marginTop: 16,
  },
});
