import "@/i18n";
import { AppBackground } from "@/components/app-background";
import { LoaderProvider } from "@/context/loader";
import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <LoaderProvider>
        <AppBackground>
          <Stack
            screenOptions={{
              animation: 'slide_from_bottom',
              contentStyle: { backgroundColor: "transparent" },
              headerShown: false,
            }}
          />
        </AppBackground>
      </LoaderProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
