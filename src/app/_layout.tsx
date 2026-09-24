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
          headerShown: false,
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
