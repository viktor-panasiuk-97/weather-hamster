import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const SHEET_COLUMNS = 5;
const SHEET_ROWS = 2;
const FRAME_COUNT = SHEET_COLUMNS * SHEET_ROWS;
const CELL_WIDTH = 256;
const CELL_HEIGHT = 256;
const CELL_ASPECT_RATIO = CELL_HEIGHT / CELL_WIDTH;
const ANIMATION_DURATION_MS = 500;
const HAMSTER_SIZE = 144;

export const LOADER_MIN_DURATION_MS = 750;

function HamsterAnimation({ size = HAMSTER_SIZE }: { size?: number }) {
  const cellHeight = size * CELL_ASPECT_RATIO;
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(FRAME_COUNT, { duration: ANIMATION_DURATION_MS, easing: Easing.linear }),
      -1,
    );

    return () => cancelAnimation(progress);
  }, [progress]);

  const sheetStyle = useAnimatedStyle(() => {
    const frame = Math.floor(progress.value) % FRAME_COUNT;

    return {
      left: -(frame % SHEET_COLUMNS) * size,
      top: -Math.floor(frame / SHEET_COLUMNS) * cellHeight,
    };
  });

  return (
    <View style={{ width: size, height: cellHeight, overflow: "hidden" }}>
      <Animated.Image
        source={require("@/assets/images/hamster-loader.png")}
        resizeMode="stretch"
        style={[
          {
            position: "absolute",
            width: size * SHEET_COLUMNS,
            height: cellHeight * SHEET_ROWS,
          },
          sheetStyle,
        ]}
      />
    </View>
  );
}

export function Loader({ visible }: { visible: boolean }) {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <HamsterAnimation />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 1000,
    elevation: 1000,
    backgroundColor: "#D9F99D",
    justifyContent: "center",
    alignItems: "center",
  },
});
