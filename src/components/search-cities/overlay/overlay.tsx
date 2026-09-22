import { StyleSheet, View, type ViewStyle } from "react-native";

export function Overlay() {
  return <View style={styles.overlay} pointerEvents="none" />;
}

const styles = StyleSheet.create({
  overlay: {
    position: "fixed" as ViewStyle["position"],
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    zIndex: 10,
  },
});
