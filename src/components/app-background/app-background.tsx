import type { ReactNode } from "react";
import { ImageBackground, StyleSheet } from "react-native";

export function AppBackground({ children }: { children: ReactNode }) {
  return (
    <ImageBackground
      source={require("@/assets/images/bg.jpg")}
      style={styles.background}
      resizeMode="repeat"
    >
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});
