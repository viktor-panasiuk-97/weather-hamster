import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text } from "react-native";

export function CloseButton({ onPress }: { onPress: () => void }) {
  const { t } = useTranslation();

  return (
    <Pressable onPress={onPress} style={styles.closeButton} hitSlop={8} accessibilityRole="button" accessibilityLabel={t("common.closeSearch")}>
      <Text style={styles.closeButtonText}>✕</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    marginLeft: 12,
    padding: 8,
  },
  closeButtonText: {
    fontSize: 18,
    color: "#fff",
  },
});
