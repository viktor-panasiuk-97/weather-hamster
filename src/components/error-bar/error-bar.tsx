import { useErrorBarStore } from "@/store/error-bar";
import { reloadAppAsync } from "expo";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { SlideInUp, SlideOutUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function ErrorBar() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const visible = useErrorBarStore((state) => state.visible);
  const message = useErrorBarStore((state) => state.message);
  const onRetry = useErrorBarStore((state) => state.onRetry);
  const hideErrorBar = useErrorBarStore((state) => state.hideErrorBar);

  if (!visible) {
    return null;
  }

  const handlePress = () => {
    if (onRetry) {
      hideErrorBar();
      onRetry();
    } else {
      reloadAppAsync();
    }
  };

  return (
    <Animated.View
      entering={SlideInUp}
      exiting={SlideOutUp}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <View style={styles.content} accessibilityRole="alert">
        <Text style={styles.message}>{message ?? t("common.somethingWentWrong")}</Text>
        <Pressable style={styles.button} onPress={handlePress} accessibilityRole="button">
          <Text style={styles.buttonLabel}>
            {onRetry ? t("common.retry") : t("common.reloadApp")}
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1100,
    elevation: 1100,
    backgroundColor: "#e5484d",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  message: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: "#fff",
  },
  button: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
});
