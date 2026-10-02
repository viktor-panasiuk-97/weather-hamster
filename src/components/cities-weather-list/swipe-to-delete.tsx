import { RemoveCard } from "@/components/cities-weather-list/remove-card";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

type Props = {
  onDelete: () => void;
  children: ReactNode;
};

// Calls onDelete when the card is swiped left past half its width.
export function SwipeToDelete({ onDelete, children }: Props) {
  const translateX = useSharedValue(0);
  const cardWidth = useSharedValue(0);

  const pan = Gesture.Pan()
    .activeOffsetX(-10)
    .failOffsetY([-10, 10])
    .onUpdate((e) => {
      translateX.value = Math.min(0, e.translationX);
    })
    .onEnd(() => {
      if (-translateX.value > cardWidth.value / 2) {
        scheduleOnRN(onDelete);
      }
      translateX.value = withSpring(0);
    });

  const removeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-40, 0], [1, 0], Extrapolation.CLAMP),
  }));

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      style={styles.cardWrapper}
      onLayout={(e) => {
        cardWidth.value = e.nativeEvent.layout.width;
      }}
    >
      <Animated.View style={[StyleSheet.absoluteFill, removeStyle]}>
        <RemoveCard />
      </Animated.View>
      <GestureDetector gesture={pan}>
        <Animated.View style={cardStyle}>{children}</Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: 16,
    marginVertical: 5,
  },
});
