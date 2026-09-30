import "@/i18n";
import { LoaderProvider } from "@/context/loader";
import { Stack } from "expo-router";
import { ImageBackground, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <LoaderProvider>
        <ImageBackground
          source={require("@/assets/images/bg.jpg")}
          style={styles.background}
          resizeMode="repeat"
        >
          <Stack
            screenOptions={{
              animation: 'slide_from_bottom',
              contentStyle: { backgroundColor: "transparent" },
              headerShown: false,
            }}
          />
        </ImageBackground>
      </LoaderProvider>
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
