import { geoCordinatesByCityName } from "@/api/weather-api";
import { SearchInput } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function Index() {
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    geoCordinatesByCityName('Lutsk').then(console.log)
  }, [])

  return (
    <View style={styles.container}>
      <SearchInput
        value={searchValue}
        onChangeText={setSearchValue}
        placeholder="Search for a city"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
});
