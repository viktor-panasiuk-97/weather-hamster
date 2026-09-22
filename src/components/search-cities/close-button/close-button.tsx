import { Pressable, StyleSheet, Text } from "react-native";

export function CloseButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.closeButton} hitSlop={8} accessibilityRole="button" accessibilityLabel="Close search">
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
  },
});
