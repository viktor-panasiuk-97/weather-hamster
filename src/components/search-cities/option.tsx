import type { GeoLocation } from "@/api/weather-api";
import { getLocalizedCityName } from "@/utils";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text } from "react-native";

export function Option({
  location,
  onPress,
}: {
  location: GeoLocation;
  onPress: () => void;
}) {
  const { i18n } = useTranslation();
  const label = `${getLocalizedCityName(location, i18n.language)}, ${location.country}`;

  return (
    <Pressable onPress={onPress} style={styles.option} accessibilityRole="button" accessibilityLabel={label}>
      <Text style={styles.optionText}>{label}</Text>
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
