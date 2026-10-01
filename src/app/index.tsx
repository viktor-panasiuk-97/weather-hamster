import { AppBackground } from "@/components/app-background";
import { CitiesWeatherList } from "@/components/cities-weather-list";
import { LanguageSwitcher } from "@/components/language-switcher";
import { SearchCities } from "@/components/search-cities";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <AppBackground>
      <SafeAreaView style={styles.container}>
        <LanguageSwitcher style={styles.languageSwitcher} />
        <SearchCities style={styles.search} />
        <CitiesWeatherList style={styles.list} />
      </SafeAreaView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
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
