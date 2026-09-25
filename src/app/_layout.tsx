import { CitiesProvider } from "@/context/cities";
import { Stack } from "expo-router";
import { ImageBackground, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <CitiesProvider>
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
      </CitiesProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
});
