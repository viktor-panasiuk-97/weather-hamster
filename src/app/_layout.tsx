import { Stack } from "expo-router";
import { ImageBackground, StyleSheet } from "react-native";

export default function RootLayout() {
  return (
    <ImageBackground
      source={require("@/assets/images/bg.jpg")}
      style={styles.background}
      resizeMode="repeat"
    >
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: "transparent" },
        }}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});
