import { geoCordinatesByCityName } from "@/api/weather-api";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  useEffect(() => {
    geoCordinatesByCityName('Lutsk').then(console.log)
  }, [])
  return (
    <View style={styles.container}>
      <Text>Edit src/app/index.tsx to edit this screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
