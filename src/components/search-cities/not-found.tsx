import { useTranslation } from "react-i18next";
import { StyleSheet, Text } from "react-native";

export function NotFound() {
  const { t } = useTranslation();

  return <Text style={styles.notFound} accessibilityRole="text" accessibilityLiveRegion="polite">{t("common.notFound")}</Text>;
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
