import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

export function RemoveCard() {
  return (
    <View style={styles.card}>
      <Image source={require("@/assets/images/trash.svg")} tintColor="#fff" style={styles.icon} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 14,
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: 24,
    backgroundColor: "#e5484d",
  },
  icon: {
    width: 28,
    height: 28,
  },
});
