import { StyleSheet, Text } from "react-native";

export function NotFound() {
  return <Text style={styles.notFound} accessibilityRole="text" accessibilityLiveRegion="polite">Not Found</Text>;
}

const styles = StyleSheet.create({
  notFound: {
    fontSize: 16,
    color: "#666",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
});
