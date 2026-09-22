import type { GeoLocation } from "@/api/weather-api";
import { Pressable, StyleSheet, Text } from "react-native";

export function Option({
  location,
  onPress,
}: {
  location: GeoLocation;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.option} accessibilityRole="button" accessibilityLabel={`${location.name}, ${location.country}`}>
      <Text style={styles.optionText}>
        {location.name}, {location.country}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionText: {
    fontSize: 16,
  },
});
